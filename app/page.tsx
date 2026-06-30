'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useCallback } from 'react'

// ─── Word rotator ─────────────────────────────────────────────────────────────
const ROTATING_WORDS = ['repricing.', 'hiring.', 'launching.', 'pivoting.', 'winning.']

function WordRotator() {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => { setIdx(i => (i + 1) % ROTATING_WORDS.length); setVisible(true) }, 350)
    }, 2200)
    return () => clearInterval(t)
  }, [])
  return (
    <span style={{
      display: 'inline-block',
      background: 'linear-gradient(135deg, #10b981 0%, #34d399 60%, #6ee7b7 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(-10px)',
      transition: 'opacity 0.3s ease, transform 0.3s ease',
      minWidth: '200px',
    }}>
      {ROTATING_WORDS[idx]}
    </span>
  )
}

// ─── Scroll reveal ────────────────────────────────────────────────────────────
function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => setVisible(true), delay); observer.disconnect() }
    }, { threshold: 0.08 })
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [delay])
  return { ref, visible }
}

// ─── Counter ──────────────────────────────────────────────────────────────────
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - start) / 1600, 1)
          setCount(Math.floor((1 - Math.pow(1 - p, 4)) * target))
          if (p < 1) requestAnimationFrame(tick)
          else setCount(target)
        }
        requestAnimationFrame(tick)
      }
    })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])
  return <span ref={ref}>{count}{suffix}</span>
}

// ─── Live feed data ───────────────────────────────────────────────────────────
const CHANGES = [
  { type: 'PRICING',  color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  company: 'Notion',     detail: 'Plus plan raised €8 → €12/month',              time: '2m' },
  { type: 'HIRING',   color: '#10b981', bg: 'rgba(16,185,129,0.08)',  company: 'Linear',     detail: '6 new roles opened in NYC & Berlin',           time: '14m' },
  { type: 'FEATURE',  color: '#3b82f6', bg: 'rgba(59,130,246,0.08)',  company: 'Loom',       detail: 'AI summaries now on all plans',                time: '41m' },
  { type: 'CONTENT',  color: '#a78bfa', bg: 'rgba(167,139,250,0.08)', company: 'Superhuman', detail: 'Launched SEO push targeting "email ai"',       time: '2h' },
  { type: 'PRICING',  color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  company: 'Figma',      detail: 'Removed Starter tier entirely',                time: '5h' },
]

// ─── Sample report section ────────────────────────────────────────────────────
const REPORT_ITEMS = [
  { emoji: '💰', title: 'Notion raised prices', detail: 'Plus plan up 50%. Our analysis: they\'re repositioning upmarket. Opportunity: target their churned SMB users.', tag: 'HIGH IMPACT', tagColor: '#f59e0b' },
  { emoji: '🧑‍💻', title: 'Linear hiring 6 engineers', detail: 'Roles focused on enterprise integrations. Signal: major platform push in Q3. Watch for an enterprise plan announcement.', tag: 'SIGNAL', tagColor: '#3b82f6' },
  { emoji: '✨', title: 'Loom AI now free', detail: 'Removing friction to drive top-of-funnel growth. Defensive move: counter with your async video feature or messaging.', tag: 'ACTION', tagColor: '#10b981' },
]

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { quote: 'Rival caught a competitor pricing change 3 days before our own pricing review. We adjusted immediately and kept the positioning advantage.', name: 'Marcus T.', role: 'Founder, Growthpath', initials: 'MT' },
  { quote: 'I blocked 4 hours every Friday for competitor research. Now I read Rival\'s Monday briefing in 10 minutes. That\'s 200+ hours back per year.', name: 'Sarah K.', role: 'Head of Marketing, Stackwise', initials: 'SK' },
  { quote: 'The hiring signals are unreal. We saw a competitor post 6 enterprise sales roles before any announcement. We had a counter-strategy ready the same week.', name: 'David R.', role: 'CEO, Helixdata', initials: 'DR' },
]

