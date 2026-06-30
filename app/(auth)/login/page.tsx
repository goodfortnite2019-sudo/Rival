'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#09090b' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="emerald-dot" />
            <span className="text-white font-semibold text-lg">Rival</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-6 mb-2">Welcome back</h1>
          <p className="text-zinc-400 text-sm">Sign in to your intelligence dashboard</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 p-8" style={{ background: '#111113' }}>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-zinc-700 text-white text-sm transition-colors focus:outline-none focus:border-emerald-500"
                style={{ background: '#18181b' }}
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-zinc-700 text-white text-sm transition-colors focus:outline-none focus:border-emerald-500"
                style={{ background: '#18181b' }}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl border border-red-900 text-red-400 text-sm" style={{ background: 'rgba(239,68,68,0.08)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-black text-sm transition-all hover:opacity-90 disabled:opacity-50 mt-2"
              style={{ background: '#10b981' }}>
              {loading ? 'Signing in…' : 'Sign in →'}
            </button>
          </form>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="hover:text-white transition-colors" style={{ color: '#10b981' }}>Start free</Link>
        </p>
      </div>
    </div>
  )
}
