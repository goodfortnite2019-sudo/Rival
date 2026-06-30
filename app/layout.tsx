import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Rival — Competitor Intelligence, Automated',
  description: 'Know exactly what your competitors do every week. Rival monitors them automatically and delivers a ready-to-read intelligence briefing every Monday morning.',
  keywords: 'competitor monitoring, competitive intelligence, competitor tracking, market intelligence',
  openGraph: {
    title: 'Rival — Competitor Intelligence, Automated',
    description: 'Know every move your competitors make — without lifting a finger.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-[#09090b] text-zinc-100 antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
