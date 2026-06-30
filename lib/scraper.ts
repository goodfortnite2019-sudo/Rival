import * as cheerio from 'cheerio'
import crypto from 'crypto'

export interface ScrapeResult {
  url: string
  content: string
  wordCount: number
  hash: string
  success: boolean
  error?: string
}

const NOISE_SELECTORS = [
  'script', 'style', 'noscript', 'iframe',
  'nav', 'footer', 'header',
  '[class*="cookie"]', '[id*="cookie"]',
  '[class*="banner"]', '[class*="popup"]',
  '[class*="modal"]', '[aria-hidden="true"]',
]

export async function scrapePage(url: string): Promise<ScrapeResult> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RivalBot/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!response.ok) {
      return { url, content: '', wordCount: 0, hash: '', success: false, error: `HTTP ${response.status}` }
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Remove noise
    NOISE_SELECTORS.forEach(sel => $(sel).remove())

    // Extract meaningful text from important sections
    const sections: string[] = []

    // Try to get structured sections
    const important = ['main', 'article', '[role="main"]', '.content', '#content', 'body']
    let extracted = ''

    for (const sel of important) {
      const el = $(sel)
      if (el.length && el.text().trim().length > 100) {
        extracted = el.text()
        break
      }
    }

    if (!extracted) extracted = $('body').text()

    // Clean up whitespace
    const content = extracted
      .replace(/\t/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/ {2,}/g, ' ')
      .trim()
      .slice(0, 15000) // limit to 15k chars per page

    const wordCount = content.split(/\s+/).filter(Boolean).length
    const hash = crypto.createHash('md5').update(content).digest('hex')

    return { url, content, wordCount, hash, success: true }

  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Unknown error'
    return { url, content: '', wordCount: 0, hash: '', success: false, error }
  }
}

export function getCompetitorPages(baseUrl: string): Array<{ type: string; url: string }> {
  const base = baseUrl.replace(/\/$/, '')
  return [
    { type: 'homepage', url: base },
    { type: 'pricing', url: `${base}/pricing` },
    { type: 'features', url: `${base}/features` },
    { type: 'blog', url: `${base}/blog` },
    { type: 'jobs', url: `${base}/jobs` },
    { type: 'changelog', url: `${base}/changelog` },
  ]
}

export function diffContent(oldContent: string, newContent: string): {
  hasChanged: boolean
  addedWords: number
  removedWords: number
  changePercent: number
  addedSnippet: string
  removedSnippet: string
} {
  if (!oldContent && !newContent) return {
    hasChanged: false, addedWords: 0, removedWords: 0,
    changePercent: 0, addedSnippet: '', removedSnippet: ''
  }

  const oldWords = new Set(oldContent.toLowerCase().split(/\s+/).filter(Boolean))
  const newWords = new Set(newContent.toLowerCase().split(/\s+/).filter(Boolean))

  const added = [...newWords].filter(w => !oldWords.has(w))
  const removed = [...oldWords].filter(w => !newWords.has(w))

  const total = Math.max(oldWords.size, newWords.size, 1)
  const changePercent = Math.round(((added.length + removed.length) / total) * 100)

  // Extract representative snippets of changes
  const addedSnippet = extractChangedSnippet(oldContent, newContent)
  const removedSnippet = extractChangedSnippet(newContent, oldContent)

  return {
    hasChanged: changePercent > 1,
    addedWords: added.length,
    removedWords: removed.length,
    changePercent,
    addedSnippet,
    removedSnippet,
  }
}

function extractChangedSnippet(base: string, compare: string): string {
  const baseLines = base.split('\n')
  const compareLines = compare.split('\n')

  const newLines = compareLines.filter(line =>
    line.trim().length > 20 && !baseLines.some(bl => bl.trim() === line.trim())
  )

  return newLines.slice(0, 3).join(' ').slice(0, 300)
}
