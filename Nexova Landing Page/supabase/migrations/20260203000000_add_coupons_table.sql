-- Migration: Add coupons system for subscription discounts
-- Created: 2026-02-03

-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10,2) NOT NULL CHECK (discount_value > 0),
  max_uses INTEGER,                    -- NULL = unlimited
  used_count INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,             -- NULL = no expiry
  min_amount NUMERIC(10,2) DEFAULT 0,
  applicable_plans TEXT[] DEFAULT ARRAY['premium'],
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create coupon_uses table for tracking usage
CREATE TABLE IF NOT EXISTS coupon_uses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  original_amount NUMERIC(10,2) NOT NULL,
  discount_amount NUMERIC(10,2) NOT NULL,
  final_amount NUMERIC(10,2) NOT NULL,
  used_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(coupon_id, user_id)  -- One coupon per user (lifetime)
);

-- Create indexes for coupons
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_is_active ON coupons(is_active);
CREATE INDEX idx_coupons_valid_dates ON coupons(valid_from, valid_until);

-- Create indexes for coupon_uses
CREATE INDEX idx_coupon_uses_coupon_id ON coupon_uses(coupon_id);
CREATE INDEX idx_coupon_uses_user_id ON coupon_uses(user_id);

-- Create trigger for updated_at on coupons
CREATE TRIGGER coupons_updated_at
  BEFORE UPDATE ON coupons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Enable RLS on coupons table
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Coupons policies: Only admins can manage, but anyone authenticated can read active coupons (for validation)
CREATE POLICY "Anyone can read active coupons"
  ON coupons FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role can manage coupons"
  ON coupons FOR ALL
  USING (true)
  WITH CHECK (true);

-- Enable RLS on coupon_uses table
ALTER TABLE coupon_uses ENABLE ROW LEVEL SECURITY;

-- Users can see their own coupon usage
CREATE POLICY "Users can view own coupon usage"
  ON coupon_uses FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can manage all coupon uses
CREATE POLICY "Service role can manage coupon uses"
  ON coupon_uses FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add coupon_id column to subscriptions for tracking
ALTER TABLE subscriptions
ADD COLUMN IF NOT EXISTS coupon_id UUID REFERENCES coupons(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS original_amount NUMERIC(10,2);
