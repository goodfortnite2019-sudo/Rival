import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Get workspace
  const { data: workspace } = await supabase
    .from('workspaces')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  // Get competitors
  const { data: competitors } = await supabase
    .from('competitors')
    .select('*, monitored_pages(*)')
    .eq('workspace_id', workspace?.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  // Get latest report
  const { data: latestReport } = await supabase
    .from('reports')
    .select('*')
    .eq('workspace_id', workspace?.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // Get recent changes
  const { data: recentChanges } = await supabase
    .from('changes')
    .select('*, competitor:competitor_id(name), monitored_page:monitored_page_id(page_type)')
    .in('competitor_id', (competitors || []).map(c => c.id))
    .order('detected_at', { ascending: false })
    .limit(10)

  const competitorCount = competitors?.length || 0
  const planLimit = workspace?.competitor_limit || 2
  const plan = workspace?.plan || 'free'

  return (
    <div className="min-h-screen" style={{ background: '#09090b' }}>
      {/* Top nav */}
      <nav className="border-b border-zinc-800 px-6 py-4" style={{ background: '#0d0d0f' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="emerald-dot" />
              <span className="text-white font-semibold">Rival</span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <Link href="/dashboard" className="px-3 py-1.5 rounded-lg text-sm text-white" style={{ background: 'rgba(255,255,255,0.06)' }}>Dashboard</Link>
              <Link href="/dashboard/reports" className="px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white transition-colors">Reports</Link>
              <Link href="/dashboard/settings" className="px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white transition-colors">Settings</Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 rounded-md text-xs font-medium capitalize border border-zinc-700 text-zinc-400">{plan}</span>
            {plan === 'free' && (
              <Link href="/dashboard/settings?upgrade=true" className="px-3 py-1.5 rounded-lg text-xs font-semibold text-black" style={{ background: '#10b981' }}>
                Upgrade to Pro
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Intelligence Dashboard</h1>
            <p className="text-zinc-500 text-sm mt-1">Monitoring {competitorCount} of {planLimit} competitors</p>
          </div>
          {competitorCount < planLimit && (
            <Link href="/dashboard/competitors/add"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-black transition-all hover:opacity-90"
              style={{ background: '#10b981' }}>
              + Add competitor
            </Link>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Competitors', value: competitorCount, sub: `of ${planLimit} max` },
            { label: 'Pages monitored', value: (competitors || []).reduce((s, c) => s + (c.monitored_pages?.length || 0), 0), sub: 'across all competitors' },
            { label: 'Changes this week', value: recentChanges?.length || 0, sub: 'detected', highlight: (recentChanges?.length || 0) > 0 },
            { label: 'Last report', value: latestReport ? new Date(latestReport.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : '—', sub: latestReport ? `${latestReport.changes_count} changes` : 'Not generated yet' },
          ].map((stat, i) => (
            <div key={i} className="p-5 rounded-2xl border border-zinc-800" style={{ background: '#111113' }}>
              <div className="text-xs text-zinc-500 mb-2 uppercase tracking-wider">{stat.label}</div>
              <div className={`text-3xl font-bold mb-1 ${stat.highlight ? '' : 'text-white'}`}
                style={stat.highlight ? { color: '#10b981' } : {}}>
                {stat.value}
              </div>
              <div className="text-xs text-zinc-600">{stat.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Competitors list */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Your competitors</h2>
              {competitorCount < planLimit && (
                <Link href="/dashboard/competitors/add" className="text-xs hover:opacity-80" style={{ color: '#10b981' }}>+ Add</Link>
              )}
            </div>

            {competitors?.length === 0 ? (
              <div className="p-8 rounded-2xl border border-dashed border-zinc-700 text-center">
                <p className="text-zinc-500 text-sm mb-4">No competitors yet</p>
                <Link href="/dashboard/competitors/add"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-black inline-block"
                  style={{ background: '#10b981' }}>
                  Add your first competitor
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {competitors?.map(competitor => (
                  <div key={competitor.id} className="p-4 rounded-xl border border-zinc-800 hover:border-zinc-600 transition-all" style={{ background: '#111113' }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium text-sm">{competitor.name}</div>
                        <div className="text-zinc-500 text-xs mt-0.5 truncate max-w-[180px]">{competitor.url}</div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#10b981' }} />
                        <span className="text-xs text-zinc-500">{competitor.monitored_pages?.length || 0} pages</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {competitorCount >= planLimit && plan === 'free' && (
              <div className="mt-4 p-4 rounded-xl border border-zinc-800" style={{ background: 'rgba(16,185,129,0.05)' }}>
                <p className="text-xs text-zinc-400 mb-3">Upgrade to Pro to monitor up to 5 competitors</p>
                <Link href="/dashboard/settings?upgrade=true"
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg text-black inline-block"
                  style={{ background: '#10b981' }}>
                  Upgrade to Pro →
                </Link>
              </div>
            )}
          </div>

          {/* Recent changes / Latest report */}
          <div className="md:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-semibold">Recent changes</h2>
              {latestReport && (
                <Link href={`/dashboard/reports/${latestReport.id}`} className="text-xs hover:opacity-80" style={{ color: '#10b981' }}>
                  View full report →
                </Link>
              )}
            </div>

            {!recentChanges?.length ? (
              <div className="p-8 rounded-2xl border border-zinc-800 text-center" style={{ background: '#111113' }}>
                {competitors?.length === 0 ? (
                  <p className="text-zinc-500 text-sm">Add competitors to start detecting changes</p>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 text-xl" style={{ background: 'rgba(16,185,129,0.1)' }}>◎</div>
                    <p className="text-zinc-400 text-sm font-medium mb-1">All quiet this week</p>
                    <p className="text-zinc-600 text-xs">No significant competitor changes detected. We&apos;ll notify you when something moves.</p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {recentChanges.map(change => {
                  const signalColor = change.significance === 'high' ? '#f59e0b' : change.significance === 'medium' ? '#10b981' : '#52525b'
                  const typeColors: Record<string, string> = {
                    pricing_change: '#f59e0b', new_feature: '#3b82f6',
                    content_update: '#8b5cf6', restructure: '#ec4899', messaging_change: '#10b981',
                  }
                  const typeColor = typeColors[change.change_type] || '#52525b'

                  return (
                    <div key={change.id} className="p-4 rounded-xl border border-zinc-800 hover:border-zinc-600 transition-all" style={{ background: '#111113' }}>
                      <div className="flex items-start gap-3">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold font-mono mt-0.5 shrink-0 uppercase"
                          style={{ background: `${typeColor}20`, color: typeColor }}>
                          {change.change_type?.replace('_', ' ')}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-white">
                              {(change.competitor as Record<string, string>)?.name}
                            </span>
                            <span className="text-xs text-zinc-600">·</span>
                            <span className="text-xs text-zinc-500 capitalize">
                              {(change.monitored_page as Record<string, string>)?.page_type}
                            </span>
                          </div>
                          {change.summary && (
                            <p className="text-xs text-zinc-400">{change.summary}</p>
                          )}
                          <p className="text-xs text-zinc-600 mt-1">
                            {new Date(change.detected_at).toLocaleDateString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: signalColor }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
