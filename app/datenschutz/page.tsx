import Link from 'next/link'

export const metadata = { title: 'Datenschutzerklärung — Rival' }

export default function DatenschutzPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#e4e4e7' }}>
      <nav style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="#10b981" strokeWidth="1.5"/><circle cx="10" cy="10" r="4" fill="#10b981"/></svg>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>Rival</span>
        </Link>
      </nav>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '60px 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Datenschutzerklärung</h1>
        <p style={{ fontSize: 13, color: '#52525b', marginBottom: 40 }}>Zuletzt aktualisiert: Juni 2026</p>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 12 }}>1. Verantwortlicher</h2>
          <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.8 }}>
            Verantwortlicher im Sinne der DSGVO ist:<br /><br />
            Joe Simon / Simvera<br />
            Kurstraße 36, 10178 Berlin<br />
            E-Mail: <a href="mailto:joe.simon.contact@gmail.com" style={{ color: '#10b981' }}>joe.simon.contact@gmail.com</a>
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 12 }}>2. Erhobene Daten</h2>
          <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.8 }}>
            Wir erheben folgende personenbezogene Daten bei der Nutzung unseres Dienstes:
          </p>
          <ul style={{ fontSize: 14, color: '#71717a', lineHeight: 2, paddingLeft: 20, marginTop: 8 }}>
            <li>E-Mail-Adresse (bei der Registrierung)</li>
            <li>Zahlungsinformationen (verarbeitet durch Stripe)</li>
            <li>Von Ihnen hinzugefügte Competitor-URLs</li>
            <li>Nutzungsdaten und Log-Dateien</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 12 }}>3. Zweck der Verarbeitung</h2>
          <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.8 }}>
            Wir verarbeiten Ihre Daten zur Bereitstellung des Rival-Dienstes (Competitor-Monitoring, Briefings, Alerts), zur Abrechnung über Stripe sowie zur Kommunikation per E-Mail bezüglich Ihres Kontos.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 12 }}>4. Drittanbieter</h2>
          <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.8 }}>
            Wir nutzen folgende Drittanbieter zur Bereitstellung unseres Dienstes:
          </p>
          <ul style={{ fontSize: 14, color: '#71717a', lineHeight: 2, paddingLeft: 20, marginTop: 8 }}>
            <li><strong style={{ color: '#a1a1aa' }}>Supabase</strong> — Datenbankhosting und Authentifizierung (EU-Server)</li>
            <li><strong style={{ color: '#a1a1aa' }}>Vercel</strong> — Hosting und Deployment</li>
            <li><strong style={{ color: '#a1a1aa' }}>Stripe</strong> — Zahlungsabwicklung</li>
            <li><strong style={{ color: '#a1a1aa' }}>Anthropic (Claude)</strong> — KI-Analyse der Competitor-Daten</li>
            <li><strong style={{ color: '#a1a1aa' }}>Resend</strong> — E-Mail-Versand</li>
          </ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 12 }}>5. Ihre Rechte</h2>
          <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.8 }}>
            Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer personenbezogenen Daten. Zur Ausübung dieser Rechte wenden Sie sich an: <a href="mailto:joe.simon.contact@gmail.com" style={{ color: '#10b981' }}>joe.simon.contact@gmail.com</a>
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 12 }}>6. Cookies</h2>
          <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.8 }}>
            Wir verwenden ausschließlich technisch notwendige Cookies zur Aufrechterhaltung Ihrer Sitzung. Es werden keine Tracking- oder Marketing-Cookies eingesetzt.
          </p>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 12 }}>7. Datenlöschung</h2>
          <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.8 }}>
            Ihre Daten werden gelöscht, sobald sie für den jeweiligen Zweck nicht mehr erforderlich sind oder Sie Ihr Konto kündigen. Zahlungsdaten werden gemäß gesetzlicher Aufbewahrungsfristen (10 Jahre) gespeichert.
          </p>
        </section>

        <div style={{ paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 24 }}>
          <Link href="/impressum" style={{ fontSize: 13, color: '#52525b', textDecoration: 'none' }}>Impressum</Link>
          <Link href="/terms" style={{ fontSize: 13, color: '#52525b', textDecoration: 'none' }}>Terms</Link>
          <Link href="/" style={{ fontSize: 13, color: '#52525b', textDecoration: 'none' }}>← Zurück</Link>
        </div>
      </div>
    </div>
  )
}
