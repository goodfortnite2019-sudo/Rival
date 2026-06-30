import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://rival-sandy.vercel.app'
const FROM = process.env.EMAIL_FROM || 'briefings@getrival.eu'

// ── Weekly briefing email ─────────────────────────────────────────────────────
export async function sendWeeklyBriefing({
  to, reportHtml, competitorCount, changesCount, periodEnd, reportId,
}: {
  to: string
  reportHtml: string
  competitorCount: number
  changesCount: number
  periodEnd: string
  reportId?: string
}) {
  const subject = changesCount > 0
    ? `Rival: ${changesCount} competitor move${changesCount !== 1 ? 's' : ''} detected — ${periodEnd}`
    : `Rival: All quiet this week — ${periodEnd}`

  const exportLink = reportId ? `${APP_URL}/api/export/${reportId}` : `${APP_URL}/dashboard`

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:680px;margin:0 auto;padding:40px 24px;">

  <div style="margin-bottom:28px;display:flex;align-items:center;gap:12px;">
    <span style="font-size:20px;font-weight:700;color:#fff;letter-spacing:-0.5px;">Rival</span>
    <span style="font-size:11px;color:#71717a;text-transform:uppercase;letter-spacing:2px;">Weekly Briefing</span>
  </div>

  <div style="background:#111113;border:1px solid #27272a;border-radius:14px;padding:24px;margin-bottom:24px;display:flex;gap:32px;">
    <div><div style="font-size:12px;color:#52525b;margin-bottom:4px;">Competitors</div><div style="font-size:32px;font-weight:700;color:#fff;line-height:1;">${competitorCount}</div></div>
    <div><div style="font-size:12px;color:#52525b;margin-bottom:4px;">Changes detected</div><div style="font-size:32px;font-weight:700;color:${changesCount > 0 ? '#10b981' : '#fff'};line-height:1;">${changesCount}</div></div>
    <div><div style="font-size:12px;color:#52525b;margin-bottom:4px;">Period</div><div style="font-size:16px;font-weight:600;color:#fff;margin-top:8px;">${periodEnd}</div></div>
  </div>

  ${reportHtml}

  <div style="margin-top:32px;display:flex;gap:12px;">
    <a href="${APP_URL}/dashboard" style="display:inline-block;padding:10px 20px;border-radius:8px;background:#10b981;color:#000;font-size:13px;font-weight:600;text-decoration:none;">View dashboard →</a>
    <a href="${exportLink}" style="display:inline-block;padding:10px 20px;border-radius:8px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:#a1a1aa;font-size:13px;font-weight:500;text-decoration:none;">Download PDF</a>
  </div>

  <div style="margin-top:40px;padding-top:20px;border-top:1px solid #27272a;font-size:12px;color:#3f3f46;">
    You're receiving this because you use Rival. <a href="${APP_URL}/dashboard/settings" style="color:#71717a;">Manage settings</a>
  </div>
</div>
</body>
</html>`

  await resend.emails.send({ from: FROM, to, subject, html })
}

// ── Instant alert email ───────────────────────────────────────────────────────
export async function sendInstantAlert({
  to, competitorName, changeType, summary, pageType,
}: {
  to: string
  competitorName: string
  changeType: string
  summary: string
  pageType: string
}) {
  const typeLabel: Record<string, string> = {
    pricing_change: '💰 Pricing Change',
    new_feature: '✨ New Feature',
    hiring_signal: '🧑‍💻 Hiring Signal',
    content_update: '📝 Content Update',
    restructure: '⚡ Restructure',
    messaging_change: '📣 Messaging Change',
  }
  const label = typeLabel[changeType] || '🔔 Change Detected'

  const subject = `[Alert] ${competitorName} — ${label}`

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 24px;">

  <div style="margin-bottom:24px;">
    <span style="font-size:18px;font-weight:700;color:#fff;">Rival</span>
    <span style="margin-left:8px;font-size:10px;color:#ef4444;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;background:rgba(239,68,68,0.1);padding:3px 8px;border-radius:4px;">INSTANT ALERT</span>
  </div>

  <div style="background:#111113;border:1px solid rgba(239,68,68,0.2);border-radius:14px;padding:28px;margin-bottom:20px;">
    <div style="font-size:13px;color:#ef4444;font-weight:700;margin-bottom:16px;text-transform:uppercase;letter-spacing:0.05em;">${label}</div>
    <div style="font-size:22px;font-weight:700;color:#fff;margin-bottom:8px;">${competitorName}</div>
    <div style="font-size:12px;color:#52525b;margin-bottom:20px;">Detected on: ${pageType} page</div>
    <div style="font-size:15px;color:#a1a1aa;line-height:1.75;padding:16px;background:rgba(255,255,255,0.03);border-radius:8px;border-left:3px solid #ef4444;">
      ${summary}
    </div>
  </div>

  <a href="${APP_URL}/dashboard" style="display:inline-block;padding:12px 24px;border-radius:10px;background:#10b981;color:#000;font-size:14px;font-weight:700;text-decoration:none;">View in dashboard →</a>

  <div style="margin-top:32px;font-size:12px;color:#3f3f46;">
    Rival detected this change in real-time. <a href="${APP_URL}/dashboard/settings" style="color:#52525b;">Manage alerts</a>
  </div>
</div>
</body>
</html>`

  await resend.emails.send({ from: FROM, to, subject, html })
}

// ── Slack notification ────────────────────────────────────────────────────────
export async function sendSlackNotification(
  webhookUrl: string,
  payload:
    | { type: 'instant'; competitorName: string; changeType: string; summary: string; pageType: string }
    | { type: 'weekly'; changesCount: number; competitorCount: number; periodEnd: string; appUrl: string }
) {
  try {
    let body: object

    if (payload.type === 'instant') {
      body = {
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `🚨 *Rival Alert: ${payload.competitorName}*\n*${payload.changeType.replace(/_/g, ' ').toUpperCase()}* detected on ${payload.pageType} page`,
            },
          },
          {
            type: 'section',
            text: { type: 'mrkdwn', text: `> ${payload.summary}` },
          },
          {
            type: 'actions',
            elements: [{ type: 'button', text: { type: 'plain_text', text: 'View Dashboard' }, url: `${APP_URL}/dashboard` }],
          },
        ],
      }
    } else {
      body = {
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: payload.changesCount > 0
                ? `📊 *Rival Weekly Brief — ${payload.periodEnd}*\n*${payload.changesCount} changes* detected across ${payload.competitorCount} competitors`
                : `📊 *Rival Weekly Brief — ${payload.periodEnd}*\nAll quiet this week across ${payload.competitorCount} competitors ✓`,
            },
          },
          {
            type: 'actions',
            elements: [{ type: 'button', text: { type: 'plain_text', text: 'Read full briefing' }, url: `${payload.appUrl}/dashboard` }],
          },
        ],
      }
    }

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch (err) {
    console.error('Slack notification failed:', err)
    // Non-blocking — don't throw
  }
}
