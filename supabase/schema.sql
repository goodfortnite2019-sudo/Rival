-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workspaces (one per user for now, extendable to teams)
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'My Workspace',
  plan TEXT NOT NULL DEFAULT 'free', -- free, pro, agency
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  competitor_limit INTEGER NOT NULL DEFAULT 2,
  report_frequency TEXT NOT NULL DEFAULT 'monthly', -- monthly, weekly, daily
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Competitors to monitor
CREATE TABLE competitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pages we monitor per competitor
CREATE TABLE monitored_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE,
  page_type TEXT NOT NULL, -- homepage, pricing, features, blog, jobs, changelog
  url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_scanned_at TIMESTAMPTZ,
  last_content_hash TEXT
);

-- Snapshots of each page on each scan
CREATE TABLE snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  monitored_page_id UUID REFERENCES monitored_pages(id) ON DELETE CASCADE,
  content TEXT,
  content_hash TEXT,
  word_count INTEGER,
  scanned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Changes detected between scans
CREATE TABLE changes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE,
  monitored_page_id UUID REFERENCES monitored_pages(id) ON DELETE CASCADE,
  change_type TEXT NOT NULL, -- text_change, new_content, pricing_change, structural_change
  significance TEXT NOT NULL DEFAULT 'medium', -- low, medium, high
  summary TEXT,
  old_snippet TEXT,
  new_snippet TEXT,
  detected_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weekly / Monthly intelligence reports
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  html_content TEXT,
  plain_text TEXT,
  changes_count INTEGER DEFAULT 0,
  email_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitored_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Workspaces: owner only
CREATE POLICY "Users can manage their workspace"
  ON workspaces FOR ALL
  USING (owner_id = auth.uid());

-- Competitors: via workspace ownership
CREATE POLICY "Users can manage their competitors"
  ON competitors FOR ALL
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

-- Monitored pages
CREATE POLICY "Users can view their monitored pages"
  ON monitored_pages FOR ALL
  USING (competitor_id IN (
    SELECT c.id FROM competitors c
    JOIN workspaces w ON c.workspace_id = w.id
    WHERE w.owner_id = auth.uid()
  ));

-- Snapshots (read only for users)
CREATE POLICY "Users can view their snapshots"
  ON snapshots FOR SELECT
  USING (monitored_page_id IN (
    SELECT mp.id FROM monitored_pages mp
    JOIN competitors c ON mp.competitor_id = c.id
    JOIN workspaces w ON c.workspace_id = w.id
    WHERE w.owner_id = auth.uid()
  ));

-- Changes
CREATE POLICY "Users can view their changes"
  ON changes FOR SELECT
  USING (competitor_id IN (
    SELECT c.id FROM competitors c
    JOIN workspaces w ON c.workspace_id = w.id
    WHERE w.owner_id = auth.uid()
  ));

-- Reports
CREATE POLICY "Users can view their reports"
  ON reports FOR SELECT
  USING (workspace_id IN (
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  ));

-- Function to auto-create workspace on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO workspaces (owner_id, name)
  VALUES (NEW.id, 'My Workspace');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
