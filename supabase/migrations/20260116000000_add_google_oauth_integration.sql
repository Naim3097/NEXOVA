-- Migration: Add Google OAuth Integration for per-user Google Sheets access
-- This allows each user to connect their own Google account for Sheets integration

-- Create table to store user Google OAuth tokens
CREATE TABLE IF NOT EXISTS user_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  integration_type TEXT NOT NULL CHECK (integration_type IN ('google_sheets', 'google_drive', 'zapier', 'mailchimp')),

  -- OAuth tokens (encrypted at application layer)
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,

  -- Additional metadata
  scope TEXT, -- OAuth scopes granted
  metadata JSONB DEFAULT '{}', -- Store email, name, etc.

  -- Status
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure one integration type per user
  UNIQUE(user_id, integration_type)
);

-- Create index for faster lookups
CREATE INDEX idx_user_integrations_user_id ON user_integrations(user_id);
CREATE INDEX idx_user_integrations_type ON user_integrations(user_id, integration_type);
CREATE INDEX idx_user_integrations_active ON user_integrations(user_id, integration_type, is_active);

-- Add RLS policies
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;

-- Users can only read their own integrations
CREATE POLICY "Users can view their own integrations"
  ON user_integrations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own integrations
CREATE POLICY "Users can create their own integrations"
  ON user_integrations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own integrations
CREATE POLICY "Users can update their own integrations"
  ON user_integrations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own integrations
CREATE POLICY "Users can delete their own integrations"
  ON user_integrations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_integrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_user_integrations_updated_at
  BEFORE UPDATE ON user_integrations
  FOR EACH ROW
  EXECUTE FUNCTION update_user_integrations_updated_at();

-- Add comment
COMMENT ON TABLE user_integrations IS 'Stores OAuth tokens and integration settings for external services like Google Sheets';
