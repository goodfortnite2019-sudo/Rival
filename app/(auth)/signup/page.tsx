'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setDone(true)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#09090b' }}>
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl" style={{ background: 'rgba(16,185,129,0.15)' }}>✉</div>
          <h2 className="text-2xl font-bold text-white mb-3">Check your email</h2>
          <p className="text-zinc-400 mb-6">We sent a confirmation link to <strong className="text-white">{email}</strong>. Click it to activate your account.</p>
          <Link href="/login" className="text-sm" style={{ color: '#10b981' }}>Back to login →</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#09090b' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="emerald-dot" />
            <span className="text-white font-semibold text-lg">Rival</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mt-6 mb-2">Start monitoring free</h1>
          <p className="text-zinc-400 text-sm">No credit card · Setup in 3 minutes</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 p-8" style={{ background: '#111113' }}>
          <form onSubmit={handleSignup} className="space-y-4">
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
                minLength={8}
                className="w-full px-4 py-3 rounded-xl border border-zinc-700 text-white text-sm transition-colors focus:outline-none focus:border-emerald-500"
                style={{ background: '#18181b' }}
                placeholder="Min. 8 characters"
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
              {loading ? 'Creating account…' : 'Create free account →'}
            </button>
          </form>

          <p className="text-xs text-zinc-600 text-center mt-4">
            By signing up you agree to our{' '}
            <Link href="/terms" className="underline hover:text-zinc-400">Terms</Link> and{' '}
            <Link href="/privacy" className="underline hover:text-zinc-400">Privacy Policy</Link>.
          </p>
        </div>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="hover:text-white transition-colors" style={{ color: '#10b981' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
