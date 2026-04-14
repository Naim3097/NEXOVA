-- Add leanx_environment field to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS leanx_environment TEXT DEFAULT 'live' CHECK (leanx_environment IN ('test', 'live'));
