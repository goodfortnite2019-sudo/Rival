import Link from 'next/link'

export const metadata = { title: 'Impressum — Rival' }

export default function ImpressumPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#e4e4e7' }}>
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="#10b981" strokeWidth="1.5"/><circle cx="10" cy="10" r="4" fill="#10b981"/></svg>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Rival</span>
        </Link>
      </nav>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '60px 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Impressum</h1>
        <p style={{ fontSize: 13, color: '#52525b', marginBottom: 40 }}>Angaben gemäß § 5 TMG</p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Anbieter</h2>
          <p style={{ fontSize: 15, color: '#e4e4e7', lineHeight: 1.8 }}>
            Simvera<br />
            Joe Simon<br />
            Kurstraße 36<br />
            10178 Berlin<br />
            Deutschland
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Kontakt</h2>
          <p style={{ fontSize: 15, color: '#e4e4e7', lineHeight: 1.8 }}>
            E-Mail: <a href="mailto:joe.simon.contact@gmail.com" style={{ color: '#10b981' }}>joe.simon.contact@gmail.com</a>
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Verantwortlich für den Inhalt</h2>
          <p style={{ fontSize: 15, color: '#e4e4e7', lineHeight: 1.8 }}>
            Joe Simon<br />
            Kurstraße 36<br />
            10178 Berlin
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Haftungsausschluss</h2>
          <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.8 }}>
            Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
          </p>
        </section>

        <div style={{ paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 24 }}>
          <Link href="/datenschutz" style={{ fontSize: 13, color: '#52525b', textDecoration: 'none' }}>Datenschutz</Link>
          <Link href="/terms" style={{ fontSize: 13, color: '#52525b', textDecoration: 'none' }}>Terms</Link>
          <Link href="/" style={{ fontSize: 13, color: '#52525b', textDecoration: 'none' }}>← Zurück</Link>
        </div>
      </div>
    </div>
  )
}
