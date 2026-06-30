-- ============================================================
-- Rival Schema v2 — neue Features
-- Führe dieses Script in Supabase SQL Editor aus
-- ============================================================

-- 1. Neue Felder in workspaces
ALTER TABLE workspaces ADD COLUMN IF NOT EXISTS slack_webhook_url TEXT;
ALTER TABLE workspaces ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE workspaces ADD COLUMN IF NOT EXISTS referred_by TEXT;
ALTER TABLE workspaces ADD COLUMN IF NOT EXISTS ltd_codes_redeemed INTEGER DEFAULT 0;

-- 2. LTD Codes Tabelle (AppSumo Stacking)
CREATE TABLE IF NOT EXISTS ltd_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  competitor_bonus INTEGER NOT NULL DEFAULT 3,
  plan TEXT NOT NULL DEFAULT 'pro',
  redeemed_by UUID REFERENCES workspaces(id),
  redeemed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Health Score in competitors
ALTER TABLE competitors ADD COLUMN IF NOT EXISTS health_score INTEGER DEFAULT NULL;
ALTER TABLE competitors ADD COLUMN IF NOT EXISTS health_label TEXT DEFAULT NULL;
ALTER TABLE competitors ADD COLUMN IF NOT EXISTS last_health_update TIMESTAMPTZ DEFAULT NULL;

-- 4. Instant Alerts Log
CREATE TABLE IF NOT EXISTS instant_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  competitor_id UUID REFERENCES competitors(id) ON DELETE CASCADE,
  change_type TEXT NOT NULL,
  summary TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Beispiel LTD-Codes (für dich als Admin)
-- Diese kannst du AppSumo-Käufern schicken
-- Jeder Code gibt +3 Competitor Slots und Pro-Plan
INSERT INTO ltd_codes (code, competitor_bonus, plan) VALUES
  ('RIVAL-SUMO-001', 3, 'pro'),
  ('RIVAL-SUMO-002', 3, 'pro'),
  ('RIVAL-SUMO-003', 3, 'pro'),
  ('RIVAL-SUMO-004', 3, 'pro'),
  ('RIVAL-SUMO-005', 3, 'pro'),
  ('RIVAL-SUMO-006', 6, 'agency'),
  ('RIVAL-SUMO-007', 6, 'agency'),
  ('RIVAL-SUMO-008', 6, 'agency')
ON CONFLICT (code) DO NOTHING;

-- 6. RLS für neue Tabellen
ALTER TABLE ltd_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE instant_alerts ENABLE ROW LEVEL SECURITY;

-- Users können nur ihre eigenen Alerts sehen
CREATE POLICY "Users see own instant alerts" ON instant_alerts
  FOR SELECT USING (
    workspace_id IN (SELECT id FROM workspaces WHERE owner_id = auth.uid())
  );

-- LTD codes: jeder kann lesen (für Validierung), nur Admins können insertten
CREATE POLICY "Anyone can read unloaded ltd codes" ON ltd_codes
  FOR SELECT USING (true);
