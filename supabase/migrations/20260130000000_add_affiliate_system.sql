-- Add affiliate_code to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS affiliate_code TEXT UNIQUE;

-- Create index for fast lookup by affiliate code
CREATE INDEX IF NOT EXISTS idx_profiles_affiliate_code ON profiles(affiliate_code) WHERE affiliate_code IS NOT NULL;

-- Create affiliate_referrals table to track signups from affiliate links
CREATE TABLE IF NOT EXISTS affiliate_referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  affiliate_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'signed_up' CHECK (status IN ('signed_up', 'active', 'churned')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(referred_id) -- A user can only be referred once
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_referrer ON affiliate_referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_referred ON affiliate_referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_referrals_code ON affiliate_referrals(affiliate_code);

-- Enable RLS
ALTER TABLE affiliate_referrals ENABLE ROW LEVEL SECURITY;

-- Users can read their own referrals (as referrer)
CREATE POLICY "Users can view own referrals" ON affiliate_referrals
  FOR SELECT USING (auth.uid() = referrer_id);

-- Service role can insert referrals (done server-side during signup)
CREATE POLICY "Allow insert referrals" ON affiliate_referrals
  FOR INSERT WITH CHECK (true);

-- Trigger to update updated_at
CREATE TRIGGER update_affiliate_referrals_updated_at
  BEFORE UPDATE ON affiliate_referrals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
