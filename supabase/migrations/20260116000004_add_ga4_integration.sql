-- Add GA4 integration fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS ga4_connected BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS ga4_property_id TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ga4_access_token TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ga4_refresh_token TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ga4_token_expiry TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ga4_connected_at TIMESTAMPTZ DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN profiles.ga4_connected IS 'Whether Google Analytics 4 is connected';
COMMENT ON COLUMN profiles.ga4_property_id IS 'GA4 Property ID (e.g., properties/123456789)';
COMMENT ON COLUMN profiles.ga4_access_token IS 'Encrypted OAuth access token for GA4 API';
COMMENT ON COLUMN profiles.ga4_refresh_token IS 'Encrypted OAuth refresh token for GA4 API';
COMMENT ON COLUMN profiles.ga4_token_expiry IS 'When the access token expires';
COMMENT ON COLUMN profiles.ga4_connected_at IS 'When GA4 was connected';
