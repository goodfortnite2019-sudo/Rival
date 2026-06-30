import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase-server'
import { scrapePage, getCompetitorPages } from '@/lib/scraper'

// Manual scan trigger — called when user adds a new competitor
export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { competitorId } = await request.json()
  const admin = createAdminClient()

  // Verify competitor belongs to user
  const { data: competitor } = await admin
    .from('competitors')
    .select('*, workspace:workspace_id(owner_id)')
    .eq('id', competitorId)
    .single()

  if (!competitor || (competitor.workspace as Record<string, string>).owner_id !== user.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const pages = getCompetitorPages(competitor.url)

    for (const page of pages) {
      // Create monitored page if not exists
      const { data: existingPage } = await admin
        .from('monitored_pages')
        .select('id')
        .eq('competitor_id', competitorId)
        .eq('page_type', page.type)
        .single()

      let pageId: string

      if (!existingPage) {
        const { data: newPage } = await admin
          .from('monitored_pages')
          .insert({ competitor_id: competitorId, page_type: page.type, url: page.url })
          .select()
          .single()
        if (!newPage) continue
        pageId = newPage.id
      } else {
        pageId = existingPage.id
      }

      // Scrape and store initial snapshot
      const result = await scrapePage(page.url)
      if (!result.success || !result.content) continue

      await admin.from('snapshots').insert({
        monitored_page_id: pageId,
        content: result.content,
        content_hash: result.hash,
        word_count: result.wordCount,
      })

      await admin.from('monitored_pages').update({
        last_scanned_at: new Date().toISOString(),
        last_content_hash: result.hash,
      }).eq('id', pageId)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Scan error:', err)
    return NextResponse.json({ error: 'Scan failed' }, { status: 500 })
  }
}
