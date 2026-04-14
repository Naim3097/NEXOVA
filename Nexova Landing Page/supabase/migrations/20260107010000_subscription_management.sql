-- =====================================================
-- Subscription Management System
-- =====================================================

-- Add subscription tracking columns to profiles (if not exists)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'past_due', 'trialing')),
ADD COLUMN IF NOT EXISTS subscription_start_date timestamptz,
ADD COLUMN IF NOT EXISTS subscription_end_date timestamptz,
ADD COLUMN IF NOT EXISTS subscription_renewal_date timestamptz,
ADD COLUMN IF NOT EXISTS subscription_cancelled_at timestamptz;

-- Subscriptions table for tracking subscription records
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan text NOT NULL CHECK (plan IN ('free', 'pro')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing', 'incomplete')),

  -- Payment details
  amount numeric(10, 2) NOT NULL,
  currency text NOT NULL DEFAULT 'MYR',
  billing_interval text NOT NULL DEFAULT 'monthly' CHECK (billing_interval IN ('monthly', 'yearly')),

  -- LeanX integration
  leanx_subscription_id text UNIQUE,
  leanx_customer_id text,

  -- Dates
  current_period_start timestamptz NOT NULL DEFAULT NOW(),
  current_period_end timestamptz NOT NULL,
  trial_start timestamptz,
  trial_end timestamptz,
  cancelled_at timestamptz,
  ended_at timestamptz,

  -- Metadata
  metadata jsonb DEFAULT '{}',

  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

-- Billing history table for invoices
CREATE TABLE IF NOT EXISTS billing_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL,

  -- Invoice details
  invoice_number text UNIQUE NOT NULL,
  description text NOT NULL,
  amount numeric(10, 2) NOT NULL,
  currency text NOT NULL DEFAULT 'MYR',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),

  -- Payment details
  payment_method text,
  leanx_transaction_id text,

  -- Dates
  invoice_date timestamptz NOT NULL DEFAULT NOW(),
  due_date timestamptz,
  paid_at timestamptz,

  -- Metadata
  metadata jsonb DEFAULT '{}',

  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_leanx_id ON subscriptions(leanx_subscription_id);
CREATE INDEX IF NOT EXISTS idx_billing_history_user_id ON billing_history(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_history_subscription_id ON billing_history(subscription_id);
CREATE INDEX IF NOT EXISTS idx_billing_history_status ON billing_history(status);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for billing_history
CREATE POLICY "Users can view own billing history"
  ON billing_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own billing history"
  ON billing_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to get active subscription for user
CREATE OR REPLACE FUNCTION get_active_subscription(p_user_id uuid)
RETURNS TABLE (
  subscription_id uuid,
  plan text,
  status text,
  amount numeric,
  currency text,
  billing_interval text,
  current_period_end timestamptz,
  is_trial boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.id,
    s.plan,
    s.status,
    s.amount,
    s.currency,
    s.billing_interval,
    s.current_period_end,
    (s.trial_end IS NOT NULL AND s.trial_end > NOW()) AS is_trial
  FROM subscriptions s
  WHERE s.user_id = p_user_id
    AND s.status IN ('active', 'trialing', 'past_due')
  ORDER BY s.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check project limit for user
CREATE OR REPLACE FUNCTION check_project_limit(p_user_id uuid)
RETURNS TABLE (
  can_create_project boolean,
  current_count integer,
  max_allowed integer,
  plan text
) AS $$
DECLARE
  v_plan text;
  v_count integer;
  v_limit integer;
BEGIN
  -- Get user's subscription plan
  SELECT subscription_plan INTO v_plan
  FROM profiles
  WHERE id = p_user_id;

  -- Count current projects
  SELECT COUNT(*) INTO v_count
  FROM projects
  WHERE user_id = p_user_id;

  -- Determine limit based on plan
  IF v_plan = 'pro' THEN
    v_limit := 999999; -- Unlimited (practical limit)
  ELSE
    v_limit := 3; -- Free plan limit
  END IF;

  RETURN QUERY
  SELECT
    (v_count < v_limit) AS can_create_project,
    v_count AS current_count,
    v_limit AS max_allowed,
    v_plan AS plan;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS text AS $$
DECLARE
  v_year text;
  v_month text;
  v_sequence integer;
  v_invoice_number text;
BEGIN
  v_year := TO_CHAR(NOW(), 'YYYY');
  v_month := TO_CHAR(NOW(), 'MM');

  -- Get next sequence number for this month
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 10 FOR 4) AS integer)), 0) + 1
  INTO v_sequence
  FROM billing_history
  WHERE invoice_number LIKE 'INV-' || v_year || v_month || '%';

  v_invoice_number := 'INV-' || v_year || v_month || '-' || LPAD(v_sequence::text, 4, '0');

  RETURN v_invoice_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate subscription revenue
CREATE OR REPLACE FUNCTION get_subscription_revenue(
  p_user_id uuid DEFAULT NULL,
  p_days integer DEFAULT 30
)
RETURNS TABLE (
  total_revenue numeric,
  paid_invoices integer,
  pending_invoices integer,
  failed_invoices integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(SUM(CASE WHEN bh.status = 'paid' THEN bh.amount ELSE 0 END), 0) AS total_revenue,
    COUNT(CASE WHEN bh.status = 'paid' THEN 1 END)::integer AS paid_invoices,
    COUNT(CASE WHEN bh.status = 'pending' THEN 1 END)::integer AS pending_invoices,
    COUNT(CASE WHEN bh.status = 'failed' THEN 1 END)::integer AS failed_invoices
  FROM billing_history bh
  WHERE (p_user_id IS NULL OR bh.user_id = p_user_id)
    AND bh.created_at >= NOW() - (p_days || ' days')::interval;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update subscription status in profiles
CREATE OR REPLACE FUNCTION sync_subscription_to_profile()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET
    subscription_plan = NEW.plan,
    subscription_status = NEW.status,
    subscription_renewal_date = NEW.current_period_end,
    updated_at = NOW()
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_sync_subscription_to_profile
  AFTER INSERT OR UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION sync_subscription_to_profile();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_billing_history_updated_at
  BEFORE UPDATE ON billing_history
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create initial free subscription for existing users
INSERT INTO subscriptions (user_id, plan, status, amount, currency, current_period_start, current_period_end)
SELECT
  id,
  'free',
  'active',
  0,
  'MYR',
  NOW(),
  NOW() + interval '1 year'
FROM profiles
WHERE NOT EXISTS (
  SELECT 1 FROM subscriptions WHERE subscriptions.user_id = profiles.id
);

COMMENT ON TABLE subscriptions IS 'Tracks user subscription records';
COMMENT ON TABLE billing_history IS 'Stores billing invoices and payment history';
COMMENT ON FUNCTION get_active_subscription IS 'Returns active subscription for a user';
COMMENT ON FUNCTION check_project_limit IS 'Checks if user can create more projects based on plan';
COMMENT ON FUNCTION generate_invoice_number IS 'Generates sequential invoice numbers';
COMMENT ON FUNCTION get_subscription_revenue IS 'Calculates subscription revenue statistics';
