import Link from 'next/link'

export const metadata = { title: 'Terms of Service — Rival' }

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#e4e4e7' }}>
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="#10b981" strokeWidth="1.5"/><circle cx="10" cy="10" r="4" fill="#10b981"/></svg>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Rival</span>
        </Link>
      </nav>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '60px 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Terms of Service</h1>
        <p style={{ fontSize: 13, color: '#52525b', marginBottom: 40 }}>Last updated: June 2026</p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 12 }}>1. Service</h2>
          <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.8 }}>
            Rival is a competitor intelligence SaaS operated by Joe Simon / Simvera, Kurstraße 36, 10178 Berlin, Germany. By using Rival you agree to these terms.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 12 }}>2. Acceptable Use</h2>
          <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.8 }}>
            You may use Rival to monitor publicly available competitor information for legitimate business intelligence purposes. You may not use Rival to scrape personal data, violate third-party terms of service, or engage in unlawful activities.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 12 }}>3. Subscriptions & Payments</h2>
          <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.8 }}>
            Subscriptions are billed monthly via Stripe. You may cancel at any time — your access continues until the end of the billing period. No refunds are issued for partial months. AppSumo lifetime deal codes are non-refundable after redemption.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 12 }}>4. Availability</h2>
          <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.8 }}>
            We aim for 99% uptime but do not guarantee uninterrupted service. We are not liable for damages resulting from service outages, inaccurate data, or missed monitoring cycles.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 12 }}>5. Data & Privacy</h2>
          <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.8 }}>
            We process your data as described in our <Link href="/datenschutz" style={{ color: '#10b981' }}>Privacy Policy</Link>. Your competitor data belongs to you and is not shared with third parties.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 12 }}>6. Termination</h2>
          <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.8 }}>
            We reserve the right to terminate accounts that violate these terms. You may delete your account at any time by contacting <a href="mailto:joe.simon.contact@gmail.com" style={{ color: '#10b981' }}>joe.simon.contact@gmail.com</a>.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 12 }}>7. Governing Law</h2>
          <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.8 }}>
            These terms are governed by German law. Place of jurisdiction is Berlin, Germany.
          </p>
        </section>

        <div style={{ paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 24 }}>
          <Link href="/impressum" style={{ fontSize: 13, color: '#52525b', textDecoration: 'none' }}>Impressum</Link>
          <Link href="/datenschutz" style={{ fontSize: 13, color: '#52525b', textDecoration: 'none' }}>Datenschutz</Link>
          <Link href="/" style={{ fontSize: 13, color: '#52525b', textDecoration: 'none' }}>← Back</Link>
        </div>
      </div>
    </div>
  )
}
