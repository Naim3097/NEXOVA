-- Migration: Fix Security Issues
-- Description: Fixes function search_path vulnerabilities and improves RLS policies
-- Date: 2026-01-09

-- =====================================================
-- Fix search_path for all functions
-- =====================================================

-- 1. generate_subdomain
CREATE OR REPLACE FUNCTION generate_subdomain(name TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(name, '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE
SET search_path = public, pg_temp;

-- 2. ensure_unique_subdomain
CREATE OR REPLACE FUNCTION ensure_unique_subdomain(base_subdomain TEXT)
RETURNS TEXT AS $$
DECLARE
  test_subdomain TEXT;
  counter INTEGER := 1;
BEGIN
  test_subdomain := base_subdomain;

  -- Check if subdomain exists
  WHILE EXISTS (SELECT 1 FROM profiles WHERE subdomain = test_subdomain) LOOP
    test_subdomain := base_subdomain || '-' || counter;
    counter := counter + 1;
  END LOOP;

  RETURN test_subdomain;
END;
$$ LANGUAGE plpgsql
SET search_path = public, pg_temp;

-- 3. auto_generate_subdomain
CREATE OR REPLACE FUNCTION auto_generate_subdomain()
RETURNS TRIGGER AS $$
BEGIN
  -- Only generate if Pro plan and subdomain not set
  IF NEW.subscription_plan = 'pro' AND NEW.subdomain IS NULL THEN
    NEW.subdomain := ensure_unique_subdomain(
      generate_subdomain(COALESCE(NEW.display_name, 'user-' || substring(NEW.id::text, 1, 8)))
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public, pg_temp;

-- 4. update_transactions_updated_at
CREATE OR REPLACE FUNCTION update_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public, pg_temp;

-- 5. get_transaction_stats
CREATE OR REPLACE FUNCTION get_transaction_stats(p_user_id UUID, p_project_id UUID DEFAULT NULL)
RETURNS TABLE (
  total_transactions BIGINT,
  successful_transactions BIGINT,
  failed_transactions BIGINT,
  cancelled_transactions BIGINT,
  total_revenue DECIMAL(10, 2),
  today_revenue DECIMAL(10, 2),
  today_transactions BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_transactions,
    COUNT(*) FILTER (WHERE status = 'completed')::BIGINT as successful_transactions,
    COUNT(*) FILTER (WHERE status = 'failed')::BIGINT as failed_transactions,
    COUNT(*) FILTER (WHERE status = 'cancelled')::BIGINT as cancelled_transactions,
    COALESCE(SUM(total_amount) FILTER (WHERE status = 'completed'), 0) as total_revenue,
    COALESCE(SUM(total_amount) FILTER (WHERE status = 'completed' AND DATE(created_at) = CURRENT_DATE), 0) as today_revenue,
    COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE)::BIGINT as today_transactions
  FROM transactions
  WHERE user_id = p_user_id
    AND (p_project_id IS NULL OR project_id = p_project_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- 6. get_traffic_by_date
CREATE OR REPLACE FUNCTION get_traffic_by_date(
  p_project_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  date DATE,
  page_views BIGINT,
  unique_visitors BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    DATE(created_at) as date,
    COUNT(*) as page_views,
    COUNT(DISTINCT session_id) as unique_visitors
  FROM analytics_events
  WHERE project_id = p_project_id
    AND event_type = 'page_view'
    AND created_at >= NOW() - (p_days || ' days')::INTERVAL
  GROUP BY DATE(created_at)
  ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- 7. get_conversion_funnel
CREATE OR REPLACE FUNCTION get_conversion_funnel(
  p_project_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  step TEXT,
  sessions BIGINT,
  percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH funnel_data AS (
    SELECT
      COUNT(DISTINCT CASE WHEN event_type = 'page_view' THEN session_id END) as page_views,
      COUNT(DISTINCT CASE WHEN event_type = 'button_click' THEN session_id END) as button_clicks,
      COUNT(DISTINCT CASE WHEN event_type = 'form_view' THEN session_id END) as form_views,
      COUNT(DISTINCT CASE WHEN event_type = 'form_submit' THEN session_id END) as form_submits
    FROM analytics_events
    WHERE project_id = p_project_id
      AND created_at >= NOW() - (p_days || ' days')::INTERVAL
  )
  SELECT 'Page View'::TEXT as step, page_views as sessions, 100.0 as percentage FROM funnel_data
  UNION ALL
  SELECT 'Button Click'::TEXT, button_clicks, ROUND((button_clicks::NUMERIC / page_views * 100), 1) FROM funnel_data WHERE page_views > 0
  UNION ALL
  SELECT 'Form View'::TEXT, form_views, ROUND((form_views::NUMERIC / page_views * 100), 1) FROM funnel_data WHERE page_views > 0
  UNION ALL
  SELECT 'Form Submit'::TEXT, form_submits, ROUND((form_submits::NUMERIC / page_views * 100), 1) FROM funnel_data WHERE page_views > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- 8. get_top_referrers
CREATE OR REPLACE FUNCTION get_top_referrers(
  p_project_id UUID,
  p_days INTEGER DEFAULT 30,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  referrer TEXT,
  visitors BIGINT,
  percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH total AS (
    SELECT COUNT(DISTINCT session_id) as total_visitors
    FROM analytics_events
    WHERE project_id = p_project_id
      AND event_type = 'page_view'
      AND created_at >= NOW() - (p_days || ' days')::INTERVAL
  )
  SELECT
    COALESCE(metadata->>'referrer', 'direct')::TEXT as referrer,
    COUNT(DISTINCT session_id) as visitors,
    ROUND(
      (COUNT(DISTINCT session_id)::NUMERIC / total.total_visitors * 100),
      1
    ) as percentage
  FROM analytics_events, total
  WHERE project_id = p_project_id
    AND event_type = 'page_view'
    AND created_at >= NOW() - (p_days || ' days')::INTERVAL
  GROUP BY metadata->>'referrer', total.total_visitors
  ORDER BY visitors DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- 9. get_device_breakdown
CREATE OR REPLACE FUNCTION get_device_breakdown(
  p_project_id UUID,
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  device TEXT,
  visitors BIGINT,
  percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH total AS (
    SELECT COUNT(DISTINCT session_id) as total_visitors
    FROM analytics_events
    WHERE project_id = p_project_id
      AND event_type = 'page_view'
      AND created_at >= NOW() - (p_days || ' days')::INTERVAL
  )
  SELECT
    COALESCE(device_type, 'unknown')::TEXT as device,
    COUNT(DISTINCT session_id) as visitors,
    ROUND(
      (COUNT(DISTINCT session_id)::NUMERIC / total.total_visitors * 100),
      1
    ) as percentage
  FROM analytics_events, total
  WHERE project_id = p_project_id
    AND event_type = 'page_view'
    AND created_at >= NOW() - (p_days || ' days')::INTERVAL
  GROUP BY device_type, total.total_visitors
  ORDER BY visitors DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- 10. get_active_subscription
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
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- 11. check_project_limit
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
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- 12. generate_invoice_number
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
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- 13. get_subscription_revenue
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
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- 14. sync_subscription_to_profile
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
$$ LANGUAGE plpgsql
SET search_path = public, pg_temp;

-- 15. update_updated_at_column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public, pg_temp;

-- 16. update_updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public, pg_temp;

-- 17. increment_template_usage
CREATE OR REPLACE FUNCTION increment_template_usage(template_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE templates
  SET usage_count = usage_count + 1
  WHERE id = template_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- 18. get_project_with_elements
CREATE OR REPLACE FUNCTION get_project_with_elements(project_id_param UUID)
RETURNS TABLE(
  project JSONB,
  elements JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    to_jsonb(p.*) as project,
    COALESCE(jsonb_agg(to_jsonb(e.*) ORDER BY e.order) FILTER (WHERE e.id IS NOT NULL), '[]'::jsonb) as elements
  FROM projects p
  LEFT JOIN elements e ON e.project_id = p.id
  WHERE p.id = project_id_param
    AND p.user_id = auth.uid()
  GROUP BY p.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- 19. create_project_from_template
CREATE OR REPLACE FUNCTION create_project_from_template(
  template_id_param UUID,
  user_id_param UUID,
  project_name_param TEXT
)
RETURNS UUID AS $$
DECLARE
  new_project_id UUID;
  template_data JSONB;
  element_record RECORD;
BEGIN
  -- Get template data
  SELECT data INTO template_data
  FROM templates
  WHERE id = template_id_param AND is_public = true;

  IF template_data IS NULL THEN
    RAISE EXCEPTION 'Template not found or not public';
  END IF;

  -- Create project
  INSERT INTO projects (user_id, name, status, element_count)
  VALUES (user_id_param, project_name_param, 'draft', 0)
  RETURNING id INTO new_project_id;

  -- Copy elements from template
  INSERT INTO elements (project_id, type, "order", props)
  SELECT
    new_project_id,
    elem->>'type',
    (elem->>'order')::int4,
    elem->'props'
  FROM jsonb_array_elements(template_data->'elements') elem;

  -- Update element count
  UPDATE projects
  SET element_count = (SELECT COUNT(*) FROM elements WHERE project_id = new_project_id)
  WHERE id = new_project_id;

  -- Increment template usage
  PERFORM increment_template_usage(template_id_param);

  -- Create initial version snapshot
  INSERT INTO project_versions (project_id, version_number, snapshot_type, data, created_by, is_auto_save, label)
  SELECT
    new_project_id,
    0,
    'full',
    jsonb_build_object(
      'elements', jsonb_agg(to_jsonb(e.*) ORDER BY e.order),
      'seo_settings', p.seo_settings
    ),
    user_id_param,
    false,
    'Initial version from template'
  FROM projects p
  LEFT JOIN elements e ON e.project_id = p.id
  WHERE p.id = new_project_id
  GROUP BY p.id, p.seo_settings;

  RETURN new_project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- 20. handle_new_user
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url, settings)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url',
    '{}'::jsonb
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- =====================================================
-- Fix RLS Policies for analytics_events and form_submissions
-- =====================================================

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Anyone can insert analytics events" ON analytics_events;
DROP POLICY IF EXISTS "Anyone can insert form submissions" ON form_submissions;

-- Create more secure policies that verify the project exists
-- This allows public pages to submit analytics, but only for valid projects
CREATE POLICY "Allow public analytics for published projects"
  ON analytics_events FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = analytics_events.project_id
        AND projects.status = 'published'
    )
  );

-- Same for form submissions - only allow for published projects
CREATE POLICY "Allow public form submissions for published projects"
  ON form_submissions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = form_submissions.project_id
        AND projects.status = 'published'
    )
  );

-- =====================================================
-- Comments for documentation
-- =====================================================

COMMENT ON FUNCTION generate_subdomain IS 'Generates URL-safe subdomain from display name - SECURED';
COMMENT ON FUNCTION ensure_unique_subdomain IS 'Ensures subdomain uniqueness by appending counter if needed - SECURED';
COMMENT ON FUNCTION auto_generate_subdomain IS 'Trigger function to auto-generate subdomain for Pro users - SECURED';
COMMENT ON FUNCTION update_transactions_updated_at IS 'Updates transaction updated_at timestamp - SECURED';
COMMENT ON FUNCTION get_transaction_stats IS 'Returns transaction statistics for user/project - SECURED';
COMMENT ON FUNCTION get_traffic_by_date IS 'Returns traffic analytics by date - SECURED';
COMMENT ON FUNCTION get_conversion_funnel IS 'Returns conversion funnel data - SECURED';
COMMENT ON FUNCTION get_top_referrers IS 'Returns top referrer sources - SECURED';
COMMENT ON FUNCTION get_device_breakdown IS 'Returns device type breakdown - SECURED';
COMMENT ON FUNCTION get_active_subscription IS 'Returns active subscription for user - SECURED';
COMMENT ON FUNCTION check_project_limit IS 'Checks project creation limits based on plan - SECURED';
COMMENT ON FUNCTION generate_invoice_number IS 'Generates sequential invoice numbers - SECURED';
COMMENT ON FUNCTION get_subscription_revenue IS 'Calculates subscription revenue statistics - SECURED';
COMMENT ON FUNCTION sync_subscription_to_profile IS 'Syncs subscription status to profile - SECURED';
COMMENT ON FUNCTION update_updated_at_column IS 'Generic updated_at updater - SECURED';
COMMENT ON FUNCTION update_updated_at IS 'Generic updated_at updater - SECURED';
COMMENT ON FUNCTION increment_template_usage IS 'Increments template usage counter - SECURED';
COMMENT ON FUNCTION get_project_with_elements IS 'Returns project with all elements in single query - SECURED';
COMMENT ON FUNCTION create_project_from_template IS 'Creates new project from template - SECURED';
COMMENT ON FUNCTION handle_new_user IS 'Creates profile on user signup - SECURED';