// ─── Translations ─────────────────────────────────────────────────────────────
const COPY = {
  en: {
    badge: 'Competitor intelligence, fully automated',
    headline1: 'Your competitors',
    navFeatures: 'Features',
    navHowItWorks: 'How it works',
    navPricing: 'Pricing',
    signIn: 'Sign in',
    getStarted: 'Get started free →',
    heroCta: 'Start monitoring for free →',
    heroSub: 'Rival monitors your competitors 24/7 — pricing changes, new features, hiring signals, content shifts — and delivers a Claude-analyzed intelligence briefing every Monday morning.',
    heroNoCard: 'No credit card required · Live in 3 minutes',
    statsLabel1: 'Page types monitored',
    statsLabel2: 'Avg. weekly changes caught',
    statsLabel3: 'Time saved per week',
    statsLabel4: 'Founders & teams',
    problemLabel: 'The problem',
    problemH2: 'You\'re flying blind.',
    problemP: 'Your competitors are moving. Pricing. Pivoting. Hiring. Launching. And you find out weeks later — from a customer, a tweet, or pure accident. By then it\'s already too late.',
    briefingLabel: 'Sample output',
    briefingH2: 'A briefing that\nactually gets read.',
    briefingP: 'Claude AI doesn\'t just detect changes — it interprets them. Every briefing tells you what happened, why it matters, and what to do about it.',
    briefingFeatures: ['Change detection across 6 page types', 'Claude-generated strategic context', 'Ready to share with your team', 'Delivered every Monday at 8am'],
    howLabel: 'Setup',
    howH2: 'Live in 3 minutes.',
    steps: [
      { title: 'Add your competitors', desc: 'Drop in a URL. Rival instantly scans their homepage, pricing, blog, jobs, features, and changelog as your baseline snapshot.' },
      { title: 'We monitor 24/7', desc: 'Our engine re-crawls every competitor weekly and diffs content at the character level. Nothing gets past it.' },
      { title: 'Read your briefing Monday 8am', desc: 'A Claude-analyzed intelligence report lands in your inbox. What changed, why it matters, what to do. Read it in 10 minutes. Be the most informed person in the room.' },
    ],
    testimonialsLabel: 'Results',
    testimonialsH2: 'Real wins, real teams.',
    pricingLabel: 'Pricing',
    pricingH2: 'Simple. Honest. No tricks.',
    pricingP: 'Cancel anytime. Upgrade or downgrade instantly.',
    finalH2line1: 'Stop guessing.',
    finalH2line2: 'Start knowing.',
    finalP: 'Your competitors are moving right now. The question is — do you know where they\'re going?',
    finalCta: 'Start monitoring for free →',
    finalSub: 'No credit card required · Setup in 3 minutes',
    footerPrivacy: 'Privacy',
    footerTerms: 'Terms',
    footerImprint: 'Imprint',
    footerContact: 'Contact',
    planFree: { name: 'Free', desc: 'Start today, no card needed', cta: 'Get started free', features: ['2 competitors', 'Monthly briefing', 'Web dashboard', 'Homepage + pricing pages'] },
    planPro: { name: 'Pro', desc: 'For serious operators', cta: 'Start Pro trial', features: ['5 competitors', 'Weekly email briefings', 'All 6 page types', 'Hiring & content signals', 'Full change history', 'Priority support'] },
    planAgency: { name: 'Agency', desc: 'For teams and agencies', cta: 'Start Agency trial', features: ['15 competitors', 'Weekly briefings for all', 'White-label reports', 'Up to 3 team members', 'Full API access', 'Dedicated support'] },
  },
  de: {
    badge: 'Competitor-Intelligence, vollständig automatisiert',
    headline1: 'Deine Konkurrenz',
    navFeatures: 'Features',
    navHowItWorks: 'So funktionierts',
    navPricing: 'Preise',
    signIn: 'Anmelden',
    getStarted: 'Kostenlos starten →',
    heroCta: 'Kostenlos starten →',
    heroSub: 'Rival überwacht deine Konkurrenz rund um die Uhr — Preisänderungen, neue Features, Stellenanzeigen, Content-Shifts — und liefert jeden Montag früh eine KI-analysierte Intelligence-Briefing direkt in dein Postfach.',
    heroNoCard: 'Keine Kreditkarte · Live in 3 Minuten',
    statsLabel1: 'Überwachte Seitentypen',
    statsLabel2: 'Ø wöchentliche Änderungen erkannt',
    statsLabel3: 'Gesparte Zeit pro Woche',
    statsLabel4: 'Gründer & Teams',
    problemLabel: 'Das Problem',
    problemH2: 'Du fliegst im Blindflug.',
    problemP: 'Deine Konkurrenz macht Moves. Preise ändern. Pivoten. Einstellen. Launchen. Und du erfährst es Wochen später — von einem Kunden, einem Tweet oder per Zufall. Dann ist es längst zu spät.',
    briefingLabel: 'Beispiel-Output',
    briefingH2: 'Ein Briefing,\ndas wirklich gelesen wird.',
    briefingP: 'Claude AI erkennt nicht nur Änderungen — es interpretiert sie. Jedes Briefing sagt dir, was sich verändert hat, warum es wichtig ist und was du tun solltest.',
    briefingFeatures: ['Erkennung bei 6 Seitentypen', 'Strategischer Kontext via Claude', 'Direkt mit dem Team teilbar', 'Jeden Montag um 8 Uhr'],
    howLabel: 'Setup',
    howH2: 'In 3 Minuten live.',
    steps: [
      { title: 'Konkurrenten hinzufügen', desc: 'URL einfügen. Rival scannt sofort Homepage, Preise, Blog, Jobs, Features und Changelog als Baseline-Snapshot.' },
      { title: 'Wir überwachen 24/7', desc: 'Unser System crawlt jeden Konkurrenten wöchentlich und vergleicht Inhalte auf Zeichenebene. Nichts entgeht uns.' },
      { title: 'Briefing lesen — Montag, 8 Uhr', desc: 'Ein KI-analysierter Intelligence-Report landet in deinem Postfach. Was sich geändert hat, warum es wichtig ist, was zu tun ist. 10 Minuten lesen. Die informierteste Person im Raum sein.' },
    ],
    testimonialsLabel: 'Ergebnisse',
    testimonialsH2: 'Echte Erfolge, echte Teams.',
    pricingLabel: 'Preise',
    pricingH2: 'Einfach. Ehrlich. Keine Tricks.',
    pricingP: 'Jederzeit kündigen. Sofort upgraden oder downgraden.',
    finalH2line1: 'Hör auf zu raten.',
    finalH2line2: 'Fang an zu wissen.',
    finalP: 'Deine Konkurrenz macht gerade Moves. Die Frage ist — weißt du wohin?',
    finalCta: 'Kostenlos starten →',
    finalSub: 'Keine Kreditkarte · Setup in 3 Minuten',
    footerPrivacy: 'Datenschutz',
    footerTerms: 'AGB',
    footerImprint: 'Impressum',
    footerContact: 'Kontakt',
    planFree: { name: 'Free', desc: 'Heute starten, keine Karte nötig', cta: 'Kostenlos starten', features: ['2 Konkurrenten', 'Monatliches Briefing', 'Web-Dashboard', 'Homepage + Preisseiten'] },
    planPro: { name: 'Pro', desc: 'Für ernsthafte Gründer', cta: 'Pro testen', features: ['5 Konkurrenten', 'Wöchentliche Email-Briefings', 'Alle 6 Seitentypen', 'Hiring & Content-Signale', 'Vollständige Änderungshistorie', 'Priority-Support'] },
    planAgency: { name: 'Agency', desc: 'Für Teams und Agenturen', cta: 'Agency testen', features: ['15 Konkurrenten', 'Wöchentliche Briefings für alle', 'White-Label Reports', 'Bis zu 3 Teammitglieder', 'Vollständiger API-Zugang', 'Dedizierter Support'] },
  },
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [activeFeed, setActiveFeed] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [lang, setLang] = useState<'en' | 'de'>('en')
  const t = COPY[lang]
  const heroR = useReveal(0)
  const statsR = useReveal(100)
  const problemR = useReveal(100)
  const featuresR = useReveal(100)
  const reportR = useReveal(100)
  const testimonialsR = useReveal(100)

  useEffect(() => {
    const t = setInterval(() => setActiveFeed(p => (p + 1) % CHANGES.length), 2600)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navOpaque = scrollY > 40

  return (
    <div style={{ background: '#050507', color: '#fafafa', overflowX: 'hidden', minHeight: '100vh' }}>

      {/* Ambient background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }} />
        {/* Top glow */}
        <div style={{
          position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: 1000, height: 600,
          background: 'radial-gradient(ellipse at 50% -10%, rgba(16,185,129,0.12) 0%, transparent 65%)',
        }} />
        {/* Bottom-left glow */}
        <div style={{
          position: 'absolute', bottom: '20%', left: 0,
          width: 600, height: 600,
          background: 'radial-gradient(ellipse at 0% 50%, rgba(16,185,129,0.04) 0%, transparent 60%)',
        }} />
      </div>

      {/* ── NAV ──────────────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 56, display: 'flex', alignItems: 'center',
        padding: '0 24px',
        background: navOpaque ? 'rgba(5,5,7,0.9)' : 'transparent',
        backdropFilter: navOpaque ? 'blur(20px)' : 'none',
        borderBottom: navOpaque ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="#10b981" strokeWidth="1.5" />
                <circle cx="10" cy="10" r="4" fill="#10b981" />
              </svg>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>Rival</span>
            </div>
            <div style={{ display: 'flex', gap: 24 }}>
              {[[t.navFeatures, '#features'], [t.navHowItWorks, '#how-it-works'], [t.navPricing, '#pricing']].map(([label, href]) => (
                <a key={href} href={href} style={{ fontSize: 13, color: '#71717a', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#71717a')}>
                  {label}
                </a>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Language toggle */}
            <button
              onClick={() => setLang(l => l === 'en' ? 'de' : 'en')}
              style={{
                fontSize: 12, fontWeight: 600, padding: '5px 10px', borderRadius: 6,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#71717a', cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '0.05em',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#71717a'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)' }}>
              {lang === 'en' ? 'DE' : 'EN'}
            </button>
            <Link href="/login" style={{ fontSize: 13, color: '#71717a', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#71717a')}>
              {t.signIn}
            </Link>
            <Link href="/signup" style={{
              fontSize: 13, fontWeight: 600, padding: '7px 16px', borderRadius: 8,
              background: '#10b981', color: '#000', textDecoration: 'none',
              transition: 'all 0.15s', display: 'inline-block',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#0ea471'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#10b981'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}>
              {t.getStarted}
            </Link>
          </div>
        </div>
      </nav>

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section style={{ padding: '140px 24px 80px', textAlign: 'center' }} ref={heroR.ref}>
          {/* Pill badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 32,
            padding: '6px 14px', borderRadius: 99,
            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
            opacity: heroR.visible ? 1 : 0, transform: heroR.visible ? 'none' : 'translateY(12px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulseGlow 2s infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: '#10b981' }}>{t.badge}</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(52px, 9vw, 96px)', fontWeight: 800, lineHeight: 1.02,
            letterSpacing: '-0.04em', marginBottom: 28,
            opacity: heroR.visible ? 1 : 0, transform: heroR.visible ? 'none' : 'translateY(20px)',
            transition: 'opacity 0.7s 0.1s ease, transform 0.7s 0.1s ease',
          }}>
            <span style={{ color: '#fff' }}>{t.headline1}<br />{lang === 'de' ? 'gerade am ' : 'are '}</span>
            <WordRotator />
          </h1>

          {/* Subline */}
          <p style={{
            fontSize: 18, lineHeight: 1.7, color: '#71717a', maxWidth: 520, margin: '0 auto 40px',
            opacity: heroR.visible ? 1 : 0, transform: heroR.visible ? 'none' : 'translateY(16px)',
            transition: 'opacity 0.7s 0.2s ease, transform 0.7s 0.2s ease',
          }}>
            {t.heroSub}
          </p>

          {/* CTAs */}
          <div style={{
            display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap',
            opacity: heroR.visible ? 1 : 0, transform: heroR.visible ? 'none' : 'translateY(12px)',
            transition: 'opacity 0.7s 0.3s ease, transform 0.7s 0.3s ease',
          }}>
            <Link href="/signup" style={{
              fontSize: 15, fontWeight: 600, padding: '14px 28px', borderRadius: 12,
              background: '#10b981', color: '#000', textDecoration: 'none',
              boxShadow: '0 0 0 1px rgba(16,185,129,0.3), 0 8px 32px rgba(16,185,129,0.25)',
              transition: 'all 0.2s ease', display: 'inline-block',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-1px)'; el.style.boxShadow = '0 0 0 1px rgba(16,185,129,0.4), 0 12px 48px rgba(16,185,129,0.35)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = '0 0 0 1px rgba(16,185,129,0.3), 0 8px 32px rgba(16,185,129,0.25)' }}>
              {t.heroCta}
            </Link>
            <Link href="/demo" style={{
              fontSize: 15, fontWeight: 500, padding: '14px 28px', borderRadius: 12,
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
              color: '#a1a1aa', textDecoration: 'none', transition: 'all 0.2s ease', display: 'inline-block',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.07)'; el.style.color = '#fff' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(255,255,255,0.04)'; el.style.color = '#a1a1aa' }}>
              {lang === 'en' ? 'See live demo →' : 'Live-Demo ansehen →'}
            </Link>
          </div>
          <p style={{ fontSize: 12, color: '#3f3f46', marginTop: 16 }}>{t.heroNoCard}</p>

          {/* ── PRODUCT MOCKUP ─────────────────────────────────────────────── */}
          <div style={{
            maxWidth: 900, margin: '72px auto 0',
            opacity: heroR.visible ? 1 : 0, transform: heroR.visible ? 'none' : 'translateY(40px)',
            transition: 'opacity 0.9s 0.45s ease, transform 0.9s 0.45s ease',
          }}>
            {/* Halo glow */}
            <div style={{
              position: 'absolute', left: '50%', transform: 'translateX(-50%)',
              width: 700, height: 100, marginTop: -20,
              background: 'radial-gradient(ellipse, rgba(16,185,129,0.18) 0%, transparent 70%)',
              filter: 'blur(20px)', pointerEvents: 'none', zIndex: -1,
            }} />

            <div style={{
              borderRadius: 16, overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)',
              background: '#0c0c0f',
              boxShadow: '0 40px 120px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
            }}>
              {/* Window chrome */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)',
                background: '#0a0a0d',
              }}>
                <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                  {['#ff5f57', '#febc2e', '#28c840'].map(c => (
                    <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
                  ))}
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 7,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <circle cx="5" cy="5" r="4" stroke="#3f3f46" strokeWidth="1.2" />
                    <path d="M3 5h4M5 3v4" stroke="#3f3f46" strokeWidth="1.2" />
                  </svg>
                  <span style={{ fontSize: 11, color: '#3f3f46' }}>app.getrival.eu/dashboard</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', animation: 'pulseGlow 2s infinite' }} />
                  <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>Live</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', minHeight: 380 }}>
                {/* Sidebar */}
                <div style={{ borderRight: '1px solid rgba(255,255,255,0.05)', padding: '16px 12px', background: '#080809' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: '#3f3f46', marginBottom: 12, paddingLeft: 8 }}>WORKSPACE</div>
                  {[
                    { label: 'Intelligence Feed', icon: '◈', active: true },
                    { label: 'Competitors', icon: '⬡', active: false },
                    { label: 'Weekly Reports', icon: '◉', active: false },
                    { label: 'Settings', icon: '✦', active: false },
                  ].map(item => (
                    <div key={item.label} style={{
                      display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px', borderRadius: 7,
                      marginBottom: 2,
                      background: item.active ? 'rgba(16,185,129,0.08)' : 'transparent',
                      cursor: 'default',
                    }}>
                      <span style={{ fontSize: 10, color: item.active ? '#10b981' : '#3f3f46' }}>{item.icon}</span>
                      <span style={{ fontSize: 12, color: item.active ? '#e4e4e7' : '#52525b', fontWeight: item.active ? 500 : 400 }}>{item.label}</span>
                      {item.active && <span style={{ marginLeft: 'auto', fontSize: 10, background: '#10b981', color: '#000', borderRadius: 4, padding: '1px 6px', fontWeight: 700 }}>{CHANGES.length}</span>}
                    </div>
                  ))}

                  <div style={{ marginTop: 24, padding: '0 8px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: '#3f3f46', marginBottom: 10 }}>COMPETITORS</div>
                    {['Notion', 'Linear', 'Loom', 'Superhuman', 'Figma'].map(c => (
                      <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: 6,
                          background: `hsl(${c.charCodeAt(0) * 37 % 360}, 50%, 25%)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 9, fontWeight: 700, color: '#fff',
                        }}>{c[0]}</div>
                        <span style={{ fontSize: 11, color: '#52525b' }}>{c}</span>
                        <div style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main content */}
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: 0 }}>Intelligence Feed</h3>
                      <p style={{ fontSize: 11, color: '#52525b', margin: '3px 0 0' }}>Week of June 23–29, 2026 · Monitored 5 competitors</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ padding: '5px 10px', borderRadius: 7, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', fontSize: 11, color: '#10b981', fontWeight: 600 }}>
                        {CHANGES.length} changes
                      </div>
                      <div style={{ padding: '5px 10px', borderRadius: 7, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', fontSize: 11, color: '#52525b' }}>
                        Export
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {CHANGES.map((item, i) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10,
                        background: i === activeFeed ? item.bg : 'rgba(255,255,255,0.015)',
                        border: `1px solid ${i === activeFeed ? `rgba(${item.color === '#10b981' ? '16,185,129' : item.color === '#f59e0b' ? '245,158,11' : item.color === '#3b82f6' ? '59,130,246' : '167,139,250'},0.2)` : 'rgba(255,255,255,0.04)'}`,
                        transform: i === activeFeed ? 'translateX(4px)' : 'none',
                        transition: 'all 0.4s ease',
                      }}>
                        <span style={{ padding: '2px 7px', borderRadius: 5, fontSize: 9, fontWeight: 800, letterSpacing: '0.05em', background: item.bg, color: item.color, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                          {item.type}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#e4e4e7', whiteSpace: 'nowrap' }}>{item.company}</span>
                        <span style={{ fontSize: 11, color: '#52525b', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.detail}</span>
                        <span style={{ fontSize: 10, color: '#27272a', whiteSpace: 'nowrap' }}>{item.time} ago</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SOCIAL PROOF BAR ─────────────────────────────────────────────── */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '20px 24px' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, color: '#27272a', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>Used by teams at</span>
            {['YC-backed startups', 'Digital agencies', 'B2B SaaS', 'Growth teams', 'Solo founders'].map(l => (
              <span key={l} style={{ fontSize: 13, color: '#27272a', fontWeight: 500, cursor: 'default', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#52525b')}
                onMouseLeave={e => (e.currentTarget.style.color = '#27272a')}>
                {l}
              </span>
            ))}
          </div>
        </div>

        {/* ── STATS ────────────────────────────────────────────────────────── */}
        <section style={{ padding: '80px 24px' }} ref={statsR.ref}>
          <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
            {[
              { value: 94, suffix: '%', label: 'of pricing changes\ndetected within 24h' },
              { value: 6, suffix: '', label: 'page types monitored\nper competitor' },
              { value: 200, suffix: 'h', label: 'saved per year vs\nmanual research' },
            ].map((s, i) => (
              <div key={i} style={{
                textAlign: 'center', padding: '40px 20px',
                borderRadius: 16,
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                margin: 4,
                opacity: statsR.visible ? 1 : 0,
                transform: statsR.visible ? 'none' : 'translateY(20px)',
                transition: `opacity 0.6s ${i * 0.12}s ease, transform 0.6s ${i * 0.12}s ease`,
              }}>
                <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: '-0.03em', color: i === 0 ? '#10b981' : '#fff', lineHeight: 1, marginBottom: 12 }}>
                  <Counter target={s.value} suffix={s.suffix} />
                </div>
                <div style={{ fontSize: 13, color: '#52525b', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── THE PROBLEM ──────────────────────────────────────────────────── */}
        <section style={{ padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }} ref={problemR.ref}>
          <div style={{ maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
            <div style={{ opacity: problemR.visible ? 1 : 0, transform: problemR.visible ? 'none' : 'translateX(-20px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#10b981', marginBottom: 16, textTransform: 'uppercase' }}>The problem</p>
              <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#fff', marginBottom: 20 }}>
                Manual research is<br />broken. Everyone knows it.
              </h2>
              <p style={{ fontSize: 16, color: '#71717a', lineHeight: 1.8, marginBottom: 28 }}>
                You block out Friday afternoons to check competitor sites. You set Google Alerts that miss 80% of changes. You have spreadsheets that are 3 weeks out of date. Meanwhile your competitors are moving.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Google Alerts miss most changes',
                  'Spreadsheets go stale within days',
                  'Manual checks don\'t scale past 3 competitors',
                  'No context — just raw data, no insight',
                ].map(p => (
                  <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: '#ef4444', fontSize: 14, flexShrink: 0 }}>✕</span>
                    <span style={{ fontSize: 14, color: '#52525b' }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ opacity: problemR.visible ? 1 : 0, transform: problemR.visible ? 'none' : 'translateX(20px)', transition: 'opacity 0.7s 0.2s ease, transform 0.7s 0.2s ease' }}>
              {/* "Before Rival" fake email */}
              <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(239,68,68,0.2)', background: '#0c0c0f' }}>
                <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.06)', borderBottom: '1px solid rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', background: 'rgba(239,68,68,0.12)', padding: '2px 8px', borderRadius: 4 }}>BEFORE RIVAL</span>
                  <span style={{ fontSize: 11, color: '#52525b' }}>Friday competitive research block</span>
                </div>
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { task: 'Check Notion pricing page', time: '15 min', done: true },
                    { task: 'Check Linear changelog', time: '20 min', done: true },
                    { task: 'Google "competitor name news"', time: '30 min', done: false },
                    { task: 'Update spreadsheet', time: '25 min', done: false },
                    { task: 'Write summary for team', time: '40 min', done: false },
                  ].map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ width: 14, height: 14, borderRadius: 4, border: `1.5px solid ${t.done ? '#ef4444' : '#27272a'}`, background: t.done ? 'rgba(239,68,68,0.15)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {t.done && <span style={{ fontSize: 8, color: '#ef4444' }}>✓</span>}
                      </div>
                      <span style={{ fontSize: 12, color: '#71717a', flex: 1, textDecoration: t.done ? 'line-through' : 'none' }}>{t.task}</span>
                      <span style={{ fontSize: 11, color: '#3f3f46', fontFamily: 'monospace' }}>{t.time}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 4, padding: '8px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: '#ef4444' }}>Total every week:</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#ef4444' }}>~2.5 hours lost</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────────────────────── */}
        <section id="features" style={{ padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }} ref={featuresR.ref}>
          <div style={{ maxWidth: 1120, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#10b981', marginBottom: 12, textTransform: 'uppercase' }}>What Rival monitors</p>
              <h2 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', marginBottom: 12 }}>Intelligence that drives decisions.</h2>
              <p style={{ fontSize: 16, color: '#52525b' }}>Not vanity metrics. The signals that move markets.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
              {/* Card 1 - large */}
              <div style={{
                borderRadius: 16, padding: 32, background: '#0c0c0f',
                border: '1px solid rgba(255,255,255,0.06)',
                opacity: featuresR.visible ? 1 : 0, transform: featuresR.visible ? 'none' : 'translateY(20px)',
                transition: 'opacity 0.6s ease, transform 0.6s ease, border-color 0.2s',
                cursor: 'default',
              } as React.CSSProperties}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(245,158,11,0.25)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
                <div style={{ fontSize: 28, marginBottom: 24, color: '#f59e0b' }}>◈</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Pricing intelligence</h3>
                <p style={{ fontSize: 14, color: '#52525b', lineHeight: 1.7, marginBottom: 24 }}>
                  Every price change, plan restructure, and tier removal. Detected within 24 hours, explained with strategic context.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    { co: 'Notion', ch: 'Plus: €8 → €12/mo', delta: '+50%' },
                    { co: 'Linear', ch: 'Pro: removed free tier', delta: '⚡' },
                  ].map(r => (
                    <div key={r.co} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.12)' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#e4e4e7' }}>{r.co}</span>
                      <span style={{ fontSize: 11, color: '#52525b', flex: 1 }}>{r.ch}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b', fontFamily: 'monospace' }}>{r.delta}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { icon: '◉', title: 'Hiring signals', color: '#10b981', desc: 'Job postings reveal strategy months before press releases. Know when they\'re scaling enterprise, building AI, or entering new markets.' },
                  { icon: '✦', title: 'Feature launches', color: '#3b82f6', desc: 'New features, removed features, beta rollouts, changelogs. Never get caught off guard by a product update again.' },
                ].map((f, i) => (
                  <div key={i} style={{
                    borderRadius: 16, padding: 28, background: '#0c0c0f',
                    border: '1px solid rgba(255,255,255,0.06)', flex: 1,
                    opacity: featuresR.visible ? 1 : 0, transform: featuresR.visible ? 'none' : 'translateY(20px)',
                    transition: `opacity 0.6s ${(i + 1) * 0.12}s ease, transform 0.6s ${(i + 1) * 0.12}s ease, border-color 0.2s`,
                    cursor: 'default',
                  } as React.CSSProperties}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = `${f.color}40`)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}>
                    <div style={{ fontSize: 22, color: f.color, marginBottom: 14 }}>{f.icon}</div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{f.title}</h3>
                    <p style={{ fontSize: 13, color: '#52525b', lineHeight: 1.7 }}>{f.desc}</p>
                  </div>
                ))}
              </div>

              {/* Full width card */}
              <div style={{
                gridColumn: '1 / -1', borderRadius: 16, padding: 32,
                background: 'linear-gradient(135deg, rgba(167,139,250,0.04) 0%, rgba(16,185,129,0.03) 100%)',
                border: '1px solid rgba(167,139,250,0.15)',
                display: 'flex', alignItems: 'center', gap: 48,
                opacity: featuresR.visible ? 1 : 0, transform: featuresR.visible ? 'none' : 'translateY(20px)',
                transition: 'opacity 0.6s 0.3s ease, transform 0.6s 0.3s ease',
              } as React.CSSProperties}>
                <div style={{ fontSize: 28, color: '#a78bfa', flexShrink: 0 }}>⬡</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Content & SEO intelligence</h3>
                  <p style={{ fontSize: 14, color: '#52525b', lineHeight: 1.7 }}>Blog cadence, keyword pivots, new landing pages, guest posts. Know what angles they're pushing before it affects your traffic.</p>
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', maxWidth: 220, flexShrink: 0 }}>
                  {['Blog cadence', 'New keywords', 'Landing pages', 'Guest posts', 'SEO pivots', 'Ad copy'].map(t => (
                    <span key={t} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: 'rgba(167,139,250,0.08)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.15)' }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SAMPLE REPORT ────────────────────────────────────────────────── */}
        <section style={{ padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }} ref={reportR.ref}>
          <div style={{ maxWidth: 1120, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
              <div style={{ opacity: reportR.visible ? 1 : 0, transform: reportR.visible ? 'none' : 'translateX(-20px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#10b981', marginBottom: 16, textTransform: 'uppercase' }}>Sample output</p>
                <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.1, marginBottom: 20 }}>
                  A briefing that<br />actually gets read.
                </h2>
                <p style={{ fontSize: 15, color: '#71717a', lineHeight: 1.8, marginBottom: 32 }}>
                  Claude AI doesn't just detect changes — it interprets them. Every briefing tells you what happened, why it matters, and what to do about it.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {['Change detection across 6 page types', 'Claude-generated strategic context', 'Ready to share with your team', 'Delivered every Monday at 8am'].map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 20, height: 20, borderRadius: 6, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 10, color: '#10b981' }}>✓</span>
                      </div>
                      <span style={{ fontSize: 14, color: '#a1a1aa' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Email preview */}
              <div style={{ opacity: reportR.visible ? 1 : 0, transform: reportR.visible ? 'none' : 'translateX(20px)', transition: 'opacity 0.7s 0.2s ease, transform 0.7s 0.2s ease' }}>
                <div style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', background: '#0c0c0f', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
                  <div style={{ padding: '14px 18px', background: '#080809', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: 11, color: '#52525b', marginBottom: 4 }}>From: briefings@getrival.eu</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#e4e4e7' }}>Your Monday Intel Brief · Week 26</div>
                  </div>
                  <div style={{ padding: 20 }}>
                    <div style={{ fontSize: 11, color: '#3f3f46', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      5 competitors · {CHANGES.length} changes · Generated by Claude AI
                    </div>
                    {REPORT_ITEMS.map((item, i) => (
                      <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < REPORT_ITEMS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <span style={{ fontSize: 14 }}>{item.emoji}</span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#e4e4e7' }}>{item.title}</span>
                          <span style={{ marginLeft: 'auto', fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 4, background: `rgba(${item.tagColor === '#f59e0b' ? '245,158,11' : item.tagColor === '#3b82f6' ? '59,130,246' : '16,185,129'},0.1)`, color: item.tagColor }}>
                            {item.tag}
                          </span>
                        </div>
                        <p style={{ fontSize: 12, color: '#71717a', lineHeight: 1.7, margin: 0 }}>{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
        <section id="how-it-works" style={{ padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#10b981', marginBottom: 12, textTransform: 'uppercase' }}>{t.howLabel}</p>
              <h2 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff' }}>{t.howH2}</h2>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 19, top: 20, bottom: 20, width: 1, background: 'linear-gradient(to bottom, #10b981, rgba(16,185,129,0.1))' }} />
              {t.steps.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginBottom: 40 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                    background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))',
                    border: '1px solid rgba(16,185,129,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 800, color: '#10b981', position: 'relative', zIndex: 1,
                    fontFamily: 'monospace',
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ paddingTop: 8 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{step.title}</h3>
                    <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.8 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
        <section style={{ padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }} ref={testimonialsR.ref}>
          <div style={{ maxWidth: 1120, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#10b981', marginBottom: 12, textTransform: 'uppercase' }}>{t.testimonialsLabel}</p>
              <h2 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff' }}>{t.testimonialsH2}</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {TESTIMONIALS.map((testimonial, i) => (
                <div key={i} style={{
                  borderRadius: 16, padding: 28, background: '#0c0c0f',
                  border: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', flexDirection: 'column',
                  opacity: testimonialsR.visible ? 1 : 0, transform: testimonialsR.visible ? 'none' : 'translateY(20px)',
                  transition: `opacity 0.6s ${i * 0.12}s ease, transform 0.6s ${i * 0.12}s ease`,
                }}>
                  <div style={{ fontSize: 36, color: '#10b981', lineHeight: 1, marginBottom: 16, fontFamily: 'Georgia, serif' }}>"</div>
                  <p style={{ fontSize: 14, color: '#a1a1aa', lineHeight: 1.75, flex: 1, marginBottom: 24 }}>{testimonial.quote}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: 'linear-gradient(135deg, #059669, #10b981)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, color: '#fff',
                    }}>{testimonial.initials}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#e4e4e7' }}>{testimonial.name}</div>
                      <div style={{ fontSize: 11, color: '#52525b' }}>{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── APPSUMO ──────────────────────────────────────────────────────── */}
        <section style={{ padding: '0 24px 80px' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto' }}>
            <div style={{
              borderRadius: 20, padding: '40px 48px',
              background: 'linear-gradient(135deg, rgba(251,146,60,0.06) 0%, rgba(239,68,68,0.04) 100%)',
              border: '1px solid rgba(251,146,60,0.18)',
              display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap',
            }}>
              <div style={{ fontSize: 48 }}>🔥</div>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'inline-block', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', color: '#fb923c', background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.2)', padding: '3px 10px', borderRadius: 6, marginBottom: 12 }}>APPSUMO DEAL</div>
                <h3 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Get lifetime access for $69</h3>
                <p style={{ fontSize: 14, color: '#a1a1aa' }}>One payment. No monthly fees. All Pro features forever. Limited to the first 500 customers.</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, color: '#52525b', textDecoration: 'line-through', marginBottom: 4 }}>€29/mo normally</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#fb923c', marginBottom: 16 }}>$69 <span style={{ fontSize: 14, fontWeight: 400, color: '#71717a' }}>once</span></div>
                <a href="https://appsumo.com" target="_blank" rel="noopener noreferrer" style={{
                  display: 'inline-block', padding: '12px 24px', borderRadius: 12, textDecoration: 'none',
                  background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.3)',
                  fontSize: 14, fontWeight: 600, color: '#fb923c', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(251,146,60,0.2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(251,146,60,0.12)')}>
                  Claim on AppSumo →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRICING ──────────────────────────────────────────────────────── */}
        <section id="pricing" style={{ padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#10b981', marginBottom: 12, textTransform: 'uppercase' }}>{t.pricingLabel}</p>
              <h2 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', marginBottom: 12 }}>{t.pricingH2}</h2>
              <p style={{ fontSize: 15, color: '#52525b' }}>{t.pricingP}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, alignItems: 'stretch' }}>
              {[
                { ...t.planFree, price: '€0', per: lang === 'en' ? 'forever' : 'für immer', accent: '#71717a', href: '/signup' },
                { ...t.planPro, price: '€29', per: '/month', accent: '#10b981', popular: true, href: '/signup?plan=pro' },
                { ...t.planAgency, price: '€79', per: '/month', accent: '#a78bfa', href: '/signup?plan=agency' },
              ].map(plan => (
                <div key={plan.name} style={{
                  borderRadius: 16, padding: 28,
                  background: (plan as any).popular ? 'linear-gradient(to bottom, rgba(16,185,129,0.06), rgba(16,185,129,0.02))' : '#0c0c0f',
                  border: `1px solid ${(plan as any).popular ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: (plan as any).popular ? '0 0 60px rgba(16,185,129,0.08)' : 'none',
                  display: 'flex', flexDirection: 'column',
                  position: 'relative', overflow: 'hidden',
                } as React.CSSProperties}>
                  {(plan as any).popular && (
                    <div style={{ position: 'absolute', top: 20, right: 20, fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', background: '#10b981', color: '#000', padding: '4px 10px', borderRadius: 99 }}>
                      MOST POPULAR
                    </div>
                  )}
                  <p style={{ fontSize: 12, fontWeight: 600, color: plan.accent, marginBottom: 4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{plan.name}</p>
                  <p style={{ fontSize: 12, color: '#3f3f46', marginBottom: 20 }}>{plan.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 28 }}>
                    <span style={{ fontSize: 44, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>{plan.price}</span>
                    <span style={{ fontSize: 13, color: '#3f3f46' }}>{plan.per}</span>
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 16, height: 16, borderRadius: 5, background: `rgba(${plan.accent === '#10b981' ? '16,185,129' : plan.accent === '#a78bfa' ? '167,139,250' : '113,113,122'},0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: 9, color: plan.accent }}>✓</span>
                        </div>
                        <span style={{ fontSize: 13, color: '#71717a' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link href={plan.href} style={{
                    display: 'block', textAlign: 'center', padding: '12px', borderRadius: 10, textDecoration: 'none',
                    fontSize: 14, fontWeight: 600, transition: 'all 0.2s',
                    background: (plan as any).popular ? '#10b981' : 'rgba(255,255,255,0.05)',
                    color: (plan as any).popular ? '#000' : '#a1a1aa',
                    border: (plan as any).popular ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  } as React.CSSProperties}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.opacity = '0.85'; el.style.transform = 'translateY(-1px)' }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.opacity = '1'; el.style.transform = 'none' }}>
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
        <section style={{ padding: '120px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 50% 80%, rgba(16,185,129,0.1) 0%, transparent 60%)',
          }} />
          <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
            <h2 style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, color: '#fff', marginBottom: 16 }}>
              {t.finalH2line1}<br />
              <span style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {t.finalH2line2}
              </span>
            </h2>
            <p style={{ fontSize: 16, color: '#71717a', marginBottom: 40, lineHeight: 1.7 }}>
              {t.finalP}
            </p>
            <Link href="/signup" style={{
              display: 'inline-block', fontSize: 16, fontWeight: 700, padding: '16px 36px', borderRadius: 14,
              background: '#10b981', color: '#000', textDecoration: 'none',
              boxShadow: '0 0 0 1px rgba(16,185,129,0.4), 0 8px 48px rgba(16,185,129,0.3)',
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px) scale(1.02)'; el.style.boxShadow = '0 0 0 1px rgba(16,185,129,0.5), 0 16px 64px rgba(16,185,129,0.4)' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'none'; el.style.boxShadow = '0 0 0 1px rgba(16,185,129,0.4), 0 8px 48px rgba(16,185,129,0.3)' }}>
              {t.finalCta}
            </Link>
            <p style={{ fontSize: 12, color: '#27272a', marginTop: 16 }}>{t.finalSub}</p>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────────────── */}
        <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px 24px' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" stroke="#10b981" strokeWidth="1.5" />
                <circle cx="10" cy="10" r="4" fill="#10b981" />
              </svg>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Rival</span>
              <span style={{ fontSize: 12, color: '#27272a' }}>© 2026</span>
            </div>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {[
                [t.footerPrivacy, '/privacy'],
                [t.footerTerms, '/terms'],
                [t.footerImprint, '/impressum'],
                [t.footerContact, 'mailto:hello@getrival.eu'],
              ].map(([l, h]) => (
                <a key={l} href={h} style={{ fontSize: 12, color: '#27272a', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#71717a')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#27272a')}>
                  {l}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(16,185,129,0.5); }
          50% { opacity: 0.7; box-shadow: 0 0 0 4px rgba(16,185,129,0); }
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  )
}
