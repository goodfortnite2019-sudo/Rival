'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'

function SettingsContent() {
  const [workspace, setWorkspace] = useState<Record<string, unknown> | null>(null)
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [slackUrl, setSlackUrl] = useState('')
  const [slackSaving, setSlackSaving] = useState(false)
  const [slackSaved, setSlackSaved] = useState(false)
  const [ltdCode, setLtdCode] = useState('')
  const [ltdLoading, setLtdLoading] = useState(false)
  const [ltdMessage, setLtdMessage] = useState('')
  const [ltdError, setLtdError] = useState('')
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser({ email: user.email || '' })

      const { data: ws } = await supabase.from('workspaces').select('*').eq('owner_id', user.id).single()
      setWorkspace(ws)
      if (ws?.slack_webhook_url) setSlackUrl(ws.slack_webhook_url as string)

      // Generate referral code if missing
      if (ws && !ws.referral_code) {
        await fetch('/api/referral', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ workspaceId: ws.id }),
        })
        const { data: updated } = await supabase.from('workspaces').select('*').eq('id', ws.id).single()
        setWorkspace(updated)
      }

      setLoading(false)
    }
    load()
  }, [])

  async function handleUpgrade(plan: 'pro' | 'agency') {
    const priceId = plan === 'pro' ? process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID : process.env.NEXT_PUBLIC_STRIPE_AGENCY_PRICE_ID
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    })
    const { url } = await res.json()
    window.location.href = url
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  async function saveSlack() {
    setSlackSaving(true)
    await supabase.from('workspaces').update({ slack_webhook_url: slackUrl || null }).eq('id', workspace!.id)
    setSlackSaving(false)
    setSlackSaved(true)
    setTimeout(() => setSlackSaved(false), 3000)
  }

  async function redeemCode() {
    setLtdLoading(true)
    setLtdMessage('')
    setLtdError('')
    const res = await fetch('/api/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: ltdCode }),
    })
    const data = await res.json()
    if (res.ok) {
      setLtdMessage(data.message)
      setLtdCode('')
      const { data: updated } = await supabase.from('workspaces').select('*').eq('id', workspace!.id).single()
      setWorkspace(updated)
    } else {
      setLtdError(data.error)
    }
    setLtdLoading(false)
  }

  function copyReferral() {
    const ref = workspace?.referral_code as string
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL || ''}/signup?ref=${ref}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090b' }}>
      <div className="emerald-dot" />
    </div>
  )

  const plan = (workspace?.plan as string) || 'free'
  const limit = (workspace?.competitor_limit as number) || 2
  const showUpgrade = searchParams.get('upgrade') === 'true' || plan === 'free'
  const referralCode = workspace?.referral_code as string

  const S = {
    card: { background: '#0c0c0f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '24px', marginBottom: 16 } as React.CSSProperties,
    label: { fontSize: 12, color: '#52525b', marginBottom: 6, display: 'block' } as React.CSSProperties,
    input: { width: '100%', padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: 14, outline: 'none' } as React.CSSProperties,
  }

  return (
    <div style={{ minHeight: '100vh', background: '#09090b' }}>
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', background: '#0a0a0d' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="#10b981" strokeWidth="1.5" /><circle cx="10" cy="10" r="4" fill="#10b981" /></svg>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Rival</span>
          </Link>
          <div style={{ display: 'flex', gap: 4 }}>
            <Link href="/dashboard" style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, color: '#71717a', textDecoration: 'none' }}>Dashboard</Link>
            <Link href="/dashboard/settings" style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, color: '#fff', background: 'rgba(255,255,255,0.06)', textDecoration: 'none' }}>Settings</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 24px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 28 }}>Settings</h1>

        {/* Account */}
        <div style={S.card}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 16 }}>Account</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: 13, color: '#52525b' }}>Email</span>
            <span style={{ fontSize: 13, color: '#a1a1aa' }}>{user?.email}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: 13, color: '#52525b' }}>Plan</span>
            <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: plan === 'free' ? 'rgba(255,255,255,0.05)' : 'rgba(16,185,129,0.1)', color: plan === 'free' ? '#71717a' : '#10b981', textTransform: 'uppercase' }}>{plan}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
            <span style={{ fontSize: 13, color: '#52525b' }}>Competitor slots</span>
            <span style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{limit}</span>
          </div>
          <button onClick={handleLogout} style={{ marginTop: 8, fontSize: 13, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Sign out</button>
        </div>

        {/* Slack Integration */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Slack Integration</h2>
            <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: 700 }}>NEW</span>
          </div>
          <p style={{ fontSize: 13, color: '#52525b', marginBottom: 16 }}>Get instant alerts and weekly briefings directly in Slack.</p>
          <label style={S.label}>Slack Webhook URL</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={slackUrl}
              onChange={e => setSlackUrl(e.target.value)}
              placeholder="https://hooks.slack.com/services/..."
              style={S.input}
            />
            <button onClick={saveSlack} disabled={slackSaving} style={{
              padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
              background: slackSaved ? 'rgba(16,185,129,0.15)' : '#10b981',
              color: slackSaved ? '#10b981' : '#000', border: slackSaved ? '1px solid rgba(16,185,129,0.3)' : 'none',
            }}>
              {slackSaved ? '✓ Saved' : slackSaving ? '...' : 'Save'}
            </button>
          </div>
          <p style={{ fontSize: 11, color: '#27272a', marginTop: 8 }}>
            <a href="https://api.slack.com/messaging/webhooks" target="_blank" rel="noreferrer" style={{ color: '#3f3f46' }}>How to create a Slack webhook →</a>
          </p>
        </div>

        {/* AppSumo Code */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>AppSumo Code</h2>
            <span style={{ fontSize: 18 }}>🔥</span>
          </div>
          <p style={{ fontSize: 13, color: '#52525b', marginBottom: 16 }}>Redeem your AppSumo code for extra competitor slots. Stack up to 3 codes.</p>
          <label style={S.label}>Lifetime deal code</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={ltdCode}
              onChange={e => setLtdCode(e.target.value.toUpperCase())}
              placeholder="RIVAL-SUMO-XXX"
              style={{ ...S.input, fontFamily: 'monospace', letterSpacing: '0.05em' }}
            />
            <button onClick={redeemCode} disabled={ltdLoading || !ltdCode} style={{
              padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: ltdCode ? 'pointer' : 'not-allowed',
              background: 'rgba(251,146,60,0.12)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.25)', flexShrink: 0,
            }}>
              {ltdLoading ? '...' : 'Redeem'}
            </button>
          </div>
          {ltdMessage && <p style={{ fontSize: 13, color: '#10b981', marginTop: 10 }}>✓ {ltdMessage}</p>}
          {ltdError && <p style={{ fontSize: 13, color: '#ef4444', marginTop: 10 }}>✕ {ltdError}</p>}
          <p style={{ fontSize: 11, color: '#27272a', marginTop: 8 }}>Codes redeemed: {(workspace?.ltd_codes_redeemed as number) || 0} / 3</p>
        </div>

        {/* Referral */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Refer a friend</h2>
            <span style={{ fontSize: 18 }}>🎁</span>
          </div>
          <p style={{ fontSize: 13, color: '#52525b', marginBottom: 16 }}>Share your link — you get +1 competitor slot for every person who signs up.</p>
          {referralCode ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1, padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', fontSize: 13, color: '#a1a1aa', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {typeof window !== 'undefined' ? window.location.origin : ''}/signup?ref={referralCode}
              </div>
              <button onClick={copyReferral} style={{
                padding: '10px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
                background: copied ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
                color: copied ? '#10b981' : '#a1a1aa', border: `1px solid ${copied ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.08)'}`,
              }}>
                {copied ? '✓ Copied' : 'Copy link'}
              </button>
            </div>
          ) : (
            <p style={{ fontSize: 13, color: '#3f3f46' }}>Generating your referral link...</p>
          )}
        </div>

        {/* Upgrade */}
        {(showUpgrade || plan !== 'agency') && (
          <div style={S.card}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Upgrade your plan</h2>
            <p style={{ fontSize: 13, color: '#52525b', marginBottom: 20 }}>Monitor more competitors and unlock email briefings.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {plan !== 'pro' && plan !== 'agency' && (
                <div style={{ padding: 20, borderRadius: 12, background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 2 }}>€29<span style={{ fontSize: 13, color: '#52525b', fontWeight: 400 }}>/mo</span></div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#10b981', marginBottom: 12 }}>Pro</div>
                  {['5 competitors', 'Weekly briefings', 'All page types', 'Hiring signals', 'Instant alerts', 'Slack integration'].map(f => (
                    <div key={f} style={{ fontSize: 12, color: '#71717a', display: 'flex', gap: 6, marginBottom: 6 }}>
                      <span style={{ color: '#10b981' }}>✓</span> {f}
                    </div>
                  ))}
                  <button onClick={() => handleUpgrade('pro')} style={{ marginTop: 16, width: '100%', padding: '10px', borderRadius: 8, background: '#10b981', color: '#000', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                    Upgrade to Pro
                  </button>
                </div>
              )}
              {plan !== 'agency' && (
                <div style={{ padding: 20, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 2 }}>€79<span style={{ fontSize: 13, color: '#52525b', fontWeight: 400 }}>/mo</span></div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#a78bfa', marginBottom: 12 }}>Agency</div>
                  {['15 competitors', 'Daily monitoring', 'White-label reports', 'Team members', 'API access', 'Priority support'].map(f => (
                    <div key={f} style={{ fontSize: 12, color: '#71717a', display: 'flex', gap: 6, marginBottom: 6 }}>
                      <span style={{ color: '#a78bfa' }}>✓</span> {f}
                    </div>
                  ))}
                  <button onClick={() => handleUpgrade('agency')} style={{ marginTop: 16, width: '100%', padding: '10px', borderRadius: 8, background: 'transparent', color: '#a1a1aa', fontSize: 13, fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                    Upgrade to Agency
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090b' }}><div className="emerald-dot" /></div>}>
      <SettingsContent />
    </Suspense>
  )
}
