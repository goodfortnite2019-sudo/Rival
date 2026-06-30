'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AddCompetitorPage() {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Get workspace
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const { data: workspace } = await supabase
        .from('workspaces')
        .select('id, competitor_limit')
        .eq('owner_id', user.id)
        .single()

      if (!workspace) throw new Error('No workspace found')

      // Check limit
      const { count } = await supabase
        .from('competitors')
        .select('*', { count: 'exact', head: true })
        .eq('workspace_id', workspace.id)
        .eq('is_active', true)

      if ((count || 0) >= workspace.competitor_limit) {
        setError('You\'ve reached your competitor limit. Upgrade your plan to add more.')
        setLoading(false)
        return
      }

      // Normalize URL
      let cleanUrl = url.trim()
      if (!cleanUrl.startsWith('http')) cleanUrl = `https://${cleanUrl}`
      cleanUrl = cleanUrl.replace(/\/$/, '')

      // Add competitor
      const { data: competitor, error: insertError } = await supabase
        .from('competitors')
        .insert({ workspace_id: workspace.id, name: name.trim(), url: cleanUrl })
        .select()
        .single()

      if (insertError) throw insertError

      // Trigger initial scan
      await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitorId: competitor.id }),
      })

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-6 py-12" style={{ background: '#09090b' }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 px-6 py-4" style={{ background: '#0d0d0f' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="emerald-dot" />
            <span className="text-white font-semibold">Rival</span>
          </Link>
          <Link href="/dashboard" className="text-zinc-400 hover:text-white text-sm transition-colors">← Back to dashboard</Link>
        </div>
      </nav>

      <div className="max-w-lg mx-auto pt-20">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Add a competitor</h1>
          <p className="text-zinc-400 text-sm">We&apos;ll scan their website immediately and monitor it weekly.</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 p-8" style={{ background: '#111113' }}>
          <form onSubmit={handleAdd} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Company name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-zinc-700 text-white text-sm transition-colors focus:outline-none focus:border-emerald-500"
                style={{ background: '#18181b' }}
                placeholder="Acme Corp"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Website URL</label>
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-zinc-700 text-white text-sm transition-colors focus:outline-none focus:border-emerald-500"
                style={{ background: '#18181b' }}
                placeholder="acme.com"
              />
              <p className="text-xs text-zinc-600 mt-1.5">We&apos;ll monitor homepage, pricing, features, blog, jobs, and changelog pages.</p>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl border border-red-900 text-red-400 text-sm" style={{ background: 'rgba(239,68,68,0.08)' }}>
                {error}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-black text-sm transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: '#10b981' }}>
                {loading ? 'Scanning competitor…' : 'Add & scan now →'}
              </button>
            </div>
          </form>
        </div>

        {loading && (
          <div className="mt-6 p-4 rounded-xl border border-zinc-800 flex items-center gap-3" style={{ background: '#111113' }}>
            <div className="emerald-dot shrink-0" />
            <div>
              <p className="text-sm text-white font-medium">Scanning {name || 'competitor'}…</p>
              <p className="text-xs text-zinc-500 mt-0.5">Checking homepage, pricing, features, blog, jobs and changelog. This takes ~30 seconds.</p>
            </div>
          </div>
        )}

        <div className="mt-8 p-5 rounded-xl border border-zinc-800/50" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <h3 className="text-sm font-semibold text-white mb-3">What we monitor</h3>
          <div className="grid grid-cols-2 gap-2">
            {['Homepage', 'Pricing page', 'Features page', 'Blog', 'Jobs / Hiring', 'Changelog'].map(page => (
              <div key={page} className="flex items-center gap-2 text-sm text-zinc-400">
                <span style={{ color: '#10b981' }}>✓</span> {page}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
