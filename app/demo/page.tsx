'use client'

import Link from 'next/link'
import { useState } from 'react'

const DEMO_COMPETITORS = [
  {
    name: 'Notion',
    url: 'notion.so',
    score: 78,
    label: 'HIGH THREAT',
    scoreColor: '#ef4444',
    changes: [
      { type: 'PRICING', color: '#f59e0b', page: 'Pricing', summary: 'Plus plan raised from €8 to €12/month (+50%). Free tier storage reduced from 5MB to 2MB.', impact: 'HIGH', time: '3 days ago' },
      { type: 'CONTENT', color: '#a78bfa', page: 'Homepage', summary: 'New headline: "The connected workspace for you and your team" replaced "All-in-one workspace". SEO push targeting enterprise teams.', impact: 'MEDIUM', time: '5 days ago' },
    ],
  },
  {
    name: 'Linear',
    url: 'linear.app',
    score: 62,
    label: 'ACTIVE',
    scoreColor: '#f59e0b',
    changes: [
      { type: 'HIRING', color: '#10b981', page: 'Jobs', summary: '6 new engineering roles opened in NYC and Berlin, 3 focused on Enterprise integrations. Signal: major platform push Q3.', impact: 'HIGH', time: '6 days ago' },
      { type: 'FEATURE', color: '#3b82f6', page: 'Changelog', summary: 'Launched "Linear for Enterprise" tier with SSO, audit logs, and custom workflows. Previously only in beta.', impact: 'HIGH', time: '4 days ago' },
    ],
  },
  {
    name: 'Figma',
    url: 'figma.com',
    score: 45,
    label: 'MODERATE',
    scoreColor: '#f59e0b',
    changes: [
      { type: 'PRICING', color: '#f59e0b', page: 'Pricing', summary: 'Starter tier silently removed. Entry point now Professional at $15/seat/mo. Effective price floor increase of 50%+ for new signups.', impact: 'HIGH', time: '2 days ago' },
    ],
  },
  {
    name: 'Loom',
    url: 'loom.com',
    score: 31,
    label: 'WATCHING',
    scoreColor: '#10b981',
    changes: [
      { type: 'FEATURE', color: '#3b82f6', page: 'Features', summary: 'AI-powered video summaries now available on all plans including Free. Removing friction at top of funnel.', impact: 'MEDIUM', time: '1 week ago' },
    ],
  },
  {
    name: 'Superhuman',
    url: 'superhuman.com',
    score: 22,
    label: 'QUIET',
    scoreColor: '#52525b',
    changes: [],
  },
]

