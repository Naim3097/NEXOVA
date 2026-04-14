-- Add custom domain support to profiles table
-- This allows users to use their own domain for their published pages

-- Add custom_domain column to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS custom_domain TEXT UNIQUE;

-- Add custom_domain_verified column to track DNS verification status
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS custom_domain_verified BOOLEAN DEFAULT false;

-- Create index for faster lookups by custom domain
CREATE INDEX IF NOT EXISTS idx_profiles_custom_domain ON profiles(custom_domain);

-- Add comment for documentation
COMMENT ON COLUMN profiles.custom_domain IS 'User''s custom domain (e.g., www.example.com) for their published pages';
COMMENT ON COLUMN profiles.custom_domain_verified IS 'Whether the custom domain DNS has been verified to point to our server';
