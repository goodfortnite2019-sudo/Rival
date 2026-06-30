export interface Workspace {
  id: string
  owner_id: string
  name: string
  plan: 'free' | 'pro' | 'agency'
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  competitor_limit: number
  report_frequency: 'monthly' | 'weekly' | 'daily'
  created_at: string
}

export interface Competitor {
  id: string
  workspace_id: string
  name: string
  url: string
  is_active: boolean
  created_at: string
  monitored_pages?: MonitoredPage[]
  recent_changes?: Change[]
}

export interface MonitoredPage {
  id: string
  competitor_id: string
  page_type: 'homepage' | 'pricing' | 'features' | 'blog' | 'jobs' | 'changelog'
  url: string
  is_active: boolean
  last_scanned_at: string | null
  last_content_hash: string | null
}

export interface Snapshot {
  id: string
  monitored_page_id: string
  content: string | null
  content_hash: string | null
  word_count: number | null
  scanned_at: string
}

export interface Change {
  id: string
  competitor_id: string
  monitored_page_id: string
  change_type: 'text_change' | 'new_content' | 'pricing_change' | 'structural_change'
  significance: 'low' | 'medium' | 'high'
  summary: string | null
  old_snippet: string | null
  new_snippet: string | null
  detected_at: string
  competitor?: Competitor
  monitored_page?: MonitoredPage
}

export interface Report {
  id: string
  workspace_id: string
  period_start: string
  period_end: string
  html_content: string | null
  plain_text: string | null
  changes_count: number
  email_sent_at: string | null
  created_at: string
}

export type PageType = MonitoredPage['page_type']
