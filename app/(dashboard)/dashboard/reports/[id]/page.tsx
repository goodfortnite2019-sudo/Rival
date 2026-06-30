import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export default async function ReportPage({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  const { data: report } = await supabase
    .from('reports')
    .select('*')
    .eq('id', params.id)
    .eq('workspace_id', workspace?.id)
    .single()

  if (!report) notFound()

  return (
    <div className="min-h-screen" style={{ background: '#09090b' }}>
      {/* Nav */}
      <nav className="border-b border-zinc-800 px-6 py-4" style={{ background: '#0d0d0f' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="emerald-dot" />
            <span className="text-white font-semibold">Rival</span>
          </Link>
          <Link href="/dashboard" className="text-zinc-400 hover:text-white text-sm transition-colors">← Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Report header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-1 rounded-md text-xs font-medium" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                Intelligence Report
              </span>
              {report.email_sent_at && (
                <span className="text-xs text-zinc-500">
                  Emailed {new Date(report.email_sent_at).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white">
              Week of {new Date(report.period_start).toLocaleDateString('en', { month: 'long', day: 'numeric' })}–{new Date(report.period_end).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h1>
            <p className="text-zinc-500 text-sm mt-1">{report.changes_count} competitor changes detected</p>
          </div>
        </div>

        {/* Report content */}
        <div
          className="rounded-2xl border border-zinc-800 overflow-hidden"
          dangerouslySetInnerHTML={{ __html: report.html_content }}
        />

        <div className="mt-8 flex justify-between items-center">
          <Link href="/dashboard/reports" className="text-sm text-zinc-500 hover:text-white transition-colors">← All reports</Link>
          <p className="text-xs text-zinc-600">Generated {new Date(report.created_at).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </div>
    </div>
  )
}
