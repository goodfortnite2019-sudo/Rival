import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export interface CompetitorChangeData {
  name: string
  url: string
  changes: Array<{
    pageType: string
    changePercent: number
    addedSnippet: string
    removedSnippet: string
    significance: string
  }>
}

export async function generateIntelligenceReport(
  workspaceName: string,
  competitors: CompetitorChangeData[],
  periodStart: string,
  periodEnd: string
): Promise<{ html: string; text: string }> {

  const hasChanges = competitors.some(c => c.changes.length > 0)

  const prompt = `You are a senior competitive intelligence analyst at a top-tier strategy firm. Your briefings are used by founders and CMOs to make high-stakes decisions. Write the most comprehensive, actionable intelligence briefing possible.

BRIEFING PERIOD: ${periodStart} to ${periodEnd}
CLIENT: ${workspaceName}

RAW COMPETITOR DATA:
${competitors.map(c => `
═══════════════════════════════════════
${c.name.toUpperCase()} — ${c.url}
═══════════════════════════════════════
${c.changes.length === 0
    ? '→ NO CHANGES DETECTED THIS WEEK'
    : c.changes.map(ch => `
▸ Page monitored: ${ch.pageType}
▸ Change magnitude: ${ch.changePercent.toFixed(1)}% (${ch.significance} significance)
▸ Content added: "${ch.addedSnippet || 'N/A'}"
▸ Content removed: "${ch.removedSnippet || 'N/A'}"
`).join('\n')
  }
`).join('\n')}

═══════════════════════════════════════
BRIEFING REQUIREMENTS — READ CAREFULLY
═══════════════════════════════════════

Write a premium HTML intelligence report. For EACH competitor with changes, include ALL of the following:

1. **WHAT CHANGED** — Specific, factual description of the change
2. **WHY IT MATTERS** — Strategic interpretation: what does this signal about their direction?
3. **MARKET IMPLICATION** — How does this shift the competitive landscape?
4. **YOUR OPPORTUNITY** — Concrete action the client should take THIS WEEK
5. **RISK IF IGNORED** — What happens if the client doesn't respond?

For PRICING CHANGES: Include estimated revenue impact analysis, positioning implications, customer segment affected
For HIRING SIGNALS: Interpret what roles signal (enterprise push? New product? Geographic expansion?)
For FEATURE LAUNCHES: Assess competitive parity or differentiation impact
For CONTENT CHANGES: Identify messaging pivots and what audience they're targeting

FINAL SECTION — "INTELLIGENCE SUMMARY":
- 3 prioritized actions ranked by urgency (this week / this month / this quarter)
- One overarching strategic insight that ties all competitor moves together
- A competitive positioning recommendation

HTML FORMATTING RULES:
- Use inline styles only (no external CSS)
- Background: #09090b, text: #e4e4e7, accent: #10b981 (emerald), warning: #f59e0b, danger: #ef4444
- Each competitor gets a clearly separated card section
- Use visual hierarchy: big headers, colored tags for change types, clear sections
- Make it dense with information but scannable — busy executives read this
- Priority tags: [HIGH IMPACT] in red, [ACTION REQUIRED] in amber, [SIGNAL] in blue
- Font: system-ui, sans-serif

${!hasChanges ? `
SPECIAL CASE — NO CHANGES DETECTED:
Still write a valuable briefing. Include:
- Confirmation that all competitors were monitored with no significant moves
- Analysis of what "silence" might signal (consolidation? planning a big move?)
- Proactive recommendations for the client regardless
- Market context from general knowledge about these companies
` : ''}

Return ONLY the HTML content starting with <div style="font-family: system-ui, sans-serif; ...">. No markdown, no explanation.`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8192,
    messages: [{ role: 'user', content: prompt }],
  })

  const html = response.content[0].type === 'text' ? response.content[0].text : '<div>Report unavailable</div>'

  // Strip HTML for plain text version
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

  return { html, text }
}

export async function calculateHealthScore(
  competitorName: string,
  recentChanges: Array<{ changeType: string; significance: string; summary: string }>
): Promise<{ score: number; label: string }> {
  if (recentChanges.length === 0) return { score: 20, label: 'QUIET' }

  const highCount = recentChanges.filter(c => c.significance === 'high').length
  const mediumCount = recentChanges.filter(c => c.significance === 'medium').length
  const hasPricing = recentChanges.some(c => c.changeType === 'pricing_change')
  const hasHiring = recentChanges.some(c => c.changeType === 'hiring_signal')

  let score = 10
  score += highCount * 20
  score += mediumCount * 10
  if (hasPricing) score += 15
  if (hasHiring) score += 10
  score = Math.min(score, 99)

  const label = score >= 70 ? 'HIGH THREAT' : score >= 45 ? 'ACTIVE' : score >= 25 ? 'MODERATE' : 'QUIET'
  return { score, label }
}

export function isHighPriorityChange(changeType: string, significance: string): boolean {
  return significance === 'high' || changeType === 'pricing_change'
}

export async function analyzeChangeSummary(
  competitorName: string,
  pageType: string,
  oldContent: string,
  newContent: string
): Promise<{ summary: string; significance: 'low' | 'medium' | 'high'; changeType: string }> {

  const prompt = `You are a senior competitive intelligence analyst. Analyze this competitor website change precisely.

Competitor: ${competitorName}
Page type: ${pageType}

OLD CONTENT:
${oldContent.slice(0, 3000)}

NEW CONTENT:
${newContent.slice(0, 3000)}

CHANGE TYPE GUIDE:
- pricing_change: Any change to prices, plans, tiers, free limits, billing structure
- new_feature: New product capability, integration, or tool announced
- hiring_signal: New job postings, role changes, headcount signals
- messaging_change: Brand positioning, value proposition, headline, or target audience shift
- content_update: Blog post, case study, documentation added or updated
- restructure: Site navigation, information architecture, or major layout change

SIGNIFICANCE GUIDE:
- high: Pricing change, new flagship feature, major messaging pivot, aggressive hiring
- medium: Feature addition, content push, moderate messaging tweak
- low: Minor copy edit, small UI change, blog post, formatting update

Respond with JSON only (no markdown):
{
  "summary": "One precise sentence: WHAT changed and its strategic implication",
  "significance": "low|medium|high",
  "changeType": "pricing_change|new_feature|hiring_signal|messaging_change|content_update|restructure"
}`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
    const parsed = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || '{}')

    return {
      summary: parsed.summary || 'Content updated',
      significance: parsed.significance || 'medium',
      changeType: parsed.changeType || 'content_update',
    }
  } catch {
    return { summary: 'Content changed', significance: 'medium', changeType: 'content_update' }
  }
}