const BRIEFING_HTML = `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#e4e4e7;">

  <!-- Header -->
  <div style="margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.06);">
    <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;color:#52525b;text-transform:uppercase;margin-bottom:6px;">Rival · Weekly Intelligence Briefing</div>
    <div style="font-size:11px;color:#3f3f46;">June 23–29, 2026 · 4 competitors monitored · 5 changes detected · Powered by Claude AI</div>
  </div>

  <!-- Competitor 1: Notion -->
  <div style="margin-bottom:20px;border-radius:14px;overflow:hidden;border:1px solid rgba(245,158,11,0.2);background:rgba(245,158,11,0.03);">
    <div style="padding:14px 18px;border-bottom:1px solid rgba(245,158,11,0.12);display:flex;align-items:center;gap:10px;">
      <div style="width:28px;height:28px;border-radius:8px;background:rgba(245,158,11,0.15);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#f59e0b;">N</div>
      <span style="font-weight:700;color:#fff;font-size:14px;">Notion</span>
      <span style="font-size:10px;font-weight:800;padding:3px 9px;border-radius:4px;background:rgba(239,68,68,0.12);color:#ef4444;letter-spacing:0.05em;">HIGH THREAT · SCORE 78</span>
      <span style="margin-left:auto;font-size:10px;color:#52525b;">notion.so · pricing page</span>
    </div>
    <div style="padding:18px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
        <div style="padding:12px;border-radius:8px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:10px;font-weight:700;color:#52525b;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:5px;">What changed</div>
          <div style="font-size:13px;color:#a1a1aa;line-height:1.6;">Plus plan raised €8→€12/month (+50%). Free tier storage reduced 5MB→2MB. Silently rolled out with no announcement.</div>
        </div>
        <div style="padding:12px;border-radius:8px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:10px;font-weight:700;color:#52525b;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:5px;">Why it matters</div>
          <div style="font-size:13px;color:#a1a1aa;line-height:1.6;">This is a deliberate upmarket repositioning. They're deliberately shedding price-sensitive SMB users to improve margin and focus on enterprise teams.</div>
        </div>
        <div style="padding:12px;border-radius:8px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:10px;font-weight:700;color:#52525b;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:5px;">Market implication</div>
          <div style="font-size:13px;color:#a1a1aa;line-height:1.6;">~2M Notion free/Plus users now have reason to switch. Search volume for "Notion alternative" already +34% this week. This is a window.</div>
        </div>
        <div style="padding:12px;border-radius:8px;background:rgba(16,185,129,0.04);border:1px solid rgba(16,185,129,0.15);">
          <div style="font-size:10px;font-weight:700;color:#10b981;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:5px;">⚡ Your move this week</div>
          <div style="font-size:13px;color:#e4e4e7;line-height:1.6;font-weight:500;">Run ads on "Notion alternative" and "Notion too expensive" — CPCs are low now, intent is high. Update your homepage to address this directly.</div>
        </div>
      </div>
      <div style="padding:10px 14px;border-radius:8px;background:rgba(239,68,68,0.06);border:1px solid rgba(239,68,68,0.12);">
        <span style="font-size:10px;font-weight:700;color:#ef4444;">RISK IF IGNORED: </span>
        <span style="font-size:12px;color:#71717a;">A competitor will own this narrative within 2–3 weeks. Once they capture the SEO and paid traffic, it's expensive to recapture.</span>
      </div>
    </div>
  </div>

  <!-- Competitor 2: Linear -->
  <div style="margin-bottom:20px;border-radius:14px;overflow:hidden;border:1px solid rgba(59,130,246,0.15);background:rgba(59,130,246,0.02);">
    <div style="padding:14px 18px;border-bottom:1px solid rgba(59,130,246,0.1);display:flex;align-items:center;gap:10px;">
      <div style="width:28px;height:28px;border-radius:8px;background:rgba(59,130,246,0.15);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#3b82f6;">L</div>
      <span style="font-weight:700;color:#fff;font-size:14px;">Linear</span>
      <span style="font-size:10px;font-weight:800;padding:3px 9px;border-radius:4px;background:rgba(245,158,11,0.12);color:#f59e0b;letter-spacing:0.05em;">ACTIVE · SCORE 62</span>
      <span style="margin-left:auto;font-size:10px;color:#52525b;">linear.app · jobs + changelog</span>
    </div>
    <div style="padding:18px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
        <div style="padding:12px;border-radius:8px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:10px;font-weight:700;color:#52525b;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:5px;">What changed</div>
          <div style="font-size:13px;color:#a1a1aa;line-height:1.6;">6 new engineering roles in NYC & Berlin focused on enterprise integrations. Simultaneously launched "Linear for Enterprise" tier with SSO and audit logs.</div>
        </div>
        <div style="padding:12px;border-radius:8px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:10px;font-weight:700;color:#52525b;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:5px;">Why it matters</div>
          <div style="font-size:13px;color:#a1a1aa;line-height:1.6;">Hiring + product launch simultaneously signals a coordinated strategic push, not just product iteration. Q3 is their enterprise go-to-market moment.</div>
        </div>
        <div style="padding:12px;border-radius:8px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:10px;font-weight:700;color:#52525b;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:5px;">Market implication</div>
          <div style="font-size:13px;color:#a1a1aa;line-height:1.6;">Linear will be less focused on indie devs and small startups for the next 2 quarters. Their product velocity for non-enterprise features will slow.</div>
        </div>
        <div style="padding:12px;border-radius:8px;background:rgba(16,185,129,0.04);border:1px solid rgba(16,185,129,0.15);">
          <div style="font-size:10px;font-weight:700;color:#10b981;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:5px;">⚡ Your move this week</div>
          <div style="font-size:13px;color:#e4e4e7;line-height:1.6;font-weight:500;">Position against complexity. "Built for founders, not enterprise IT" is now a defensible angle. Linear is vacating this positioning — claim it.</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Competitor 3: Figma -->
  <div style="margin-bottom:28px;border-radius:14px;overflow:hidden;border:1px solid rgba(167,139,250,0.15);background:rgba(167,139,250,0.02);">
    <div style="padding:14px 18px;border-bottom:1px solid rgba(167,139,250,0.1);display:flex;align-items:center;gap:10px;">
      <div style="width:28px;height:28px;border-radius:8px;background:rgba(167,139,250,0.15);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#a78bfa;">F</div>
      <span style="font-weight:700;color:#fff;font-size:14px;">Figma</span>
      <span style="font-size:10px;font-weight:800;padding:3px 9px;border-radius:4px;background:rgba(245,158,11,0.12);color:#f59e0b;letter-spacing:0.05em;">ACTIVE · SCORE 55</span>
      <span style="margin-left:auto;font-size:10px;color:#52525b;">figma.com · pricing page</span>
    </div>
    <div style="padding:18px;">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
        <div style="padding:12px;border-radius:8px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:10px;font-weight:700;color:#52525b;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:5px;">What changed</div>
          <div style="font-size:13px;color:#a1a1aa;line-height:1.6;">Starter tier silently removed. Entry point now Professional at $15/seat/mo. Effective +50%+ price floor increase for all new signups.</div>
        </div>
        <div style="padding:12px;border-radius:8px;background:rgba(16,185,129,0.04);border:1px solid rgba(16,185,129,0.15);">
          <div style="font-size:10px;font-weight:700;color:#10b981;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:5px;">⚡ Your move this week</div>
          <div style="font-size:13px;color:#e4e4e7;line-height:1.6;font-weight:500;">Students, freelancers, and indie designers are actively searching for alternatives right now. This is a one-time acquisition window — run ads before your competitors do.</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Intelligence Summary -->
  <div style="padding:20px;border-radius:14px;background:rgba(16,185,129,0.05);border:1px solid rgba(16,185,129,0.2);">
    <div style="font-size:11px;font-weight:700;letter-spacing:0.1em;color:#10b981;text-transform:uppercase;margin-bottom:16px;">Intelligence Summary</div>

    <div style="margin-bottom:16px;">
      <div style="font-size:11px;font-weight:700;color:#52525b;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:10px;">Prioritized Actions</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div style="display:flex;gap:10px;align-items:flex-start;">
          <span style="font-size:10px;font-weight:800;padding:2px 8px;border-radius:4px;background:rgba(239,68,68,0.12);color:#ef4444;white-space:nowrap;margin-top:1px;">THIS WEEK</span>
          <span style="font-size:13px;color:#a1a1aa;line-height:1.6;">Target "Notion alternative" and "Figma alternative" in paid ads — both have surging intent and your competitors are asleep on this.</span>
        </div>
        <div style="display:flex;gap:10px;align-items:flex-start;">
          <span style="font-size:10px;font-weight:800;padding:2px 8px;border-radius:4px;background:rgba(245,158,11,0.12);color:#f59e0b;white-space:nowrap;margin-top:1px;">THIS MONTH</span>
          <span style="font-size:13px;color:#a1a1aa;line-height:1.6;">Publish a positioning piece: "Built for founders, not enterprise" — Linear and Notion are both going upmarket, leaving a gap you should own.</span>
        </div>
        <div style="display:flex;gap:10px;align-items:flex-start;">
          <span style="font-size:10px;font-weight:800;padding:2px 8px;border-radius:4px;background:rgba(59,130,246,0.12);color:#3b82f6;white-space:nowrap;margin-top:1px;">THIS QUARTER</span>
          <span style="font-size:13px;color:#a1a1aa;line-height:1.6;">All three competitors are moving upmarket simultaneously. This is a structural shift — your SMB positioning is now a durable moat, not a fallback.</span>
        </div>
      </div>
    </div>

    <div style="padding-top:14px;border-top:1px solid rgba(16,185,129,0.12);">
      <div style="font-size:11px;font-weight:700;color:#52525b;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:6px;">Strategic insight</div>
      <div style="font-size:13px;color:#a1a1aa;line-height:1.75;">Notion, Linear, and Figma all raised prices or removed entry tiers this week. This is not coincidence — it's a market signal that SaaS is entering a margin-recovery cycle. The companies that hold their pricing and capture displaced SMB users this quarter will build compounding acquisition advantages that are very expensive to undo.</div>
    </div>
  </div>
</div>
`

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'briefing'>('feed')
  const [selectedCompetitor, setSelectedCompetitor] = useState(0)

  return (
    <div style={{ background: '#050507', minHeight: '100vh', color: '#fafafa' }}>
      {/* Grid bg */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

      {/* Nav */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(5,5,7,0.92)', backdropFilter: 'blur(20px)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="#10b981" strokeWidth="1.5" /><circle cx="10" cy="10" r="4" fill="#10b981" /></svg>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Rival</span>
            </Link>
            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 99, background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', fontWeight: 600 }}>LIVE DEMO</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#52525b' }}>This is read-only. Your real data stays private.</span>
            <Link href="/signup" style={{ fontSize: 13, fontWeight: 600, padding: '7px 16px', borderRadius: 8, background: '#10b981', color: '#000', textDecoration: 'none' }}>
              Start free →
            </Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 6 }}>Intelligence Dashboard <span style={{ color: '#3f3f46' }}>— Demo</span></h1>
          <p style={{ fontSize: 14, color: '#52525b' }}>Week of June 23–29, 2026 · 5 competitors monitored · 5 changes detected</p>
        </div>

        {/* Stats bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Competitors', value: '5', sub: 'of 5 active' },
            { label: 'Changes detected', value: '5', sub: 'this week', accent: true },
            { label: 'High priority', value: '3', sub: 'need attention', warn: true },
            { label: 'Next briefing', value: 'Mon', sub: 'delivered 8am' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '16px 20px', borderRadius: 12, background: '#0c0c0f', border: `1px solid ${s.warn ? 'rgba(239,68,68,0.15)' : s.accent ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)'}` }}>
              <div style={{ fontSize: 11, color: '#52525b', marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: s.warn ? '#ef4444' : s.accent ? '#10b981' : '#fff', lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: '#3f3f46' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 16 }}>

          {/* Sidebar */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#3f3f46', marginBottom: 8, textTransform: 'uppercase' }}>Competitors</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {DEMO_COMPETITORS.map((c, i) => (
                <button key={i} onClick={() => setSelectedCompetitor(i)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, cursor: 'pointer', textAlign: 'left', width: '100%',
                  background: selectedCompetitor === i ? 'rgba(16,185,129,0.08)' : 'transparent',
                  border: `1px solid ${selectedCompetitor === i ? 'rgba(16,185,129,0.2)' : 'transparent'}`,
                  transition: 'all 0.15s',
                }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: `hsl(${c.name.charCodeAt(0) * 37 % 360}, 40%, 20%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{c.name[0]}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: selectedCompetitor === i ? '#fff' : '#a1a1aa', marginBottom: 2 }}>{c.name}</div>
                    <div style={{ fontSize: 10, color: c.scoreColor, fontWeight: 600 }}>{c.label}</div>
                  </div>
                  {c.changes.length > 0 && (
                    <span style={{ fontSize: 10, fontWeight: 700, background: 'rgba(239,68,68,0.12)', color: '#ef4444', borderRadius: 99, padding: '2px 7px' }}>{c.changes.length}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Weekly briefing link */}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', color: '#3f3f46', marginBottom: 8, textTransform: 'uppercase' }}>Views</div>
              {[
                { label: 'Intelligence Feed', id: 'feed' as const },
                { label: 'Weekly Briefing', id: 'briefing' as const },
              ].map(v => (
                <button key={v.id} onClick={() => setActiveTab(v.id)} style={{
                  display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 8, marginBottom: 4, cursor: 'pointer',
                  background: activeTab === v.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                  border: `1px solid ${activeTab === v.id ? 'rgba(255,255,255,0.08)' : 'transparent'}`,
                  fontSize: 13, color: activeTab === v.id ? '#e4e4e7' : '#52525b',
                  transition: 'all 0.15s',
                }}>{v.label}</button>
              ))}
            </div>
          </div>

          {/* Main */}
          <div>
            {activeTab === 'feed' ? (
              <div>
                {/* Selected competitor detail */}
                {(() => {
                  const c = DEMO_COMPETITORS[selectedCompetitor]
                  return (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, background: `hsl(${c.name.charCodeAt(0) * 37 % 360}, 40%, 20%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#fff' }}>{c.name[0]}</div>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{c.name}</div>
                          <div style={{ fontSize: 12, color: '#52525b' }}>{c.url}</div>
                        </div>
                        {/* Health score */}
                        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                          <div style={{ fontSize: 10, color: '#52525b', marginBottom: 4 }}>Threat Score</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 80, height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                              <div style={{ width: `${c.score}%`, height: '100%', borderRadius: 99, background: c.scoreColor, transition: 'width 0.5s ease' }} />
                            </div>
                            <span style={{ fontSize: 16, fontWeight: 800, color: c.scoreColor }}>{c.score}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, color: c.scoreColor, background: `${c.scoreColor}12`, padding: '2px 7px', borderRadius: 4 }}>{c.label}</span>
                          </div>
                        </div>
                      </div>

                      {c.changes.length === 0 ? (
                        <div style={{ padding: 32, textAlign: 'center', borderRadius: 12, background: '#0c0c0f', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ fontSize: 24, marginBottom: 12 }}>✓</div>
                          <div style={{ fontSize: 14, color: '#52525b' }}>No significant changes detected this week</div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {c.changes.map((change, j) => (
                            <div key={j} style={{ padding: '20px 22px', borderRadius: 14, background: '#0c0c0f', border: '1px solid rgba(255,255,255,0.06)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.05em', padding: '3px 8px', borderRadius: 5, background: `${change.color}15`, color: change.color, fontFamily: 'monospace' }}>{change.type}</span>
                                <span style={{ fontSize: 12, color: '#52525b' }}>on {change.page} page</span>
                                <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: change.impact === 'HIGH' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', color: change.impact === 'HIGH' ? '#ef4444' : '#f59e0b' }}>{change.impact} IMPACT</span>
                                <span style={{ fontSize: 11, color: '#27272a' }}>{change.time}</span>
                              </div>
                              <p style={{ margin: 0, fontSize: 14, color: '#a1a1aa', lineHeight: 1.7 }}>{change.summary}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })()}
              </div>
            ) : (
              <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', background: '#0c0c0f' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#080809', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#e4e4e7' }}>Weekly Intelligence Briefing</div>
                    <div style={{ fontSize: 11, color: '#52525b', marginTop: 2 }}>June 23–29, 2026 · Generated by Claude AI</div>
                  </div>
                  <Link href="/signup" style={{ fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 8, background: '#10b981', color: '#000', textDecoration: 'none' }}>
                    Get your real briefing →
                  </Link>
                </div>
                <div style={{ padding: 24 }} dangerouslySetInnerHTML={{ __html: BRIEFING_HTML }} />
              </div>
            )}
          </div>
        </div>

        {/* CTA bottom */}
        <div style={{ marginTop: 48, padding: '40px', borderRadius: 20, background: 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(16,185,129,0.02))', border: '1px solid rgba(16,185,129,0.15)', textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 12, letterSpacing: '-0.02em' }}>Ready to monitor your real competitors?</h2>
          <p style={{ fontSize: 15, color: '#71717a', marginBottom: 24 }}>Setup takes 3 minutes. First briefing arrives Monday morning.</p>
          <Link href="/signup" style={{ display: 'inline-block', fontSize: 15, fontWeight: 700, padding: '14px 32px', borderRadius: 12, background: '#10b981', color: '#000', textDecoration: 'none', boxShadow: '0 0 32px rgba(16,185,129,0.25)' }}>
            Start for free →
          </Link>
          <p style={{ fontSize: 12, color: '#27272a', marginTop: 12 }}>No credit card · Free forever plan available</p>
        </div>
      </div>
    </div>
  )
}
