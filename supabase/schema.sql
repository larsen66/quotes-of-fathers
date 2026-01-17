-- Supabase Schema for "Цитаты Отцов" Project
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- Table: fathers (Отцы)
-- =============================================
CREATE TABLE IF NOT EXISTS fathers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Localized name (ka = required, ru = optional)
  name_ka TEXT NOT NULL,
  name_ru TEXT,
  
  -- Localized biography (optional)
  bio_ka TEXT,
  bio_ru TEXT,
  
  -- Image URLs (stored in Supabase Storage)
  avatar_url TEXT NOT NULL,
  profile_image_url TEXT,
  
  -- Display order
  "order" INTEGER,
  
  -- Soft delete flag
  deleted BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for sync queries
CREATE INDEX IF NOT EXISTS idx_fathers_updated_at ON fathers(updated_at);
CREATE INDEX IF NOT EXISTS idx_fathers_deleted ON fathers(deleted);

-- =============================================
-- Table: quotes (Цитаты)
-- =============================================
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign key to father
  father_id UUID NOT NULL REFERENCES fathers(id) ON DELETE CASCADE,
  
  -- Localized text (ka = required, ru = optional)
  text_ka TEXT NOT NULL,
  text_ru TEXT,
  
  -- Localized source (optional)
  source_ka TEXT,
  source_ru TEXT,
  
  -- Quote date (optional, format: YYYY-MM-DD)
  quote_date DATE,
  
  -- Tags (array of strings)
  tags TEXT[] DEFAULT '{}',
  
  -- Publication status
  is_published BOOLEAN DEFAULT TRUE,
  
  -- Soft delete flag
  deleted BOOLEAN DEFAULT FALSE,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for sync and filtering
CREATE INDEX IF NOT EXISTS idx_quotes_updated_at ON quotes(updated_at);
CREATE INDEX IF NOT EXISTS idx_quotes_father_id ON quotes(father_id);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_is_published ON quotes(is_published);
CREATE INDEX IF NOT EXISTS idx_quotes_deleted ON quotes(deleted);

-- =============================================
-- Table: feedback (Обратная связь)
-- =============================================
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Message content
  message TEXT NOT NULL,
  contact TEXT,
  
  -- User's language
  language TEXT NOT NULL CHECK (language IN ('ka', 'ru')),
  
  -- App metadata
  platform TEXT CHECK (platform IN ('ios', 'android')),
  app_version TEXT,
  
  -- Read status for admin
  is_read BOOLEAN DEFAULT FALSE,
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for admin queries
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_is_read ON feedback(is_read);

-- =============================================
-- Table: app_settings (Глобальные настройки)
-- =============================================
CREATE TABLE IF NOT EXISTS app_settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Singleton row
  
  -- Subscriber count for "About Us" screen
  subscriber_count INTEGER DEFAULT 0,
  
  -- Timestamp
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings row
INSERT INTO app_settings (id, subscriber_count) 
VALUES (1, 0) 
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- Function: Auto-update updated_at timestamp
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for auto-updating updated_at
CREATE TRIGGER update_fathers_updated_at
  BEFORE UPDATE ON fathers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON app_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS
ALTER TABLE fathers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for fathers (mobile app needs to read without auth)
CREATE POLICY "Public read access for fathers"
  ON fathers FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin write access for fathers
CREATE POLICY "Admin write access for fathers"
  ON fathers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Public read access for quotes (mobile app needs to read without auth)
CREATE POLICY "Public read access for quotes"
  ON quotes FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin write access for quotes
CREATE POLICY "Admin write access for quotes"
  ON quotes FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Anyone can insert feedback (mobile app sends without auth)
CREATE POLICY "Public insert access for feedback"
  ON feedback FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users can read feedback
CREATE POLICY "Admin read access for feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (true);

-- Admin update/delete for feedback
CREATE POLICY "Admin write access for feedback"
  ON feedback FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admin delete access for feedback"
  ON feedback FOR DELETE
  TO authenticated
  USING (true);

-- Public read access for app_settings
CREATE POLICY "Public read access for app_settings"
  ON app_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin write access for app_settings
CREATE POLICY "Admin write access for app_settings"
  ON app_settings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =============================================
-- Storage Buckets Setup (run separately in Dashboard or via API)
-- =============================================
-- Create bucket 'fathers' for father images:
-- - avatars
-- - profile images
--
-- Storage policies:
-- - Public read access (for mobile app)
-- - Authenticated write access (for admin panel)
