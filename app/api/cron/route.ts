import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { scrapePage, diffContent } from '@/lib/scraper'
import { generateIntelligenceReport, analyzeChangeSummary, calculateHealthScore, isHighPriorityChange } from '@/lib/anthropic'
import { sendWeeklyBriefing, sendInstantAlert, sendSlackNotification } from '@/lib/mailer'
import type { CompetitorChangeData } from '@/lib/anthropic'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const secret = process.env.CRON_SECRET || 'rival2026'
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const now = new Date()
  const periodEnd = now.toISOString().split('T')[0]
  const periodStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

  try {
    const { data: workspaces } = await supabase
      .from('workspaces')
      .select('*, owner:owner_id(email)')
      .in('plan', ['pro', 'agency'])

    if (!workspaces?.length) return NextResponse.json({ success: true, processed: 0 })

    let processedCount = 0
    for (const workspace of workspaces) {
      try {
        await processWorkspace(supabase, workspace, periodStart, periodEnd)
        processedCount++
      } catch (err) {
        console.error(`Error processing workspace ${workspace.id}:`, err)
      }
    }

    return NextResponse.json({ success: true, processed: processedCount })
  } catch (err) {
    console.error('Cron job error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

async function processWorkspace(
  supabase: ReturnType<typeof createAdminClient>,
  workspace: Record<string, unknown>,
  periodStart: string,
  periodEnd: string
) {
  const { data: competitors } = await supabase
    .from('competitors')
    .select('*, monitored_pages(*)')
    .eq('workspace_id', workspace.id)
    .eq('is_active', true)

  if (!competitors?.length) return

  const ownerEmail = (workspace.owner as Record<string, string>)?.email
  const slackWebhook = workspace.slack_webhook_url as string | undefined
  const competitorChanges: CompetitorChangeData[] = []

  for (const competitor of competitors) {
    const pages = competitor.monitored_pages || []
    const competitorData: CompetitorChangeData = { name: competitor.name, url: competitor.url, changes: [] }
    const recentChangesForScore: Array<{ changeType: string; significance: string; summary: string }> = []

    for (const page of pages) {
      if (!page.is_active) continue

      const result = await scrapePage(page.url)
      if (!result.success || !result.content) continue

      const { data: lastSnapshot } = await supabase
        .from('snapshots')
        .select('content, content_hash')
        .eq('monitored_page_id', page.id)
        .order('scanned_at', { ascending: false })
        .limit(1)
        .single()

      await supabase.from('snapshots').insert({
        monitored_page_id: page.id,
        content: result.content,
        content_hash: result.hash,
        word_count: result.wordCount,
      })

      await supabase
        .from('monitored_pages')
        .update({ last_scanned_at: new Date().toISOString(), last_content_hash: result.hash })
        .eq('id', page.id)

      if (lastSnapshot && lastSnapshot.content_hash !== result.hash) {
        const diff = diffContent(lastSnapshot.content || '', result.content)

        if (diff.hasChanged && diff.changePercent > 2) {
          const analysis = await analyzeChangeSummary(
            competitor.name, page.page_type,
            lastSnapshot.content || '', result.content
          )

          await supabase.from('changes').insert({
            competitor_id: competitor.id,
            monitored_page_id: page.id,
            change_type: analysis.changeType,
            significance: analysis.significance,
            summary: analysis.summary,
            old_snippet: diff.removedSnippet,
            new_snippet: diff.addedSnippet,
          })

          recentChangesForScore.push({ changeType: analysis.changeType, significance: analysis.significance, summary: analysis.summary })

          competitorData.changes.push({
            pageType: page.page_type,
            changePercent: diff.changePercent,
            addedSnippet: diff.addedSnippet,
            removedSnippet: diff.removedSnippet,
            significance: analysis.significance,
          })

          // ── INSTANT ALERT ──────────────────────────────────────────────
          if (isHighPriorityChange(analysis.changeType, analysis.significance) && ownerEmail) {
            // Check if we already sent an alert for this competitor+type today
            const today = new Date().toISOString().split('T')[0]
            const { data: existing } = await supabase
              .from('instant_alerts')
              .select('id')
              .eq('workspace_id', workspace.id)
              .eq('competitor_id', competitor.id)
              .gte('sent_at', `${today}T00:00:00Z`)
              .limit(1)

            if (!existing?.length) {
              await sendInstantAlert({
                to: ownerEmail,
                competitorName: competitor.name,
                changeType: analysis.changeType,
                summary: analysis.summary,
                pageType: page.page_type,
              })

              await supabase.from('instant_alerts').insert({
                workspace_id: workspace.id,
                competitor_id: competitor.id,
                change_type: analysis.changeType,
                summary: analysis.summary,
              })

              // ── SLACK INSTANT ALERT ────────────────────────────────────
              if (slackWebhook) {
                await sendSlackNotification(slackWebhook, {
                  type: 'instant',
                  competitorName: competitor.name,
                  changeType: analysis.changeType,
                  summary: analysis.summary,
                  pageType: page.page_type,
                })
              }
            }
          }
        }
      }
    }

    // ── HEALTH SCORE UPDATE ──────────────────────────────────────────────
    const { score, label } = await calculateHealthScore(competitor.name, recentChangesForScore)
    await supabase.from('competitors').update({
      health_score: score,
      health_label: label,
      last_health_update: new Date().toISOString(),
    }).eq('id', competitor.id)

    competitorChanges.push(competitorData)
  }

  // ── WEEKLY REPORT ────────────────────────────────────────────────────────
  const report = await generateIntelligenceReport(
    workspace.name as string, competitorChanges, periodStart, periodEnd
  )
  const totalChanges = competitorChanges.reduce((sum, c) => sum + c.changes.length, 0)

  const { data: savedReport } = await supabase.from('reports').insert({
    workspace_id: workspace.id,
    period_start: periodStart,
    period_end: periodEnd,
    html_content: report.html,
    plain_text: report.text,
    changes_count: totalChanges,
  }).select().single()

  if (ownerEmail && savedReport) {
    await sendWeeklyBriefing({
      to: ownerEmail,
      reportHtml: report.html,
      competitorCount: competitors.length,
      changesCount: totalChanges,
      periodEnd,
      reportId: savedReport.id,
    })

    await supabase.from('reports').update({ email_sent_at: new Date().toISOString() }).eq('id', savedReport.id)

    // ── SLACK WEEKLY SUMMARY ─────────────────────────────────────────────
    if (slackWebhook) {
      await sendSlackNotification(slackWebhook, {
        type: 'weekly',
        changesCount: totalChanges,
        competitorCount: competitors.length,
        periodEnd,
        appUrl: process.env.NEXT_PUBLIC_APP_URL || '',
      })
    }
  }
}
