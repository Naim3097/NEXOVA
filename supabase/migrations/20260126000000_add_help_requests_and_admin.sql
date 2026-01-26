-- =====================================================
-- Help Requests & Admin System
-- =====================================================

-- Add role column to profiles for admin access
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Update the subscription plan constraint to include 'premium' and 'enterprise'
-- First, drop the existing constraint if it exists
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_plan_check;

-- Add new constraint with updated plan values
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_plan_check
  CHECK (plan IN ('free', 'premium', 'enterprise'));

-- Update existing 'pro' plans to 'premium'
UPDATE subscriptions SET plan = 'premium' WHERE plan = 'pro';

-- Update profiles subscription_plan to match new values
UPDATE profiles SET subscription_plan = 'premium' WHERE subscription_plan = 'pro';

-- Create help_requests table for support system
CREATE TABLE IF NOT EXISTS help_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Request details
  request_type text NOT NULL CHECK (request_type IN ('help', 'enterprise_inquiry')),
  page_source text, -- Which page the request came from
  subject text,
  message text NOT NULL,

  -- User info snapshot (in case profile changes)
  user_name text,
  user_email text,
  user_phone text,
  user_plan text,

  -- Status tracking
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'contacted', 'resolved', 'closed')),
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),

  -- Admin notes
  admin_notes text,
  assigned_to uuid REFERENCES profiles(id),

  -- Timestamps
  contacted_at timestamptz,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT NOW(),
  updated_at timestamptz DEFAULT NOW()
);

-- Create indexes for help_requests
CREATE INDEX IF NOT EXISTS idx_help_requests_user_id ON help_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_help_requests_status ON help_requests(status);
CREATE INDEX IF NOT EXISTS idx_help_requests_type ON help_requests(request_type);
CREATE INDEX IF NOT EXISTS idx_help_requests_created_at ON help_requests(created_at DESC);

-- Enable Row Level Security
ALTER TABLE help_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for help_requests
-- Users can view their own help requests
CREATE POLICY "Users can view own help requests"
  ON help_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own help requests
CREATE POLICY "Users can create own help requests"
  ON help_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all help requests
CREATE POLICY "Admins can view all help requests"
  ON help_requests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can update all help requests
CREATE POLICY "Admins can update all help requests"
  ON help_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Trigger to update updated_at timestamp
CREATE TRIGGER trigger_help_requests_updated_at
  BEFORE UPDATE ON help_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to get admin statistics
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS TABLE (
  total_users bigint,
  free_users bigint,
  premium_users bigint,
  enterprise_users bigint,
  new_help_requests bigint,
  total_help_requests bigint,
  new_signups_today bigint,
  new_signups_week bigint,
  active_subscriptions bigint,
  monthly_revenue numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM profiles)::bigint AS total_users,
    (SELECT COUNT(*) FROM profiles WHERE subscription_plan = 'free' OR subscription_plan IS NULL)::bigint AS free_users,
    (SELECT COUNT(*) FROM profiles WHERE subscription_plan = 'premium')::bigint AS premium_users,
    (SELECT COUNT(*) FROM profiles WHERE subscription_plan = 'enterprise')::bigint AS enterprise_users,
    (SELECT COUNT(*) FROM help_requests WHERE status = 'new')::bigint AS new_help_requests,
    (SELECT COUNT(*) FROM help_requests)::bigint AS total_help_requests,
    (SELECT COUNT(*) FROM profiles WHERE created_at >= CURRENT_DATE)::bigint AS new_signups_today,
    (SELECT COUNT(*) FROM profiles WHERE created_at >= CURRENT_DATE - interval '7 days')::bigint AS new_signups_week,
    (SELECT COUNT(*) FROM subscriptions WHERE status = 'active' AND plan != 'free')::bigint AS active_subscriptions,
    (SELECT COALESCE(SUM(amount), 0) FROM billing_history WHERE status = 'paid' AND created_at >= date_trunc('month', CURRENT_DATE))::numeric AS monthly_revenue;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(p_user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = p_user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update project limit function to use new plan names
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
  IF v_plan IN ('premium', 'enterprise') THEN
    v_limit := 999999; -- Unlimited (practical limit)
  ELSE
    v_limit := 1; -- Free plan limit: 1 project
  END IF;

  RETURN QUERY
  SELECT
    (v_count < v_limit) AS can_create_project,
    v_count AS current_count,
    v_limit AS max_allowed,
    v_plan AS plan;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check product limit for free users
CREATE OR REPLACE FUNCTION check_product_limit(p_user_id uuid)
RETURNS TABLE (
  can_create_product boolean,
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

  -- Count current products
  SELECT COUNT(*) INTO v_count
  FROM products
  WHERE user_id = p_user_id;

  -- Determine limit based on plan
  IF v_plan IN ('premium', 'enterprise') THEN
    v_limit := 999999; -- Unlimited
  ELSE
    v_limit := 5; -- Free plan limit: 5 products
  END IF;

  RETURN QUERY
  SELECT
    (v_count < v_limit) AS can_create_product,
    v_count AS current_count,
    v_limit AS max_allowed,
    v_plan AS plan;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_admin_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION check_product_limit(uuid) TO authenticated;

COMMENT ON TABLE help_requests IS 'Stores user help requests and enterprise inquiries for admin review';
COMMENT ON FUNCTION get_admin_stats IS 'Returns admin dashboard statistics';
COMMENT ON FUNCTION is_admin IS 'Checks if a user has admin role';
COMMENT ON FUNCTION check_product_limit IS 'Checks if user can create more products based on plan';
