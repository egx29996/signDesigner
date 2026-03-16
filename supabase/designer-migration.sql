-- EGX Sign Designer — Database Schema
-- Run this migration against your Supabase project.

-- Families table (reference data)
CREATE TABLE IF NOT EXISTS families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tier TEXT CHECK (tier IN ('good','better','best','premium')),
  description TEXT,
  default_tokens JSONB,
  curated_palette JSONB,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Sign packages (user designs)
CREATE TABLE IF NOT EXISTS sign_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  family_id TEXT NOT NULL,
  name TEXT DEFAULT 'Untitled Package',
  design_tokens JSONB NOT NULL,
  token_color_sources JSONB DEFAULT '{}',
  sign_types JSONB NOT NULL,
  metadata JSONB DEFAULT '{}',
  share_token TEXT UNIQUE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','submitted','quoted')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS policies
ALTER TABLE sign_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own packages" ON sign_packages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own packages" ON sign_packages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own packages" ON sign_packages
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own packages" ON sign_packages
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can read shared packages" ON sign_packages
  FOR SELECT USING (share_token IS NOT NULL);

-- Index for share token lookups
CREATE INDEX idx_sign_packages_share_token ON sign_packages(share_token) WHERE share_token IS NOT NULL;

-- Index for user lookups
CREATE INDEX idx_sign_packages_user_id ON sign_packages(user_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sign_packages_modtime
  BEFORE UPDATE ON sign_packages
  FOR EACH ROW EXECUTE FUNCTION update_modified_column();
