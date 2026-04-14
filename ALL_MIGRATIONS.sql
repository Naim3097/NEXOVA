-- FILE: 20260106000001_initial_schema.sql
-- Migration 001: Initial schema for Product Page Builder
-- Description: Creates all tables, indexes, RLS policies, and functions

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE (extends Supabase auth.users)
-- =====================================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'starter', 'pro', 'agency')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'expired')),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PROJECTS TABLE
-- =====================================================
CREATE TABLE projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  element_count INT DEFAULT 0,
  current_version INT DEFAULT 0,
  published_url TEXT,
  published_at TIMESTAMPTZ,
  seo_settings JSONB DEFAULT '{}',
  integrations JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_slug ON projects(slug) WHERE slug IS NOT NULL;

-- =====================================================
-- ELEMENTS TABLE
-- =====================================================
CREATE TABLE elements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  "order" INT NOT NULL,
  props JSONB NOT NULL DEFAULT '{}',
  version INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_elements_project_order ON elements(project_id, "order");
CREATE INDEX idx_elements_type ON elements(type);

-- =====================================================
-- PROJECT VERSIONS TABLE
-- =====================================================
CREATE TABLE project_versions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  version_number INT NOT NULL,
  snapshot_type TEXT DEFAULT 'delta' CHECK (snapshot_type IN ('full', 'delta')),
  data JSONB NOT NULL,
  base_version INT,
  created_by UUID REFERENCES profiles(id),
  is_auto_save BOOLEAN DEFAULT true,
  label TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, version_number)
);

CREATE INDEX idx_versions_project ON project_versions(project_id, version_number DESC);

-- =====================================================
-- TEMPLATES TABLE
-- =====================================================
CREATE TABLE templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  industry TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  preview_url TEXT,
  data JSONB NOT NULL,
  is_public BOOLEAN DEFAULT true,
  usage_count INT DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_templates_category ON templates(category) WHERE is_public = true;
CREATE INDEX idx_templates_tags ON templates USING GIN(tags);
CREATE INDEX idx_templates_slug ON templates(slug);

-- =====================================================
-- FORM SUBMISSIONS TABLE
-- =====================================================
CREATE TABLE form_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  form_id TEXT NOT NULL,
  data JSONB NOT NULL,
  ip_address INET,
  user_agent TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_submissions_project ON form_submissions(project_id, submitted_at DESC);
CREATE INDEX idx_submissions_form ON form_submissions(form_id);

-- =====================================================
-- ANALYTICS EVENTS TABLE
-- =====================================================
CREATE TABLE analytics_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  session_id TEXT NOT NULL,
  device_type TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_project_date ON analytics_events(project_id, created_at DESC);
CREATE INDEX idx_analytics_session ON analytics_events(session_id);
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);

-- =====================================================
-- CUSTOM DOMAINS TABLE
-- =====================================================
CREATE TABLE custom_domains (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  domain TEXT UNIQUE NOT NULL,
  verified BOOLEAN DEFAULT false,
  ssl_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_custom_domains_project ON custom_domains(project_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_domains ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can CRUD own projects"
  ON projects FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Elements policies (inherit from projects)
CREATE POLICY "Users can CRUD elements in own projects"
  ON elements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = elements.project_id
        AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = elements.project_id
        AND projects.user_id = auth.uid()
    )
  );

-- Version history policies
CREATE POLICY "Users can read version history for own projects"
  ON project_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_versions.project_id
        AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create versions for own projects"
  ON project_versions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_versions.project_id
        AND projects.user_id = auth.uid()
    )
  );

-- Templates policies (public read)
CREATE POLICY "Anyone can read public templates"
  ON templates FOR SELECT
  USING (is_public = true);

-- Form submissions policies
CREATE POLICY "Users can read form submissions for own projects"
  ON form_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = form_submissions.project_id
        AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert form submissions"
  ON form_submissions FOR INSERT
  WITH CHECK (true);

-- Analytics policies
CREATE POLICY "Users can read analytics for own projects"
  ON analytics_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = analytics_events.project_id
        AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert analytics events"
  ON analytics_events FOR INSERT
  WITH CHECK (true);

-- Custom domains policies
CREATE POLICY "Users can CRUD custom domains for own projects"
  ON custom_domains FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = custom_domains.project_id
        AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = custom_domains.project_id
        AND projects.user_id = auth.uid()
    )
  );

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to get project with all elements (single query)
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment template usage count
CREATE OR REPLACE FUNCTION increment_template_usage(template_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE templates
  SET usage_count = usage_count + 1
  WHERE id = template_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create project from template
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_elements_updated_at
  BEFORE UPDATE ON elements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- AUTOMATIC PROFILE CREATION
-- =====================================================

-- Function to create profile on user signup
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when new user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- INITIAL DATA - SEED TEMPLATES (Optional)
-- =====================================================
-- This section can be used to seed initial templates
-- Will be populated separately via data import


-- FILE: 20260106100000_published_pages.sql
-- Create published_pages table for storing generated HTML
CREATE TABLE IF NOT EXISTS published_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  html_content TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT unique_project_published UNIQUE (project_id)
);

-- Add index for fast slug lookups
CREATE INDEX idx_published_pages_slug ON published_pages(slug);
CREATE INDEX idx_published_pages_project ON published_pages(project_id);

-- Enable RLS
ALTER TABLE published_pages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read published pages (public access)
CREATE POLICY "Published pages are publicly readable"
  ON published_pages
  FOR SELECT
  USING (true);

-- Only project owners can insert/update/delete
CREATE POLICY "Users can manage their own published pages"
  ON published_pages
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = published_pages.project_id
        AND projects.user_id = auth.uid()
    )
  );

-- Add auto-update trigger
CREATE TRIGGER update_published_pages_updated_at
  BEFORE UPDATE ON published_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON TABLE published_pages IS 'Stores published HTML content for projects';


-- FILE: 20260106110000_add_subdomain_support.sql
-- Add subdomain column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS subdomain TEXT UNIQUE;

-- Add index for fast subdomain lookups
CREATE INDEX IF NOT EXISTS idx_profiles_subdomain ON profiles(subdomain);

-- Add comment
COMMENT ON COLUMN profiles.subdomain IS 'User subdomain for Pro plan (e.g., "johndoe" for johndoe.xide.app)';

-- Update subscription_plan type to only include free and pro
-- Note: This will fail if there are existing records with 'starter' or 'agency'
-- For production, you'd need a data migration first
-- For now, we'll just update the constraint

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_subscription_plan_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_subscription_plan_check
  CHECK (subscription_plan IN ('free', 'pro'));

-- Function to generate subdomain from display_name
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
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to ensure unique subdomain
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
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate subdomain on profile creation (for Pro users)
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
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_generate_subdomain
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_subdomain();

-- Add custom_domain column to projects table (for future use)
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS custom_domain TEXT UNIQUE;

-- Add index for custom domain lookups
CREATE INDEX IF NOT EXISTS idx_projects_custom_domain ON projects(custom_domain);

-- Comment
COMMENT ON COLUMN projects.custom_domain IS 'Custom domain for Pro plan (e.g., "www.acmecorp.com")';


-- FILE: 20260106120000_add_storage_bucket.sql
-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true);

-- Allow authenticated users to upload images
CREATE POLICY "Users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-images');

-- Allow authenticated users to update their own images
CREATE POLICY "Users can update their own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'project-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete their own images
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access to all images
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-images');


-- FILE: 20260106130000_add_leanx_integration.sql
-- Migration: Add LeanX Payment Integration Support
-- Description: Adds LeanX credentials to profiles and creates transactions table
-- Date: 2026-01-06

-- Add LeanX credentials to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS leanx_api_key TEXT,
ADD COLUMN IF NOT EXISTS leanx_secret_key TEXT,
ADD COLUMN IF NOT EXISTS leanx_merchant_id TEXT,
ADD COLUMN IF NOT EXISTS leanx_enabled BOOLEAN DEFAULT false;

-- Create transactions table for payment tracking
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  -- Transaction details
  transaction_id TEXT UNIQUE NOT NULL, -- LeanX transaction ID
  order_id TEXT NOT NULL, -- Our internal order ID

  -- Product information
  product_name TEXT NOT NULL,
  product_description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'MYR',

  -- Bump offer (upsell)
  has_bump_offer BOOLEAN DEFAULT false,
  bump_offer_name TEXT,
  bump_offer_amount DECIMAL(10, 2),
  bump_offer_accepted BOOLEAN DEFAULT false,

  -- Total amount (including bump offer if accepted)
  total_amount DECIMAL(10, 2) NOT NULL,

  -- Customer information
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,

  -- Payment status
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed, cancelled, refunded
  payment_method TEXT,

  -- LeanX specific data
  leanx_payment_url TEXT,
  leanx_response JSONB,

  -- Metadata
  ip_address TEXT,
  user_agent TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Indexes for better query performance
  CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'))
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_project_id ON transactions(project_id);
CREATE INDEX IF NOT EXISTS idx_transactions_transaction_id ON transactions(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transactions_order_id ON transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_customer_email ON transactions(customer_email);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transactions table

-- Users can view their own transactions
CREATE POLICY "Users can view own transactions"
ON transactions FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can insert transactions (via API)
CREATE POLICY "Users can create transactions"
ON transactions FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update their own transactions (status updates via webhook)
CREATE POLICY "Users can update own transactions"
ON transactions FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Users cannot delete transactions (audit trail)
-- No DELETE policy - transactions should never be deleted

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER set_transactions_updated_at
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_transactions_updated_at();

-- Function to calculate transaction statistics
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_transaction_stats TO authenticated;

-- Comments for documentation
COMMENT ON TABLE transactions IS 'Stores payment transactions processed through LeanX gateway';
COMMENT ON COLUMN transactions.transaction_id IS 'LeanX transaction ID from payment gateway';
COMMENT ON COLUMN transactions.order_id IS 'Internal order ID generated by our system';
COMMENT ON COLUMN transactions.has_bump_offer IS 'Whether this transaction included a bump offer/upsell';
COMMENT ON COLUMN transactions.bump_offer_accepted IS 'Whether customer accepted the bump offer';
COMMENT ON COLUMN transactions.leanx_response IS 'Full JSON response from LeanX API for debugging';


-- FILE: 20260107000000_analytics_functions.sql
-- Analytics helper functions

-- Function to get traffic by date (for charts)
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get top referrers
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get device breakdown
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get conversion funnel data
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add index for better performance on metadata queries
CREATE INDEX IF NOT EXISTS idx_analytics_metadata_referrer ON analytics_events
  USING gin ((metadata->'referrer'));

CREATE INDEX IF NOT EXISTS idx_analytics_metadata_utm ON analytics_events
  USING gin ((metadata->'utmSource'));

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_traffic_by_date(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_top_referrers(UUID, INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_device_breakdown(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_conversion_funnel(UUID, INTEGER) TO authenticated;


-- FILE: 20260107010000_subscription_management.sql
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


-- FILE: 20260108000001_add_version_delete_policy.sql
-- Migration: Add DELETE policy for project_versions table
-- This allows users to delete version history for their own projects

-- Add DELETE policy for project_versions
CREATE POLICY "Users can delete versions for own projects"
  ON project_versions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_versions.project_id
        AND projects.user_id = auth.uid()
    )
  );


-- FILE: 20260109000000_fix_security_issues.sql
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


-- FILE: 20260109020000_create_products_table.sql
-- Create products table for inventory management
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL, -- SKU/Product Code
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  base_price DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'RM',
  quantity_pricing JSONB DEFAULT '[]'::jsonb, -- Array of {min_qty: number, price: number}
  notes TEXT, -- Internal notes
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX idx_products_user_id ON products(user_id);

-- Create index on code for searching
CREATE INDEX idx_products_code ON products(code);

-- Create index on status for filtering
CREATE INDEX idx_products_status ON products(status);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_products_updated_at();

-- Row Level Security (RLS) Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Users can view their own products
CREATE POLICY "Users can view own products"
  ON products FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own products
CREATE POLICY "Users can insert own products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own products
CREATE POLICY "Users can update own products"
  ON products FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own products
CREATE POLICY "Users can delete own products"
  ON products FOR DELETE
  USING (auth.uid() = user_id);

-- Add comment for documentation
COMMENT ON TABLE products IS 'Stores product inventory for e-commerce functionality';
COMMENT ON COLUMN products.quantity_pricing IS 'JSON array of bulk pricing: [{"min_qty": 10, "price": 45.00}, {"min_qty": 50, "price": 40.00}]';
COMMENT ON COLUMN products.notes IS 'Internal notes not visible to customers';


-- FILE: 20260109030000_reset_templates_ebook.sql
-- Migration: Reset Templates - Create Ebook Category
-- Date: 2026-01-09
-- Purpose: Remove all existing templates and create new Ebook sales page template

-- Step 1: Delete all existing templates and their elements
DELETE FROM elements WHERE template_id IS NOT NULL;
DELETE FROM templates;

-- Step 2: Insert new Ebook sales page template inspired by IMPACH Academy
INSERT INTO templates (
  id,
  name,
  description,
  category,
  industry,
  preview_image,
  thumbnail_image,
  tags,
  is_free,
  price,
  status
) VALUES (
  gen_random_uuid(),
  'Ebook Sales Page',
  'A high-converting sales page template perfect for ebooks, digital products, and online courses. Features countdown timer, benefit highlights, testimonials, pricing tables, and FAQ section. Designed to maximize conversions.',
  'ebook',
  'Education',
  'https://placehold.co/1200x800/22c55e/ffffff?text=Ebook+Sales+Page',
  'https://placehold.co/400x300/22c55e/ffffff?text=Ebook',
  ARRAY['ebook', 'digital-product', 'course', 'education', 'sales', 'conversion', 'landing-page'],
  true,
  0,
  'published'
);

-- Get the template ID for reference
DO $$
DECLARE
  template_uuid UUID;
BEGIN
  -- Get the newly created template ID
  SELECT id INTO template_uuid FROM templates WHERE name = 'Ebook Sales Page' LIMIT 1;

  -- Element 1: Announcement Bar with Countdown Timer
  INSERT INTO elements (template_id, type, order_index, props) VALUES (
    template_uuid,
    'announcement_bar',
    1,
    jsonb_build_object(
      'message', 'SPECIAL PROMOTION ENDS IN',
      'bgColor', '#ef4444',
      'textColor', '#ffffff',
      'showCountdown', true,
      'countdownLabel', 'Ends in:',
      'countdownEndDate', (NOW() + INTERVAL '30 days')::text,
      'isSticky', true,
      'showCloseButton', false,
      'link', '#pricing',
      'linkText', 'Get Started Now'
    )
  );

  -- Element 2: Navigation Header
  INSERT INTO elements (template_id, type, order_index, props) VALUES (
    template_uuid,
    'navigation',
    2,
    jsonb_build_object(
      'logo', '',
      'logoText', 'YOUR ACADEMY',
      'menuItems', jsonb_build_array(
        jsonb_build_object('label', 'Home', 'url', '#'),
        jsonb_build_object('label', 'Benefits', 'url', '#benefits'),
        jsonb_build_object('label', 'Pricing', 'url', '#pricing'),
        jsonb_build_object('label', 'Testimonials', 'url', '#testimonials'),
        jsonb_build_object('label', 'FAQ', 'url', '#faq')
      ),
      'ctaButton', jsonb_build_object(
        'text', 'Enroll Now',
        'url', '#pricing'
      ),
      'bgColor', '#ffffff',
      'textColor', '#111827',
      'isSticky', true,
      'layout', 'split'
    )
  );

  -- Element 3: Hero Section
  INSERT INTO elements (template_id, type, order_index, props) VALUES (
    template_uuid,
    'hero',
    3,
    jsonb_build_object(
      'variant', 'centered',
      'title', 'Save Up To $2,421 In Your First Year',
      'subtitle', 'Limited Time Offer - Enroll by January 31, 2026',
      'description', 'Transform your learning journey with our comprehensive program. Get exclusive access to premium content, expert guidance, and lifetime support.',
      'primaryButton', jsonb_build_object('text', 'Enroll Now - Save $2,421', 'url', '#pricing'),
      'secondaryButton', jsonb_build_object('text', 'Learn More', 'url', '#benefits'),
      'image', 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1200&h=800&fit=crop',
      'bgColor', '#f0fdfa'
    )
  );

  -- Element 4: Problem/Pain Points Section (using Features Grid)
  INSERT INTO elements (template_id, type, order_index, props) VALUES (
    template_uuid,
    'features',
    4,
    jsonb_build_object(
      'title', 'Are You Struggling With These Challenges?',
      'subtitle', 'You''re not alone. Here are common problems we help solve:',
      'variant', 'grid',
      'features', jsonb_build_array(
        jsonb_build_object('title', 'Lack of structured learning path', 'description', 'Without a clear roadmap, it''s easy to feel lost and overwhelmed', 'icon', 'x-circle'),
        jsonb_build_object('title', 'Limited time to study', 'description', 'Busy schedules make it hard to commit to traditional learning', 'icon', 'x-circle'),
        jsonb_build_object('title', 'Expensive courses with no results', 'description', 'Spent thousands on programs that didn''t deliver promised outcomes', 'icon', 'x-circle'),
        jsonb_build_object('title', 'No personalized support', 'description', 'One-size-fits-all approach doesn''t address your specific needs', 'icon', 'x-circle'),
        jsonb_build_object('title', 'Outdated materials', 'description', 'Learning content that''s not relevant to current industry standards', 'icon', 'x-circle'),
        jsonb_build_object('title', 'No accountability', 'description', 'Easy to procrastinate without proper guidance and check-ins', 'icon', 'x-circle')
      )
    )
  );

  -- Element 5: Solution/Benefits Section (using Features Grid)
  INSERT INTO elements (template_id, type, order_index, props) VALUES (
    template_uuid,
    'features',
    5,
    jsonb_build_object(
      'title', 'Why Choose Our Program?',
      'subtitle', 'Everything you need to succeed in one comprehensive package',
      'variant', 'grid',
      'features', jsonb_build_array(
        jsonb_build_object('title', '10+ Years Experience', 'description', 'Proven track record of helping students achieve their goals', 'icon', 'award'),
        jsonb_build_object('title', 'Free Enrichment Programs', 'description', 'Access exclusive workshops and bonus content at no extra cost', 'icon', 'gift'),
        jsonb_build_object('title', 'Quarterly Progress Reports', 'description', 'Regular assessments to track your improvement and adjust strategy', 'icon', 'trending-up'),
        jsonb_build_object('title', 'Comprehensive Curriculum', 'description', 'Step-by-step lessons covering everything from basics to advanced', 'icon', 'check-circle'),
        jsonb_build_object('title', 'Exclusive 2026 Promotion', 'description', 'Special discount available only for early enrollments this month', 'icon', 'dollar-sign'),
        jsonb_build_object('title', '1000+ Successful Students', 'description', 'Join thousands who have transformed their lives with our program', 'icon', 'users')
      )
    )
  );

  -- Element 6: Pricing Table
  INSERT INTO elements (template_id, type, order_index, props) VALUES (
    template_uuid,
    'pricing',
    6,
    jsonb_build_object(
      'title', 'Choose Your Package',
      'subtitle', 'Save up to 50% with our limited-time promotion',
      'layout', 'cards',
      'plans', jsonb_build_array(
        jsonb_build_object(
          'name', 'Basic Package',
          'price', '99',
          'currency', 'RM',
          'period', 'one-time',
          'description', 'Perfect for beginners starting their journey',
          'features', jsonb_build_array(
            'Access to core curriculum',
            'Monthly progress reports',
            'Email support',
            'Digital learning materials',
            'Certificate of completion'
          ),
          'buttonText', 'Get Started',
          'buttonUrl', '#checkout',
          'highlighted', false
        ),
        jsonb_build_object(
          'name', 'Premium Package',
          'price', '199',
          'currency', 'RM',
          'period', 'one-time',
          'description', 'Most popular - Best value for serious learners',
          'features', jsonb_build_array(
            'Everything in Basic',
            'Quarterly diagnostic tests',
            'Free enrichment classes',
            'Priority support',
            'Exclusive webinars',
            '1-on-1 coaching sessions'
          ),
          'buttonText', 'Enroll Now - Save RM200',
          'buttonUrl', '#checkout',
          'highlighted', true
        ),
        jsonb_build_object(
          'name', 'Elite Package',
          'price', '349',
          'currency', 'RM',
          'period', 'one-time',
          'description', 'Ultimate package with personalized attention',
          'features', jsonb_build_array(
            'Everything in Premium',
            'Weekly 1-on-1 mentoring',
            'Customized learning path',
            'Lifetime access to updates',
            'VIP community access',
            'Job placement assistance'
          ),
          'buttonText', 'Go Elite',
          'buttonUrl', '#checkout',
          'highlighted', false
        )
      )
    )
  );

  -- Element 7: What's Included Section (using Features Grid)
  INSERT INTO elements (template_id, type, order_index, props) VALUES (
    template_uuid,
    'features',
    7,
    jsonb_build_object(
      'title', 'What''s Included In This Promotion?',
      'subtitle', 'Total value worth $4,621 - Now only $2,200',
      'variant', 'grid',
      'features', jsonb_build_array(
        jsonb_build_object('title', 'Registration Fee Waived', 'description', 'Save RM500 on enrollment - normally charged for all new students', 'icon', 'dollar-sign'),
        jsonb_build_object('title', 'Free Assessment Tests', 'description', 'Worth RM300 - Quarterly diagnostic tests to track your progress', 'icon', 'clipboard'),
        jsonb_build_object('title', 'Free Enrichment Classes', 'description', 'Worth RM800 - Access to all bonus workshops and masterclasses', 'icon', 'sparkles'),
        jsonb_build_object('title', 'Premium Learning Materials', 'description', 'Worth RM421 - Digital and physical resources included', 'icon', 'book')
      )
    )
  );

  -- Element 8: Testimonials
  INSERT INTO elements (template_id, type, order_index, props) VALUES (
    template_uuid,
    'testimonials',
    8,
    jsonb_build_object(
      'title', 'What Our Students Say',
      'subtitle', 'Join thousands of satisfied learners who transformed their lives',
      'variant', 'grid',
      'testimonials', jsonb_build_array(
        jsonb_build_object(
          'name', 'Sarah Johnson',
          'role', 'Parent of 2 Students',
          'quote', 'My children''s grades improved dramatically within 3 months. The structured approach and regular assessments made all the difference. Highly recommend!',
          'rating', 5
        ),
        jsonb_build_object(
          'name', 'Ahmad Rahman',
          'role', 'Student, Form 5',
          'quote', 'The personalized attention and enrichment classes helped me excel in my exams. Got straight A''s thanks to this program!',
          'rating', 5
        ),
        jsonb_build_object(
          'name', 'Michelle Tan',
          'role', 'Parent',
          'quote', 'Best investment in my child''s education. The teachers are dedicated and the results speak for themselves. Worth every penny!',
          'rating', 5
        ),
        jsonb_build_object(
          'name', 'Kumar Suresh',
          'role', 'Student, Form 4',
          'quote', 'From struggling student to top performer - this program changed my academic life. The support is amazing!',
          'rating', 5
        ),
        jsonb_build_object(
          'name', 'Lisa Wong',
          'role', 'Parent',
          'quote', 'My daughter was hesitant at first, but now she looks forward to classes. Seeing her confidence grow has been incredible.',
          'rating', 5
        ),
        jsonb_build_object(
          'name', 'David Lee',
          'role', 'Parent of 3 Students',
          'quote', 'Having all three kids in the program has been a game-changer. The value for money is unbeatable, especially with this promotion!',
          'rating', 5
        )
      )
    )
  );

  -- Element 9: CTA Section
  INSERT INTO elements (template_id, type, order_index, props) VALUES (
    template_uuid,
    'cta',
    9,
    jsonb_build_object(
      'title', 'Ready to Transform Your Learning Journey?',
      'description', 'Join now and save up to RM2,421. Limited time offer ends January 31, 2026. Don''t miss out!',
      'buttonText', 'Enroll Now - Save Big',
      'buttonUrl', '#pricing',
      'buttonBgColor', '#10b981',
      'buttonTextColor', '#ffffff',
      'buttonSize', 'large',
      'buttonFontSize', 20,
      'bgColor', '#f0fdf4'
    )
  );

  -- Element 10: FAQ Section
  INSERT INTO elements (template_id, type, order_index, props) VALUES (
    template_uuid,
    'faq',
    10,
    jsonb_build_object(
      'title', 'Frequently Asked Questions',
      'subtitle', 'Everything you need to know about our program',
      'variant', 'accordion',
      'questions', jsonb_build_array(
        jsonb_build_object(
          'question', 'What is included in the program?',
          'answer', 'The program includes comprehensive curriculum materials, regular assessments, enrichment classes, learning materials, and ongoing support. Premium packages include additional 1-on-1 coaching and exclusive resources.'
        ),
        jsonb_build_object(
          'question', 'How long is the program valid?',
          'answer', 'Once enrolled, you have lifetime access to the core curriculum and all future updates. Live coaching sessions are available for the duration of your chosen package (6 months to 1 year).'
        ),
        jsonb_build_object(
          'question', 'Is there a money-back guarantee?',
          'answer', 'Yes! We offer a 30-day money-back guarantee. If you''re not satisfied with the program within the first 30 days, we''ll refund your full payment, no questions asked.'
        ),
        jsonb_build_object(
          'question', 'Can I upgrade my package later?',
          'answer', 'Absolutely! You can upgrade from Basic to Premium or Elite at any time. You''ll only pay the difference, and your progress will be maintained.'
        ),
        jsonb_build_object(
          'question', 'What payment methods do you accept?',
          'answer', 'We accept all major credit cards, online banking, and payment platforms. Installment plans are available for Premium and Elite packages.'
        ),
        jsonb_build_object(
          'question', 'When does the promotion end?',
          'answer', 'This special promotion ends on January 31, 2026 at 11:59 PM. After that, prices will return to regular rates and the bonus inclusions won''t be available.'
        ),
        jsonb_build_object(
          'question', 'Do you offer group discounts?',
          'answer', 'Yes! Families enrolling multiple students can get additional discounts. Contact us for a customized group rate quote.'
        ),
        jsonb_build_object(
          'question', 'Still have questions?',
          'answer', 'Feel free to reach out to our support team via WhatsApp or email. We''re here to help you make the best decision for your learning journey!'
        )
      )
    )
  );

  -- Element 11: Footer
  INSERT INTO elements (template_id, type, order_index, props) VALUES (
    template_uuid,
    'footer',
    11,
    jsonb_build_object(
      'logo', '',
      'logoText', 'YOUR ACADEMY',
      'description', 'Empowering learners to achieve their full potential through comprehensive education and personalized support.',
      'columns', jsonb_build_array(
        jsonb_build_object(
          'title', 'Quick Links',
          'links', jsonb_build_array(
            jsonb_build_object('label', 'Home', 'url', '#'),
            jsonb_build_object('label', 'About Us', 'url', '#about'),
            jsonb_build_object('label', 'Programs', 'url', '#programs'),
            jsonb_build_object('label', 'Contact', 'url', '#contact')
          )
        ),
        jsonb_build_object(
          'title', 'Programs',
          'links', jsonb_build_array(
            jsonb_build_object('label', 'Basic Package', 'url', '#pricing'),
            jsonb_build_object('label', 'Premium Package', 'url', '#pricing'),
            jsonb_build_object('label', 'Elite Package', 'url', '#pricing'),
            jsonb_build_object('label', 'Enrichment Classes', 'url', '#enrichment')
          )
        ),
        jsonb_build_object(
          'title', 'Support',
          'links', jsonb_build_array(
            jsonb_build_object('label', 'FAQ', 'url', '#faq'),
            jsonb_build_object('label', 'Contact Us', 'url', '#contact'),
            jsonb_build_object('label', 'Privacy Policy', 'url', '#privacy'),
            jsonb_build_object('label', 'Terms of Service', 'url', '#terms')
          )
        )
      ),
      'socialLinks', jsonb_build_array(
        jsonb_build_object('platform', 'facebook', 'url', 'https://facebook.com/youracademy'),
        jsonb_build_object('platform', 'twitter', 'url', 'https://twitter.com/youracademy'),
        jsonb_build_object('platform', 'instagram', 'url', 'https://instagram.com/youracademy')
      ),
      'copyright', '© 2026 Your Academy. All rights reserved.',
      'bgColor', '#1f2937',
      'textColor', '#ffffff'
    )
  );

END $$;

-- Add helpful comment
COMMENT ON TABLE templates IS 'Templates library - Reset with Ebook category on 2026-01-09';


-- FILE: 20260109040000_fix_function_search_path.sql
-- Fix function search_path security vulnerability
-- This prevents search_path manipulation attacks by explicitly setting the search_path

-- Drop and recreate the update_products_updated_at function with secure search_path
DROP FUNCTION IF EXISTS update_products_updated_at();

CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add comment explaining the security fix
COMMENT ON FUNCTION update_products_updated_at() IS 'Trigger function to update updated_at timestamp. Uses fixed search_path for security.';


-- FILE: 20260110000000_add_leanx_collection_uuid.sql
-- Migration: Add LeanX Collection UUID to profiles
-- Description: Adds collection_uuid column to store LeanX payment collection ID
-- Date: 2026-01-10

-- Add collection_uuid column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS leanx_collection_uuid TEXT;

-- Add comment for documentation
COMMENT ON COLUMN profiles.leanx_collection_uuid IS 'LeanX Collection UUID (Dc-... or CL-...) for payment gateway integration';


-- FILE: 20260116000000_add_google_oauth_integration.sql
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


-- FILE: 20260116000001_add_user_uploads_bucket.sql
-- Create storage bucket for user uploads (avatars, etc.)
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-uploads', 'user-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-uploads');

-- Allow authenticated users to update their own files
CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access to all files (for avatars, etc.)
CREATE POLICY "Public can view files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'user-uploads');


-- FILE: 20260116000002_add_leanx_environment.sql
-- Add leanx_environment field to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS leanx_environment TEXT DEFAULT 'live' CHECK (leanx_environment IN ('test', 'live'));


-- FILE: 20260116000003_add_tracking_pixels.sql
-- Add tracking pixels configuration to profiles (account-level defaults)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS tracking_pixels JSONB DEFAULT '{
  "facebook": {"enabled": false, "pixelId": null, "enableConversionsAPI": false, "triggerPurchaseOnPending": false},
  "tiktok": {"enabled": false, "pixelId": null, "enableEventsAPI": false, "triggerPurchaseOnPending": false},
  "google_ads": {"enabled": false, "tagId": null, "conversionLabel": null},
  "google_analytics": {"enabled": false, "measurementId": null}
}'::jsonb;

-- Add tracking pixels override to projects (project-specific overrides)
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS tracking_pixels_override JSONB DEFAULT NULL;

COMMENT ON COLUMN profiles.tracking_pixels IS 'Default tracking pixels configuration for all projects';
COMMENT ON COLUMN projects.tracking_pixels_override IS 'Project-specific pixel overrides. NULL means use account defaults';


-- FILE: 20260116000004_add_ga4_integration.sql
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


-- FILE: 20260118000000_add_baju_raya_template.sql
-- Migration: Add Baju Raya E-commerce Template
-- Date: 2026-01-18
-- Purpose: Create a high-converting e-commerce template for Baju Raya fashion brand

INSERT INTO templates (
  id,
  name,
  slug,
  description,
  category,
  industry,
  thumbnail_url,
  preview_url,
  tags,
  is_public,
  usage_count,
  data
) VALUES (
  gen_random_uuid(),
  'Baju Raya Collection',
  'baju-raya-collection',
  'A beautiful e-commerce template perfect for selling Baju Raya, Baju Melayu, and traditional Malay clothing. Features elegant design, size guides, delivery info, and WhatsApp ordering. Optimized for Hari Raya sales campaigns.',
  'ecommerce',
  'Fashion',
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&h=800&fit=crop',
  ARRAY['baju raya', 'fashion', 'ecommerce', 'hari raya', 'baju melayu', 'clothing', 'traditional', 'malaysia', 'raya'],
  true,
  0,
  '{
    "seo_settings": {
      "title": "Koleksi Baju Raya 2026 | Baju Melayu & Kurung Terkini",
      "description": "Dapatkan koleksi Baju Raya terbaru dengan harga berpatutan. Baju Melayu, Baju Kurung, dan set family matching. Penghantaran percuma ke seluruh Malaysia.",
      "ogType": "product",
      "robotsIndex": true,
      "robotsFollow": true,
      "language": "ms"
    },
    "theme": {
      "primaryColor": "#7c3aed",
      "fontFamily": "Inter"
    },
    "elements": [
      {
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "PROMOSI RAYA! Diskaun Sehingga 50% + Penghantaran PERCUMA",
          "bgColor": "#7c3aed",
          "textColor": "#ffffff",
          "showCountdown": true,
          "countdownLabel": "Tamat dalam:",
          "countdownEndDate": "2026-03-31T23:59:59",
          "isSticky": true,
          "showCloseButton": false,
          "link": "#pricing",
          "linkText": "Beli Sekarang"
        }
      },
      {
        "type": "navigation",
        "order": 1,
        "props": {
          "logo": "",
          "logoText": "RAYA COLLECTION",
          "menuItems": [
            {"label": "Koleksi", "url": "#pricing"},
            {"label": "Testimoni", "url": "#testimonials"},
            {"label": "Soalan Lazim", "url": "#faq"}
          ],
          "ctaButton": {"text": "Tempah Sekarang", "url": "#order"},
          "bgColor": "#ffffff",
          "textColor": "#111827",
          "isSticky": true,
          "layout": "left"
        }
      },
      {
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Koleksi Baju Raya 2026",
          "subheadline": "Tampil bergaya sempena Hari Raya dengan koleksi eksklusif kami. Baju Melayu, Baju Kurung & Set Sedondon untuk sekeluarga.",
          "ctaText": "Lihat Koleksi",
          "ctaUrl": "#pricing",
          "image": "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1600&h=900&fit=crop",
          "bgColor": "#faf5ff",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#f3e8ff",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 60,
          "buttonBgColor": "#7c3aed",
          "buttonTextColor": "#ffffff"
        }
      },
      {
        "type": "features",
        "order": 3,
        "props": {
          "variant": "grid",
          "title": "Kenapa Pilih Kami?",
          "features": [
            {"icon": "sparkles", "title": "Kain Premium", "description": "Menggunakan kain berkualiti tinggi yang selesa, lembut dan tahan lama"},
            {"icon": "award", "title": "Rekaan Eksklusif", "description": "Corak dan design terkini yang moden namun tetap tradisional"},
            {"icon": "rocket", "title": "Penghantaran Cepat", "description": "Penghantaran dalam 2-3 hari bekerja ke seluruh Malaysia"},
            {"icon": "shield", "title": "Jaminan Kualiti", "description": "Wang dikembalikan jika tidak berpuas hati dengan produk"},
            {"icon": "users", "title": "Set Sekeluarga", "description": "Koleksi matching untuk seluruh ahli keluarga"},
            {"icon": "gift", "title": "Hadiah Percuma", "description": "Free gift exclusive untuk pembelian melebihi RM200"}
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "pricing",
        "order": 4,
        "props": {
          "title": "Koleksi Pilihan Kami",
          "subtitle": "Harga istimewa sempena Hari Raya 2026",
          "layout": "cards",
          "plans": [
            {
              "name": "Baju Melayu Slim Fit",
              "price": "89",
              "currency": "RM",
              "period": "per helai",
              "description": "Baju Melayu moden dengan potongan slim fit yang kemas",
              "features": ["Kain cotton berkualiti tinggi", "Potongan slim fit moden", "Tersedia dalam 8 warna", "Saiz XS hingga 4XL", "Butang kayu premium", "Jahitan kemas dan rapi"],
              "buttonText": "Tempah Sekarang",
              "buttonUrl": "#order",
              "highlighted": false
            },
            {
              "name": "Set Sedondon Lelaki + Wanita",
              "price": "169",
              "currency": "RM",
              "period": "per set",
              "description": "Set matching untuk pasangan - paling popular!",
              "features": ["1x Baju Melayu Slim Fit", "1x Baju Kurung Moden", "Kain premium berkualiti", "Warna matching yang cantik", "FREE samping bernilai RM39", "Kotak hadiah eksklusif"],
              "buttonText": "Pilihan Popular!",
              "buttonUrl": "#order",
              "highlighted": true
            },
            {
              "name": "Set Family (4 orang)",
              "price": "299",
              "currency": "RM",
              "period": "per set",
              "description": "Set lengkap untuk sekeluarga - Ayah, Ibu & 2 Anak",
              "features": ["1x Baju Melayu Dewasa", "1x Baju Kurung Dewasa", "2x Baju Kanak-kanak", "Semua saiz tersedia", "FREE 2x samping/selendang", "Penghantaran PERCUMA"],
              "buttonText": "Set Jimat!",
              "buttonUrl": "#order",
              "highlighted": false
            }
          ],
          "bgColor": "#faf5ff"
        }
      },
      {
        "type": "testimonials",
        "order": 5,
        "props": {
          "variant": "grid",
          "title": "Apa Kata Pelanggan Kami",
          "testimonials": [
            {"name": "Siti Aminah", "role": "Kuala Lumpur", "quote": "Kain sangat lembut dan selesa! Anak-anak suka sangat. Tahun ni repeat order lagi untuk Raya.", "rating": 5},
            {"name": "Ahmad Firdaus", "role": "Johor Bahru", "quote": "Potongan slim fit memang kemas. Ramai puji masa rumah terbuka. Sangat berbaloi dengan harga!", "rating": 5},
            {"name": "Nurul Huda", "role": "Penang", "quote": "Set sedondon untuk family kami semua. Gambar Raya tahun ni memang cantik! Terima kasih.", "rating": 5},
            {"name": "Mohd Hafiz", "role": "Selangor", "quote": "Penghantaran cepat, dalam 2 hari dah sampai. Kualiti tiptop! Memang akan repeat order.", "rating": 5},
            {"name": "Farah Diana", "role": "Melaka", "quote": "Baju kurung moden design sangat cantik. Warna pun exactly macam gambar. Sangat puas hati!", "rating": 5},
            {"name": "Rizal Ibrahim", "role": "Sabah", "quote": "Walaupun di Sabah, sampai dalam masa seminggu. Packaging kemas dan baju sangat berkualiti.", "rating": 5}
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "cta",
        "order": 6,
        "props": {
          "variant": "centered",
          "headline": "Jangan Lepaskan Peluang Ini!",
          "description": "Stok terhad! Tempah sekarang sebelum kehabisan. Promosi tamat 31 Mac 2026.",
          "buttonText": "Tempah Sekarang",
          "buttonUrl": "#order",
          "bgGradient": "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
          "buttonColor": "#ffffff",
          "buttonTextColor": "#7c3aed",
          "buttonSize": "lg"
        }
      },
      {
        "type": "faq",
        "order": 7,
        "props": {
          "variant": "single_column",
          "title": "Soalan Lazim",
          "questions": [
            {"question": "Bagaimana cara untuk mengetahui saiz yang sesuai?", "answer": "Kami menyediakan carta saiz lengkap di setiap produk. Anda boleh ukur badan anda dan rujuk carta tersebut. Jika masih ragu, WhatsApp kami dengan ukuran anda dan kami akan bantu cadangkan saiz yang sesuai."},
            {"question": "Berapa lama tempoh penghantaran?", "answer": "Untuk Semenanjung Malaysia: 2-3 hari bekerja. Untuk Sabah & Sarawak: 5-7 hari bekerja. Penghantaran PERCUMA untuk pembelian melebihi RM150."},
            {"question": "Boleh tukar saiz jika tidak muat?", "answer": "Ya, kami menawarkan pertukaran saiz PERCUMA dalam tempoh 7 hari selepas menerima barang. Pastikan tag masih ada dan baju belum dipakai/dibasuh."},
            {"question": "Apakah kaedah pembayaran yang diterima?", "answer": "Kami menerima FPX (online banking), kad kredit/debit, dan juga Cash on Delivery (COD) untuk kawasan terpilih. Boleh juga buat bayaran ansuran melalui Atome atau GrabPay Later."},
            {"question": "Boleh buat tempahan untuk kumpulan/kenduri?", "answer": "Sudah tentu! Untuk tempahan 10 helai ke atas, anda layak mendapat diskaun istimewa. WhatsApp kami untuk dapatkan sebut harga khas."},
            {"question": "Adakah warna dalam gambar sama dengan produk sebenar?", "answer": "Kami berusaha untuk menunjukkan warna sehampir mungkin dengan produk sebenar. Namun, warna mungkin sedikit berbeza bergantung kepada tetapan skrin peranti anda."},
            {"question": "Bila tarikh akhir untuk tempahan sampai sebelum Raya?", "answer": "Untuk jaminan sampai sebelum Hari Raya, sila buat tempahan selewat-lewatnya 10 hari sebelum Raya. Tempahan last minute mungkin tertakluk kepada ketersediaan stok."}
          ],
          "bgColor": "#faf5ff"
        }
      },
      {
        "type": "form_with_payment",
        "order": 8,
        "props": {
          "title": "Borang Tempahan",
          "description": "Isikan maklumat anda untuk meneruskan tempahan. Kami akan hubungi anda untuk pengesahan.",
          "nameLabel": "Nama Penuh",
          "mobileLabel": "No. Telefon",
          "emailLabel": "Email",
          "showName": true,
          "showMobile": true,
          "showEmail": true,
          "nameRequired": true,
          "mobileRequired": true,
          "emailRequired": false,
          "defaultCountryCode": "MY",
          "products": [
            {"id": "baju-melayu-slim", "name": "Baju Melayu Slim Fit", "description": "Baju Melayu moden potongan slim fit", "price": 89, "image": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&h=200&fit=crop", "featured": false},
            {"id": "set-sedondon", "name": "Set Sedondon (Lelaki + Wanita)", "description": "Set matching untuk pasangan", "price": 169, "image": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop", "featured": true},
            {"id": "set-family", "name": "Set Family (4 orang)", "description": "Set lengkap sekeluarga", "price": 299, "image": "https://images.unsplash.com/photo-1558171813-4c088753af8f?w=200&h=200&fit=crop", "featured": false}
          ],
          "currency": "MYR",
          "submitButtonText": "Teruskan Pembayaran",
          "submitButtonColor": "#7c3aed",
          "bgColor": "#ffffff",
          "termsUrl": "#terms",
          "policyUrl": "#privacy",
          "contactUrl": "#contact",
          "companyName": "Raya Collection Sdn Bhd",
          "companyRegistration": "SSM: 202401012345"
        }
      },
      {
        "type": "whatsapp_button",
        "order": 9,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Assalamualaikum, saya berminat dengan Koleksi Baju Raya 2026. Boleh saya tahu lebih lanjut?",
          "buttonText": "WhatsApp Kami",
          "buttonColor": "#25D366",
          "buttonSize": "lg",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true,
          "showHeadline": true,
          "headlineText": "Ada soalan? Hubungi kami terus!",
          "headlineColor": "#1f2937"
        }
      },
      {
        "type": "footer",
        "order": 10,
        "props": {
          "logo": "",
          "logoText": "RAYA COLLECTION",
          "description": "Koleksi Baju Raya berkualiti tinggi dengan harga berpatutan. Tampil bergaya bersama keluarga tersayang.",
          "columns": [
            {"title": "Pautan Pantas", "links": [{"label": "Laman Utama", "url": "#"}, {"label": "Koleksi", "url": "#pricing"}, {"label": "Testimoni", "url": "#testimonials"}, {"label": "Hubungi Kami", "url": "#contact"}]},
            {"title": "Maklumat", "links": [{"label": "Carta Saiz", "url": "#size"}, {"label": "Polisi Penghantaran", "url": "#shipping"}, {"label": "Polisi Pemulangan", "url": "#return"}, {"label": "Soalan Lazim", "url": "#faq"}]},
            {"title": "Hubungi Kami", "links": [{"label": "WhatsApp: +60 12-345 6789", "url": "https://wa.me/60123456789"}, {"label": "Email: hello@rayacollection.my", "url": "mailto:hello@rayacollection.my"}, {"label": "Isnin - Jumaat: 9am - 6pm", "url": "#"}]}
          ],
          "socialLinks": [
            {"platform": "facebook", "url": "https://facebook.com/rayacollection"},
            {"platform": "instagram", "url": "https://instagram.com/rayacollection"}
          ],
          "copyright": "© 2026 Raya Collection Sdn Bhd. Hak cipta terpelihara.",
          "bgColor": "#1f2937",
          "textColor": "#ffffff"
        }
      }
    ]
  }'::jsonb
);


-- FILE: 20260119000000_add_custom_domain_to_profiles.sql
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


-- FILE: 20260120000000_add_automotive_service_template.sql
-- Migration: Add Automotive Service Template
-- Date: 2026-01-20
-- Purpose: Create a car service/workshop template with booking form CTA

-- Insert Automotive Service template
INSERT INTO templates (
  id,
  name,
  slug,
  category,
  industry,
  description,
  thumbnail_url,
  preview_url,
  data,
  is_public,
  usage_count,
  tags
) VALUES (
  gen_random_uuid(),
  'Auto Service Workshop',
  'auto-service-workshop',
  'automotive',
  'Automotive',
  'A professional automotive service template perfect for car workshops, mechanics, and auto repair centers. Features service highlights, booking form for appointments, testimonials, and FAQ. Designed to convert visitors into booked customers.',
  'https://placehold.co/400x300/1e40af/ffffff?text=Auto+Service',
  'https://placehold.co/1200x800/1e40af/ffffff?text=Auto+Service+Preview',
  jsonb_build_object(
    'elements', jsonb_build_array(
      -- Element 1: Announcement Bar
      jsonb_build_object(
        'id', 'elem-auto-1',
        'type', 'announcement_bar',
        'order', 1,
        'props', jsonb_build_object(
          'message', 'FREE VEHICLE INSPECTION WITH EVERY SERVICE BOOKING!',
          'bgColor', '#dc2626',
          'textColor', '#ffffff',
          'showCountdown', false,
          'isSticky', true,
          'showCloseButton', true,
          'link', '#booking',
          'linkText', 'Book Now'
        )
      ),
      -- Element 2: Navigation Header
      jsonb_build_object(
        'id', 'elem-auto-2',
        'type', 'navigation',
        'order', 2,
        'props', jsonb_build_object(
          'logo', '',
          'logoText', 'AUTO PRO SERVICE',
          'menuItems', jsonb_build_array(
            jsonb_build_object('label', 'Services', 'url', '#services'),
            jsonb_build_object('label', 'Testimonials', 'url', '#testimonials'),
            jsonb_build_object('label', 'FAQ', 'url', '#faq')
          ),
          'ctaButton', jsonb_build_object(
            'text', 'Book Appointment',
            'url', '#booking'
          ),
          'bgColor', '#0f172a',
          'textColor', '#ffffff',
          'isSticky', true,
          'layout', 'split'
        )
      ),
      -- Element 3: Hero Section
      jsonb_build_object(
        'id', 'elem-auto-3',
        'type', 'hero',
        'order', 3,
        'props', jsonb_build_object(
          'variant', 'image_bg',
          'headline', 'Expert Car Care You Can Trust',
          'subheadline', 'Professional auto service with certified mechanics. Quality repairs, honest pricing, and your satisfaction guaranteed.',
          'ctaText', 'Book Your Service Now',
          'ctaUrl', '#booking',
          'image', 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=1920&h=1080&fit=crop',
          'bgColor', '#0f172a',
          'headlineColor', '#ffffff',
          'subheadlineColor', '#e2e8f0',
          'imageOpacity', 60,
          'buttonBgColor', '#dc2626',
          'buttonTextColor', '#ffffff'
        )
      ),
      -- Element 4: Services Section
      jsonb_build_object(
        'id', 'elem-auto-4',
        'type', 'features',
        'order', 4,
        'props', jsonb_build_object(
          'title', 'Our Services',
          'subtitle', 'Complete automotive care under one roof',
          'variant', 'grid',
          'features', jsonb_build_array(
            jsonb_build_object('title', 'Engine Repair & Diagnostics', 'description', 'Advanced computer diagnostics and expert engine repairs for all makes and models', 'icon', 'settings'),
            jsonb_build_object('title', 'Oil Change & Maintenance', 'description', 'Regular maintenance services to keep your vehicle running smoothly', 'icon', 'droplet'),
            jsonb_build_object('title', 'Brake Service', 'description', 'Complete brake inspection, repair, and replacement services', 'icon', 'shield'),
            jsonb_build_object('title', 'Air Conditioning', 'description', 'A/C repair, recharge, and maintenance for optimal cooling', 'icon', 'wind'),
            jsonb_build_object('title', 'Tire Services', 'description', 'Tire rotation, balancing, alignment, and replacement', 'icon', 'circle'),
            jsonb_build_object('title', 'Battery Service', 'description', 'Battery testing, charging, and replacement services', 'icon', 'zap')
          ),
          'bgColor', '#f8fafc'
        )
      ),
      -- Element 5: Why Choose Us
      jsonb_build_object(
        'id', 'elem-auto-5',
        'type', 'features',
        'order', 5,
        'props', jsonb_build_object(
          'title', 'Why Choose Auto Pro Service?',
          'subtitle', 'Experience the difference of working with professionals who care',
          'variant', 'grid',
          'features', jsonb_build_array(
            jsonb_build_object('title', 'Certified Mechanics', 'description', 'Our team consists of ASE-certified technicians with years of experience', 'icon', 'award'),
            jsonb_build_object('title', 'Transparent Pricing', 'description', 'No hidden fees. Get detailed quotes before any work begins', 'icon', 'dollar-sign'),
            jsonb_build_object('title', 'Quality Parts', 'description', 'We use only OEM and high-quality aftermarket parts', 'icon', 'check-circle'),
            jsonb_build_object('title', 'Warranty Included', 'description', '12-month warranty on all repairs and parts installed', 'icon', 'shield'),
            jsonb_build_object('title', 'Quick Turnaround', 'description', 'Most services completed same-day. We value your time', 'icon', 'clock'),
            jsonb_build_object('title', 'Free Inspection', 'description', 'Complimentary 25-point vehicle inspection with every service', 'icon', 'gift')
          ),
          'bgColor', '#ffffff'
        )
      ),
      -- Element 6: Testimonials
      jsonb_build_object(
        'id', 'elem-auto-6',
        'type', 'testimonials',
        'order', 6,
        'props', jsonb_build_object(
          'title', 'What Our Customers Say',
          'subtitle', 'Trusted by thousands of car owners in the community',
          'variant', 'grid',
          'testimonials', jsonb_build_array(
            jsonb_build_object('name', 'Ahmad Razak', 'role', 'Honda Civic Owner', 'quote', 'Best workshop I have ever visited! They fixed my engine problem that 3 other workshops could not diagnose. Fair pricing and excellent service.', 'rating', 5),
            jsonb_build_object('name', 'Sarah Lim', 'role', 'Toyota Vios Owner', 'quote', 'I always bring my car here for servicing. The staff is friendly, work is done quickly, and they always explain everything clearly.', 'rating', 5),
            jsonb_build_object('name', 'Kumar Pillai', 'role', 'BMW 3 Series Owner', 'quote', 'Finally found a workshop I can trust with my BMW. Professional service at reasonable prices. Highly recommend!', 'rating', 5),
            jsonb_build_object('name', 'Michelle Wong', 'role', 'Mazda CX-5 Owner', 'quote', 'The online booking system is so convenient! I booked my appointment, dropped off my car, and it was ready by evening. Great experience!', 'rating', 5),
            jsonb_build_object('name', 'Rizal Hassan', 'role', 'Proton X70 Owner', 'quote', 'They found and fixed a brake issue during the free inspection. Could have been dangerous. Thank you for your honesty and thorough work!', 'rating', 5),
            jsonb_build_object('name', 'Jenny Tan', 'role', 'Perodua Myvi Owner', 'quote', 'Very satisfied with the A/C repair. My car is cool again! The mechanic took time to explain what was wrong and showed me the faulty part.', 'rating', 5)
          ),
          'bgColor', '#f1f5f9'
        )
      ),
      -- Element 7: Booking Form (Main CTA)
      jsonb_build_object(
        'id', 'elem-auto-7',
        'type', 'booking_form',
        'order', 7,
        'props', jsonb_build_object(
          'title', 'Book Your Service Appointment',
          'description', 'Schedule your visit online and skip the wait. Choose your preferred date and time slot below.',
          'nameLabel', 'Full Name',
          'phoneLabel', 'Phone Number',
          'emailLabel', 'Email Address',
          'remarkLabel', 'Vehicle Details & Service Required',
          'showName', true,
          'showPhone', true,
          'showEmail', true,
          'showRemark', true,
          'nameRequired', true,
          'phoneRequired', true,
          'emailRequired', false,
          'remarkRequired', true,
          'defaultCountryCode', 'MY',
          'serviceName', 'Car Service Appointment',
          'servicePrice', 0,
          'currency', 'MYR',
          'duration', 60,
          'slotDuration', 60,
          'startTime', '08:00',
          'endTime', '18:00',
          'availableDays', jsonb_build_array(1, 2, 3, 4, 5, 6),
          'blockedDates', jsonb_build_array(),
          'submitButtonText', 'Confirm Booking',
          'submitButtonColor', '#dc2626',
          'bgColor', '#ffffff',
          'google_sheets_enabled', false,
          'google_sheets_url', '',
          'requirePayment', false,
          'termsUrl', '#terms',
          'policyUrl', '#privacy'
        )
      ),
      -- Element 8: FAQ
      jsonb_build_object(
        'id', 'elem-auto-8',
        'type', 'faq',
        'order', 8,
        'props', jsonb_build_object(
          'title', 'Frequently Asked Questions',
          'subtitle', 'Got questions? We have answers',
          'variant', 'single_column',
          'questions', jsonb_build_array(
            jsonb_build_object('question', 'Do I need to book an appointment?', 'answer', 'While walk-ins are welcome, we highly recommend booking an appointment to ensure we can serve you promptly. Online booking allows you to choose your preferred time slot.'),
            jsonb_build_object('question', 'How long does a typical service take?', 'answer', 'Regular servicing takes about 1-2 hours. More complex repairs may take longer, but we will always inform you of the estimated time before starting any work.'),
            jsonb_build_object('question', 'What brands do you service?', 'answer', 'We service all major car brands including Proton, Perodua, Honda, Toyota, Nissan, Mazda, BMW, Mercedes, and more. Our technicians are trained to work on various makes and models.'),
            jsonb_build_object('question', 'Do you provide warranty on repairs?', 'answer', 'Yes! All our repairs come with a 12-month warranty on parts and labor. If any issue arises from our work, bring it back and we will fix it at no additional cost.'),
            jsonb_build_object('question', 'Can I wait while my car is being serviced?', 'answer', 'Absolutely! We have a comfortable waiting area with air conditioning, WiFi, and refreshments. You can also drop off your car and we will call you when it is ready.'),
            jsonb_build_object('question', 'What payment methods do you accept?', 'answer', 'We accept cash, credit/debit cards, online banking, and e-wallets including Touch n Go, GrabPay, and Boost. Installment plans are available for major repairs.'),
            jsonb_build_object('question', 'Is the free inspection really free?', 'answer', 'Yes, the 25-point inspection is completely free with any service booking. We will check your brakes, fluids, belts, battery, and more - with no obligation for additional repairs.'),
            jsonb_build_object('question', 'What are your operating hours?', 'answer', 'We are open Monday to Saturday, 8:00 AM to 6:00 PM. We are closed on Sundays and public holidays. Emergency services may be arranged by calling our hotline.')
          ),
          'bgColor', '#f8fafc'
        )
      ),
      -- Element 9: WhatsApp Button
      jsonb_build_object(
        'id', 'elem-auto-9',
        'type', 'whatsapp_button',
        'order', 9,
        'props', jsonb_build_object(
          'phoneNumber', '60123456789',
          'message', 'Hi! I would like to inquire about your car service.',
          'buttonText', 'Chat on WhatsApp',
          'buttonColor', '#25D366',
          'buttonSize', 'md',
          'position', 'fixed',
          'fixedPosition', 'bottom-right',
          'showIcon', true,
          'tooltipText', 'Need help? Chat with us!',
          'showHeadline', false
        )
      ),
      -- Element 10: Footer
      jsonb_build_object(
        'id', 'elem-auto-10',
        'type', 'footer',
        'order', 10,
        'props', jsonb_build_object(
          'logo', '',
          'logoText', 'AUTO PRO SERVICE',
          'description', 'Your trusted partner for all automotive needs. Quality service, honest pricing, and customer satisfaction guaranteed since 2010.',
          'columns', jsonb_build_array(
            jsonb_build_object(
              'title', 'Services',
              'links', jsonb_build_array(
                jsonb_build_object('label', 'Engine Repair', 'url', '#services'),
                jsonb_build_object('label', 'Oil Change', 'url', '#services'),
                jsonb_build_object('label', 'Brake Service', 'url', '#services'),
                jsonb_build_object('label', 'A/C Service', 'url', '#services')
              )
            ),
            jsonb_build_object(
              'title', 'Company',
              'links', jsonb_build_array(
                jsonb_build_object('label', 'About Us', 'url', '#about'),
                jsonb_build_object('label', 'Our Team', 'url', '#team'),
                jsonb_build_object('label', 'Careers', 'url', '#careers'),
                jsonb_build_object('label', 'Contact', 'url', '#contact')
              )
            ),
            jsonb_build_object(
              'title', 'Support',
              'links', jsonb_build_array(
                jsonb_build_object('label', 'FAQ', 'url', '#faq'),
                jsonb_build_object('label', 'Book Online', 'url', '#booking'),
                jsonb_build_object('label', 'Privacy Policy', 'url', '#privacy'),
                jsonb_build_object('label', 'Terms of Service', 'url', '#terms')
              )
            )
          ),
          'socialLinks', jsonb_build_array(
            jsonb_build_object('platform', 'facebook', 'url', 'https://facebook.com/autoproservice'),
            jsonb_build_object('platform', 'instagram', 'url', 'https://instagram.com/autoproservice'),
            jsonb_build_object('platform', 'youtube', 'url', 'https://youtube.com/autoproservice')
          ),
          'copyright', '© 2026 Auto Pro Service. All rights reserved.',
          'bgColor', '#0f172a',
          'textColor', '#e2e8f0'
        )
      )
    ),
    'seo_settings', jsonb_build_object(
      'title', 'Auto Pro Service - Expert Car Care You Can Trust',
      'description', 'Professional auto service with certified mechanics. Quality repairs, honest pricing, and your satisfaction guaranteed. Book your appointment today!',
      'ogType', 'website',
      'twitterCard', 'summary_large_image',
      'robotsIndex', true,
      'robotsFollow', true,
      'language', 'en'
    ),
    'theme', jsonb_build_object(
      'primaryColor', '#dc2626',
      'fontFamily', 'Inter'
    )
  ),
  true,
  0,
  ARRAY['automotive', 'car-service', 'mechanic', 'workshop', 'repair', 'booking', 'appointment']
);

-- Add comment
COMMENT ON TABLE templates IS 'Templates library - Added Automotive Service template on 2026-01-20';


-- FILE: 20260120000001_create_bookings_table.sql
-- Migration: Create Bookings Table
-- Date: 2026-01-20
-- Purpose: Create bookings table for booking form submissions

-- =====================================================
-- BOOKINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  element_id UUID REFERENCES elements(id) ON DELETE SET NULL,
  booking_ref TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_remark TEXT,
  booking_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  service_name TEXT DEFAULT 'Booking',
  service_price DECIMAL(10, 2) DEFAULT 0,
  duration INTEGER DEFAULT 60,
  payment_status TEXT DEFAULT 'not_required' CHECK (payment_status IN ('not_required', 'pending', 'paid', 'refunded', 'failed')),
  transaction_id TEXT,
  payment_method TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_project_id ON bookings(project_id);
CREATE INDEX idx_bookings_element_id ON bookings(element_id);
CREATE INDEX idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_booking_ref ON bookings(booking_ref);
CREATE INDEX idx_bookings_customer_email ON bookings(customer_email);
CREATE INDEX idx_bookings_submitted_at ON bookings(submitted_at DESC);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookings
-- Users can view their own bookings
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert bookings (through service role - public endpoint uses service key)
CREATE POLICY "Service role can insert bookings" ON bookings
  FOR INSERT WITH CHECK (true);

-- Users can update their own bookings
CREATE POLICY "Users can update own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own bookings
CREATE POLICY "Users can delete own bookings" ON bookings
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- LEADS TABLE (if not exists)
-- =====================================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  element_id UUID REFERENCES elements(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  message TEXT,
  custom_fields JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for leads
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_project_id ON leads(project_id);
CREATE INDEX IF NOT EXISTS idx_leads_element_id ON leads(element_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_customer_email ON leads(customer_email);
CREATE INDEX IF NOT EXISTS idx_leads_submitted_at ON leads(submitted_at DESC);

-- Enable Row Level Security for leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for leads
CREATE POLICY "Users can view own leads" ON leads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert leads" ON leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own leads" ON leads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own leads" ON leads
  FOR DELETE USING (auth.uid() = user_id);

-- Add comment
COMMENT ON TABLE bookings IS 'Booking form submissions from published pages';
COMMENT ON TABLE leads IS 'Lead capture form submissions from published pages';


-- FILE: 20260126000000_add_help_requests_and_admin.sql
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


-- FILE: 20260127000001_fix_subscription_plan_constraint.sql
-- Fix subscription table constraints for plan and status fields
-- The plan column only allowed 'free' and 'pro' but we need 'premium' and 'enterprise'
-- The status column was missing 'pending' and 'failed' values

-- First, drop the existing constraints
ALTER TABLE public.subscriptions
DROP CONSTRAINT IF EXISTS subscriptions_plan_check;

ALTER TABLE public.subscriptions
DROP CONSTRAINT IF EXISTS subscriptions_status_check;

-- Add updated constraints with all required values
ALTER TABLE public.subscriptions
ADD CONSTRAINT subscriptions_plan_check
CHECK (plan = ANY (ARRAY['free'::text, 'pro'::text, 'premium'::text, 'enterprise'::text]));

ALTER TABLE public.subscriptions
ADD CONSTRAINT subscriptions_status_check
CHECK (status = ANY (ARRAY['active'::text, 'cancelled'::text, 'past_due'::text, 'trialing'::text, 'incomplete'::text, 'pending'::text, 'failed'::text]));


-- FILE: 20260127000002_fix_subscription_sync_trigger.sql
-- Fix the sync_subscription_to_profile trigger to only update profile plan
-- when subscription status is 'active' (payment completed)
-- Pending payments should NOT upgrade the user

CREATE OR REPLACE FUNCTION sync_subscription_to_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Only sync subscription_plan to profile if status is 'active'
  -- This ensures users aren't upgraded until payment is confirmed
  IF NEW.status = 'active' THEN
    UPDATE profiles
    SET
      subscription_plan = NEW.plan,
      subscription_status = NEW.status,
      subscription_renewal_date = NEW.current_period_end,
      updated_at = NOW()
    WHERE id = NEW.user_id;
  ELSE
    -- For non-active statuses, only update the status field, not the plan
    UPDATE profiles
    SET
      subscription_status = NEW.status,
      updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- FILE: 20260127100000_recreate_auto_service_template.sql
-- Migration: Recreate Auto Service Workshop Template
-- Date: 2026-01-27
-- Purpose: Recreate with product_carousel for services, features with images for why choose us

-- Delete existing template
DELETE FROM templates WHERE slug = 'auto-service-workshop';

-- Insert updated template
INSERT INTO templates (
  id,
  name,
  slug,
  category,
  industry,
  description,
  thumbnail_url,
  preview_url,
  data,
  is_public,
  usage_count,
  tags
) VALUES (
  gen_random_uuid(),
  'Auto Service Workshop',
  'auto-service-workshop',
  'automotive',
  'Automotive',
  'A professional automotive service template perfect for car workshops, mechanics, and auto repair centers. Features service showcase with images, booking form for appointments, testimonials, and WhatsApp integration. Designed to convert visitors into booked customers.',
  'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=1200&h=800&fit=crop',
  '{
    "seo_settings": {
      "title": "Auto Pro Service - Expert Car Care You Can Trust",
      "description": "Professional auto service with certified mechanics. Quality repairs, honest pricing, and your satisfaction guaranteed. Book your appointment today!",
      "ogType": "website",
      "robotsIndex": true,
      "robotsFollow": true,
      "language": "en"
    },
    "theme": {
      "primaryColor": "#dc2626",
      "fontFamily": "Inter"
    },
    "elements": [
      {
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "LIMITED OFFER: FREE 25-Point Vehicle Inspection With Every Service Booking!",
          "bgColor": "#dc2626",
          "textColor": "#ffffff",
          "showCountdown": true,
          "countdownLabel": "Offer ends in:",
          "countdownEndDate": "2026-03-31T23:59:59",
          "isSticky": true,
          "showCloseButton": true,
          "link": "#booking",
          "linkText": "Book Now"
        }
      },
      {
        "type": "navigation",
        "order": 1,
        "props": {
          "logo": "",
          "logoText": "AUTO PRO SERVICE",
          "menuItems": [
            {"label": "Services", "url": "#services"},
            {"label": "Why Us", "url": "#why-us"},
            {"label": "Testimonials", "url": "#testimonials"},
            {"label": "Book Now", "url": "#booking"}
          ],
          "ctaButton": {"text": "Book Appointment", "url": "#booking"},
          "bgColor": "#0f172a",
          "textColor": "#ffffff",
          "isSticky": true,
          "layout": "split"
        }
      },
      {
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Expert Car Care You Can Trust",
          "subheadline": "Professional auto service with certified mechanics. Quality repairs, honest pricing, and your satisfaction guaranteed since 2010.",
          "ctaText": "Book Your Service Now",
          "ctaUrl": "#booking",
          "image": "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=1920&h=1080&fit=crop",
          "bgColor": "#0f172a",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#e2e8f0",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 50,
          "buttonBgColor": "#dc2626",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "type": "product_carousel",
        "order": 3,
        "props": {
          "title": "Our Services",
          "subtitle": "Complete automotive care under one roof. From routine maintenance to major repairs, we handle it all.",
          "products": [
            {
              "id": "svc-engine",
              "code": "SVC-001",
              "name": "Engine Repair & Diagnostics",
              "description": "Advanced computer diagnostics and expert engine repairs for all makes and models. Our certified mechanics use state-of-the-art equipment.",
              "image_url": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
              "base_price": 150,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-oil",
              "code": "SVC-002",
              "name": "Oil Change & Maintenance",
              "description": "Regular maintenance services including oil change, filter replacement, and fluid top-up to keep your vehicle running smoothly.",
              "image_url": "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&h=400&fit=crop",
              "base_price": 80,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-brake",
              "code": "SVC-003",
              "name": "Brake Service & Repair",
              "description": "Complete brake inspection, pad replacement, rotor resurfacing, and brake fluid flush. Your safety is our priority.",
              "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
              "base_price": 120,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-ac",
              "code": "SVC-004",
              "name": "Air Conditioning Service",
              "description": "A/C repair, gas recharge, compressor service, and full system diagnostics for optimal cooling performance.",
              "image_url": "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=600&h=400&fit=crop",
              "base_price": 100,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-tire",
              "code": "SVC-005",
              "name": "Tire & Wheel Services",
              "description": "Tire rotation, balancing, wheel alignment, and tire replacement. We stock all major tire brands at competitive prices.",
              "image_url": "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=600&h=400&fit=crop",
              "base_price": 60,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-battery",
              "code": "SVC-006",
              "name": "Battery & Electrical",
              "description": "Battery testing, charging, jump-start service, and replacement. We also handle alternator and starter motor repairs.",
              "image_url": "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600&h=400&fit=crop",
              "base_price": 90,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "layout": "grid",
          "columns": 3,
          "showPrice": true,
          "showDescription": true,
          "cardStyle": "shadow",
          "showAddToCart": false,
          "bgColor": "#f8fafc",
          "textColor": "#0f172a",
          "priceColor": "#dc2626"
        }
      },
      {
        "type": "features",
        "order": 4,
        "props": {
          "variant": "grid",
          "title": "Why Choose Auto Pro Service?",
          "features": [
            {
              "icon": "award",
              "title": "Certified Mechanics",
              "description": "Our team consists of ASE-certified technicians with over 10 years of experience working on all makes and models.",
              "image": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=400&fit=crop"
            },
            {
              "icon": "dollar-sign",
              "title": "Transparent Pricing",
              "description": "No hidden fees or surprise charges. Get a detailed quote before any work begins so you know exactly what to expect.",
              "image": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop"
            },
            {
              "icon": "check-circle",
              "title": "Quality OEM Parts",
              "description": "We use only genuine OEM and high-quality aftermarket parts to ensure your vehicle gets the best components.",
              "image": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop"
            },
            {
              "icon": "shield",
              "title": "12-Month Warranty",
              "description": "All our repairs come with a 12-month warranty on parts and labor. Drive with peace of mind knowing we stand behind our work.",
              "image": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop"
            },
            {
              "icon": "clock",
              "title": "Quick Turnaround",
              "description": "Most services completed same-day. We value your time and work efficiently without compromising quality.",
              "image": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop"
            },
            {
              "icon": "gift",
              "title": "Free 25-Point Inspection",
              "description": "Complimentary vehicle health check with every service. We inspect brakes, fluids, belts, battery, tires, and more.",
              "image": "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=600&h=400&fit=crop"
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "booking_form",
        "order": 5,
        "props": {
          "title": "Book Your Service Appointment",
          "description": "Schedule your visit online and skip the wait. Choose your preferred date and time slot below.",
          "nameLabel": "Full Name",
          "phoneLabel": "Phone Number",
          "emailLabel": "Email Address",
          "remarkLabel": "Vehicle Details & Service Required (e.g. Honda Civic 2020, Oil Change)",
          "showName": true,
          "showPhone": true,
          "showEmail": true,
          "showRemark": true,
          "nameRequired": true,
          "phoneRequired": true,
          "emailRequired": false,
          "remarkRequired": true,
          "defaultCountryCode": "MY",
          "serviceName": "Car Service Appointment",
          "servicePrice": 0,
          "currency": "MYR",
          "duration": 60,
          "slotDuration": 60,
          "startTime": "08:00",
          "endTime": "18:00",
          "availableDays": [1, 2, 3, 4, 5, 6],
          "blockedDates": [],
          "submitButtonText": "Confirm Booking",
          "submitButtonColor": "#dc2626",
          "bgColor": "#f8fafc",
          "google_sheets_enabled": false,
          "google_sheets_url": "",
          "requirePayment": false,
          "termsUrl": "#terms",
          "policyUrl": "#privacy"
        }
      },
      {
        "type": "testimonials",
        "order": 6,
        "props": {
          "variant": "grid",
          "title": "What Our Customers Say",
          "testimonials": [
            {"name": "Ahmad Razak", "role": "Honda Civic Owner", "quote": "Best workshop I have ever visited! They fixed my engine problem that 3 other workshops could not diagnose. Fair pricing and excellent service.", "rating": 5},
            {"name": "Sarah Lim", "role": "Toyota Vios Owner", "quote": "I always bring my car here for servicing. The staff is friendly, work is done quickly, and they always explain everything clearly.", "rating": 5},
            {"name": "Kumar Pillai", "role": "BMW 3 Series Owner", "quote": "Finally found a workshop I can trust with my BMW. Professional service at reasonable prices. Highly recommend!", "rating": 5},
            {"name": "Michelle Wong", "role": "Mazda CX-5 Owner", "quote": "The online booking system is so convenient! I booked my appointment, dropped off my car, and it was ready by evening. Great experience!", "rating": 5},
            {"name": "Rizal Hassan", "role": "Proton X70 Owner", "quote": "They found and fixed a brake issue during the free inspection. Could have been dangerous. Thank you for your honesty and thorough work!", "rating": 5},
            {"name": "Jenny Tan", "role": "Perodua Myvi Owner", "quote": "Very satisfied with the A/C repair. My car is cool again! The mechanic took time to explain what was wrong and showed me the faulty part.", "rating": 5}
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "whatsapp_button",
        "order": 7,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Hi! I would like to inquire about your car service and book an appointment.",
          "buttonText": "Chat on WhatsApp",
          "buttonColor": "#25D366",
          "buttonSize": "lg",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true,
          "tooltipText": "Need help? Chat with us!",
          "showHeadline": true,
          "headlineText": "Questions? We are here to help!",
          "headlineColor": "#1f2937"
        }
      },
      {
        "type": "footer",
        "order": 8,
        "props": {
          "logo": "",
          "logoText": "AUTO PRO SERVICE",
          "description": "Your trusted partner for all automotive needs. Quality service, honest pricing, and customer satisfaction guaranteed since 2010.",
          "columns": [
            {
              "title": "Our Services",
              "links": [
                {"label": "Engine Repair", "url": "#services"},
                {"label": "Oil Change", "url": "#services"},
                {"label": "Brake Service", "url": "#services"},
                {"label": "A/C Service", "url": "#services"},
                {"label": "Tire Services", "url": "#services"},
                {"label": "Battery Service", "url": "#services"}
              ]
            },
            {
              "title": "Quick Links",
              "links": [
                {"label": "Book Appointment", "url": "#booking"},
                {"label": "Our Team", "url": "#why-us"},
                {"label": "Testimonials", "url": "#testimonials"},
                {"label": "Contact Us", "url": "#contact"}
              ]
            },
            {
              "title": "Contact Info",
              "links": [
                {"label": "WhatsApp: +60 12-345 6789", "url": "https://wa.me/60123456789"},
                {"label": "Email: hello@autoproservice.my", "url": "mailto:hello@autoproservice.my"},
                {"label": "Mon - Sat: 8am - 6pm", "url": "#"},
                {"label": "123 Jalan Workshop, KL", "url": "#"}
              ]
            }
          ],
          "socialLinks": [
            {"platform": "facebook", "url": "https://facebook.com/autoproservice"},
            {"platform": "instagram", "url": "https://instagram.com/autoproservice"},
            {"platform": "youtube", "url": "https://youtube.com/autoproservice"}
          ],
          "copyright": "© 2026 Auto Pro Service. All rights reserved.",
          "bgColor": "#0f172a",
          "textColor": "#e2e8f0"
        }
      }
    ]
  }'::jsonb,
  true,
  0,
  ARRAY['automotive', 'car-service', 'mechanic', 'workshop', 'repair', 'booking', 'appointment', 'auto']
);


-- FILE: 20260127110000_add_clinic_template.sql
-- Migration: Add Clinic & Healthcare Template
-- Date: 2026-01-27
-- Purpose: Create a professional clinic/healthcare template with booking, services showcase, and WhatsApp integration

INSERT INTO templates (
  id,
  name,
  slug,
  category,
  industry,
  description,
  thumbnail_url,
  preview_url,
  data,
  is_public,
  usage_count,
  tags
) VALUES (
  gen_random_uuid(),
  'Healthcare Clinic',
  'healthcare-clinic',
  'healthcare',
  'Healthcare',
  'A professional healthcare clinic template perfect for medical clinics, dental practices, aesthetic centers, and wellness clinics. Features service showcase with images, online appointment booking, patient testimonials, and WhatsApp integration. Designed to build trust and convert visitors into patients.',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=800&fit=crop',
  '{
    "seo_settings": {
      "title": "HealthFirst Clinic - Your Trusted Healthcare Partner",
      "description": "Professional healthcare services with experienced doctors. General checkups, dental care, aesthetic treatments, and more. Book your appointment online today!",
      "ogType": "website",
      "robotsIndex": true,
      "robotsFollow": true,
      "language": "en"
    },
    "theme": {
      "primaryColor": "#0891b2",
      "fontFamily": "Inter"
    },
    "elements": [
      {
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "NEW PATIENTS: Get a FREE Health Screening with your first visit!",
          "bgColor": "#0891b2",
          "textColor": "#ffffff",
          "showCountdown": false,
          "isSticky": true,
          "showCloseButton": true,
          "link": "#booking",
          "linkText": "Book Now"
        }
      },
      {
        "type": "navigation",
        "order": 1,
        "props": {
          "logo": "",
          "logoText": "HEALTHFIRST CLINIC",
          "menuItems": [
            {"label": "Services", "url": "#services"},
            {"label": "Why Us", "url": "#why-us"},
            {"label": "Testimonials", "url": "#testimonials"},
            {"label": "Book Now", "url": "#booking"}
          ],
          "ctaButton": {"text": "Book Appointment", "url": "#booking"},
          "bgColor": "#ffffff",
          "textColor": "#1e293b",
          "isSticky": true,
          "layout": "split"
        }
      },
      {
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Your Health, Our Priority",
          "subheadline": "Experienced doctors, modern facilities, and compassionate care. We are here to help you and your family stay healthy and happy.",
          "ctaText": "Book Your Appointment",
          "ctaUrl": "#booking",
          "image": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&h=1080&fit=crop",
          "bgColor": "#0f172a",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#e0f2fe",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 50,
          "buttonBgColor": "#0891b2",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "type": "product_carousel",
        "order": 3,
        "props": {
          "title": "Our Services",
          "subtitle": "Comprehensive healthcare services tailored to your needs. From general checkups to specialized treatments.",
          "products": [
            {
              "id": "svc-general",
              "code": "CLN-001",
              "name": "General Consultation",
              "description": "Comprehensive health assessments with experienced doctors. Includes physical examination, vital signs check, and medical advice.",
              "image_url": "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=600&h=400&fit=crop",
              "base_price": 80,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-dental",
              "code": "CLN-002",
              "name": "Dental Care",
              "description": "Complete dental services including cleaning, fillings, whitening, and orthodontics. Gentle care for the whole family.",
              "image_url": "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&h=400&fit=crop",
              "base_price": 120,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-aesthetic",
              "code": "CLN-003",
              "name": "Aesthetic Treatments",
              "description": "Advanced aesthetic procedures including facial treatments, laser therapy, and skin rejuvenation by certified specialists.",
              "image_url": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop",
              "base_price": 250,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-lab",
              "code": "CLN-004",
              "name": "Lab Tests & Diagnostics",
              "description": "On-site laboratory for blood tests, X-rays, ultrasound, and comprehensive health screening packages.",
              "image_url": "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&h=400&fit=crop",
              "base_price": 150,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-physio",
              "code": "CLN-005",
              "name": "Physiotherapy",
              "description": "Rehabilitation and physiotherapy sessions for sports injuries, chronic pain, and post-surgery recovery.",
              "image_url": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
              "base_price": 100,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-pediatric",
              "code": "CLN-006",
              "name": "Pediatric Care",
              "description": "Specialized care for infants, children, and adolescents. Vaccinations, growth monitoring, and childhood illness treatment.",
              "image_url": "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&h=400&fit=crop",
              "base_price": 90,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "layout": "grid",
          "columns": 3,
          "showPrice": true,
          "showDescription": true,
          "cardStyle": "shadow",
          "showAddToCart": false,
          "bgColor": "#f0f9ff",
          "textColor": "#1e293b",
          "priceColor": "#0891b2"
        }
      },
      {
        "type": "features",
        "order": 4,
        "props": {
          "variant": "grid",
          "title": "Why Choose HealthFirst Clinic?",
          "features": [
            {
              "icon": "award",
              "title": "Experienced Doctors",
              "description": "Our team of board-certified physicians brings over 20 years of combined experience across multiple specialties.",
              "image": "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=400&fit=crop"
            },
            {
              "icon": "heart",
              "title": "Patient-Centered Care",
              "description": "We listen, we care, and we put your health first. Every treatment plan is tailored to your unique needs.",
              "image": "https://images.unsplash.com/photo-1551190822-a9ce113ac100?w=600&h=400&fit=crop"
            },
            {
              "icon": "zap",
              "title": "Modern Facilities",
              "description": "State-of-the-art medical equipment and a comfortable, hygienic environment for your peace of mind.",
              "image": "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&h=400&fit=crop"
            },
            {
              "icon": "clock",
              "title": "Minimal Wait Time",
              "description": "Book online and skip the queue. Our efficient scheduling ensures you are seen promptly at your appointment time.",
              "image": "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=600&h=400&fit=crop"
            },
            {
              "icon": "shield",
              "title": "Insurance Accepted",
              "description": "We accept all major insurance panels including AIA, Prudential, Great Eastern, and government programs.",
              "image": "https://images.unsplash.com/photo-1563213126-a4273aed2016?w=600&h=400&fit=crop"
            },
            {
              "icon": "map-pin",
              "title": "Convenient Location",
              "description": "Centrally located with ample parking. Easy access via public transport. Open 7 days a week for your convenience.",
              "image": "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&h=400&fit=crop"
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "booking_form",
        "order": 5,
        "props": {
          "title": "Book Your Appointment",
          "description": "Schedule your visit online. Choose your preferred date and time, and our team will confirm your booking.",
          "nameLabel": "Full Name",
          "phoneLabel": "Phone Number",
          "emailLabel": "Email Address",
          "remarkLabel": "Reason for Visit / Preferred Doctor",
          "showName": true,
          "showPhone": true,
          "showEmail": true,
          "showRemark": true,
          "nameRequired": true,
          "phoneRequired": true,
          "emailRequired": false,
          "remarkRequired": false,
          "defaultCountryCode": "MY",
          "serviceName": "Clinic Appointment",
          "servicePrice": 0,
          "currency": "MYR",
          "duration": 30,
          "slotDuration": 30,
          "startTime": "08:00",
          "endTime": "21:00",
          "availableDays": [0, 1, 2, 3, 4, 5, 6],
          "blockedDates": [],
          "submitButtonText": "Confirm Appointment",
          "submitButtonColor": "#0891b2",
          "bgColor": "#f0f9ff",
          "google_sheets_enabled": false,
          "google_sheets_url": "",
          "requirePayment": false,
          "termsUrl": "#terms",
          "policyUrl": "#privacy"
        }
      },
      {
        "type": "testimonials",
        "order": 6,
        "props": {
          "variant": "grid",
          "title": "What Our Patients Say",
          "testimonials": [
            {"name": "Nurul Aisyah", "role": "Regular Patient", "quote": "The doctors here truly care about their patients. Dr. Lim took the time to explain everything and made me feel at ease. Best clinic experience I have had.", "rating": 5},
            {"name": "David Chen", "role": "Dental Patient", "quote": "I used to be terrified of dentists but the team here is so gentle and professional. My dental cleaning was completely painless. Highly recommend!", "rating": 5},
            {"name": "Priya Sharma", "role": "Aesthetic Patient", "quote": "Amazing results from my facial treatment! The aesthetic doctor explained every step and the results exceeded my expectations. Will definitely come back.", "rating": 5},
            {"name": "Ahmad Faiz", "role": "Parent", "quote": "We bring all three of our kids here for checkups and vaccinations. The pediatric doctor is wonderful with children - they actually look forward to their visits!", "rating": 5},
            {"name": "Lisa Tan", "role": "Physiotherapy Patient", "quote": "After my knee surgery, the physiotherapy sessions here helped me recover much faster than expected. The therapist was knowledgeable and encouraging.", "rating": 5},
            {"name": "Raj Kumar", "role": "Health Screening Patient", "quote": "Got my annual health screening done here. Very organized, minimal waiting, and the doctor explained all results thoroughly. Great value for the price.", "rating": 5}
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "whatsapp_button",
        "order": 7,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Hi! I would like to inquire about your clinic services and book an appointment.",
          "buttonText": "Chat with Us",
          "buttonColor": "#25D366",
          "buttonSize": "lg",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true,
          "tooltipText": "Need help? Chat with us!",
          "showHeadline": true,
          "headlineText": "Have questions? We are here to help!",
          "headlineColor": "#1e293b"
        }
      },
      {
        "type": "footer",
        "order": 8,
        "props": {
          "logo": "",
          "logoText": "HEALTHFIRST CLINIC",
          "description": "Your trusted healthcare partner. Providing quality medical care with compassion and excellence since 2015.",
          "columns": [
            {
              "title": "Our Services",
              "links": [
                {"label": "General Consultation", "url": "#services"},
                {"label": "Dental Care", "url": "#services"},
                {"label": "Aesthetic Treatments", "url": "#services"},
                {"label": "Lab Tests", "url": "#services"},
                {"label": "Physiotherapy", "url": "#services"},
                {"label": "Pediatric Care", "url": "#services"}
              ]
            },
            {
              "title": "Quick Links",
              "links": [
                {"label": "Book Appointment", "url": "#booking"},
                {"label": "Our Doctors", "url": "#why-us"},
                {"label": "Patient Reviews", "url": "#testimonials"},
                {"label": "Insurance Panels", "url": "#insurance"}
              ]
            },
            {
              "title": "Contact Us",
              "links": [
                {"label": "WhatsApp: +60 12-345 6789", "url": "https://wa.me/60123456789"},
                {"label": "Email: hello@healthfirstclinic.my", "url": "mailto:hello@healthfirstclinic.my"},
                {"label": "Mon - Sun: 8am - 9pm", "url": "#"},
                {"label": "45 Jalan Kesihatan, KL", "url": "#"}
              ]
            }
          ],
          "socialLinks": [
            {"platform": "facebook", "url": "https://facebook.com/healthfirstclinic"},
            {"platform": "instagram", "url": "https://instagram.com/healthfirstclinic"}
          ],
          "copyright": "© 2026 HealthFirst Clinic. All rights reserved.",
          "bgColor": "#0f172a",
          "textColor": "#e2e8f0"
        }
      }
    ]
  }'::jsonb,
  true,
  0,
  ARRAY['clinic', 'healthcare', 'medical', 'doctor', 'dental', 'aesthetic', 'booking', 'appointment', 'hospital']
);


-- FILE: 20260127120000_recreate_ebook_template.sql
-- Migration: Recreate Ebook Sales Page Template
-- Date: 2026-01-27
-- Purpose: Recreate ebook template with product showcase (add to cart), form with payment, and full section layout

-- Delete existing ebook template
DELETE FROM templates WHERE slug = 'ebook-sales-page';

-- Insert updated ebook template
INSERT INTO templates (
  id,
  name,
  slug,
  category,
  industry,
  description,
  thumbnail_url,
  preview_url,
  data,
  is_public,
  usage_count,
  tags
) VALUES (
  gen_random_uuid(),
  'Ebook Sales Page',
  'ebook-sales-page',
  'digital-products',
  'Education',
  'A high-converting ebook sales page template perfect for authors, coaches, and digital product creators. Features product showcase with add to cart, order form with payment integration, testimonials, and WhatsApp support. Designed to maximize digital product sales.',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&h=800&fit=crop',
  '{
    "seo_settings": {
      "title": "Transform Your Life - Best-Selling Ebooks & Digital Guides",
      "description": "Discover our collection of best-selling ebooks and digital guides. Practical knowledge on business, productivity, finance, and personal growth. Instant digital delivery.",
      "ogType": "product",
      "robotsIndex": true,
      "robotsFollow": true,
      "language": "en"
    },
    "theme": {
      "primaryColor": "#7c3aed",
      "fontFamily": "Inter"
    },
    "elements": [
      {
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "LAUNCH SALE: 40% OFF All Ebooks - Use Code LAUNCH40 at Checkout!",
          "bgColor": "#7c3aed",
          "textColor": "#ffffff",
          "showCountdown": true,
          "countdownLabel": "Sale ends in:",
          "countdownEndDate": "2026-03-31T23:59:59",
          "isSticky": true,
          "showCloseButton": true,
          "link": "#products",
          "linkText": "Shop Now"
        }
      },
      {
        "type": "navigation",
        "order": 1,
        "props": {
          "logo": "",
          "logoText": "BOOKWISE",
          "menuItems": [
            {"label": "Ebooks", "url": "#products"},
            {"label": "Why Us", "url": "#why-us"},
            {"label": "Reviews", "url": "#testimonials"},
            {"label": "Order Now", "url": "#order"}
          ],
          "ctaButton": {"text": "Get Your Copy", "url": "#order"},
          "bgColor": "#ffffff",
          "textColor": "#1e293b",
          "isSticky": true,
          "layout": "split"
        }
      },
      {
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Unlock Your Full Potential",
          "subheadline": "Best-selling ebooks packed with actionable strategies for business, productivity, and personal growth. Join 10,000+ readers who transformed their lives.",
          "ctaText": "Browse Collection",
          "ctaUrl": "#products",
          "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop",
          "bgColor": "#1e1b4b",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#e0e7ff",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 45,
          "buttonBgColor": "#7c3aed",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "type": "product_carousel",
        "order": 3,
        "props": {
          "title": "Our Ebook Collection",
          "subtitle": "Practical guides written by industry experts. Instant PDF download after purchase.",
          "products": [
            {
              "id": "ebook-business",
              "code": "EBK-001",
              "name": "The Startup Blueprint",
              "description": "A step-by-step guide to launching your business from zero. Covers validation, funding, marketing, and scaling. 250+ pages of actionable advice.",
              "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop",
              "base_price": 49,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "ebook-productivity",
              "code": "EBK-002",
              "name": "Peak Productivity System",
              "description": "Master time management, eliminate distractions, and 10x your output. Includes templates, checklists, and daily planners.",
              "image_url": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop",
              "base_price": 39,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "ebook-finance",
              "code": "EBK-003",
              "name": "Financial Freedom Guide",
              "description": "Learn to budget, invest, and build wealth from scratch. Covers stocks, property, crypto, and passive income strategies for Malaysians.",
              "image_url": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop",
              "base_price": 59,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "ebook-marketing",
              "code": "EBK-004",
              "name": "Digital Marketing Mastery",
              "description": "Complete guide to social media marketing, SEO, email campaigns, and paid ads. Real case studies and proven frameworks.",
              "image_url": "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=400&fit=crop",
              "base_price": 45,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "ebook-mindset",
              "code": "EBK-005",
              "name": "Mindset Shift",
              "description": "Transform your thinking, overcome limiting beliefs, and develop an unstoppable growth mindset. Backed by psychology and neuroscience.",
              "image_url": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop",
              "base_price": 35,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "ebook-bundle",
              "code": "EBK-006",
              "name": "Complete Bundle (All 5 Books)",
              "description": "Get all 5 ebooks at a massive discount! Save over 50% compared to buying individually. The ultimate self-improvement library.",
              "image_url": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop",
              "base_price": 99,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "layout": "grid",
          "columns": 3,
          "showPrice": true,
          "showDescription": true,
          "cardStyle": "shadow",
          "showAddToCart": true,
          "addToCartButtonColor": "#7c3aed",
          "addToCartButtonText": "Add to Cart",
          "bgColor": "#faf5ff",
          "textColor": "#1e1b4b",
          "priceColor": "#7c3aed"
        }
      },
      {
        "type": "features",
        "order": 4,
        "props": {
          "variant": "grid",
          "title": "Why Choose BookWise?",
          "features": [
            {
              "icon": "zap",
              "title": "Instant Digital Delivery",
              "description": "Get your ebook immediately after purchase. Download as PDF and start reading in minutes on any device.",
              "image": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop"
            },
            {
              "icon": "award",
              "title": "Expert Authors",
              "description": "Written by industry professionals and successful entrepreneurs with real-world experience and proven results.",
              "image": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
            },
            {
              "icon": "refresh-cw",
              "title": "Lifetime Updates",
              "description": "Every ebook purchase includes free lifetime updates. As we improve and expand content, you get the latest version.",
              "image": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop"
            },
            {
              "icon": "shield",
              "title": "30-Day Money Back",
              "description": "Not satisfied? Get a full refund within 30 days, no questions asked. We stand behind the quality of our content.",
              "image": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop"
            },
            {
              "icon": "book-open",
              "title": "Actionable Content",
              "description": "No fluff or filler. Every chapter includes practical exercises, templates, and step-by-step action plans you can use immediately.",
              "image": "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&h=400&fit=crop"
            },
            {
              "icon": "users",
              "title": "Community Access",
              "description": "Join our exclusive reader community for discussions, accountability, and networking with like-minded individuals.",
              "image": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop"
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "form_with_payment",
        "order": 5,
        "props": {
          "title": "Order Your Ebooks Now",
          "description": "Fill in your details below to complete your purchase. Instant download link will be sent to your email.",
          "nameLabel": "Full Name",
          "mobileLabel": "Phone Number",
          "emailLabel": "Email Address",
          "showName": true,
          "showMobile": true,
          "showEmail": true,
          "nameRequired": true,
          "mobileRequired": true,
          "emailRequired": true,
          "defaultCountryCode": "MY",
          "products": [
            {"id": "ebook-business", "name": "The Startup Blueprint", "description": "Complete startup guide - 250+ pages", "price": 49, "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&h=200&fit=crop", "featured": false},
            {"id": "ebook-productivity", "name": "Peak Productivity System", "description": "Time management & productivity guide", "price": 39, "image": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=200&h=200&fit=crop", "featured": false},
            {"id": "ebook-finance", "name": "Financial Freedom Guide", "description": "Investing & wealth building for Malaysians", "price": 59, "image": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=200&h=200&fit=crop", "featured": false},
            {"id": "ebook-marketing", "name": "Digital Marketing Mastery", "description": "Social media, SEO & paid ads guide", "price": 45, "image": "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=200&h=200&fit=crop", "featured": false},
            {"id": "ebook-mindset", "name": "Mindset Shift", "description": "Growth mindset & personal development", "price": 35, "image": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=200&h=200&fit=crop", "featured": false},
            {"id": "ebook-bundle", "name": "Complete Bundle (All 5 Books)", "description": "Save 50%+ - All ebooks included", "price": 99, "image": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop", "featured": true}
          ],
          "currency": "MYR",
          "submitButtonText": "Complete Purchase",
          "submitButtonColor": "#7c3aed",
          "bgColor": "#faf5ff",
          "termsUrl": "#terms",
          "policyUrl": "#privacy",
          "contactUrl": "#contact",
          "companyName": "BookWise Digital Sdn Bhd",
          "companyRegistration": "SSM: 202601012345"
        }
      },
      {
        "type": "testimonials",
        "order": 6,
        "props": {
          "variant": "grid",
          "title": "What Our Readers Say",
          "testimonials": [
            {"name": "Aiman Hakim", "role": "Entrepreneur", "quote": "The Startup Blueprint literally changed my business trajectory. I went from confused to launching my first product in 3 months. Worth every sen!", "rating": 5},
            {"name": "Jessica Ng", "role": "Marketing Manager", "quote": "Digital Marketing Mastery is hands down the best marketing ebook I have read. The frameworks are practical and I implemented them the same week.", "rating": 5},
            {"name": "Farah Nadia", "role": "Freelancer", "quote": "Peak Productivity System helped me manage my freelance work so much better. I am now earning more while working fewer hours. Incredible!", "rating": 5},
            {"name": "Daniel Lim", "role": "Fresh Graduate", "quote": "The Financial Freedom Guide opened my eyes to investing. At 25, I have already started building my portfolio thanks to this ebook.", "rating": 5},
            {"name": "Syafiq Rahman", "role": "Content Creator", "quote": "I bought the Complete Bundle and it was the best investment I made this year. Each book complements the others perfectly.", "rating": 5},
            {"name": "Mei Ling", "role": "HR Professional", "quote": "Mindset Shift is a game-changer. The exercises helped me overcome my impostor syndrome and finally go for that promotion. Got it!", "rating": 5}
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "whatsapp_button",
        "order": 7,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Hi! I am interested in your ebooks. Can I know more about the available titles?",
          "buttonText": "Ask Us Anything",
          "buttonColor": "#25D366",
          "buttonSize": "lg",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true,
          "tooltipText": "Have questions? Chat with us!",
          "showHeadline": true,
          "headlineText": "Need help choosing? We are here!",
          "headlineColor": "#1e293b"
        }
      },
      {
        "type": "footer",
        "order": 8,
        "props": {
          "logo": "",
          "logoText": "BOOKWISE",
          "description": "Empowering individuals with practical knowledge through high-quality digital books. Read, learn, and transform your life.",
          "columns": [
            {
              "title": "Our Ebooks",
              "links": [
                {"label": "The Startup Blueprint", "url": "#products"},
                {"label": "Peak Productivity System", "url": "#products"},
                {"label": "Financial Freedom Guide", "url": "#products"},
                {"label": "Digital Marketing Mastery", "url": "#products"},
                {"label": "Mindset Shift", "url": "#products"},
                {"label": "Complete Bundle", "url": "#products"}
              ]
            },
            {
              "title": "Quick Links",
              "links": [
                {"label": "Order Now", "url": "#order"},
                {"label": "Reader Reviews", "url": "#testimonials"},
                {"label": "About the Authors", "url": "#why-us"},
                {"label": "FAQ", "url": "#faq"}
              ]
            },
            {
              "title": "Support",
              "links": [
                {"label": "WhatsApp: +60 12-345 6789", "url": "https://wa.me/60123456789"},
                {"label": "Email: hello@bookwise.my", "url": "mailto:hello@bookwise.my"},
                {"label": "Refund Policy", "url": "#refund"},
                {"label": "Terms & Conditions", "url": "#terms"}
              ]
            }
          ],
          "socialLinks": [
            {"platform": "facebook", "url": "https://facebook.com/bookwisemy"},
            {"platform": "instagram", "url": "https://instagram.com/bookwisemy"},
            {"platform": "twitter", "url": "https://twitter.com/bookwisemy"}
          ],
          "copyright": "© 2026 BookWise Digital Sdn Bhd. All rights reserved.",
          "bgColor": "#1e1b4b",
          "textColor": "#e0e7ff"
        }
      }
    ]
  }'::jsonb,
  true,
  0,
  ARRAY['ebook', 'digital-product', 'book', 'education', 'course', 'download', 'pdf', 'sales-page']
);


-- FILE: 20260127130000_add_wedding_photography_template.sql
-- Wedding Photography Template
INSERT INTO templates (
  id, name, slug, category, industry, description, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Wedding Photography',
  'wedding-photography',
  'services',
  'Photography',
  'Professional wedding photography service page with packages, portfolio showcase, booking form, and payment integration.',
  true,
  ARRAY['wedding', 'photography', 'services', 'packages', 'booking', 'portfolio'],
  '{
    "elements": [
      {
        "id": "wedding-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "Book Your Dream Wedding Photography - Limited Slots Available for 2026!",
          "bgColor": "#1a1a2e",
          "textColor": "#e8d5b7",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": false
        }
      },
      {
        "id": "wedding-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "ETERNAL FRAMES",
          "logo": "",
          "menuItems": [
            { "label": "Home", "url": "#hero-2" },
            { "label": "Packages", "url": "#pricing-4" },
            { "label": "Why Us", "url": "#features-5" },
            { "label": "Book Now", "url": "#form_with_payment-6" },
            { "label": "Reviews", "url": "#testimonials-7" }
          ],
          "bgColor": "#ffffff",
          "textColor": "#1a1a2e",
          "isSticky": true,
          "layout": "left",
          "ctaButton": {
            "text": "Book Now",
            "url": "#form_with_payment-6"
          }
        }
      },
      {
        "id": "wedding-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Capturing Your Forever Moments",
          "subheadline": "Professional wedding photography that tells your unique love story. Every glance, every tear of joy, every dance move - beautifully preserved for generations.",
          "ctaText": "View Our Packages",
          "ctaUrl": "#pricing-4",
          "image": "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80",
          "bgColor": "#1a1a2e",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#e2e8f0",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 50,
          "buttonBgColor": "#8b5e3c",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "id": "wedding-pricing",
        "type": "pricing",
        "order": 4,
        "props": {
          "title": "Our Wedding Packages",
          "subtitle": "Choose the perfect package to capture every beautiful moment of your special day",
          "layout": "cards",
          "enablePaymentIntegration": false,
          "plans": [
            {
              "name": "Essential",
              "price": "2,500",
              "currency": "RM",
              "period": "event",
              "description": "Perfect for intimate weddings and solemnization ceremonies",
              "image": "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80",
              "features": [
                "4 Hours Coverage",
                "1 Photographer",
                "100+ Edited Photos",
                "Online Gallery",
                "Digital Downloads",
                "Pre-Wedding Consultation"
              ],
              "buttonText": "Choose Essential",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": false
            },
            {
              "name": "Premium",
              "price": "4,500",
              "currency": "RM",
              "period": "event",
              "description": "Complete coverage for your wedding ceremony and reception",
              "image": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
              "features": [
                "8 Hours Full Day Coverage",
                "2 Photographers",
                "300+ Edited Photos",
                "Online Gallery + USB Drive",
                "Engagement Photo Session",
                "Wedding Day Timeline Planning",
                "Same-Day Photo Preview"
              ],
              "buttonText": "Choose Premium",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": true
            },
            {
              "name": "Luxury",
              "price": "8,000",
              "currency": "RM",
              "period": "event",
              "description": "The ultimate wedding photography experience with videography",
              "image": "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
              "features": [
                "12 Hours Full Coverage",
                "2 Photographers + 1 Videographer",
                "500+ Edited Photos",
                "Cinematic Wedding Film (5-10 min)",
                "Premium Photo Album (40 pages)",
                "Drone Aerial Photography",
                "Pre-Wedding Photo + Video Session",
                "Next-Day Edit Highlight Reel"
              ],
              "buttonText": "Choose Luxury",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": false
            }
          ]
        }
      },
      {
        "id": "wedding-features",
        "type": "features",
        "order": 5,
        "props": {
          "title": "Why Choose Eternal Frames",
          "variant": "grid",
          "features": [
            {
              "icon": "sparkles",
              "title": "Award-Winning Photography",
              "description": "Our team has been recognized with multiple photography awards for creative wedding storytelling.",
              "image": "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=600&q=80"
            },
            {
              "icon": "heart",
              "title": "Candid & Natural Style",
              "description": "We specialize in capturing genuine emotions and spontaneous moments that make your day unique.",
              "image": "https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&q=80"
            },
            {
              "icon": "clock",
              "title": "Quick Turnaround",
              "description": "Receive your beautifully edited photos within 2-4 weeks. Same-day previews available for premium packages.",
              "image": "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&q=80"
            },
            {
              "icon": "users",
              "title": "Experienced Team",
              "description": "Over 500 weddings photographed with a team that understands every cultural tradition and ceremony.",
              "image": "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80"
            },
            {
              "icon": "shield",
              "title": "Backup & Security",
              "description": "Triple backup system ensures your precious memories are never lost. Cloud storage included for 1 year.",
              "image": "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80"
            },
            {
              "icon": "star",
              "title": "5-Star Reviews",
              "description": "Consistently rated 5 stars by our couples. Read real testimonials from happy newlyweds.",
              "image": "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600&q=80"
            }
          ]
        }
      },
      {
        "id": "wedding-form-payment",
        "type": "form_with_payment",
        "order": 6,
        "props": {
          "title": "Book Your Wedding Photography",
          "description": "Secure your date with a deposit. Fill in your details and select your preferred package.",
          "submitButtonText": "Book & Pay Deposit",
          "submitButtonColor": "#8b5e3c",
          "showName": true,
          "showMobile": true,
          "showEmail": true,
          "nameRequired": true,
          "mobileRequired": true,
          "emailRequired": true,
          "defaultCountryCode": "MY",
          "products": [
            {
              "id": "wedding-essential",
              "name": "Essential Package - Deposit",
              "description": "4 Hours, 1 Photographer, 100+ Photos",
              "price": 500
            },
            {
              "id": "wedding-premium",
              "name": "Premium Package - Deposit",
              "description": "8 Hours, 2 Photographers, 300+ Photos, Engagement Session",
              "price": 1000,
              "featured": true
            },
            {
              "id": "wedding-luxury",
              "name": "Luxury Package - Deposit",
              "description": "12 Hours, Photo + Video, Album, Drone, Pre-Wedding Session",
              "price": 2000
            }
          ],
          "currency": "MYR",
          "bgColor": "#faf7f2",
          "companyName": "Eternal Frames Photography",
          "companyRegistration": ""
        }
      },
      {
        "id": "wedding-testimonials",
        "type": "testimonials",
        "order": 7,
        "props": {
          "title": "What Our Couples Say",
          "variant": "grid",
          "testimonials": [
            {
              "name": "Sarah & Ahmad",
              "role": "Married Dec 2025",
              "quote": "Eternal Frames captured every emotion perfectly. From the nervous moments before the ceremony to the joyful celebrations at the reception. The photos are absolutely stunning!",
              "rating": 5
            },
            {
              "name": "Lisa & Daniel",
              "role": "Married Oct 2025",
              "quote": "We chose the Premium package and it was worth every penny. The engagement session was so much fun, and the wedding photos exceeded our expectations. Highly recommend!",
              "rating": 5
            },
            {
              "name": "Nurul & Faiz",
              "role": "Married Aug 2025",
              "quote": "The team was professional, friendly, and made us feel completely comfortable. They understood our cultural traditions perfectly and captured beautiful moments we will treasure forever.",
              "rating": 5
            },
            {
              "name": "Emily & James",
              "role": "Married Jun 2025",
              "quote": "We went with the Luxury package including videography. The cinematic wedding film made us cry happy tears all over again. The drone shots of our outdoor ceremony were breathtaking!",
              "rating": 5
            },
            {
              "name": "Priya & Raj",
              "role": "Married Apr 2025",
              "quote": "Having two photographers meant no moment was missed. While one captured the bride getting ready, the other was with the groom. The parallel storytelling in our album is incredible.",
              "rating": 5
            },
            {
              "name": "Aisha & Hafiz",
              "role": "Married Feb 2025",
              "quote": "From the pre-wedding shoot to the reception, everything was handled seamlessly. The quick turnaround meant we could share photos with family within weeks. Absolutely wonderful experience!",
              "rating": 5
            }
          ]
        }
      },
      {
        "id": "wedding-whatsapp",
        "type": "whatsapp_button",
        "order": 8,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Hi! I am interested in your wedding photography services. I would like to know more about your packages.",
          "buttonText": "Chat With Us",
          "buttonColor": "#25D366",
          "buttonSize": "md",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true
        }
      },
      {
        "id": "wedding-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "Eternal Frames Photography",
          "description": "Capturing love stories, one frame at a time",
          "copyright": "2026 Eternal Frames Photography. All rights reserved.",
          "bgColor": "#1a1a2e",
          "textColor": "#e8d5b7",
          "columns": [
            {
              "title": "Quick Links",
              "links": [
                { "label": "Packages", "url": "#pricing-4" },
                { "label": "Why Choose Us", "url": "#features-5" },
                { "label": "Book Now", "url": "#form_with_payment-6" },
                { "label": "Reviews", "url": "#testimonials-7" }
              ]
            },
            {
              "title": "Services",
              "links": [
                { "label": "Wedding Photography", "url": "#" },
                { "label": "Pre-Wedding Shoot", "url": "#" },
                { "label": "Engagement Session", "url": "#" },
                { "label": "Videography", "url": "#" }
              ]
            }
          ],
          "socialLinks": [
            { "platform": "instagram", "url": "https://instagram.com" },
            { "platform": "facebook", "url": "https://facebook.com" }
          ]
        }
      }
    ],
    "seo_settings": {
      "title": "Eternal Frames - Professional Wedding Photography",
      "description": "Capture your dream wedding with our professional photography services. From intimate ceremonies to grand celebrations, we tell your love story beautifully.",
      "keywords": "wedding photography, wedding photographer, wedding packages, bridal photography, engagement photos, wedding videography"
    },
    "theme": {
      "primaryColor": "#8b5e3c",
      "fontFamily": "Playfair Display, serif"
    }
  }'::jsonb
);


-- FILE: 20260129100000_add_saloon_template.sql
-- Saloon Template
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Saloon',
  'saloon',
  'saloon',
  'Saloon',
  'Professional saloon landing page with service showcase, booking form, testimonials, and FAQ. Perfect for hair salons, beauty parlors, and nail studios.',
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&h=800&fit=crop',
  true,
  ARRAY['saloon', 'hair salon', 'beauty', 'spa', 'nail', 'booking', 'services'],
  '{
    "elements": [
      {
        "id": "saloon-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "✨ Grand Opening Special! 30% OFF All Services - Limited Time Only",
          "bgColor": "#be185d",
          "textColor": "#ffffff",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": false
        }
      },
      {
        "id": "saloon-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "GLOW STUDIO",
          "logo": "",
          "menuItems": [
            { "label": "Services", "url": "#product_carousel-4" },
            { "label": "Reviews", "url": "#testimonials-6" },
            { "label": "FAQ", "url": "#faq-7" }
          ],
          "bgColor": "#ffffff",
          "textColor": "#1f2937",
          "isSticky": true,
          "layout": "left",
          "ctaButton": {
            "text": "Book Now",
            "url": "#booking_form-5"
          }
        }
      },
      {
        "id": "saloon-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Your Beauty, Our Passion",
          "subheadline": "Experience premium hair and beauty treatments in a relaxing environment. Our skilled stylists are dedicated to making you look and feel your best.",
          "ctaText": "Book Appointment",
          "ctaUrl": "#booking_form-5",
          "image": "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1920&q=80",
          "bgColor": "#fdf2f8",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#fce7f3",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 50,
          "buttonBgColor": "#be185d",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "id": "saloon-features",
        "type": "features",
        "order": 3,
        "props": {
          "title": "Why Choose Glow Studio?",
          "variant": "grid",
          "features": [
            {
              "icon": "sparkles",
              "title": "Expert Stylists",
              "description": "Our team of certified stylists brings years of experience and stays updated with the latest trends."
            },
            {
              "icon": "heart",
              "title": "Premium Products",
              "description": "We use only top-quality, salon-grade products to ensure the best results for your hair and skin."
            },
            {
              "icon": "shield",
              "title": "Hygienic Environment",
              "description": "Strict hygiene protocols with sanitized tools and clean workstations for your safety and comfort."
            },
            {
              "icon": "star",
              "title": "Satisfaction Guaranteed",
              "description": "Your satisfaction is our priority. We ensure every client leaves happy and confident."
            },
            {
              "icon": "clock",
              "title": "Flexible Hours",
              "description": "Open 7 days a week with extended hours to fit your busy schedule. Walk-ins welcome!"
            },
            {
              "icon": "award",
              "title": "Award-Winning Service",
              "description": "Recognised as one of the top salons in the area with multiple beauty industry awards."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "saloon-products",
        "type": "product_carousel",
        "order": 4,
        "props": {
          "title": "Our Services",
          "subtitle": "From haircuts to full makeovers, we offer a wide range of beauty treatments tailored to your needs.",
          "products": [
            {
              "id": "svc-haircut",
              "code": "SAL-001",
              "name": "Haircut & Styling",
              "description": "Professional haircut and blow-dry styling by our expert stylists. Includes consultation, wash, cut, and styling.",
              "image_url": "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&h=400&fit=crop",
              "base_price": 45,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-coloring",
              "code": "SAL-002",
              "name": "Hair Colouring",
              "description": "Full hair colouring service using premium products. Includes balayage, highlights, and full colour options.",
              "image_url": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop",
              "base_price": 150,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-treatment",
              "code": "SAL-003",
              "name": "Hair Treatment & Spa",
              "description": "Deep conditioning treatment and relaxing scalp spa to rejuvenate and nourish your hair from root to tip.",
              "image_url": "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&h=400&fit=crop",
              "base_price": 80,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "bgColor": "#fdf2f8"
        }
      },
      {
        "id": "saloon-booking",
        "type": "booking_form",
        "order": 5,
        "props": {
          "title": "Book Your Appointment",
          "description": "Reserve your slot online. Pick your preferred date and time and we will confirm your booking.",
          "nameLabel": "Full Name",
          "phoneLabel": "Phone Number",
          "emailLabel": "Email Address",
          "remarkLabel": "Preferred Service / Stylist",
          "showName": true,
          "showPhone": true,
          "showEmail": true,
          "showRemark": true,
          "nameRequired": true,
          "phoneRequired": true,
          "emailRequired": false,
          "remarkRequired": false,
          "defaultCountryCode": "MY",
          "serviceName": "Salon Appointment",
          "servicePrice": 0,
          "currency": "MYR",
          "duration": 60,
          "slotDuration": 60,
          "startTime": "10:00",
          "endTime": "20:00",
          "availableDays": [0, 1, 2, 3, 4, 5, 6],
          "blockedDates": [],
          "submitButtonText": "Confirm Booking",
          "submitButtonColor": "#be185d",
          "bgColor": "#ffffff",
          "google_sheets_enabled": false
        }
      },
      {
        "id": "saloon-testimonials",
        "type": "testimonials",
        "order": 6,
        "props": {
          "title": "What Our Clients Say",
          "variant": "grid",
          "testimonials": [
            {
              "name": "Aisyah Rahman",
              "role": "Regular Client",
              "quote": "The best salon experience I have ever had! The stylist understood exactly what I wanted and the result was gorgeous. Will definitely be coming back.",
              "rating": 5
            },
            {
              "name": "Michelle Tan",
              "role": "Hair Colouring Client",
              "quote": "I was nervous about colouring my hair for the first time but the team made me feel so comfortable. The balayage turned out perfect! Highly recommend.",
              "rating": 5
            },
            {
              "name": "Priya Devi",
              "role": "Bridal Package Client",
              "quote": "Had my bridal hair and makeup done here. The team was so professional and patient. I felt like a princess on my big day. Thank you Glow Studio!",
              "rating": 5
            }
          ],
          "bgColor": "#fdf2f8"
        }
      },
      {
        "id": "saloon-faq",
        "type": "faq",
        "order": 7,
        "props": {
          "title": "Frequently Asked Questions",
          "variant": "single_column",
          "questions": [
            {
              "question": "Do I need to book an appointment?",
              "answer": "We recommend booking an appointment to secure your preferred time slot, but walk-ins are also welcome subject to availability."
            },
            {
              "question": "How long does a hair colouring session take?",
              "answer": "A full hair colouring session typically takes 2-3 hours depending on the technique and hair length. Highlights or balayage may take slightly longer."
            },
            {
              "question": "What products do you use?",
              "answer": "We use premium salon-grade products from trusted brands to ensure the best results and minimal damage to your hair."
            },
            {
              "question": "Do you offer packages for weddings or events?",
              "answer": "Yes! We offer special bridal and event packages that include hair styling, makeup, and trial sessions. Contact us for customised packages."
            },
            {
              "question": "What is your cancellation policy?",
              "answer": "We kindly request at least 24 hours notice for cancellations. Late cancellations or no-shows may incur a small fee."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "saloon-cta",
        "type": "cta",
        "order": 8,
        "props": {
          "variant": "centered",
          "headline": "Ready for a New Look?",
          "description": "Book your appointment today and let our expert stylists transform your look. Walk-ins welcome!",
          "buttonText": "Book Now",
          "buttonUrl": "#booking_form-5",
          "bgGradient": "linear-gradient(135deg, #be185d 0%, #9d174d 100%)"
        }
      },
      {
        "id": "saloon-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "GLOW STUDIO",
          "description": "Your one-stop beauty destination for hair, skin, and nails.",
          "copyright": "2026 Glow Studio. All rights reserved.",
          "bgColor": "#1f2937",
          "textColor": "#f9fafb",
          "columns": [
            {
              "title": "Quick Links",
              "links": [
                { "label": "Services", "url": "#product_carousel-4" },
                { "label": "Book Appointment", "url": "#booking_form-5" },
                { "label": "Reviews", "url": "#testimonials-6" },
                { "label": "FAQ", "url": "#faq-7" }
              ]
            },
            {
              "title": "Operating Hours",
              "links": [
                { "label": "Mon - Fri: 10am - 8pm", "url": "#" },
                { "label": "Sat - Sun: 10am - 6pm", "url": "#" },
                { "label": "Public Holidays: Closed", "url": "#" }
              ]
            }
          ],
          "socialLinks": [
            { "platform": "instagram", "url": "https://instagram.com" },
            { "platform": "facebook", "url": "https://facebook.com" }
          ]
        }
      }
    ],
    "seo_settings": {
      "title": "Glow Studio - Premium Hair & Beauty Salon",
      "description": "Experience premium hair and beauty treatments at Glow Studio. Expert stylists, top-quality products, and a relaxing environment. Book your appointment today!",
      "keywords": "hair salon, beauty salon, haircut, hair colouring, hair treatment, beauty parlor, salon appointment"
    },
    "theme": {
      "primaryColor": "#be185d",
      "fontFamily": "Inter"
    }
  }'::jsonb
);


-- FILE: 20260129110000_add_kuih_raya_template.sql
-- Kuih Raya Template (E-commerce)
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Kuih Raya',
  'kuih-raya',
  'ecommerce',
  'Food & Beverage',
  'Beautiful e-commerce template for selling Kuih Raya, cookies, and festive treats. Includes product showcase, order form with payment, testimonials, and FAQ.',
  'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1200&h=800&fit=crop',
  true,
  ARRAY['kuih raya', 'cookies', 'raya', 'food', 'ecommerce', 'hari raya', 'bakery', 'malaysia'],
  '{
    "elements": [
      {
        "id": "kuih-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "🌙 Pre-Order Kuih Raya 2026 Kini Dibuka! Penghantaran Percuma Untuk Pesanan RM150+",
          "bgColor": "#b45309",
          "textColor": "#ffffff",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": true,
          "countdownLabel": "Tarikh tutup tempahan:",
          "countdownEndDate": "2026-03-15T23:59:59"
        }
      },
      {
        "id": "kuih-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "DAPUR RAYA",
          "logo": "",
          "menuItems": [
            { "label": "Koleksi", "url": "#product_carousel-4" },
            { "label": "Testimoni", "url": "#testimonials-6" },
            { "label": "Soalan Lazim", "url": "#faq-7" }
          ],
          "bgColor": "#ffffff",
          "textColor": "#1f2937",
          "isSticky": true,
          "layout": "left",
          "ctaButton": {
            "text": "Tempah Sekarang",
            "url": "#form_with_payment-5"
          }
        }
      },
      {
        "id": "kuih-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Koleksi Kuih Raya 2026",
          "subheadline": "Kuih raya homemade berkualiti tinggi diperbuat daripada bahan-bahan premium. Sempurna untuk hidangan Hari Raya dan buah tangan istimewa.",
          "ctaText": "Lihat Koleksi",
          "ctaUrl": "#product_carousel-4",
          "image": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1920&q=80",
          "bgColor": "#fffbeb",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#fef3c7",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 50,
          "buttonBgColor": "#b45309",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "id": "kuih-features",
        "type": "features",
        "order": 3,
        "props": {
          "title": "Kenapa Pilih Dapur Raya?",
          "variant": "grid",
          "features": [
            {
              "icon": "sparkles",
              "title": "100% Homemade",
              "description": "Setiap kuih dibuat dengan tangan menggunakan resipi turun-temurun yang terjamin rasanya."
            },
            {
              "icon": "award",
              "title": "Bahan Premium",
              "description": "Kami hanya menggunakan mentega, tepung, dan bahan berkualiti tinggi tanpa pengawet tiruan."
            },
            {
              "icon": "rocket",
              "title": "Penghantaran Selamat",
              "description": "Pembungkusan kemas dan selamat untuk memastikan kuih sampai dalam keadaan sempurna."
            },
            {
              "icon": "shield",
              "title": "Jaminan Kualiti",
              "description": "Setiap balang melalui kawalan kualiti ketat. Wang dikembalikan jika tidak berpuas hati."
            },
            {
              "icon": "gift",
              "title": "Pembungkusan Cantik",
              "description": "Sesuai untuk dijadikan hadiah dengan pembungkusan eksklusif dan tag ucapan Raya percuma."
            },
            {
              "icon": "heart",
              "title": "Dibuat Dengan Kasih Sayang",
              "description": "Lebih 10 tahun pengalaman membuat kuih raya untuk pelanggan setia di seluruh Malaysia."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "kuih-products",
        "type": "product_carousel",
        "order": 4,
        "props": {
          "title": "Koleksi Kuih Raya Kami",
          "subtitle": "Pilih dari pelbagai jenis kuih raya tradisional dan moden kegemaran anda.",
          "products": [
            {
              "id": "kuih-tart",
              "code": "KR-001",
              "name": "Tart Nenas Premium",
              "description": "Tart nenas rangup dengan jem nenas asli. Dibakar sempurna dengan mentega berkualiti tinggi. Kegemaran No.1 setiap Raya!",
              "image_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
              "base_price": 35,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "kuih-makmur",
              "code": "KR-002",
              "name": "Kuih Makmur Istimewa",
              "description": "Kuih makmur lembut yang hancur di mulut dengan inti kacang tanah rangup. Resipi warisan nenek yang tidak berubah.",
              "image_url": "https://images.unsplash.com/photo-1486427944544-d2c246c4df14?w=600&h=400&fit=crop",
              "base_price": 28,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "kuih-semperit",
              "code": "KR-003",
              "name": "Semperit Susu",
              "description": "Biskut semperit yang lembut dan cair di mulut. Diperbuat daripada susu segar dan mentega tulen. Sesuai untuk semua peringkat umur.",
              "image_url": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&h=400&fit=crop",
              "base_price": 25,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "bgColor": "#fffbeb"
        }
      },
      {
        "id": "kuih-form-payment",
        "type": "form_with_payment",
        "order": 5,
        "props": {
          "title": "Borang Tempahan",
          "description": "Isikan maklumat anda dan pilih kuih raya kegemaran untuk meneruskan tempahan.",
          "nameLabel": "Nama Penuh",
          "mobileLabel": "No. Telefon",
          "emailLabel": "Email",
          "showName": true,
          "showMobile": true,
          "showEmail": true,
          "nameRequired": true,
          "mobileRequired": true,
          "emailRequired": false,
          "defaultCountryCode": "MY",
          "products": [
            {
              "id": "tart-nenas",
              "name": "Tart Nenas Premium",
              "description": "1 balang (50 biji)",
              "price": 35
            },
            {
              "id": "kuih-makmur",
              "name": "Kuih Makmur Istimewa",
              "description": "1 balang (40 biji)",
              "price": 28
            },
            {
              "id": "semperit-susu",
              "name": "Semperit Susu",
              "description": "1 balang (50 biji)",
              "price": 25
            }
          ],
          "currency": "MYR",
          "submitButtonText": "Teruskan Pembayaran",
          "submitButtonColor": "#b45309",
          "bgColor": "#ffffff",
          "companyName": "Dapur Raya",
          "companyRegistration": ""
        }
      },
      {
        "id": "kuih-testimonials",
        "type": "testimonials",
        "order": 6,
        "props": {
          "title": "Apa Kata Pelanggan Kami",
          "variant": "grid",
          "testimonials": [
            {
              "name": "Kak Nora",
              "role": "Pelanggan Setia 5 Tahun",
              "quote": "Setiap tahun memang order sini. Tart nenas dia memang terbaik! Rangup dan jem nenas pekat. Tetamu rumah terbuka selalu tanya beli mana.",
              "rating": 5
            },
            {
              "name": "Siti Hajar",
              "role": "Kuala Lumpur",
              "quote": "First time order dan terus jatuh cinta! Kuih makmur dia betul-betul hancur di mulut. Packaging pun cantik, sesuai untuk bagi hadiah.",
              "rating": 5
            },
            {
              "name": "Puan Azizah",
              "role": "Johor Bahru",
              "quote": "Order 10 balang untuk bagi saudara-mara. Semua puji! Penghantaran pun cepat dan selamat sampai. Memang recommended!",
              "rating": 5
            }
          ],
          "bgColor": "#fffbeb"
        }
      },
      {
        "id": "kuih-faq",
        "type": "faq",
        "order": 7,
        "props": {
          "title": "Soalan Lazim",
          "variant": "single_column",
          "questions": [
            {
              "question": "Bila tarikh tutup tempahan?",
              "answer": "Tempahan ditutup 2 minggu sebelum Hari Raya atau apabila kuota penuh. Kami sarankan untuk tempah awal bagi mengelakkan kekecewaan."
            },
            {
              "question": "Berapa lama jangka hayat kuih?",
              "answer": "Kuih raya kami tahan sehingga 3-4 minggu jika disimpan dalam bekas kedap udara pada suhu bilik. Lebih tahan lama jika disimpan dalam peti sejuk."
            },
            {
              "question": "Adakah penghantaran tersedia ke seluruh Malaysia?",
              "answer": "Ya! Kami menghantar ke seluruh Semenanjung Malaysia (2-3 hari) dan Sabah & Sarawak (5-7 hari). Penghantaran percuma untuk pesanan RM150 ke atas."
            },
            {
              "question": "Boleh buat tempahan pukal untuk corporate?",
              "answer": "Boleh! Kami menerima tempahan pukal untuk syarikat dan majlis. Hubungi kami melalui WhatsApp untuk harga istimewa."
            },
            {
              "question": "Adakah kuih mengandungi bahan allergen?",
              "answer": "Kuih kami mengandungi mentega, susu, tepung gandum, dan kacang. Sila maklumkan jika anda mempunyai sebarang alergi."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "kuih-cta",
        "type": "cta",
        "order": 8,
        "props": {
          "variant": "centered",
          "headline": "Jangan Lepaskan Peluang!",
          "description": "Tempah kuih raya premium kami sekarang sebelum kehabisan. Penghantaran percuma untuk pesanan RM150+!",
          "buttonText": "Tempah Sekarang",
          "buttonUrl": "#form_with_payment-5",
          "bgGradient": "linear-gradient(135deg, #b45309 0%, #92400e 100%)"
        }
      },
      {
        "id": "kuih-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "DAPUR RAYA",
          "description": "Kuih raya homemade berkualiti tinggi untuk keluarga tercinta.",
          "copyright": "2026 Dapur Raya. Hakcipta terpelihara.",
          "bgColor": "#1f2937",
          "textColor": "#f9fafb",
          "columns": [
            {
              "title": "Pautan Pantas",
              "links": [
                { "label": "Koleksi Kuih", "url": "#product_carousel-4" },
                { "label": "Tempah Sekarang", "url": "#form_with_payment-5" },
                { "label": "Testimoni", "url": "#testimonials-6" },
                { "label": "Soalan Lazim", "url": "#faq-7" }
              ]
            },
            {
              "title": "Hubungi Kami",
              "links": [
                { "label": "WhatsApp: +60 12-345 6789", "url": "https://wa.me/60123456789" },
                { "label": "Email: hello@dapurraya.my", "url": "mailto:hello@dapurraya.my" }
              ]
            }
          ],
          "socialLinks": [
            { "platform": "instagram", "url": "https://instagram.com" },
            { "platform": "facebook", "url": "https://facebook.com" }
          ]
        }
      }
    ],
    "seo_settings": {
      "title": "Dapur Raya - Koleksi Kuih Raya Premium 2026",
      "description": "Tempah kuih raya homemade berkualiti tinggi. Tart nenas, kuih makmur, semperit dan banyak lagi. Penghantaran ke seluruh Malaysia.",
      "keywords": "kuih raya, tart nenas, kuih makmur, semperit, biskut raya, hari raya, tempah kuih raya"
    },
    "theme": {
      "primaryColor": "#b45309",
      "fontFamily": "Inter"
    }
  }'::jsonb
);


-- FILE: 20260129120000_add_barbershop_template.sql
-- Barbershop Template
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Barbershop',
  'barbershop',
  'barber',
  'Barber',
  'Modern barbershop landing page with service showcase, booking form, testimonials, and FAQ. Perfect for barbershops, men grooming studios, and hair studios.',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&h=800&fit=crop',
  true,
  ARRAY['barbershop', 'barber', 'haircut', 'grooming', 'men', 'fade', 'booking'],
  '{
    "elements": [
      {
        "id": "barber-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "💈 Walk-ins Welcome! First-Time Customers Get 20% OFF",
          "bgColor": "#1c1917",
          "textColor": "#fbbf24",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": false
        }
      },
      {
        "id": "barber-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "THE SHARP EDGE",
          "logo": "",
          "menuItems": [
            { "label": "Services", "url": "#product_carousel-4" },
            { "label": "Reviews", "url": "#testimonials-6" },
            { "label": "FAQ", "url": "#faq-7" }
          ],
          "bgColor": "#1c1917",
          "textColor": "#fafaf9",
          "isSticky": true,
          "layout": "left",
          "ctaButton": {
            "text": "Book Now",
            "url": "#booking_form-5"
          }
        }
      },
      {
        "id": "barber-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Where Style Meets Precision",
          "subheadline": "Premium grooming experience for the modern gentleman. Expert barbers, classic techniques, and a welcoming atmosphere.",
          "ctaText": "Book Your Cut",
          "ctaUrl": "#booking_form-5",
          "image": "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1920&q=80",
          "bgColor": "#1c1917",
          "headlineColor": "#fbbf24",
          "subheadlineColor": "#e7e5e4",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 45,
          "buttonBgColor": "#fbbf24",
          "buttonTextColor": "#1c1917",
          "showCtaButton": true
        }
      },
      {
        "id": "barber-features",
        "type": "features",
        "order": 3,
        "props": {
          "title": "Why Choose The Sharp Edge?",
          "variant": "grid",
          "features": [
            {
              "icon": "award",
              "title": "Master Barbers",
              "description": "Our barbers are highly skilled professionals with years of experience in classic and modern cutting techniques."
            },
            {
              "icon": "sparkles",
              "title": "Premium Products",
              "description": "We use only top-tier grooming products to ensure the best results and a luxury experience every visit."
            },
            {
              "icon": "clock",
              "title": "No Long Waits",
              "description": "Book your slot online and walk right in. We respect your time with efficient scheduling and punctual service."
            },
            {
              "icon": "shield",
              "title": "Clean & Hygienic",
              "description": "Sterilised tools, fresh towels, and a spotless environment. Your health and comfort are our top priority."
            },
            {
              "icon": "users",
              "title": "All Ages Welcome",
              "description": "From kids to seniors, we cater to all ages with specialised cuts and grooming services for everyone."
            },
            {
              "icon": "star",
              "title": "5-Star Rated",
              "description": "Consistently rated 5 stars by our customers. Experience the service that keeps them coming back."
            }
          ],
          "bgColor": "#fafaf9"
        }
      },
      {
        "id": "barber-products",
        "type": "product_carousel",
        "order": 4,
        "props": {
          "title": "Our Services",
          "subtitle": "From classic cuts to modern fades, we offer a full range of grooming services for the modern man.",
          "products": [
            {
              "id": "svc-haircut",
              "code": "BAR-001",
              "name": "Classic Haircut & Fade",
              "description": "Precision haircut with your choice of fade style. Includes wash, cut, styling, and hot towel finish.",
              "image_url": "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=400&fit=crop",
              "base_price": 35,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-beard",
              "code": "BAR-002",
              "name": "Beard Trim & Grooming",
              "description": "Professional beard shaping, trimming, and grooming with hot towel treatment and premium beard oil application.",
              "image_url": "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop",
              "base_price": 25,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-combo",
              "code": "BAR-003",
              "name": "The Full Experience",
              "description": "Complete grooming package including haircut, beard trim, hot towel facial, scalp massage, and hair styling.",
              "image_url": "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&h=400&fit=crop",
              "base_price": 55,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "bgColor": "#f5f5f4"
        }
      },
      {
        "id": "barber-booking",
        "type": "booking_form",
        "order": 5,
        "props": {
          "title": "Book Your Appointment",
          "description": "Reserve your seat and skip the wait. Choose your preferred date, time, and barber.",
          "nameLabel": "Full Name",
          "phoneLabel": "Phone Number",
          "emailLabel": "Email Address",
          "remarkLabel": "Preferred Barber / Service",
          "showName": true,
          "showPhone": true,
          "showEmail": true,
          "showRemark": true,
          "nameRequired": true,
          "phoneRequired": true,
          "emailRequired": false,
          "remarkRequired": false,
          "defaultCountryCode": "MY",
          "serviceName": "Barber Appointment",
          "servicePrice": 0,
          "currency": "MYR",
          "duration": 45,
          "slotDuration": 45,
          "startTime": "10:00",
          "endTime": "21:00",
          "availableDays": [0, 1, 2, 3, 4, 5, 6],
          "blockedDates": [],
          "submitButtonText": "Confirm Booking",
          "submitButtonColor": "#fbbf24",
          "submitButtonTextColor": "#1c1917",
          "bgColor": "#ffffff",
          "google_sheets_enabled": false
        }
      },
      {
        "id": "barber-testimonials",
        "type": "testimonials",
        "order": 6,
        "props": {
          "title": "What Our Clients Say",
          "variant": "grid",
          "testimonials": [
            {
              "name": "Adam Razak",
              "role": "Regular Client",
              "quote": "Best barbershop in town! The attention to detail on my fade is always on point. The hot towel finish is the cherry on top. Highly recommend!",
              "rating": 5
            },
            {
              "name": "Danish Hakim",
              "role": "First-Time Client",
              "quote": "First time here and I am already a loyal customer. The barber took time to understand what I wanted and delivered perfectly. Great vibe too!",
              "rating": 5
            },
            {
              "name": "Ryan Lee",
              "role": "Beard Grooming Client",
              "quote": "Finally found a place that knows how to handle beards properly. The beard trim and grooming service is top notch. My beard has never looked this good.",
              "rating": 5
            }
          ],
          "bgColor": "#f5f5f4"
        }
      },
      {
        "id": "barber-faq",
        "type": "faq",
        "order": 7,
        "props": {
          "title": "Frequently Asked Questions",
          "variant": "single_column",
          "questions": [
            {
              "question": "Do I need to book an appointment?",
              "answer": "We recommend booking online to secure your slot, but walk-ins are always welcome. Booking ensures no waiting time."
            },
            {
              "question": "How long does a haircut take?",
              "answer": "A standard haircut takes about 30-45 minutes. The Full Experience package takes approximately 60-75 minutes."
            },
            {
              "question": "Do you offer services for kids?",
              "answer": "Yes! We welcome kids aged 5 and above. Our barbers are experienced with children and make the experience fun and comfortable."
            },
            {
              "question": "What payment methods do you accept?",
              "answer": "We accept cash, debit/credit cards, and e-wallets including Touch n Go, GrabPay, and DuitNow QR."
            },
            {
              "question": "Can I request a specific barber?",
              "answer": "Absolutely! When booking online, you can select your preferred barber. You can also mention it in the remarks field."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "barber-cta",
        "type": "cta",
        "order": 8,
        "props": {
          "variant": "centered",
          "headline": "Ready for a Fresh Cut?",
          "description": "Book your appointment now and experience the best grooming service in town. Walk-ins also welcome!",
          "buttonText": "Book Your Slot",
          "buttonUrl": "#booking_form-5",
          "bgGradient": "linear-gradient(135deg, #1c1917 0%, #292524 100%)"
        }
      },
      {
        "id": "barber-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "THE SHARP EDGE",
          "description": "Premium barbershop for the modern gentleman.",
          "copyright": "2026 The Sharp Edge. All rights reserved.",
          "bgColor": "#1c1917",
          "textColor": "#fafaf9",
          "columns": [
            {
              "title": "Quick Links",
              "links": [
                { "label": "Services", "url": "#product_carousel-4" },
                { "label": "Book Appointment", "url": "#booking_form-5" },
                { "label": "Reviews", "url": "#testimonials-6" },
                { "label": "FAQ", "url": "#faq-7" }
              ]
            },
            {
              "title": "Operating Hours",
              "links": [
                { "label": "Mon - Sat: 10am - 9pm", "url": "#" },
                { "label": "Sunday: 10am - 6pm", "url": "#" },
                { "label": "Public Holidays: 10am - 4pm", "url": "#" }
              ]
            }
          ],
          "socialLinks": [
            { "platform": "instagram", "url": "https://instagram.com" },
            { "platform": "facebook", "url": "https://facebook.com" },
            { "platform": "tiktok", "url": "https://tiktok.com" }
          ]
        }
      }
    ],
    "seo_settings": {
      "title": "The Sharp Edge - Premium Barbershop",
      "description": "Experience premium grooming at The Sharp Edge. Expert barbers, classic and modern cuts, beard grooming, and a welcoming atmosphere. Book your appointment today!",
      "keywords": "barbershop, barber, haircut, fade, beard trim, grooming, men haircut, barber near me"
    },
    "theme": {
      "primaryColor": "#fbbf24",
      "fontFamily": "Inter"
    }
  }'::jsonb
);


-- FILE: 20260129130000_add_digital_marketing_course_template.sql
-- Digital Marketing Course Template (Digital Products)
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Digital Marketing Course',
  'digital-marketing-course',
  'digital-products',
  'Education',
  'Professional digital marketing course landing page with tiered product sets, payment form, testimonials, and FAQ. Perfect for online courses, workshops, and digital education products.',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
  true,
  ARRAY['digital marketing', 'course', 'online learning', 'education', 'digital products', 'marketing', 'bundle'],
  '{
    "elements": [
      {
        "id": "dmc-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "🔥 Early Bird Offer! Enroll Now & Save Up To 40% - Limited Slots Available",
          "bgColor": "#4f46e5",
          "textColor": "#ffffff",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": true,
          "countdownLabel": "Offer ends in:",
          "countdownEndDate": "2026-03-31T23:59:59"
        }
      },
      {
        "id": "dmc-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "MARKETPRO ACADEMY",
          "logo": "",
          "menuItems": [
            { "label": "Packages", "url": "#product_carousel-4" },
            { "label": "Reviews", "url": "#testimonials-7" },
            { "label": "FAQ", "url": "#faq-6" }
          ],
          "bgColor": "#ffffff",
          "textColor": "#1f2937",
          "isSticky": true,
          "layout": "left",
          "ctaButton": {
            "text": "Enroll Now",
            "url": "#form_with_payment-5"
          }
        }
      },
      {
        "id": "dmc-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Master Digital Marketing in 30 Days",
          "subheadline": "Learn proven strategies to grow any business online. From social media mastery to paid ads and SEO — everything you need to become a digital marketing expert.",
          "ctaText": "View Packages",
          "ctaUrl": "#product_carousel-4",
          "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80",
          "bgColor": "#eef2ff",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#e0e7ff",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 45,
          "buttonBgColor": "#4f46e5",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "id": "dmc-features",
        "type": "features",
        "order": 3,
        "props": {
          "title": "Why Choose MarketPro Academy?",
          "variant": "grid",
          "features": [
            {
              "icon": "video",
              "title": "50+ Video Lessons",
              "description": "Comprehensive video modules covering every aspect of digital marketing, from beginner to advanced strategies."
            },
            {
              "icon": "award",
              "title": "Industry-Certified",
              "description": "Get a recognised certificate upon completion. Boost your resume and showcase your digital marketing expertise."
            },
            {
              "icon": "users",
              "title": "Private Community",
              "description": "Join an exclusive community of students and marketers. Network, share ideas, and grow together."
            },
            {
              "icon": "zap",
              "title": "Actionable Templates",
              "description": "Ready-to-use templates for ads, content calendars, email campaigns, and more. Start implementing immediately."
            },
            {
              "icon": "headphones",
              "title": "Lifetime Support",
              "description": "Get ongoing support from our team of experts. Ask questions, get feedback, and stay on track."
            },
            {
              "icon": "refresh-cw",
              "title": "Lifetime Updates",
              "description": "Digital marketing evolves fast. Get free lifetime access to all future course updates and new modules."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "dmc-products",
        "type": "product_carousel",
        "order": 4,
        "props": {
          "title": "Choose Your Package",
          "subtitle": "Select the package that fits your learning goals. All packages include lifetime access to course materials.",
          "products": [
            {
              "id": "set-1",
              "code": "DMC-001",
              "name": "Set 1 — Starter",
              "description": "Perfect for beginners. Get the core modules covering social media marketing, content strategy, and basic SEO. Includes 20+ video lessons and starter templates.",
              "image_url": "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=400&fit=crop",
              "base_price": 149,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "set-2",
              "code": "DMC-002",
              "name": "Set 2 — Professional",
              "description": "Everything in Starter plus advanced modules on paid advertising (Meta & Google Ads), email marketing, funnel building, and analytics. 40+ video lessons included.",
              "image_url": "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop",
              "base_price": 299,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "set-3",
              "code": "DMC-003",
              "name": "Set 3 — Bundle (Complete)",
              "description": "The ultimate bundle! All modules from Starter + Professional, plus exclusive bonuses: 1-on-1 coaching session, private mastermind group, done-for-you ad templates, and lifetime community access.",
              "image_url": "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
              "base_price": 499,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "bgColor": "#eef2ff"
        }
      },
      {
        "id": "dmc-form-payment",
        "type": "form_with_payment",
        "order": 5,
        "props": {
          "title": "Enroll Now",
          "description": "Fill in your details and select your preferred package to get instant access to the course.",
          "nameLabel": "Full Name",
          "mobileLabel": "Phone Number",
          "emailLabel": "Email Address",
          "showName": true,
          "showMobile": true,
          "showEmail": true,
          "nameRequired": true,
          "mobileRequired": true,
          "emailRequired": true,
          "defaultCountryCode": "MY",
          "products": [
            {
              "id": "starter-pkg",
              "name": "Set 1 — Starter",
              "description": "Core modules, 20+ videos, starter templates",
              "price": 149
            },
            {
              "id": "pro-pkg",
              "name": "Set 2 — Professional",
              "description": "All Starter content + advanced modules, 40+ videos",
              "price": 299,
              "featured": true
            },
            {
              "id": "bundle-pkg",
              "name": "Set 3 — Bundle (Complete)",
              "description": "Everything + coaching, mastermind group, bonus templates",
              "price": 499
            }
          ],
          "currency": "MYR",
          "submitButtonText": "Enroll & Pay Now",
          "submitButtonColor": "#4f46e5",
          "bgColor": "#ffffff",
          "companyName": "MarketPro Academy",
          "companyRegistration": ""
        }
      },
      {
        "id": "dmc-faq",
        "type": "faq",
        "order": 6,
        "props": {
          "title": "Frequently Asked Questions",
          "variant": "single_column",
          "questions": [
            {
              "question": "Is this course suitable for complete beginners?",
              "answer": "Absolutely! The Starter package is designed specifically for beginners with no prior marketing experience. We start from the basics and build up."
            },
            {
              "question": "How long do I have access to the course?",
              "answer": "All packages come with lifetime access. You can learn at your own pace and revisit any module whenever you want."
            },
            {
              "question": "What is the difference between the packages?",
              "answer": "Set 1 (Starter) covers core digital marketing skills. Set 2 (Professional) adds advanced paid ads and analytics. Set 3 (Bundle) includes everything plus 1-on-1 coaching and exclusive community access."
            },
            {
              "question": "Do I get a certificate?",
              "answer": "Yes! Upon completing all modules in your package, you will receive a digital certificate that you can add to your LinkedIn profile or resume."
            },
            {
              "question": "Is there a refund policy?",
              "answer": "We offer a 7-day money-back guarantee. If you are not satisfied with the course within the first 7 days, we will refund your payment in full."
            },
            {
              "question": "Can I upgrade my package later?",
              "answer": "Yes! You can upgrade from Starter to Professional or Bundle at any time. You will only pay the difference in price."
            }
          ],
          "bgColor": "#eef2ff"
        }
      },
      {
        "id": "dmc-testimonials",
        "type": "testimonials",
        "order": 7,
        "props": {
          "title": "What Our Students Say",
          "variant": "grid",
          "testimonials": [
            {
              "name": "Amir Syafiq",
              "role": "Freelance Marketer",
              "quote": "This course completely changed my career. I went from zero knowledge to running paid ads for clients within 2 months. The templates alone are worth the investment!",
              "rating": 5
            },
            {
              "name": "Nurul Aina",
              "role": "Small Business Owner",
              "quote": "As a small business owner, I needed to learn digital marketing fast. The Bundle package gave me everything. My online sales increased by 300% in just 3 months!",
              "rating": 5
            },
            {
              "name": "Kevin Lim",
              "role": "Marketing Executive",
              "quote": "Even as someone already working in marketing, I learnt so many new strategies. The advanced ads module and funnel building section were absolute game changers.",
              "rating": 5
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "dmc-cta",
        "type": "cta",
        "order": 8,
        "props": {
          "variant": "centered",
          "headline": "Start Your Digital Marketing Journey Today",
          "description": "Join 5,000+ students who have transformed their careers and businesses. Enroll now and get instant access!",
          "buttonText": "Enroll Now",
          "buttonUrl": "#form_with_payment-5",
          "bgGradient": "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
        }
      },
      {
        "id": "dmc-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "MARKETPRO ACADEMY",
          "description": "Empowering the next generation of digital marketers.",
          "copyright": "2026 MarketPro Academy. All rights reserved.",
          "bgColor": "#1e1b4b",
          "textColor": "#e0e7ff",
          "columns": [
            {
              "title": "Quick Links",
              "links": [
                { "label": "Packages", "url": "#product_carousel-4" },
                { "label": "Enroll Now", "url": "#form_with_payment-5" },
                { "label": "FAQ", "url": "#faq-6" },
                { "label": "Reviews", "url": "#testimonials-7" }
              ]
            },
            {
              "title": "Contact Us",
              "links": [
                { "label": "Email: hello@marketproacademy.com", "url": "mailto:hello@marketproacademy.com" },
                { "label": "WhatsApp: +60 12-345 6789", "url": "https://wa.me/60123456789" }
              ]
            }
          ],
          "socialLinks": [
            { "platform": "instagram", "url": "https://instagram.com" },
            { "platform": "facebook", "url": "https://facebook.com" },
            { "platform": "youtube", "url": "https://youtube.com" }
          ]
        }
      }
    ],
    "seo_settings": {
      "title": "MarketPro Academy - Master Digital Marketing in 30 Days",
      "description": "Learn digital marketing from industry experts. Social media, paid ads, SEO, email marketing, and more. Get certified and transform your career.",
      "keywords": "digital marketing course, online marketing, social media marketing, paid ads, SEO course, marketing certification, learn marketing"
    },
    "theme": {
      "primaryColor": "#4f46e5",
      "fontFamily": "Inter"
    }
  }'::jsonb
);


-- FILE: 20260129140000_add_tyre_shop_template.sql
-- Tyre Shop Template (Automotive)
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, usage_count, tags, data
) VALUES (
  gen_random_uuid(),
  'Tyre Shop',
  'tyre-shop',
  'automotive',
  'Automotive',
  'Professional tyre shop landing page with tyre services showcase, booking form, testimonials, and WhatsApp integration. Perfect for tyre shops, tyre dealers, and wheel alignment centres.',
  'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=1200&h=800&fit=crop',
  '{
    "seo_settings": {
      "title": "TyrePro Centre - Premium Tyres & Expert Fitting",
      "description": "Quality tyres from top brands at competitive prices. Professional tyre fitting, wheel alignment, balancing, and rotation. Book your appointment today!",
      "ogType": "website",
      "robotsIndex": true,
      "robotsFollow": true,
      "language": "en"
    },
    "theme": {
      "primaryColor": "#ea580c",
      "fontFamily": "Inter"
    },
    "elements": [
      {
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "🔥 BUY 3 FREE 1 on Selected Tyres! Limited Time Offer",
          "bgColor": "#ea580c",
          "textColor": "#ffffff",
          "showCountdown": true,
          "countdownLabel": "Offer ends in:",
          "countdownEndDate": "2026-03-31T23:59:59",
          "isSticky": true,
          "showCloseButton": true,
          "link": "#booking",
          "linkText": "Book Now"
        }
      },
      {
        "type": "navigation",
        "order": 1,
        "props": {
          "logo": "",
          "logoText": "TYREPRO CENTRE",
          "menuItems": [
            {"label": "Services", "url": "#services"},
            {"label": "Why Us", "url": "#why-us"},
            {"label": "Testimonials", "url": "#testimonials"},
            {"label": "Book Now", "url": "#booking"}
          ],
          "ctaButton": {"text": "Book Appointment", "url": "#booking"},
          "bgColor": "#0f172a",
          "textColor": "#ffffff",
          "isSticky": true,
          "layout": "split"
        }
      },
      {
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Premium Tyres. Expert Fitting.",
          "subheadline": "Quality tyres from top brands at competitive prices. Professional fitting, wheel alignment, and balancing by certified technicians.",
          "ctaText": "Book Your Fitting Now",
          "ctaUrl": "#booking",
          "image": "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=1920&h=1080&fit=crop",
          "bgColor": "#0f172a",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#e2e8f0",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 45,
          "buttonBgColor": "#ea580c",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "type": "product_carousel",
        "order": 3,
        "props": {
          "title": "Our Services",
          "subtitle": "Complete tyre care solutions — from new tyre supply to alignment and balancing.",
          "products": [
            {
              "id": "svc-tyre-supply",
              "code": "TYR-001",
              "name": "Tyre Supply & Fitting",
              "description": "Wide range of tyres from top brands including Michelin, Continental, Bridgestone, and Yokohama. Professional fitting with computerised balancing included.",
              "image_url": "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=600&h=400&fit=crop",
              "base_price": 250,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-alignment",
              "code": "TYR-002",
              "name": "Wheel Alignment",
              "description": "Precision 4-wheel computerised alignment to ensure even tyre wear, better fuel efficiency, and improved handling. Suitable for all vehicle types.",
              "image_url": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
              "base_price": 80,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-balancing",
              "code": "TYR-003",
              "name": "Tyre Balancing & Rotation",
              "description": "Computerised wheel balancing and tyre rotation service to maximise tyre lifespan and ensure a smooth, vibration-free ride.",
              "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
              "base_price": 50,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-puncture",
              "code": "TYR-004",
              "name": "Puncture Repair",
              "description": "Fast and reliable puncture repair using industry-standard plug and patch methods. Emergency roadside puncture assistance also available.",
              "image_url": "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=600&h=400&fit=crop",
              "base_price": 30,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-nitrogen",
              "code": "TYR-005",
              "name": "Nitrogen Filling",
              "description": "Nitrogen tyre inflation for better pressure retention, improved fuel efficiency, and longer tyre life. Recommended for all vehicle types.",
              "image_url": "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600&h=400&fit=crop",
              "base_price": 20,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-sport-tyre",
              "code": "TYR-006",
              "name": "Performance & Sport Tyres",
              "description": "High-performance tyres for sports cars and enthusiasts. Premium brands with superior grip, handling, and durability for spirited driving.",
              "image_url": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop",
              "base_price": 500,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "layout": "grid",
          "columns": 3,
          "showPrice": true,
          "showDescription": true,
          "cardStyle": "shadow",
          "showAddToCart": false,
          "bgColor": "#f8fafc",
          "textColor": "#0f172a",
          "priceColor": "#ea580c"
        }
      },
      {
        "type": "features",
        "order": 4,
        "props": {
          "variant": "grid",
          "title": "Why Choose TyrePro Centre?",
          "features": [
            {
              "icon": "award",
              "title": "Authorised Dealer",
              "description": "Authorised dealer for top tyre brands. Every tyre comes with full manufacturer warranty and authenticity guarantee.",
              "image": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=400&fit=crop"
            },
            {
              "icon": "dollar-sign",
              "title": "Best Price Guarantee",
              "description": "We match any competitor price on the same tyre. Get the best deal without compromising on quality or service.",
              "image": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop"
            },
            {
              "icon": "check-circle",
              "title": "Certified Technicians",
              "description": "Our fitters are factory-trained and certified. Your vehicle is in safe hands with precise fitting and alignment.",
              "image": "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=600&h=400&fit=crop"
            },
            {
              "icon": "shield",
              "title": "Free Tyre Inspection",
              "description": "Complimentary tyre health check including tread depth, pressure, and sidewall condition. No appointment needed.",
              "image": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop"
            },
            {
              "icon": "clock",
              "title": "Express Service",
              "description": "Most tyre changes completed within 30 minutes. No long waits — get back on the road quickly and safely.",
              "image": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop"
            },
            {
              "icon": "truck",
              "title": "Mobile Service Available",
              "description": "Can not come to us? We come to you! Mobile tyre fitting and emergency roadside tyre service available.",
              "image": "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=600&h=400&fit=crop"
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "booking_form",
        "order": 5,
        "props": {
          "title": "Book Your Tyre Service",
          "description": "Schedule your tyre fitting or service appointment online. Choose your preferred date and time.",
          "nameLabel": "Full Name",
          "phoneLabel": "Phone Number",
          "emailLabel": "Email Address",
          "remarkLabel": "Vehicle Details & Tyre Size (e.g. Honda City 2022, 185/55R16)",
          "showName": true,
          "showPhone": true,
          "showEmail": true,
          "showRemark": true,
          "nameRequired": true,
          "phoneRequired": true,
          "emailRequired": false,
          "remarkRequired": true,
          "defaultCountryCode": "MY",
          "serviceName": "Tyre Service Appointment",
          "servicePrice": 0,
          "currency": "MYR",
          "duration": 45,
          "slotDuration": 45,
          "startTime": "09:00",
          "endTime": "18:00",
          "availableDays": [1, 2, 3, 4, 5, 6],
          "blockedDates": [],
          "submitButtonText": "Confirm Booking",
          "submitButtonColor": "#ea580c",
          "bgColor": "#f8fafc",
          "google_sheets_enabled": false,
          "google_sheets_url": "",
          "requirePayment": false
        }
      },
      {
        "type": "testimonials",
        "order": 6,
        "props": {
          "variant": "grid",
          "title": "What Our Customers Say",
          "testimonials": [
            {"name": "Hafiz Ibrahim", "role": "Proton X50 Owner", "quote": "Great selection of tyres and the fitting was done in 20 minutes! Price was cheaper than the dealer. Will definitely come back.", "rating": 5},
            {"name": "Jason Ng", "role": "Honda Civic Owner", "quote": "Had my alignment done here and the difference is night and day. Car drives straight as an arrow now. Very professional team.", "rating": 5},
            {"name": "Siti Aminah", "role": "Perodua Ativa Owner", "quote": "They helped me choose the right tyre for my budget. No pushy upselling, just honest advice. The new tyres are fantastic!", "rating": 5},
            {"name": "Raj Kumar", "role": "Toyota Hilux Owner", "quote": "Got a puncture on the highway and called their mobile service. They came within 30 minutes and fixed it on the spot. Lifesaver!", "rating": 5},
            {"name": "Aiman Zafri", "role": "BMW 320i Owner", "quote": "Best tyre shop in the area. They stock performance tyres that other shops do not carry. Fitting was precise and balanced perfectly.", "rating": 5},
            {"name": "Linda Tan", "role": "Mazda 3 Owner", "quote": "Fair pricing, fast service, and friendly staff. The nitrogen filling keeps my tyre pressure stable much longer. Highly recommend!", "rating": 5}
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "whatsapp_button",
        "order": 7,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Hi! I would like to inquire about tyre prices and book an appointment.",
          "buttonText": "Chat on WhatsApp",
          "buttonColor": "#25D366",
          "buttonSize": "lg",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true,
          "tooltipText": "Need help? Chat with us!",
          "showHeadline": true,
          "headlineText": "Questions? We are here to help!",
          "headlineColor": "#1f2937"
        }
      },
      {
        "type": "footer",
        "order": 8,
        "props": {
          "logo": "",
          "logoText": "TYREPRO CENTRE",
          "description": "Your trusted tyre specialist. Quality tyres, expert fitting, and competitive prices since 2015.",
          "columns": [
            {
              "title": "Our Services",
              "links": [
                {"label": "Tyre Supply & Fitting", "url": "#services"},
                {"label": "Wheel Alignment", "url": "#services"},
                {"label": "Tyre Balancing", "url": "#services"},
                {"label": "Puncture Repair", "url": "#services"},
                {"label": "Nitrogen Filling", "url": "#services"},
                {"label": "Performance Tyres", "url": "#services"}
              ]
            },
            {
              "title": "Quick Links",
              "links": [
                {"label": "Book Appointment", "url": "#booking"},
                {"label": "Why Choose Us", "url": "#why-us"},
                {"label": "Testimonials", "url": "#testimonials"},
                {"label": "Contact Us", "url": "#contact"}
              ]
            },
            {
              "title": "Contact Info",
              "links": [
                {"label": "WhatsApp: +60 12-345 6789", "url": "https://wa.me/60123456789"},
                {"label": "Email: hello@tyreprocentre.my", "url": "mailto:hello@tyreprocentre.my"},
                {"label": "Mon - Sat: 9am - 6pm", "url": "#"},
                {"label": "Sunday: Closed", "url": "#"}
              ]
            }
          ],
          "socialLinks": [
            {"platform": "facebook", "url": "https://facebook.com"},
            {"platform": "instagram", "url": "https://instagram.com"}
          ],
          "copyright": "© 2026 TyrePro Centre. All rights reserved.",
          "bgColor": "#0f172a",
          "textColor": "#e2e8f0"
        }
      }
    ]
  }'::jsonb,
  true,
  0,
  ARRAY['tyre', 'tire', 'wheel', 'alignment', 'balancing', 'automotive', 'car', 'fitting']
);


-- FILE: 20260129150000_add_towing_provider_template.sql
-- Towing Provider Template (Automotive)
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, usage_count, tags, data
) VALUES (
  gen_random_uuid(),
  'Towing Provider',
  'towing-provider',
  'automotive',
  'Automotive',
  'Professional towing and roadside assistance landing page with service showcase, booking form, testimonials, and WhatsApp integration. Perfect for tow truck companies, roadside assistance providers, and vehicle recovery services.',
  'https://images.unsplash.com/photo-1562920618-5801e7e1ae1b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1562920618-5801e7e1ae1b?w=1200&h=800&fit=crop',
  '{
    "seo_settings": {
      "title": "RescueTow - 24/7 Towing & Roadside Assistance",
      "description": "Fast and reliable towing service available 24/7. Flatbed towing, roadside assistance, accident recovery, and long-distance transport. Call us anytime!",
      "ogType": "website",
      "robotsIndex": true,
      "robotsFollow": true,
      "language": "en"
    },
    "theme": {
      "primaryColor": "#dc2626",
      "fontFamily": "Inter"
    },
    "elements": [
      {
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "🚨 24/7 Emergency Towing Available — Call Now for Immediate Assistance!",
          "bgColor": "#dc2626",
          "textColor": "#ffffff",
          "showCountdown": false,
          "isSticky": true,
          "showCloseButton": true,
          "link": "#booking",
          "linkText": "Request Tow"
        }
      },
      {
        "type": "navigation",
        "order": 1,
        "props": {
          "logo": "",
          "logoText": "RESCUETOW",
          "menuItems": [
            {"label": "Services", "url": "#services"},
            {"label": "Why Us", "url": "#why-us"},
            {"label": "Testimonials", "url": "#testimonials"},
            {"label": "Request Tow", "url": "#booking"}
          ],
          "ctaButton": {"text": "Request Tow", "url": "#booking"},
          "bgColor": "#0f172a",
          "textColor": "#ffffff",
          "isSticky": true,
          "layout": "split"
        }
      },
      {
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Stranded? We Will Be There.",
          "subheadline": "24/7 professional towing and roadside assistance. Fast response, safe transport, and affordable rates across Malaysia.",
          "ctaText": "Request Tow Now",
          "ctaUrl": "#booking",
          "image": "https://images.unsplash.com/photo-1562920618-5801e7e1ae1b?w=1920&h=1080&fit=crop",
          "bgColor": "#0f172a",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#e2e8f0",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 45,
          "buttonBgColor": "#dc2626",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "type": "product_carousel",
        "order": 3,
        "props": {
          "title": "Our Services",
          "subtitle": "Complete towing and roadside assistance solutions — anytime, anywhere.",
          "products": [
            {
              "id": "svc-flatbed",
              "code": "TOW-001",
              "name": "Flatbed Towing",
              "description": "Safe and damage-free flatbed towing for all vehicle types including sedans, SUVs, and luxury cars. GPS-tracked for real-time updates.",
              "image_url": "https://images.unsplash.com/photo-1562920618-5801e7e1ae1b?w=600&h=400&fit=crop",
              "base_price": 150,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-accident",
              "code": "TOW-002",
              "name": "Accident Recovery",
              "description": "Emergency accident vehicle recovery with trained operators. We handle police reports coordination and insurance claims assistance.",
              "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
              "base_price": 250,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-roadside",
              "code": "TOW-003",
              "name": "Roadside Assistance",
              "description": "Battery jump-start, flat tyre change, fuel delivery, and lockout service. Quick response to get you back on the road.",
              "image_url": "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=600&h=400&fit=crop",
              "base_price": 80,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-longdistance",
              "code": "TOW-004",
              "name": "Long-Distance Transport",
              "description": "Interstate and long-distance vehicle transport across Malaysia. Secure flatbed transport with full insurance coverage.",
              "image_url": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
              "base_price": 500,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-motorcycle",
              "code": "TOW-005",
              "name": "Motorcycle Towing",
              "description": "Specialised motorcycle towing with dedicated bike cradles. Safe transport for all motorcycle types from scooters to superbikes.",
              "image_url": "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&h=400&fit=crop",
              "base_price": 100,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-commercial",
              "code": "TOW-006",
              "name": "Commercial Vehicle Towing",
              "description": "Heavy-duty towing for vans, lorries, and commercial vehicles. Equipped with industrial winch and heavy-duty flatbed.",
              "image_url": "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600&h=400&fit=crop",
              "base_price": 350,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "layout": "grid",
          "columns": 3,
          "showPrice": true,
          "showDescription": true,
          "cardStyle": "shadow",
          "showAddToCart": false,
          "bgColor": "#f8fafc",
          "textColor": "#0f172a",
          "priceColor": "#dc2626"
        }
      },
      {
        "type": "features",
        "order": 4,
        "props": {
          "variant": "grid",
          "title": "Why Choose RescueTow?",
          "features": [
            {
              "icon": "clock",
              "title": "24/7 Availability",
              "description": "We operate round the clock, 365 days a year. Whether it is 2am or during a holiday, we are always ready to help.",
              "image": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=400&fit=crop"
            },
            {
              "icon": "zap",
              "title": "Fast Response Time",
              "description": "Average arrival time of 30 minutes within city areas. GPS-tracked fleet ensures the nearest truck reaches you quickly.",
              "image": "https://images.unsplash.com/photo-1562920618-5801e7e1ae1b?w=600&h=400&fit=crop"
            },
            {
              "icon": "shield",
              "title": "Fully Insured",
              "description": "All our towing operations are fully insured. Your vehicle is protected from pickup to drop-off with comprehensive coverage.",
              "image": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop"
            },
            {
              "icon": "dollar-sign",
              "title": "Transparent Pricing",
              "description": "No hidden charges or surprise fees. Get a clear quote before we dispatch. What we quote is what you pay.",
              "image": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop"
            },
            {
              "icon": "truck",
              "title": "Modern Fleet",
              "description": "Well-maintained fleet of flatbed trucks and recovery vehicles equipped with the latest towing technology.",
              "image": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop"
            },
            {
              "icon": "award",
              "title": "Trained Operators",
              "description": "All our operators are trained and certified in safe vehicle recovery. Professional handling guaranteed for every job.",
              "image": "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=600&h=400&fit=crop"
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "booking_form",
        "order": 5,
        "props": {
          "title": "Request Towing Service",
          "description": "Fill in your details and we will dispatch the nearest available truck. For emergencies, call us directly.",
          "nameLabel": "Full Name",
          "phoneLabel": "Phone Number",
          "emailLabel": "Email Address",
          "remarkLabel": "Pickup Location, Vehicle Type & Issue (e.g. Jalan Ampang, Honda Civic, Flat tyre)",
          "showName": true,
          "showPhone": true,
          "showEmail": true,
          "showRemark": true,
          "nameRequired": true,
          "phoneRequired": true,
          "emailRequired": false,
          "remarkRequired": true,
          "defaultCountryCode": "MY",
          "serviceName": "Towing Service Request",
          "servicePrice": 0,
          "currency": "MYR",
          "duration": 60,
          "slotDuration": 60,
          "startTime": "00:00",
          "endTime": "23:59",
          "availableDays": [0, 1, 2, 3, 4, 5, 6],
          "blockedDates": [],
          "submitButtonText": "Request Tow Now",
          "submitButtonColor": "#dc2626",
          "bgColor": "#f8fafc",
          "google_sheets_enabled": false,
          "google_sheets_url": "",
          "requirePayment": false
        }
      },
      {
        "type": "testimonials",
        "order": 6,
        "props": {
          "variant": "grid",
          "title": "What Our Customers Say",
          "testimonials": [
            {"name": "Farid Azman", "role": "Accident Recovery Client", "quote": "Had an accident at 11pm and they arrived in 25 minutes. Very professional handling of my car. Even helped coordinate with the police. Truly a lifesaver!", "rating": 5},
            {"name": "Amanda Chong", "role": "Breakdown Assistance", "quote": "My car broke down on the highway during a road trip. Called RescueTow and they came so fast! Towed my car safely to the nearest workshop. Thank you!", "rating": 5},
            {"name": "Kamal Arif", "role": "Long-Distance Transport", "quote": "Used their long-distance service to transport my car from KL to Penang. Car arrived in perfect condition. Very reasonable pricing too.", "rating": 5},
            {"name": "Priya Nair", "role": "Roadside Assistance", "quote": "Battery died in a shopping mall parking lot. They came and jump-started my car within 20 minutes. Quick, efficient, and affordable!", "rating": 5},
            {"name": "David Lau", "role": "Flatbed Towing Client", "quote": "I only trust flatbed towing for my lowered car. RescueTow handled it perfectly. No scrapes, no damage. Will use again.", "rating": 5},
            {"name": "Nurul Huda", "role": "Motorcycle Towing", "quote": "My motorcycle broke down far from home. They have a special cradle for bikes which is great. Safe delivery and the driver was very careful.", "rating": 5}
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "whatsapp_button",
        "order": 7,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Hi! I need towing assistance. Please help!",
          "buttonText": "Chat on WhatsApp",
          "buttonColor": "#25D366",
          "buttonSize": "lg",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true,
          "tooltipText": "Need a tow? Chat with us!",
          "showHeadline": true,
          "headlineText": "Emergency? We are here 24/7!",
          "headlineColor": "#1f2937"
        }
      },
      {
        "type": "footer",
        "order": 8,
        "props": {
          "logo": "",
          "logoText": "RESCUETOW",
          "description": "Your trusted 24/7 towing and roadside assistance partner. Fast response, safe transport, and transparent pricing.",
          "columns": [
            {
              "title": "Our Services",
              "links": [
                {"label": "Flatbed Towing", "url": "#services"},
                {"label": "Accident Recovery", "url": "#services"},
                {"label": "Roadside Assistance", "url": "#services"},
                {"label": "Long-Distance Transport", "url": "#services"},
                {"label": "Motorcycle Towing", "url": "#services"},
                {"label": "Commercial Towing", "url": "#services"}
              ]
            },
            {
              "title": "Quick Links",
              "links": [
                {"label": "Request Tow", "url": "#booking"},
                {"label": "Why Choose Us", "url": "#why-us"},
                {"label": "Testimonials", "url": "#testimonials"},
                {"label": "Contact Us", "url": "#contact"}
              ]
            },
            {
              "title": "Contact Info",
              "links": [
                {"label": "Emergency: +60 12-345 6789", "url": "https://wa.me/60123456789"},
                {"label": "Email: help@rescuetow.my", "url": "mailto:help@rescuetow.my"},
                {"label": "Available 24/7", "url": "#"},
                {"label": "All of Malaysia", "url": "#"}
              ]
            }
          ],
          "socialLinks": [
            {"platform": "facebook", "url": "https://facebook.com"},
            {"platform": "instagram", "url": "https://instagram.com"}
          ],
          "copyright": "© 2026 RescueTow. All rights reserved.",
          "bgColor": "#0f172a",
          "textColor": "#e2e8f0"
        }
      }
    ]
  }'::jsonb,
  true,
  0,
  ARRAY['towing', 'tow truck', 'roadside assistance', 'recovery', 'emergency', 'automotive', 'breakdown', 'transport']
);


-- FILE: 20260129160000_add_battery_shop_template.sql
-- Battery Shop Template (Automotive)
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, usage_count, tags, data
) VALUES (
  gen_random_uuid(),
  'Battery Shop',
  'battery-shop',
  'automotive',
  'Automotive',
  'Professional car battery shop landing page with battery services showcase, booking form, testimonials, and WhatsApp integration. Perfect for battery retailers, auto electricians, and mobile battery replacement services.',
  'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=1200&h=800&fit=crop',
  '{
    "seo_settings": {
      "title": "BatteryKing - Car Battery Specialist & Mobile Replacement",
      "description": "Car battery supply, testing, and mobile replacement service. Top brands at best prices with free installation. Available 24/7 for emergency battery rescue!",
      "ogType": "website",
      "robotsIndex": true,
      "robotsFollow": true,
      "language": "en"
    },
    "theme": {
      "primaryColor": "#eab308",
      "fontFamily": "Inter"
    },
    "elements": [
      {
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "⚡ FREE Battery Health Check + FREE Installation on All Purchases!",
          "bgColor": "#eab308",
          "textColor": "#1c1917",
          "showCountdown": true,
          "countdownLabel": "Promo ends in:",
          "countdownEndDate": "2026-03-31T23:59:59",
          "isSticky": true,
          "showCloseButton": true,
          "link": "#booking",
          "linkText": "Book Now"
        }
      },
      {
        "type": "navigation",
        "order": 1,
        "props": {
          "logo": "",
          "logoText": "BATTERYKING",
          "menuItems": [
            {"label": "Services", "url": "#services"},
            {"label": "Why Us", "url": "#why-us"},
            {"label": "Testimonials", "url": "#testimonials"},
            {"label": "Book Now", "url": "#booking"}
          ],
          "ctaButton": {"text": "Book Service", "url": "#booking"},
          "bgColor": "#0f172a",
          "textColor": "#ffffff",
          "isSticky": true,
          "layout": "split"
        }
      },
      {
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Car Battery Dead? We Got You.",
          "subheadline": "Top brand car batteries at the best prices. Free testing, free installation, and 24/7 mobile replacement service anywhere in KL & Selangor.",
          "ctaText": "Get Battery Replaced Now",
          "ctaUrl": "#booking",
          "image": "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=1920&h=1080&fit=crop",
          "bgColor": "#0f172a",
          "headlineColor": "#eab308",
          "subheadlineColor": "#e2e8f0",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 45,
          "buttonBgColor": "#eab308",
          "buttonTextColor": "#1c1917",
          "showCtaButton": true
        }
      },
      {
        "type": "product_carousel",
        "order": 3,
        "props": {
          "title": "Our Services",
          "subtitle": "Complete car battery solutions — from testing to replacement, we handle it all.",
          "products": [
            {
              "id": "svc-battery-replace",
              "code": "BAT-001",
              "name": "Battery Supply & Installation",
              "description": "Wide range of car batteries from top brands (Amaron, Varta, Century, Bosch). Free installation and old battery disposal included.",
              "image_url": "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600&h=400&fit=crop",
              "base_price": 180,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-mobile-replace",
              "code": "BAT-002",
              "name": "Mobile Battery Replacement",
              "description": "Battery died and you are stuck? We come to your location and replace your battery on the spot. Available 24/7 across KL & Selangor.",
              "image_url": "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=600&h=400&fit=crop",
              "base_price": 220,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-battery-test",
              "code": "BAT-003",
              "name": "Battery Health Check",
              "description": "Comprehensive battery load testing and health diagnostics. Know your battery condition before it fails. Free with any service.",
              "image_url": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
              "base_price": 0,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-jumpstart",
              "code": "BAT-004",
              "name": "Jump-Start Service",
              "description": "Emergency jump-start service to get you going. Our technician will also test your battery and alternator to find the root cause.",
              "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
              "base_price": 50,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-alternator",
              "code": "BAT-005",
              "name": "Alternator & Starter Repair",
              "description": "Alternator testing, repair, and replacement. Starter motor diagnosis and repair. Comprehensive electrical system check included.",
              "image_url": "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&h=400&fit=crop",
              "base_price": 250,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-hybrid-battery",
              "code": "BAT-006",
              "name": "Hybrid & AGM Batteries",
              "description": "Specialised batteries for hybrid vehicles, start-stop systems, and luxury cars. AGM and EFB battery supply and fitting available.",
              "image_url": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop",
              "base_price": 400,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "layout": "grid",
          "columns": 3,
          "showPrice": true,
          "showDescription": true,
          "cardStyle": "shadow",
          "showAddToCart": false,
          "bgColor": "#f8fafc",
          "textColor": "#0f172a",
          "priceColor": "#eab308"
        }
      },
      {
        "type": "features",
        "order": 4,
        "props": {
          "variant": "grid",
          "title": "Why Choose BatteryKing?",
          "features": [
            {
              "icon": "zap",
              "title": "24/7 Emergency Service",
              "description": "Battery died at 3am? No problem. Our mobile service operates round the clock to rescue you wherever you are.",
              "image": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=400&fit=crop"
            },
            {
              "icon": "truck",
              "title": "We Come to You",
              "description": "Mobile battery replacement at your home, office, or roadside. No need to tow your car — we bring the battery to you.",
              "image": "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=600&h=400&fit=crop"
            },
            {
              "icon": "dollar-sign",
              "title": "Best Price Guarantee",
              "description": "We offer the most competitive battery prices in the market. Price match guarantee — find it cheaper elsewhere, we will beat it.",
              "image": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop"
            },
            {
              "icon": "shield",
              "title": "Up to 36-Month Warranty",
              "description": "All batteries come with manufacturer warranty of up to 36 months. Free replacement within warranty period.",
              "image": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop"
            },
            {
              "icon": "check-circle",
              "title": "Free Installation",
              "description": "Every battery purchase includes free professional installation and old battery disposal. No hidden charges.",
              "image": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop"
            },
            {
              "icon": "award",
              "title": "Genuine Products Only",
              "description": "We only sell original, genuine batteries from authorised distributors. No refurbished or counterfeit products.",
              "image": "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=600&h=400&fit=crop"
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "booking_form",
        "order": 5,
        "props": {
          "title": "Book Battery Service",
          "description": "Schedule your battery replacement or check-up. For emergencies, call or WhatsApp us directly.",
          "nameLabel": "Full Name",
          "phoneLabel": "Phone Number",
          "emailLabel": "Email Address",
          "remarkLabel": "Vehicle Details & Issue (e.g. Toyota Vios 2021, battery dead, need mobile replacement)",
          "showName": true,
          "showPhone": true,
          "showEmail": true,
          "showRemark": true,
          "nameRequired": true,
          "phoneRequired": true,
          "emailRequired": false,
          "remarkRequired": true,
          "defaultCountryCode": "MY",
          "serviceName": "Battery Service",
          "servicePrice": 0,
          "currency": "MYR",
          "duration": 30,
          "slotDuration": 30,
          "startTime": "08:00",
          "endTime": "20:00",
          "availableDays": [0, 1, 2, 3, 4, 5, 6],
          "blockedDates": [],
          "submitButtonText": "Book Now",
          "submitButtonColor": "#eab308",
          "submitButtonTextColor": "#1c1917",
          "bgColor": "#f8fafc",
          "google_sheets_enabled": false,
          "google_sheets_url": "",
          "requirePayment": false
        }
      },
      {
        "type": "testimonials",
        "order": 6,
        "props": {
          "variant": "grid",
          "title": "What Our Customers Say",
          "testimonials": [
            {"name": "Azlan Ismail", "role": "Honda City Owner", "quote": "Battery died in the basement parking at 10pm. Called BatteryKing and they arrived in 25 minutes! New battery installed on the spot. Excellent service!", "rating": 5},
            {"name": "Grace Lee", "role": "Toyota Camry Owner", "quote": "Best battery prices in town. Checked 5 shops before coming here and BatteryKing was the cheapest with genuine Amaron battery. Free installation too!", "rating": 5},
            {"name": "Mohd Faisal", "role": "Proton Saga Owner", "quote": "The free battery check saved me from being stranded. They found my battery was weak and replaced it before it died completely. Great preventive service!", "rating": 5},
            {"name": "Siew Ling", "role": "Perodua Myvi Owner", "quote": "Used their mobile service at my office parking. The technician was professional and quick. New battery installed in 15 minutes. Highly recommend!", "rating": 5},
            {"name": "Ravi Shankar", "role": "BMW 5 Series Owner", "quote": "Hard to find AGM battery for my BMW elsewhere. BatteryKing had it in stock and fitted it perfectly. Warranty card provided. Very trustworthy.", "rating": 5},
            {"name": "Nurul Izzah", "role": "Mazda 2 Owner", "quote": "3am emergency and they still came! The operator was friendly and professional. Charged a fair price with no midnight surcharge. Will recommend to everyone.", "rating": 5}
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "whatsapp_button",
        "order": 7,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Hi! I need a car battery replacement. Can you help?",
          "buttonText": "Chat on WhatsApp",
          "buttonColor": "#25D366",
          "buttonSize": "lg",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true,
          "tooltipText": "Battery issue? Chat with us!",
          "showHeadline": true,
          "headlineText": "Battery dead? We can help!",
          "headlineColor": "#1f2937"
        }
      },
      {
        "type": "footer",
        "order": 8,
        "props": {
          "logo": "",
          "logoText": "BATTERYKING",
          "description": "Your trusted car battery specialist. Top brands, best prices, and 24/7 mobile replacement service.",
          "columns": [
            {
              "title": "Our Services",
              "links": [
                {"label": "Battery Supply & Install", "url": "#services"},
                {"label": "Mobile Replacement", "url": "#services"},
                {"label": "Free Battery Check", "url": "#services"},
                {"label": "Jump-Start Service", "url": "#services"},
                {"label": "Alternator Repair", "url": "#services"},
                {"label": "Hybrid Batteries", "url": "#services"}
              ]
            },
            {
              "title": "Quick Links",
              "links": [
                {"label": "Book Service", "url": "#booking"},
                {"label": "Why Choose Us", "url": "#why-us"},
                {"label": "Testimonials", "url": "#testimonials"},
                {"label": "Contact Us", "url": "#contact"}
              ]
            },
            {
              "title": "Contact Info",
              "links": [
                {"label": "Emergency: +60 12-345 6789", "url": "https://wa.me/60123456789"},
                {"label": "Email: hello@batteryking.my", "url": "mailto:hello@batteryking.my"},
                {"label": "Shop: Mon - Sun 8am - 8pm", "url": "#"},
                {"label": "Mobile: Available 24/7", "url": "#"}
              ]
            }
          ],
          "socialLinks": [
            {"platform": "facebook", "url": "https://facebook.com"},
            {"platform": "instagram", "url": "https://instagram.com"}
          ],
          "copyright": "© 2026 BatteryKing. All rights reserved.",
          "bgColor": "#0f172a",
          "textColor": "#e2e8f0"
        }
      }
    ]
  }'::jsonb,
  true,
  0,
  ARRAY['battery', 'car battery', 'mobile battery', 'jump start', 'alternator', 'automotive', 'emergency', 'replacement']
);


-- FILE: 20260129170000_add_absorber_shop_template.sql
-- Absorber Shop Template (Automotive)
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, usage_count, tags, data
) VALUES (
  gen_random_uuid(),
  'Absorber Shop',
  'absorber-shop',
  'automotive',
  'Automotive',
  'Professional shock absorber and suspension shop landing page with services showcase, booking form, testimonials, and WhatsApp integration. Perfect for absorber specialists, suspension shops, and automotive workshops.',
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1200&h=800&fit=crop',
  '{
    "seo_settings": {
      "title": "AbsorberPro - Suspension & Absorber Specialist",
      "description": "Expert shock absorber and suspension services. OEM and performance absorbers, spring replacement, and ride height adjustment. Restore your ride comfort today!",
      "ogType": "website",
      "robotsIndex": true,
      "robotsFollow": true,
      "language": "en"
    },
    "theme": {
      "primaryColor": "#2563eb",
      "fontFamily": "Inter"
    },
    "elements": [
      {
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "🔧 FREE Suspension Check + 10% OFF All Absorber Replacements This Month!",
          "bgColor": "#2563eb",
          "textColor": "#ffffff",
          "showCountdown": true,
          "countdownLabel": "Promo ends in:",
          "countdownEndDate": "2026-03-31T23:59:59",
          "isSticky": true,
          "showCloseButton": true,
          "link": "#booking",
          "linkText": "Book Now"
        }
      },
      {
        "type": "navigation",
        "order": 1,
        "props": {
          "logo": "",
          "logoText": "ABSORBERPRO",
          "menuItems": [
            {"label": "Services", "url": "#services"},
            {"label": "Why Us", "url": "#why-us"},
            {"label": "Testimonials", "url": "#testimonials"},
            {"label": "Book Now", "url": "#booking"}
          ],
          "ctaButton": {"text": "Book Service", "url": "#booking"},
          "bgColor": "#0f172a",
          "textColor": "#ffffff",
          "isSticky": true,
          "layout": "split"
        }
      },
      {
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Ride Like New Again.",
          "subheadline": "Expert shock absorber and suspension services to restore your vehicle comfort and handling. OEM and performance parts available for all makes and models.",
          "ctaText": "Book Suspension Check",
          "ctaUrl": "#booking",
          "image": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1920&h=1080&fit=crop",
          "bgColor": "#0f172a",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#e2e8f0",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 45,
          "buttonBgColor": "#2563eb",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "type": "product_carousel",
        "order": 3,
        "props": {
          "title": "Our Services",
          "subtitle": "Complete suspension and absorber solutions — from inspection to performance upgrades.",
          "products": [
            {
              "id": "svc-absorber-replace",
              "code": "ABS-001",
              "name": "Absorber Replacement",
              "description": "Front and rear shock absorber replacement using OEM or equivalent parts. Includes mounting hardware and professional installation.",
              "image_url": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
              "base_price": 350,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-spring-replace",
              "code": "ABS-002",
              "name": "Spring Replacement",
              "description": "Coil spring and leaf spring replacement for sagging or broken springs. Restores ride height and load-bearing capacity to factory specifications.",
              "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
              "base_price": 280,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-suspension-check",
              "code": "ABS-003",
              "name": "Suspension Inspection",
              "description": "Comprehensive suspension health check covering absorbers, springs, bushings, ball joints, and mounting points. Detailed report provided.",
              "image_url": "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=600&h=400&fit=crop",
              "base_price": 0,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-bushing",
              "code": "ABS-004",
              "name": "Bushing & Link Replacement",
              "description": "Worn bushings and stabiliser links cause rattling and poor handling. We replace with polyurethane or OEM bushings for a tight, quiet ride.",
              "image_url": "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&h=400&fit=crop",
              "base_price": 150,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-performance",
              "code": "ABS-005",
              "name": "Performance Upgrade",
              "description": "Upgrade to performance absorbers and lowering springs from brands like Bilstein, KYB, and KW. Improved handling without sacrificing comfort.",
              "image_url": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop",
              "base_price": 800,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-alignment",
              "code": "ABS-006",
              "name": "Post-Service Alignment",
              "description": "Wheel alignment after absorber or spring replacement is essential. Computerised 4-wheel alignment ensures proper tyre wear and straight tracking.",
              "image_url": "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=600&h=400&fit=crop",
              "base_price": 80,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "layout": "grid",
          "columns": 3,
          "showPrice": true,
          "showDescription": true,
          "cardStyle": "shadow",
          "showAddToCart": false,
          "bgColor": "#f8fafc",
          "textColor": "#0f172a",
          "priceColor": "#2563eb"
        }
      },
      {
        "type": "features",
        "order": 4,
        "props": {
          "variant": "grid",
          "title": "Why Choose AbsorberPro?",
          "features": [
            {
              "icon": "award",
              "title": "Suspension Specialist",
              "description": "We focus exclusively on suspension and absorber work. This specialisation means better expertise, faster service, and superior results.",
              "image": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=400&fit=crop"
            },
            {
              "icon": "check-circle",
              "title": "OEM & Performance Parts",
              "description": "We stock genuine OEM absorbers and premium aftermarket brands like Bilstein, KYB, Monroe, and Sachs. The right part for every vehicle.",
              "image": "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop"
            },
            {
              "icon": "shield",
              "title": "12-Month Warranty",
              "description": "All absorber and spring replacements come with a 12-month warranty on parts and labour. Drive with confidence.",
              "image": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop"
            },
            {
              "icon": "dollar-sign",
              "title": "Honest Pricing",
              "description": "Transparent quotes with no hidden charges. We explain the issue clearly and only replace what is actually needed.",
              "image": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop"
            },
            {
              "icon": "clock",
              "title": "Same-Day Service",
              "description": "Most absorber replacements completed within 2-3 hours. Book in the morning, drive home by afternoon with a refreshed ride.",
              "image": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop"
            },
            {
              "icon": "gift",
              "title": "Free Suspension Check",
              "description": "Complimentary visual suspension inspection with every visit. We check absorbers, springs, bushings, and more at no charge.",
              "image": "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=600&h=400&fit=crop"
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "booking_form",
        "order": 5,
        "props": {
          "title": "Book Your Suspension Service",
          "description": "Schedule your absorber replacement or suspension check. We will have the right parts ready for your appointment.",
          "nameLabel": "Full Name",
          "phoneLabel": "Phone Number",
          "emailLabel": "Email Address",
          "remarkLabel": "Vehicle Details & Issue (e.g. Proton X50 2023, bouncy ride, front absorber leaking)",
          "showName": true,
          "showPhone": true,
          "showEmail": true,
          "showRemark": true,
          "nameRequired": true,
          "phoneRequired": true,
          "emailRequired": false,
          "remarkRequired": true,
          "defaultCountryCode": "MY",
          "serviceName": "Suspension Service Appointment",
          "servicePrice": 0,
          "currency": "MYR",
          "duration": 60,
          "slotDuration": 60,
          "startTime": "09:00",
          "endTime": "18:00",
          "availableDays": [1, 2, 3, 4, 5, 6],
          "blockedDates": [],
          "submitButtonText": "Confirm Booking",
          "submitButtonColor": "#2563eb",
          "bgColor": "#f8fafc",
          "google_sheets_enabled": false,
          "google_sheets_url": "",
          "requirePayment": false
        }
      },
      {
        "type": "testimonials",
        "order": 6,
        "props": {
          "variant": "grid",
          "title": "What Our Customers Say",
          "testimonials": [
            {"name": "Hakim Roslan", "role": "Proton X70 Owner", "quote": "My X70 was bouncing badly over bumps. AbsorberPro replaced all four absorbers and it feels like a brand new car! Smooth and stable. Great work!", "rating": 5},
            {"name": "Christine Yap", "role": "Honda Jazz Owner", "quote": "My car was making clunking sounds over speed bumps. They identified worn bushings and links, replaced them quickly. No more noise! Very knowledgeable team.", "rating": 5},
            {"name": "Zul Fikri", "role": "Perodua Bezza Owner", "quote": "Got the KYB absorbers installed here. The ride comfort improved dramatically. Fair price and the work was done in just 2 hours. Highly recommend!", "rating": 5},
            {"name": "Mei Ling", "role": "Toyota Vios Owner", "quote": "Went to AbsorberPro for a free check and they honestly told me my absorbers still had life. No unnecessary upselling. Will come back when it is time.", "rating": 5},
            {"name": "Imran Shah", "role": "BMW E90 Owner", "quote": "Upgraded to Bilstein B4 absorbers for my E90. The handling improvement is incredible. These guys know their suspension. True specialists!", "rating": 5},
            {"name": "Kavitha Devi", "role": "Mazda CX-5 Owner", "quote": "Spring snapped and they had the replacement in stock. Fixed within the same day and included a wheel alignment. Complete service from start to finish.", "rating": 5}
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "whatsapp_button",
        "order": 7,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Hi! I would like to inquire about absorber replacement for my car.",
          "buttonText": "Chat on WhatsApp",
          "buttonColor": "#25D366",
          "buttonSize": "lg",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true,
          "tooltipText": "Suspension issues? Chat with us!",
          "showHeadline": true,
          "headlineText": "Questions? We are here to help!",
          "headlineColor": "#1f2937"
        }
      },
      {
        "type": "footer",
        "order": 8,
        "props": {
          "logo": "",
          "logoText": "ABSORBERPRO",
          "description": "Your trusted suspension and absorber specialist. OEM parts, expert installation, and ride comfort guaranteed.",
          "columns": [
            {
              "title": "Our Services",
              "links": [
                {"label": "Absorber Replacement", "url": "#services"},
                {"label": "Spring Replacement", "url": "#services"},
                {"label": "Suspension Check", "url": "#services"},
                {"label": "Bushing & Links", "url": "#services"},
                {"label": "Performance Upgrade", "url": "#services"},
                {"label": "Wheel Alignment", "url": "#services"}
              ]
            },
            {
              "title": "Quick Links",
              "links": [
                {"label": "Book Service", "url": "#booking"},
                {"label": "Why Choose Us", "url": "#why-us"},
                {"label": "Testimonials", "url": "#testimonials"},
                {"label": "Contact Us", "url": "#contact"}
              ]
            },
            {
              "title": "Contact Info",
              "links": [
                {"label": "WhatsApp: +60 12-345 6789", "url": "https://wa.me/60123456789"},
                {"label": "Email: hello@absorberpro.my", "url": "mailto:hello@absorberpro.my"},
                {"label": "Mon - Sat: 9am - 6pm", "url": "#"},
                {"label": "Sunday: Closed", "url": "#"}
              ]
            }
          ],
          "socialLinks": [
            {"platform": "facebook", "url": "https://facebook.com"},
            {"platform": "instagram", "url": "https://instagram.com"}
          ],
          "copyright": "© 2026 AbsorberPro. All rights reserved.",
          "bgColor": "#0f172a",
          "textColor": "#e2e8f0"
        }
      }
    ]
  }'::jsonb,
  true,
  0,
  ARRAY['absorber', 'shock absorber', 'suspension', 'spring', 'automotive', 'ride comfort', 'handling', 'KYB']
);


-- FILE: 20260129180000_add_car_windows_shop_template.sql
-- Car Windows Shop Template (Automotive)
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, usage_count, tags, data
) VALUES (
  gen_random_uuid(),
  'Car Windows Shop',
  'car-windows-shop',
  'automotive',
  'Automotive',
  'Professional car window and tinting shop landing page with services showcase, booking form, testimonials, and WhatsApp integration. Perfect for windscreen replacement, window tinting, and auto glass specialists.',
  'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=1200&h=800&fit=crop',
  '{
    "seo_settings": {
      "title": "ClearView Auto Glass - Windscreen & Window Tinting Specialist",
      "description": "Professional windscreen replacement, window tinting, and auto glass services. Premium tint films, certified technicians, and same-day service. Get a quote today!",
      "ogType": "website",
      "robotsIndex": true,
      "robotsFollow": true,
      "language": "en"
    },
    "theme": {
      "primaryColor": "#0891b2",
      "fontFamily": "Inter"
    },
    "elements": [
      {
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "🚗 FREE Windscreen Chip Repair with Any Tinting Package! Limited Time Offer",
          "bgColor": "#0891b2",
          "textColor": "#ffffff",
          "showCountdown": true,
          "countdownLabel": "Offer ends in:",
          "countdownEndDate": "2026-03-31T23:59:59",
          "isSticky": true,
          "showCloseButton": true,
          "link": "#booking",
          "linkText": "Book Now"
        }
      },
      {
        "type": "navigation",
        "order": 1,
        "props": {
          "logo": "",
          "logoText": "CLEARVIEW AUTO GLASS",
          "menuItems": [
            {"label": "Services", "url": "#services"},
            {"label": "Why Us", "url": "#why-us"},
            {"label": "Testimonials", "url": "#testimonials"},
            {"label": "Book Now", "url": "#booking"}
          ],
          "ctaButton": {"text": "Get a Quote", "url": "#booking"},
          "bgColor": "#0f172a",
          "textColor": "#ffffff",
          "isSticky": true,
          "layout": "split"
        }
      },
      {
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Crystal Clear. Expert Care.",
          "subheadline": "Professional windscreen replacement, premium window tinting, and auto glass repair. Certified technicians with same-day service for all vehicle types.",
          "ctaText": "Get a Free Quote",
          "ctaUrl": "#booking",
          "image": "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=1920&h=1080&fit=crop",
          "bgColor": "#0f172a",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#e2e8f0",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 45,
          "buttonBgColor": "#0891b2",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "type": "product_carousel",
        "order": 3,
        "props": {
          "title": "Our Services",
          "subtitle": "Complete auto glass and tinting solutions — from repair to full replacement and premium tinting.",
          "products": [
            {
              "id": "svc-windscreen",
              "code": "WIN-001",
              "name": "Windscreen Replacement",
              "description": "OEM and equivalent windscreen replacement for all vehicle types. Includes calibration for vehicles with ADAS sensors. Same-day service available.",
              "image_url": "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=600&h=400&fit=crop",
              "base_price": 350,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-tinting",
              "code": "WIN-002",
              "name": "Premium Window Tinting",
              "description": "High-quality solar control tint films from 3M, Llumar, and V-Kool. Up to 99% UV rejection, heat reduction, and glare control. JPJ compliant.",
              "image_url": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop",
              "base_price": 500,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-chip-repair",
              "code": "WIN-003",
              "name": "Windscreen Chip Repair",
              "description": "Repair stone chips and small cracks before they spread. Quick 30-minute repair that restores structural integrity and saves costly replacement.",
              "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
              "base_price": 60,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-side-glass",
              "code": "WIN-004",
              "name": "Side & Rear Glass Replacement",
              "description": "Replacement of side windows, quarter glass, and rear windscreen. Tempered and laminated glass options available for all makes.",
              "image_url": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop",
              "base_price": 200,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-ceramic-coat",
              "code": "WIN-005",
              "name": "Ceramic Tint Film",
              "description": "Premium ceramic tint film for superior heat rejection without signal interference. Perfect for vehicles with toll transponders and GPS.",
              "image_url": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop",
              "base_price": 800,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "svc-sunroof",
              "code": "WIN-006",
              "name": "Sunroof Glass & Tinting",
              "description": "Sunroof and moonroof glass replacement and tinting. Specialised service for panoramic sunroofs with proper sealing and alignment.",
              "image_url": "https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?w=600&h=400&fit=crop",
              "base_price": 450,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "layout": "grid",
          "columns": 3,
          "showPrice": true,
          "showDescription": true,
          "cardStyle": "shadow",
          "showAddToCart": false,
          "bgColor": "#f8fafc",
          "textColor": "#0f172a",
          "priceColor": "#0891b2"
        }
      },
      {
        "type": "features",
        "order": 4,
        "props": {
          "variant": "grid",
          "title": "Why Choose ClearView?",
          "features": [
            {
              "icon": "award",
              "title": "Certified Installers",
              "description": "Our technicians are factory-trained and certified in windscreen installation and tint film application. Perfect finish guaranteed.",
              "image": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=400&fit=crop"
            },
            {
              "icon": "check-circle",
              "title": "Premium Materials Only",
              "description": "We use only top-grade glass and branded tint films (3M, Llumar, V-Kool). No cheap knockoffs. Genuine products with warranty cards.",
              "image": "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=600&h=400&fit=crop"
            },
            {
              "icon": "shield",
              "title": "Warranty Coverage",
              "description": "Up to 5-year warranty on tint films and 1-year warranty on windscreen installation. Covers bubbling, peeling, and defects.",
              "image": "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop"
            },
            {
              "icon": "dollar-sign",
              "title": "Insurance Claims",
              "description": "We handle windscreen insurance claims for major insurers. Zero out-of-pocket cost for eligible claims. Hassle-free process.",
              "image": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop"
            },
            {
              "icon": "clock",
              "title": "Same-Day Service",
              "description": "Most tinting and windscreen replacements completed within 2-4 hours. Drive in the morning, drive out by afternoon.",
              "image": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=400&fit=crop"
            },
            {
              "icon": "truck",
              "title": "Mobile Service Available",
              "description": "Can not come to us? We offer mobile windscreen replacement at your home or office. Same quality, more convenience.",
              "image": "https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=600&h=400&fit=crop"
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "booking_form",
        "order": 5,
        "props": {
          "title": "Book Your Appointment",
          "description": "Schedule your windscreen replacement, tinting, or glass repair. We will have everything ready for your visit.",
          "nameLabel": "Full Name",
          "phoneLabel": "Phone Number",
          "emailLabel": "Email Address",
          "remarkLabel": "Vehicle Details & Service Needed (e.g. Honda Civic 2023, full car tinting with ceramic film)",
          "showName": true,
          "showPhone": true,
          "showEmail": true,
          "showRemark": true,
          "nameRequired": true,
          "phoneRequired": true,
          "emailRequired": false,
          "remarkRequired": true,
          "defaultCountryCode": "MY",
          "serviceName": "Auto Glass Appointment",
          "servicePrice": 0,
          "currency": "MYR",
          "duration": 60,
          "slotDuration": 60,
          "startTime": "09:00",
          "endTime": "18:00",
          "availableDays": [1, 2, 3, 4, 5, 6],
          "blockedDates": [],
          "submitButtonText": "Confirm Booking",
          "submitButtonColor": "#0891b2",
          "bgColor": "#f8fafc",
          "google_sheets_enabled": false,
          "google_sheets_url": "",
          "requirePayment": false
        }
      },
      {
        "type": "testimonials",
        "order": 6,
        "props": {
          "variant": "grid",
          "title": "What Our Customers Say",
          "testimonials": [
            {"name": "Syazwan Ali", "role": "Honda Civic Owner", "quote": "Got full car ceramic tinting done. The heat rejection is amazing! My car is so much cooler now. The installation was flawless with no bubbles. Top quality!", "rating": 5},
            {"name": "Karen Tan", "role": "Toyota Camry Owner", "quote": "Windscreen cracked from a stone chip. ClearView replaced it same day and handled my insurance claim. Zero cost to me! Very professional service.", "rating": 5},
            {"name": "Arif Hakim", "role": "Proton X50 Owner", "quote": "The V-Kool tint on my X50 looks amazing. Clean installation, no visible edges, and my car is noticeably cooler. Worth every ringgit!", "rating": 5},
            {"name": "Lisa Ooi", "role": "BMW X1 Owner", "quote": "They calibrated my ADAS after the windscreen change — not all shops do this. Important for safety. ClearView really knows their stuff.", "rating": 5},
            {"name": "Hafiz Rahman", "role": "Perodua Ativa Owner", "quote": "Brought my car in for a small chip repair. They fixed it in 20 minutes and did not try to sell me a new windscreen. Honest and trustworthy!", "rating": 5},
            {"name": "Sanjay Kumar", "role": "Mercedes C-Class Owner", "quote": "Premium service for premium cars. They used genuine Mercedes glass and the fit is perfect. Also did ceramic tinting. My car looks and feels brand new!", "rating": 5}
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "type": "whatsapp_button",
        "order": 7,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Hi! I would like to get a quote for windscreen/tinting service.",
          "buttonText": "Chat on WhatsApp",
          "buttonColor": "#25D366",
          "buttonSize": "lg",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true,
          "tooltipText": "Need a quote? Chat with us!",
          "showHeadline": true,
          "headlineText": "Questions? We are here to help!",
          "headlineColor": "#1f2937"
        }
      },
      {
        "type": "footer",
        "order": 8,
        "props": {
          "logo": "",
          "logoText": "CLEARVIEW AUTO GLASS",
          "description": "Your trusted auto glass and tinting specialist. Premium products, certified installers, and warranty on every job.",
          "columns": [
            {
              "title": "Our Services",
              "links": [
                {"label": "Windscreen Replacement", "url": "#services"},
                {"label": "Window Tinting", "url": "#services"},
                {"label": "Chip Repair", "url": "#services"},
                {"label": "Side & Rear Glass", "url": "#services"},
                {"label": "Ceramic Tint", "url": "#services"},
                {"label": "Sunroof Services", "url": "#services"}
              ]
            },
            {
              "title": "Quick Links",
              "links": [
                {"label": "Get a Quote", "url": "#booking"},
                {"label": "Why Choose Us", "url": "#why-us"},
                {"label": "Testimonials", "url": "#testimonials"},
                {"label": "Contact Us", "url": "#contact"}
              ]
            },
            {
              "title": "Contact Info",
              "links": [
                {"label": "WhatsApp: +60 12-345 6789", "url": "https://wa.me/60123456789"},
                {"label": "Email: hello@clearviewglass.my", "url": "mailto:hello@clearviewglass.my"},
                {"label": "Mon - Sat: 9am - 6pm", "url": "#"},
                {"label": "Sunday: By Appointment", "url": "#"}
              ]
            }
          ],
          "socialLinks": [
            {"platform": "facebook", "url": "https://facebook.com"},
            {"platform": "instagram", "url": "https://instagram.com"},
            {"platform": "tiktok", "url": "https://tiktok.com"}
          ],
          "copyright": "© 2026 ClearView Auto Glass. All rights reserved.",
          "bgColor": "#0f172a",
          "textColor": "#e2e8f0"
        }
      }
    ]
  }'::jsonb,
  true,
  0,
  ARRAY['windscreen', 'tinting', 'window tint', 'auto glass', 'car windows', 'ceramic tint', 'automotive', 'glass repair']
);


-- FILE: 20260130000000_add_affiliate_system.sql
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


-- FILE: 20260203000000_add_coupons_table.sql
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


-- FILE: 20260203100000_fix_towing_template_images.sql
-- Fix broken Unsplash images in Towing Provider template
UPDATE templates
SET
  thumbnail_url = 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop',
  preview_url = 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&h=800&fit=crop',
  data = jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(
              data,
              '{elements,2,props,image}',
              '"https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&h=1080&fit=crop"'
            ),
            '{elements,3,props,products,0,image_url}',
            '"https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop"'
          ),
          '{elements,3,props,products,1,image_url}',
          '"https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop"'
        ),
        '{elements,4,props,features,1,image}',
        '"https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop"'
      ),
      '{elements,4,props,features,0,image}',
      '"https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=400&fit=crop"'
    ),
    '{elements,4,props,features,2,image}',
    '"https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&h=400&fit=crop"'
  )
WHERE slug = 'towing-provider';


-- FILE: 20260204110001_add_biskut_warisan_template.sql
-- Biskut Warisan Template (E-commerce) - Variation 1
-- Theme: Maroon/Burgundy, Variants: hero=centered, features=list, testimonials=slider, faq=two_column, cta=split
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Biskut Warisan',
  'biskut-warisan',
  'ecommerce',
  'Food & Beverage',
  'Template e-dagang elegan untuk menjual biskut dan kuih raya tradisional. Tema maroon klasik dengan reka bentuk warisan.',
  'https://images.unsplash.com/photo-1548848221-0c2e497ed557?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1548848221-0c2e497ed557?w=1200&h=800&fit=crop',
  true,
  ARRAY['biskut warisan', 'kuih bangkit', 'kuih kapit', 'biskut dahlia', 'raya', 'ecommerce', 'tradisional', 'malaysia'],
  '{
    "elements": [
      {
        "id": "warisan-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "Warisan Turun-Temurun Sejak 1985 - Tempahan Raya 2026 Kini Dibuka!",
          "bgColor": "#7c2d12",
          "textColor": "#ffffff",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": true,
          "countdownLabel": "Tempahan ditutup dalam:",
          "countdownEndDate": "2026-03-10T23:59:59"
        }
      },
      {
        "id": "warisan-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "BISKUT WARISAN",
          "logo": "",
          "menuItems": [
            { "label": "Koleksi", "url": "#product_carousel-4" },
            { "label": "Testimoni", "url": "#testimonials-6" },
            { "label": "FAQ", "url": "#faq-7" }
          ],
          "bgColor": "#fef2f2",
          "textColor": "#7c2d12",
          "isSticky": true,
          "layout": "center",
          "ctaButton": {
            "text": "Pesan Sekarang",
            "url": "#form_with_payment-5"
          }
        }
      },
      {
        "id": "warisan-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "centered",
          "headline": "Resipi Warisan Sejak 1985",
          "subheadline": "Biskut dan kuih raya asli diperbuat mengikut resipi turun-temurun. Setiap gigitan membawa kenangan manis zaman dulu.",
          "ctaText": "Jelajah Koleksi",
          "ctaUrl": "#product_carousel-4",
          "image": "https://images.unsplash.com/photo-1548848221-0c2e497ed557?w=1920&q=80",
          "bgColor": "#fef2f2",
          "headlineColor": "#7c2d12",
          "subheadlineColor": "#991b1b",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 100,
          "buttonBgColor": "#7c2d12",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "id": "warisan-features",
        "type": "features",
        "order": 3,
        "props": {
          "title": "Kelebihan Biskut Warisan",
          "variant": "list",
          "features": [
            {
              "icon": "crown",
              "title": "Resipi Asli 1985",
              "description": "Resipi yang sama sejak nenek moyang kami mula berniaga. Tidak pernah berubah, kekal sedap."
            },
            {
              "icon": "award",
              "title": "Bahan Pilihan Terbaik",
              "description": "Hanya menggunakan mentega New Zealand, tepung Jepun, dan bahan import berkualiti tinggi."
            },
            {
              "icon": "users",
              "title": "Dibuat Oleh Pakar",
              "description": "Tukang masak berpengalaman lebih 30 tahun dalam industri kuih raya tradisional."
            },
            {
              "icon": "package",
              "title": "Pembungkusan Eksklusif",
              "description": "Balang kaca premium dengan label emas. Sesuai untuk hadiah atau koleksi peribadi."
            },
            {
              "icon": "truck",
              "title": "Penghantaran Seluruh Malaysia",
              "description": "Dihantar dengan bungkusan istimewa ke seluruh negara. Percuma untuk pesanan RM200+."
            },
            {
              "icon": "shield",
              "title": "Jaminan 100% Puas Hati",
              "description": "Tidak puas hati? Wang anda dikembalikan sepenuhnya tanpa soalan."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "warisan-products",
        "type": "product_carousel",
        "order": 4,
        "props": {
          "title": "Koleksi Warisan Kami",
          "subtitle": "Setiap biskut diperbuat dengan penuh kasih sayang mengikut resipi turun-temurun.",
          "cardStyle": "shadow",
          "products": [
            {
              "id": "kuih-bangkit",
              "code": "BW-001",
              "name": "Kuih Bangkit Premium",
              "description": "Kuih bangkit lembut yang cair di mulut. Diperbuat daripada tepung ubi kayu asli dan santan segar. Wangi dan tidak terlalu manis.",
              "image_url": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=400&fit=crop",
              "base_price": 32,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "kuih-kapit",
              "code": "BW-002",
              "name": "Kuih Kapit Rangup",
              "description": "Kuih kapit nipis dan rangup dengan corak tradisional yang cantik. Diperbuat daripada santan pekat dan gula melaka.",
              "image_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
              "base_price": 28,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "biskut-dahlia",
              "code": "BW-003",
              "name": "Biskut Dahlia",
              "description": "Biskut mentega berbentuk bunga dahlia yang cantik. Lembut, rangup, dan cair di mulut. Kegemaran semua generasi.",
              "image_url": "https://images.unsplash.com/photo-1486427944544-d2c246c4df14?w=600&h=400&fit=crop",
              "base_price": 30,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "bgColor": "#fef2f2"
        }
      },
      {
        "id": "warisan-form-payment",
        "type": "form_with_payment",
        "order": 5,
        "props": {
          "title": "Borang Tempahan",
          "description": "Lengkapkan maklumat anda untuk meneruskan tempahan biskut warisan.",
          "nameLabel": "Nama Penuh",
          "mobileLabel": "No. Telefon",
          "emailLabel": "Email",
          "showName": true,
          "showMobile": true,
          "showEmail": true,
          "nameRequired": true,
          "mobileRequired": true,
          "emailRequired": false,
          "defaultCountryCode": "MY",
          "products": [
            {
              "id": "kuih-bangkit",
              "name": "Kuih Bangkit Premium",
              "description": "1 balang (45 biji)",
              "price": 32
            },
            {
              "id": "kuih-kapit",
              "name": "Kuih Kapit Rangup",
              "description": "1 balang (30 keping)",
              "price": 28
            },
            {
              "id": "biskut-dahlia",
              "name": "Biskut Dahlia",
              "description": "1 balang (40 biji)",
              "price": 30
            }
          ],
          "currency": "MYR",
          "submitButtonText": "Teruskan Pembayaran",
          "submitButtonColor": "#7c2d12",
          "bgColor": "#ffffff",
          "companyName": "Biskut Warisan",
          "companyRegistration": ""
        }
      },
      {
        "id": "warisan-testimonials",
        "type": "testimonials",
        "order": 6,
        "props": {
          "title": "Suara Pelanggan Setia",
          "variant": "slider",
          "testimonials": [
            {
              "name": "Puan Rosmah",
              "role": "Pelanggan Sejak 2010",
              "quote": "Kuih bangkit Biskut Warisan memang terbaik! Sama macam arwah nenek buat dulu. Setiap Raya mesti order sini.",
              "rating": 5
            },
            {
              "name": "Encik Hafiz",
              "role": "Penang",
              "quote": "Kuih kapit dia rangup dan wangi. Anak-anak suka sangat. Packaging pun cantik, sesuai untuk bagi boss.",
              "rating": 5
            },
            {
              "name": "Datin Seri Aminah",
              "role": "Shah Alam",
              "quote": "Setiap tahun order 20 balang untuk bagi sedara-mara. Kualiti konsisten dan tak pernah mengecewakan. Highly recommended!",
              "rating": 5
            }
          ],
          "bgColor": "#fef2f2"
        }
      },
      {
        "id": "warisan-faq",
        "type": "faq",
        "order": 7,
        "props": {
          "title": "Soalan Lazim",
          "variant": "two_column",
          "questions": [
            {
              "question": "Apakah yang membezakan Biskut Warisan?",
              "answer": "Kami menggunakan resipi yang sama sejak 1985 tanpa sebarang pengubahsuaian. Setiap biskut dibuat dengan tangan oleh tukang masak berpengalaman."
            },
            {
              "question": "Berapa lama tempoh kesahan biskut?",
              "answer": "Biskut kami tahan 4-5 minggu jika disimpan dalam bekas kedap udara. Kuih bangkit dan kapit boleh tahan lebih lama sehingga 6 minggu."
            },
            {
              "question": "Boleh customise pembungkusan?",
              "answer": "Ya! Kami menawarkan perkhidmatan pembungkusan khas untuk hadiah korporat dan majlis perkahwinan. Hubungi kami untuk sebut harga."
            },
            {
              "question": "Bagaimana dengan penghantaran?",
              "answer": "Penghantaran ke seluruh Semenanjung (2-3 hari) dan Sabah/Sarawak (5-7 hari). Percuma untuk pesanan RM200 ke atas."
            },
            {
              "question": "Ada jaminan pulangan wang?",
              "answer": "Ya, kami tawarkan jaminan 100% puas hati. Jika anda tidak berpuas hati dengan produk kami, wang akan dikembalikan sepenuhnya."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "warisan-cta",
        "type": "cta",
        "order": 8,
        "props": {
          "variant": "split",
          "headline": "Rasai Warisan Turun-Temurun",
          "description": "Tempah sekarang dan nikmati biskut berkualiti premium dengan resipi asli sejak 1985. Stok terhad!",
          "buttonText": "Tempah Sekarang",
          "buttonUrl": "#form_with_payment-5",
          "bgGradient": "linear-gradient(135deg, #7c2d12 0%, #991b1b 100%)"
        }
      },
      {
        "id": "warisan-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "BISKUT WARISAN",
          "description": "Meneruskan warisan rasa sejak 1985. Biskut tradisional berkualiti tinggi untuk keluarga Malaysia.",
          "copyright": "2026 Biskut Warisan. Hakcipta terpelihara.",
          "bgColor": "#7c2d12",
          "textColor": "#fef2f2",
          "columns": [
            {
              "title": "Pautan",
              "links": [
                { "label": "Koleksi Biskut", "url": "#product_carousel-4" },
                { "label": "Tempah Sekarang", "url": "#form_with_payment-5" },
                { "label": "Testimoni", "url": "#testimonials-6" },
                { "label": "FAQ", "url": "#faq-7" }
              ]
            },
            {
              "title": "Hubungi",
              "links": [
                { "label": "WhatsApp: +60 11-234 5678", "url": "https://wa.me/60112345678" },
                { "label": "Email: order@biskutwarisan.my", "url": "mailto:order@biskutwarisan.my" }
              ]
            }
          ],
          "socialLinks": [
            { "platform": "instagram", "url": "https://instagram.com" },
            { "platform": "facebook", "url": "https://facebook.com" }
          ]
        }
      }
    ],
    "seo_settings": {
      "title": "Biskut Warisan - Resipi Turun-Temurun Sejak 1985",
      "description": "Tempah biskut dan kuih raya tradisional dengan resipi asli sejak 1985. Kuih bangkit, kuih kapit, biskut dahlia. Penghantaran ke seluruh Malaysia.",
      "keywords": "biskut warisan, kuih bangkit, kuih kapit, biskut dahlia, kuih raya tradisional, biskut raya, malaysia"
    },
    "theme": {
      "primaryColor": "#7c2d12",
      "fontFamily": "Inter"
    }
  }'::jsonb
);


-- FILE: 20260204110002_add_rasa_tradisi_template.sql
-- Rasa Tradisi Template (E-commerce) - Variation 2
-- Theme: Emerald Green, Variants: hero=image_left, features=alternating, testimonials=masonry, faq=single_column, cta=banner
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Rasa Tradisi',
  'rasa-tradisi',
  'ecommerce',
  'Food & Beverage',
  'Template e-dagang segar dengan tema hijau zamrud untuk menjual kuih raya tradisional. Reka bentuk moden dengan sentuhan klasik.',
  'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=1200&h=800&fit=crop',
  true,
  ARRAY['rasa tradisi', 'kuih sarang semut', 'kuih ros', 'cornflakes madu', 'raya', 'ecommerce', 'tradisional', 'malaysia'],
  '{
    "elements": [
      {
        "id": "tradisi-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "Nikmati Rasa Asli Kampung - Diskaun 15% Untuk Pesanan Awal Raya 2026!",
          "bgColor": "#065f46",
          "textColor": "#ffffff",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": true,
          "countdownLabel": "Promosi tamat:",
          "countdownEndDate": "2026-02-28T23:59:59"
        }
      },
      {
        "id": "tradisi-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "RASA TRADISI",
          "logo": "",
          "menuItems": [
            { "label": "Produk", "url": "#product_carousel-4" },
            { "label": "Ulasan", "url": "#testimonials-6" },
            { "label": "Bantuan", "url": "#faq-7" }
          ],
          "bgColor": "#ecfdf5",
          "textColor": "#065f46",
          "isSticky": true,
          "layout": "split",
          "ctaButton": {
            "text": "Order Sekarang",
            "url": "#form_with_payment-5"
          }
        }
      },
      {
        "id": "tradisi-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_left",
          "headline": "Rasa Kampung Dalam Setiap Gigitan",
          "subheadline": "Kuih raya tradisional diperbuat dengan penuh kasih sayang menggunakan resipi asli kampung. Segar, sedap, dan penuh nostalgia.",
          "ctaText": "Lihat Menu",
          "ctaUrl": "#product_carousel-4",
          "image": "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=1920&q=80",
          "bgColor": "#ecfdf5",
          "headlineColor": "#065f46",
          "subheadlineColor": "#047857",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 100,
          "buttonBgColor": "#065f46",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "id": "tradisi-features",
        "type": "features",
        "order": 3,
        "props": {
          "title": "Mengapa Pilih Rasa Tradisi?",
          "variant": "alternating",
          "features": [
            {
              "icon": "leaf",
              "title": "Bahan Organik & Segar",
              "description": "Kami gunakan bahan-bahan segar dari ladang tempatan. Tiada pengawet, tiada pewarna tiruan."
            },
            {
              "icon": "home",
              "title": "Resipi Asli Kampung",
              "description": "Setiap kuih dibuat mengikut cara tradisional yang dipelajari daripada emak dan nenek kami."
            },
            {
              "icon": "heart",
              "title": "Dibuat Dengan Kasih",
              "description": "Setiap balang dibuat dengan penuh perhatian dan kasih sayang, seperti untuk keluarga sendiri."
            },
            {
              "icon": "star",
              "title": "Kualiti Premium",
              "description": "Hanya yang terbaik untuk pelanggan kami. Setiap kuih melalui kawalan kualiti yang ketat."
            },
            {
              "icon": "gift",
              "title": "Sesuai Untuk Hadiah",
              "description": "Pembungkusan cantik dan eksklusif. Sempurna untuk dijadikan buah tangan atau hadiah korporat."
            },
            {
              "icon": "zap",
              "title": "Penghantaran Pantas",
              "description": "Pesanan diproses dalam 24 jam. Penghantaran express tersedia untuk keperluan segera."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "tradisi-products",
        "type": "product_carousel",
        "order": 4,
        "props": {
          "title": "Menu Istimewa Kami",
          "subtitle": "Pilihan kuih raya tradisional yang diperbuat segar setiap hari.",
          "cardStyle": "bordered",
          "products": [
            {
              "id": "sarang-semut",
              "code": "RT-001",
              "name": "Kuih Sarang Semut",
              "description": "Kek kukus tradisional dengan tekstur berlubang unik seperti sarang semut. Lembut, manis, dan wangi gula hangus.",
              "image_url": "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&h=400&fit=crop",
              "base_price": 25,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "kuih-ros",
              "code": "RT-002",
              "name": "Kuih Ros",
              "description": "Kuih berbentuk bunga ros yang rangup dan cantik. Diperbuat daripada tepung beras dan santan. Ringan dan tidak berminyak.",
              "image_url": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=400&fit=crop",
              "base_price": 22,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "cornflakes-madu",
              "code": "RT-003",
              "name": "Cornflakes Madu",
              "description": "Cornflakes rangup disalut madu asli dan mentega. Manis semulajadi dan addictive! Kegemaran kanak-kanak dan dewasa.",
              "image_url": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&h=400&fit=crop",
              "base_price": 20,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "bgColor": "#ecfdf5"
        }
      },
      {
        "id": "tradisi-form-payment",
        "type": "form_with_payment",
        "order": 5,
        "props": {
          "title": "Borang Pesanan",
          "description": "Isi maklumat anda dan pilih kuih kegemaran untuk meneruskan pesanan.",
          "nameLabel": "Nama Penuh",
          "mobileLabel": "No. Telefon",
          "emailLabel": "Email",
          "showName": true,
          "showMobile": true,
          "showEmail": true,
          "nameRequired": true,
          "mobileRequired": true,
          "emailRequired": false,
          "defaultCountryCode": "MY",
          "products": [
            {
              "id": "sarang-semut",
              "name": "Kuih Sarang Semut",
              "description": "1 loyang (8 inci)",
              "price": 25
            },
            {
              "id": "kuih-ros",
              "name": "Kuih Ros",
              "description": "1 balang (35 biji)",
              "price": 22
            },
            {
              "id": "cornflakes-madu",
              "name": "Cornflakes Madu",
              "description": "1 balang (40 biji)",
              "price": 20
            }
          ],
          "currency": "MYR",
          "submitButtonText": "Bayar Sekarang",
          "submitButtonColor": "#065f46",
          "bgColor": "#ffffff",
          "companyName": "Rasa Tradisi",
          "companyRegistration": ""
        }
      },
      {
        "id": "tradisi-testimonials",
        "type": "testimonials",
        "order": 6,
        "props": {
          "title": "Kata Pelanggan",
          "variant": "masonry",
          "testimonials": [
            {
              "name": "Cik Farah",
              "role": "Petaling Jaya",
              "quote": "Kuih sarang semut dia memang authentic! Teringat masa kecil makan kat kampung. Terima kasih Rasa Tradisi!",
              "rating": 5
            },
            {
              "name": "Encik Rizal",
              "role": "Ipoh",
              "quote": "Cornflakes madu best gila. Anak-anak habiskan satu balang dalam sehari. Dah repeat order 3 kali!",
              "rating": 5
            },
            {
              "name": "Puan Salmah",
              "role": "Melaka",
              "quote": "Kuih ros cantik dan sedap. Bagi kat jiran semua puji. Packaging pun eco-friendly, suka sangat!",
              "rating": 5
            }
          ],
          "bgColor": "#ecfdf5"
        }
      },
      {
        "id": "tradisi-faq",
        "type": "faq",
        "order": 7,
        "props": {
          "title": "Soalan Lazim",
          "variant": "single_column",
          "questions": [
            {
              "question": "Adakah kuih dibuat fresh untuk setiap pesanan?",
              "answer": "Ya! Setiap pesanan dibuat segar mengikut tarikh penghantaran yang diminta. Kami tidak menyimpan stok lama."
            },
            {
              "question": "Berapa lama boleh tahan kuih ini?",
              "answer": "Kuih sarang semut tahan 1 minggu pada suhu bilik. Kuih ros dan cornflakes madu tahan 3-4 minggu dalam bekas kedap udara."
            },
            {
              "question": "Boleh request kurang manis?",
              "answer": "Boleh! Sila nyatakan dalam pesanan anda. Kami boleh sesuaikan tahap kemanisan mengikut citarasa anda."
            },
            {
              "question": "Ada pesanan minimum?",
              "answer": "Tiada pesanan minimum. Anda boleh order satu balang pun kami hantar dengan selamat."
            },
            {
              "question": "Bagaimana dengan penghantaran?",
              "answer": "Penghantaran tersedia ke seluruh Malaysia. Semenanjung: RM8-15, Sabah/Sarawak: RM18-25. Percuma untuk pesanan RM150+."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "tradisi-cta",
        "type": "cta",
        "order": 8,
        "props": {
          "variant": "banner",
          "headline": "Tempah Sekarang, Rasai Tradisi!",
          "description": "Jangan lepaskan peluang menikmati kuih raya tradisional yang segar dan sedap. Stok terhad untuk musim Raya ini!",
          "buttonText": "Order Sekarang",
          "buttonUrl": "#form_with_payment-5",
          "bgGradient": "linear-gradient(135deg, #065f46 0%, #047857 100%)"
        }
      },
      {
        "id": "tradisi-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "RASA TRADISI",
          "description": "Membawa rasa kampung ke rumah anda. Kuih tradisional segar untuk keluarga tercinta.",
          "copyright": "2026 Rasa Tradisi. Hakcipta terpelihara.",
          "bgColor": "#065f46",
          "textColor": "#ecfdf5",
          "columns": [
            {
              "title": "Menu",
              "links": [
                { "label": "Semua Produk", "url": "#product_carousel-4" },
                { "label": "Order Sekarang", "url": "#form_with_payment-5" },
                { "label": "Ulasan Pelanggan", "url": "#testimonials-6" },
                { "label": "Bantuan", "url": "#faq-7" }
              ]
            },
            {
              "title": "Hubungi",
              "links": [
                { "label": "WhatsApp: +60 13-456 7890", "url": "https://wa.me/60134567890" },
                { "label": "Email: hello@rasatradisi.my", "url": "mailto:hello@rasatradisi.my" }
              ]
            }
          ],
          "socialLinks": [
            { "platform": "instagram", "url": "https://instagram.com" },
            { "platform": "facebook", "url": "https://facebook.com" },
            { "platform": "tiktok", "url": "https://tiktok.com" }
          ]
        }
      }
    ],
    "seo_settings": {
      "title": "Rasa Tradisi - Kuih Raya Tradisional Segar",
      "description": "Tempah kuih raya tradisional segar diperbuat dengan resipi asli kampung. Kuih sarang semut, kuih ros, cornflakes madu. Penghantaran ke seluruh Malaysia.",
      "keywords": "rasa tradisi, kuih sarang semut, kuih ros, cornflakes madu, kuih raya tradisional, kuih kampung, malaysia"
    },
    "theme": {
      "primaryColor": "#065f46",
      "fontFamily": "Inter"
    }
  }'::jsonb
);


-- FILE: 20260204110003_add_citra_raya_template.sql
-- Citra Raya Template (E-commerce) - Variation 3
-- Theme: Royal Blue, Variants: hero=image_bg, features=grid, testimonials=grid, faq=two_column, cta=centered
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Citra Raya',
  'citra-raya',
  'ecommerce',
  'Food & Beverage',
  'Template e-dagang premium dengan tema biru diraja untuk menjual biskut raya eksklusif. Reka bentuk mewah dan profesional.',
  'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1200&h=800&fit=crop',
  true,
  ARRAY['citra raya', 'london almond', 'biskut mazola', 'biskut suji', 'raya', 'ecommerce', 'premium', 'malaysia'],
  '{
    "elements": [
      {
        "id": "citra-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "Koleksi Eksklusif Raya 2026 - Edisi Terhad, Tempah Sebelum Kehabisan!",
          "bgColor": "#1e3a8a",
          "textColor": "#ffffff",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": true,
          "countdownLabel": "Stok tamat dalam:",
          "countdownEndDate": "2026-03-01T23:59:59"
        }
      },
      {
        "id": "citra-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "CITRA RAYA",
          "logo": "",
          "menuItems": [
            { "label": "Koleksi", "url": "#product_carousel-4" },
            { "label": "Testimoni", "url": "#testimonials-6" },
            { "label": "FAQ", "url": "#faq-7" }
          ],
          "bgColor": "#eff6ff",
          "textColor": "#1e3a8a",
          "isSticky": true,
          "layout": "left",
          "ctaButton": {
            "text": "Beli Sekarang",
            "url": "#form_with_payment-5"
          }
        }
      },
      {
        "id": "citra-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Koleksi Eksklusif Citra Raya",
          "subheadline": "Biskut premium untuk tetamu istimewa. Diperbuat dengan bahan import berkualiti tinggi untuk pengalaman rasa yang tiada tandingan.",
          "ctaText": "Jelajah Koleksi",
          "ctaUrl": "#product_carousel-4",
          "image": "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1920&q=80",
          "bgColor": "#eff6ff",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#bfdbfe",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 60,
          "buttonBgColor": "#1e3a8a",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "id": "citra-features",
        "type": "features",
        "order": 3,
        "props": {
          "title": "Kelebihan Citra Raya",
          "variant": "grid",
          "features": [
            {
              "icon": "gem",
              "title": "Bahan Import Premium",
              "description": "Mentega Anchor, badam California, tepung Jepun - hanya yang terbaik untuk biskut kami."
            },
            {
              "icon": "award",
              "title": "Pemenang Anugerah",
              "description": "Pemenang Anugerah Biskut Raya Terbaik 2024 & 2025. Kualiti yang diiktiraf."
            },
            {
              "icon": "sparkles",
              "title": "Reka Bentuk Eksklusif",
              "description": "Setiap biskut direka dengan teliti untuk penampilan yang cantik dan menarik."
            },
            {
              "icon": "box",
              "title": "Pembungkusan Mewah",
              "description": "Kotak hadiah premium dengan ribbon emas. Sempurna untuk majlis rasmi dan hadiah VIP."
            },
            {
              "icon": "shield",
              "title": "Jaminan Kualiti",
              "description": "Setiap pesanan diperiksa dengan teliti sebelum penghantaran. Kepuasan dijamin."
            },
            {
              "icon": "clock",
              "title": "Fresh Made Daily",
              "description": "Biskut dibuat segar setiap hari mengikut pesanan. Tiada stok lama."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "citra-products",
        "type": "product_carousel",
        "order": 4,
        "props": {
          "title": "Koleksi Premium",
          "subtitle": "Biskut eksklusif dengan bahan import untuk pengalaman rasa yang tiada duanya.",
          "cardStyle": "shadow",
          "products": [
            {
              "id": "london-almond",
              "code": "CR-001",
              "name": "London Almond",
              "description": "Biskut mentega premium dengan taburan badam California panggang. Rangup di luar, lembut di dalam. Bestseller kami!",
              "image_url": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=400&fit=crop",
              "base_price": 45,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "biskut-mazola",
              "code": "CR-002",
              "name": "Biskut Mazola",
              "description": "Biskut klasik dengan rasa mentega yang pekat. Diperbuat daripada mentega tulen 100% tanpa minyak sayuran.",
              "image_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
              "base_price": 38,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "biskut-suji",
              "code": "CR-003",
              "name": "Biskut Suji Premium",
              "description": "Biskut suji lembut dengan tekstur yang unik. Diperbuat daripada suji import dan ghee tulen. Cair di mulut!",
              "image_url": "https://images.unsplash.com/photo-1486427944544-d2c246c4df14?w=600&h=400&fit=crop",
              "base_price": 42,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "bgColor": "#eff6ff"
        }
      },
      {
        "id": "citra-form-payment",
        "type": "form_with_payment",
        "order": 5,
        "props": {
          "title": "Borang Tempahan Eksklusif",
          "description": "Lengkapkan maklumat anda untuk menikmati koleksi premium Citra Raya.",
          "nameLabel": "Nama Penuh",
          "mobileLabel": "No. Telefon",
          "emailLabel": "Email",
          "showName": true,
          "showMobile": true,
          "showEmail": true,
          "nameRequired": true,
          "mobileRequired": true,
          "emailRequired": false,
          "defaultCountryCode": "MY",
          "products": [
            {
              "id": "london-almond",
              "name": "London Almond",
              "description": "1 balang premium (40 biji)",
              "price": 45
            },
            {
              "id": "biskut-mazola",
              "name": "Biskut Mazola",
              "description": "1 balang premium (45 biji)",
              "price": 38
            },
            {
              "id": "biskut-suji",
              "name": "Biskut Suji Premium",
              "description": "1 balang premium (40 biji)",
              "price": 42
            }
          ],
          "currency": "MYR",
          "submitButtonText": "Teruskan Pembayaran",
          "submitButtonColor": "#1e3a8a",
          "bgColor": "#ffffff",
          "companyName": "Citra Raya",
          "companyRegistration": ""
        }
      },
      {
        "id": "citra-testimonials",
        "type": "testimonials",
        "order": 6,
        "props": {
          "title": "Testimoni Pelanggan VIP",
          "variant": "grid",
          "testimonials": [
            {
              "name": "Dato Hamzah",
              "role": "CEO, Syarikat Hartanah",
              "quote": "Setiap tahun order untuk bagi clients dan partners. London Almond memang first class! Packaging pun impressive.",
              "rating": 5
            },
            {
              "name": "Datin Normah",
              "role": "Bangsar",
              "quote": "Biskut Citra Raya memang premium quality. Tetamu rumah terbuka semua impressed. Worth every sen!",
              "rating": 5
            },
            {
              "name": "Puan Marina",
              "role": "Event Planner",
              "quote": "Saya recommend Citra Raya untuk semua client saya. Kualiti konsisten dan presentation memang tip-top.",
              "rating": 5
            }
          ],
          "bgColor": "#eff6ff"
        }
      },
      {
        "id": "citra-faq",
        "type": "faq",
        "order": 7,
        "props": {
          "title": "Soalan Lazim",
          "variant": "two_column",
          "questions": [
            {
              "question": "Apa yang membuat Citra Raya berbeza?",
              "answer": "Kami hanya menggunakan bahan import berkualiti premium seperti mentega Anchor, badam California, dan tepung Jepun. Setiap biskut dibuat dengan teliti."
            },
            {
              "question": "Berapa lama biskut boleh tahan?",
              "answer": "Biskut kami tahan 4-6 minggu dalam bekas asal yang kedap udara. Disimpan di tempat sejuk dan kering."
            },
            {
              "question": "Ada pilihan corporate gift?",
              "answer": "Ya! Kami menawarkan pakej korporat dengan pembungkusan eksklusif, kad ucapan custom, dan diskaun untuk pesanan pukal."
            },
            {
              "question": "Boleh customise hamper?",
              "answer": "Boleh! Hubungi kami untuk mereka hamper mengikut bajet dan citarasa anda. Minimum 10 set untuk customisation."
            },
            {
              "question": "Bagaimana dengan penghantaran?",
              "answer": "Penghantaran percuma untuk semua pesanan. Express delivery (same day) tersedia untuk Klang Valley dengan caj tambahan RM15."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "citra-cta",
        "type": "cta",
        "order": 8,
        "props": {
          "variant": "centered",
          "headline": "Tempah Koleksi Eksklusif Anda",
          "description": "Nikmati biskut premium berkualiti tinggi untuk Hari Raya yang istimewa. Edisi terhad - tempah sekarang!",
          "buttonText": "Beli Sekarang",
          "buttonUrl": "#form_with_payment-5",
          "bgGradient": "linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)"
        }
      },
      {
        "id": "citra-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "CITRA RAYA",
          "description": "Biskut premium eksklusif untuk Hari Raya yang istimewa. Kualiti tanpa kompromi.",
          "copyright": "2026 Citra Raya. Hakcipta terpelihara.",
          "bgColor": "#1e3a8a",
          "textColor": "#eff6ff",
          "columns": [
            {
              "title": "Navigasi",
              "links": [
                { "label": "Koleksi Premium", "url": "#product_carousel-4" },
                { "label": "Tempah Sekarang", "url": "#form_with_payment-5" },
                { "label": "Testimoni VIP", "url": "#testimonials-6" },
                { "label": "FAQ", "url": "#faq-7" }
              ]
            },
            {
              "title": "Hubungi Kami",
              "links": [
                { "label": "WhatsApp: +60 17-888 9999", "url": "https://wa.me/60178889999" },
                { "label": "Email: vip@citraraya.my", "url": "mailto:vip@citraraya.my" }
              ]
            }
          ],
          "socialLinks": [
            { "platform": "instagram", "url": "https://instagram.com" },
            { "platform": "facebook", "url": "https://facebook.com" },
            { "platform": "linkedin", "url": "https://linkedin.com" }
          ]
        }
      }
    ],
    "seo_settings": {
      "title": "Citra Raya - Biskut Premium Eksklusif Hari Raya 2026",
      "description": "Tempah biskut raya premium dengan bahan import berkualiti tinggi. London Almond, Biskut Mazola, Biskut Suji. Penghantaran percuma ke seluruh Malaysia.",
      "keywords": "citra raya, london almond, biskut mazola, biskut suji, biskut premium, biskut raya eksklusif, malaysia"
    },
    "theme": {
      "primaryColor": "#1e3a8a",
      "fontFamily": "Inter"
    }
  }'::jsonb
);


-- FILE: 20260204110004_add_aroma_kampung_template.sql
-- Aroma Kampung Template (E-commerce) - Variation 4
-- Theme: Warm Brown, Variants: hero=centered, features=alternating, testimonials=slider, faq=single_column, cta=split
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Aroma Kampung',
  'aroma-kampung',
  'ecommerce',
  'Food & Beverage',
  'Template e-dagang rustic dengan tema coklat hangat untuk menjual biskut tradisional kampung. Reka bentuk mesra dan homey.',
  'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=1200&h=800&fit=crop',
  true,
  ARRAY['aroma kampung', 'kuih siput', 'biskut kacang tanah', 'lidah kucing', 'raya', 'ecommerce', 'kampung', 'malaysia'],
  '{
    "elements": [
      {
        "id": "kampung-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "Dari Dapur Kampung Ke Rumah Anda - Penghantaran Percuma Pesanan RM100+!",
          "bgColor": "#78350f",
          "textColor": "#ffffff",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": true,
          "countdownLabel": "Tawaran istimewa tamat:",
          "countdownEndDate": "2026-03-20T23:59:59"
        }
      },
      {
        "id": "kampung-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "AROMA KAMPUNG",
          "logo": "",
          "menuItems": [
            { "label": "Biskut Kami", "url": "#product_carousel-4" },
            { "label": "Cerita Pelanggan", "url": "#testimonials-6" },
            { "label": "Bantuan", "url": "#faq-7" }
          ],
          "bgColor": "#fef3c7",
          "textColor": "#78350f",
          "isSticky": true,
          "layout": "center",
          "ctaButton": {
            "text": "Tempah Sekarang",
            "url": "#form_with_payment-5"
          }
        }
      },
      {
        "id": "kampung-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "centered",
          "headline": "Aroma Kampung, Rasa Keluarga",
          "subheadline": "Biskut tradisional dibuat dengan penuh kasih sayang seperti emak buat. Setiap gigitan membawa anda pulang ke kampung halaman.",
          "ctaText": "Lihat Pilihan",
          "ctaUrl": "#product_carousel-4",
          "image": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=1920&q=80",
          "bgColor": "#fef3c7",
          "headlineColor": "#78350f",
          "subheadlineColor": "#92400e",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 100,
          "buttonBgColor": "#78350f",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "id": "kampung-features",
        "type": "features",
        "order": 3,
        "props": {
          "title": "Kenapa Aroma Kampung Istimewa?",
          "variant": "alternating",
          "features": [
            {
              "icon": "home",
              "title": "Resipi Emak & Nenek",
              "description": "Setiap biskut dibuat mengikut resipi turun-temurun yang diwarisi dari emak dan nenek kami di kampung."
            },
            {
              "icon": "flame",
              "title": "Dibakar Dengan Kayu Api",
              "description": "Biskut tertentu masih dibakar menggunakan ketuhar kayu api tradisional untuk rasa yang autentik."
            },
            {
              "icon": "leaf",
              "title": "Bahan Tempatan Segar",
              "description": "Kami gunakan kelapa parut segar, gula melaka asli, dan bahan-bahan dari kampung sendiri."
            },
            {
              "icon": "users",
              "title": "Dibuat Oleh Makcik-Makcik",
              "description": "Pasukan kami terdiri daripada makcik-makcik berpengalaman yang mahir membuat kuih tradisional."
            },
            {
              "icon": "heart",
              "title": "Dengan Penuh Kasih Sayang",
              "description": "Setiap balang diisi dengan kasih sayang dan doa agar pembeli sekeluarga sihat dan bahagia."
            },
            {
              "icon": "package",
              "title": "Pembungkusan Mesra Alam",
              "description": "Kami gunakan pembungkusan mesra alam - daun pisang, kertas kraf, dan bahan yang boleh dikitar semula."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "kampung-products",
        "type": "product_carousel",
        "order": 4,
        "props": {
          "title": "Biskut Pilihan Kampung",
          "subtitle": "Setiap biskut diperbuat segar dengan bahan tempatan berkualiti.",
          "cardStyle": "minimal",
          "products": [
            {
              "id": "kuih-siput",
              "code": "AK-001",
              "name": "Kuih Siput",
              "description": "Kuih siput rangup berbentuk spiral yang unik. Digoreng sempurna dengan minyak kelapa. Manis dan gurih seimbang.",
              "image_url": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=400&fit=crop",
              "base_price": 18,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "biskut-kacang",
              "code": "AK-002",
              "name": "Biskut Kacang Tanah",
              "description": "Biskut kacang tanah rangup dengan taburan kacang yang banyak. Diperbuat daripada kacang tanah panggang segar.",
              "image_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
              "base_price": 20,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "lidah-kucing",
              "code": "AK-003",
              "name": "Lidah Kucing",
              "description": "Biskut nipis berbentuk lidah kucing yang rangup dan lembut. Diperbuat daripada mentega dan telur segar.",
              "image_url": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&h=400&fit=crop",
              "base_price": 22,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "bgColor": "#fef3c7"
        }
      },
      {
        "id": "kampung-form-payment",
        "type": "form_with_payment",
        "order": 5,
        "props": {
          "title": "Borang Tempahan",
          "description": "Isi maklumat anda untuk meneruskan pesanan biskut kampung.",
          "nameLabel": "Nama",
          "mobileLabel": "No. Telefon",
          "emailLabel": "Email",
          "showName": true,
          "showMobile": true,
          "showEmail": true,
          "nameRequired": true,
          "mobileRequired": true,
          "emailRequired": false,
          "defaultCountryCode": "MY",
          "products": [
            {
              "id": "kuih-siput",
              "name": "Kuih Siput",
              "description": "1 balang (50 biji)",
              "price": 18
            },
            {
              "id": "biskut-kacang",
              "name": "Biskut Kacang Tanah",
              "description": "1 balang (45 biji)",
              "price": 20
            },
            {
              "id": "lidah-kucing",
              "name": "Lidah Kucing",
              "description": "1 balang (60 keping)",
              "price": 22
            }
          ],
          "currency": "MYR",
          "submitButtonText": "Bayar Sekarang",
          "submitButtonColor": "#78350f",
          "bgColor": "#ffffff",
          "companyName": "Aroma Kampung",
          "companyRegistration": ""
        }
      },
      {
        "id": "kampung-testimonials",
        "type": "testimonials",
        "order": 6,
        "props": {
          "title": "Cerita Pelanggan Kami",
          "variant": "slider",
          "testimonials": [
            {
              "name": "Mak Cik Zainab",
              "role": "Kelantan",
              "quote": "Teringat masak kat kampung dulu. Biskut kacang tanah dia memang sama macam arwah mak buat. Sedap sangat!",
              "rating": 5
            },
            {
              "name": "Abang Rashid",
              "role": "Kuala Lumpur",
              "quote": "Dah lama cari kuih siput yang rangup macam ni. Aroma Kampung memang deliver! Rasa authentic kampung.",
              "rating": 5
            },
            {
              "name": "Kak Lina",
              "role": "Johor",
              "quote": "Lidah kucing dia nipis dan lembut. Anak-anak suka sangat. Packaging pun cute dengan daun pisang!",
              "rating": 5
            }
          ],
          "bgColor": "#fef3c7"
        }
      },
      {
        "id": "kampung-faq",
        "type": "faq",
        "order": 7,
        "props": {
          "title": "Soalan Lazim",
          "variant": "single_column",
          "questions": [
            {
              "question": "Di mana biskut ini dibuat?",
              "answer": "Semua biskut dibuat di kampung kami di Perak. Makcik-makcik kami buat setiap hari dengan penuh kasih sayang."
            },
            {
              "question": "Berapa lama biskut boleh tahan?",
              "answer": "Biskut kami tahan 2-3 minggu pada suhu bilik. Simpan dalam bekas kedap udara untuk kekalkan kerenyahan."
            },
            {
              "question": "Ada pesanan minimum?",
              "answer": "Tiada pesanan minimum. Order satu balang pun kami buat dengan penuh kasih sayang yang sama."
            },
            {
              "question": "Penghantaran ke mana saja?",
              "answer": "Kami hantar ke seluruh Malaysia. Semenanjung: RM8-12, Sabah/Sarawak: RM15-20. Percuma untuk pesanan RM100+."
            },
            {
              "question": "Boleh order untuk kenduri?",
              "answer": "Boleh! Kami terima tempahan pukal untuk kenduri dan majlis. WhatsApp kami untuk harga borong."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "kampung-cta",
        "type": "cta",
        "order": 8,
        "props": {
          "variant": "split",
          "headline": "Rindu Kampung? Kami Ada Jawapannya",
          "description": "Tempah biskut tradisional kami dan bawa aroma kampung ke rumah anda. Dibuat dengan kasih sayang!",
          "buttonText": "Tempah Sekarang",
          "buttonUrl": "#form_with_payment-5",
          "bgGradient": "linear-gradient(135deg, #78350f 0%, #92400e 100%)"
        }
      },
      {
        "id": "kampung-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "AROMA KAMPUNG",
          "description": "Membawa aroma kampung ke rumah anda. Biskut tradisional dengan kasih sayang.",
          "copyright": "2026 Aroma Kampung. Hakcipta terpelihara.",
          "bgColor": "#78350f",
          "textColor": "#fef3c7",
          "columns": [
            {
              "title": "Menu",
              "links": [
                { "label": "Biskut Kami", "url": "#product_carousel-4" },
                { "label": "Tempah", "url": "#form_with_payment-5" },
                { "label": "Cerita Pelanggan", "url": "#testimonials-6" },
                { "label": "Bantuan", "url": "#faq-7" }
              ]
            },
            {
              "title": "Hubungi",
              "links": [
                { "label": "WhatsApp: +60 19-555 6666", "url": "https://wa.me/60195556666" },
                { "label": "Email: salam@aromakampung.my", "url": "mailto:salam@aromakampung.my" }
              ]
            }
          ],
          "socialLinks": [
            { "platform": "instagram", "url": "https://instagram.com" },
            { "platform": "facebook", "url": "https://facebook.com" }
          ]
        }
      }
    ],
    "seo_settings": {
      "title": "Aroma Kampung - Biskut Tradisional Kampung",
      "description": "Tempah biskut tradisional kampung diperbuat dengan kasih sayang. Kuih siput, biskut kacang tanah, lidah kucing. Penghantaran ke seluruh Malaysia.",
      "keywords": "aroma kampung, kuih siput, biskut kacang tanah, lidah kucing, biskut kampung, kuih tradisional, malaysia"
    },
    "theme": {
      "primaryColor": "#78350f",
      "fontFamily": "Inter"
    }
  }'::jsonb
);


-- FILE: 20260204110005_add_permata_hari_raya_template.sql
-- Permata Hari Raya Template (E-commerce) - Variation 5
-- Theme: Rose Pink, Variants: hero=image_left, features=list, testimonials=masonry, faq=two_column, cta=banner
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Permata Hari Raya',
  'permata-hari-raya',
  'ecommerce',
  'Food & Beverage',
  'Template e-dagang feminin dengan tema merah jambu untuk menjual biskut raya eksklusif. Reka bentuk elegan dan anggun.',
  'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=1200&h=800&fit=crop',
  true,
  ARRAY['permata hari raya', 'biskut arab', 'kuih batang buruk', 'almond london', 'raya', 'ecommerce', 'feminin', 'malaysia'],
  '{
    "elements": [
      {
        "id": "permata-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "Koleksi Istimewa Hari Raya 2026 - Hadiah Percuma Untuk 100 Pembeli Pertama!",
          "bgColor": "#9d174d",
          "textColor": "#ffffff",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": true,
          "countdownLabel": "Tawaran istimewa berakhir:",
          "countdownEndDate": "2026-03-05T23:59:59"
        }
      },
      {
        "id": "permata-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "PERMATA RAYA",
          "logo": "",
          "menuItems": [
            { "label": "Koleksi", "url": "#product_carousel-4" },
            { "label": "Reviews", "url": "#testimonials-6" },
            { "label": "FAQ", "url": "#faq-7" }
          ],
          "bgColor": "#fdf2f8",
          "textColor": "#9d174d",
          "isSticky": true,
          "layout": "split",
          "ctaButton": {
            "text": "Beli Sekarang",
            "url": "#form_with_payment-5"
          }
        }
      },
      {
        "id": "permata-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_left",
          "headline": "Permata Manis Hari Raya",
          "subheadline": "Biskut cantik dan sedap untuk meriahkan sambutan Hari Raya anda. Setiap balang adalah permata yang berharga.",
          "ctaText": "Lihat Koleksi",
          "ctaUrl": "#product_carousel-4",
          "image": "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=1920&q=80",
          "bgColor": "#fdf2f8",
          "headlineColor": "#9d174d",
          "subheadlineColor": "#be185d",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 100,
          "buttonBgColor": "#9d174d",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "id": "permata-features",
        "type": "features",
        "order": 3,
        "props": {
          "title": "Kelebihan Permata Raya",
          "variant": "list",
          "features": [
            {
              "icon": "sparkles",
              "title": "Reka Bentuk Cantik",
              "description": "Setiap biskut direka dengan teliti untuk penampilan yang cantik dan menarik. Sesuai untuk Instagram!"
            },
            {
              "icon": "heart",
              "title": "Dibuat Dengan Cinta",
              "description": "Setiap balang diisi dengan penuh kasih sayang oleh pasukan wanita kami yang berdedikasi."
            },
            {
              "icon": "gift",
              "title": "Pembungkusan Eksklusif",
              "description": "Kotak hadiah pink dengan ribbon satin. Sempurna untuk dijadikan hadiah atau hantaran."
            },
            {
              "icon": "award",
              "title": "Bahan Berkualiti",
              "description": "Hanya menggunakan bahan premium seperti mentega New Zealand dan badam Australia."
            },
            {
              "icon": "truck",
              "title": "Penghantaran Selamat",
              "description": "Biskut dibungkus dengan teliti dalam kotak khas untuk memastikan sampai dalam keadaan sempurna."
            },
            {
              "icon": "star",
              "title": "5 Bintang Rating",
              "description": "Lebih 2000 ulasan 5 bintang dari pelanggan yang berpuas hati di seluruh Malaysia."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "permata-products",
        "type": "product_carousel",
        "order": 4,
        "props": {
          "title": "Koleksi Permata",
          "subtitle": "Biskut cantik dan sedap yang menjadi kegemaran ramai.",
          "cardStyle": "bordered",
          "products": [
            {
              "id": "biskut-arab",
              "code": "PR-001",
              "name": "Biskut Arab",
              "description": "Biskut lembut dengan inti kurma Medjool premium. Dibalut dengan tepung gula halus. Manis dan mewah!",
              "image_url": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=400&fit=crop",
              "base_price": 38,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "batang-buruk",
              "code": "PR-002",
              "name": "Kuih Batang Buruk",
              "description": "Kuih tradisional berbentuk batang yang rangup. Diperbuat daripada tepung beras dan kelapa. Renyah dan sedap!",
              "image_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
              "base_price": 25,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "almond-london",
              "code": "PR-003",
              "name": "Almond London",
              "description": "Biskut mentega dengan badam utuh di tengah, disalut coklat premium. Klasik yang tidak pernah lapuk!",
              "image_url": "https://images.unsplash.com/photo-1486427944544-d2c246c4df14?w=600&h=400&fit=crop",
              "base_price": 42,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "bgColor": "#fdf2f8"
        }
      },
      {
        "id": "permata-form-payment",
        "type": "form_with_payment",
        "order": 5,
        "props": {
          "title": "Borang Tempahan",
          "description": "Lengkapkan maklumat anda untuk meneruskan pembelian biskut Permata Raya.",
          "nameLabel": "Nama Penuh",
          "mobileLabel": "No. Telefon",
          "emailLabel": "Email",
          "showName": true,
          "showMobile": true,
          "showEmail": true,
          "nameRequired": true,
          "mobileRequired": true,
          "emailRequired": false,
          "defaultCountryCode": "MY",
          "products": [
            {
              "id": "biskut-arab",
              "name": "Biskut Arab",
              "description": "1 balang cantik (35 biji)",
              "price": 38
            },
            {
              "id": "batang-buruk",
              "name": "Kuih Batang Buruk",
              "description": "1 balang cantik (40 batang)",
              "price": 25
            },
            {
              "id": "almond-london",
              "name": "Almond London",
              "description": "1 balang cantik (30 biji)",
              "price": 42
            }
          ],
          "currency": "MYR",
          "submitButtonText": "Teruskan Pembayaran",
          "submitButtonColor": "#9d174d",
          "bgColor": "#ffffff",
          "companyName": "Permata Hari Raya",
          "companyRegistration": ""
        }
      },
      {
        "id": "permata-testimonials",
        "type": "testimonials",
        "order": 6,
        "props": {
          "title": "Apa Kata Mereka",
          "variant": "masonry",
          "testimonials": [
            {
              "name": "Sis Aina",
              "role": "Influencer",
              "quote": "Cantiknyaaa packaging dia! Biskut pun sedap gila. Perfect for Raya! Dah share kat IG stories, semua tanya beli mana.",
              "rating": 5
            },
            {
              "name": "Puan Halimah",
              "role": "Selangor",
              "quote": "Biskut Arab dia memang terbaik! Kurma dalam tu mewah sangat. Sesuai sangat untuk hidang tetamu VIP.",
              "rating": 5
            },
            {
              "name": "Cik Diana",
              "role": "Penang",
              "quote": "Almond London best ever! Coklat tebal dan badam besar. Order untuk hantaran tunang, semua puji!",
              "rating": 5
            }
          ],
          "bgColor": "#fdf2f8"
        }
      },
      {
        "id": "permata-faq",
        "type": "faq",
        "order": 7,
        "props": {
          "title": "Soalan Lazim",
          "variant": "two_column",
          "questions": [
            {
              "question": "Boleh customise warna packaging?",
              "answer": "Ya! Kami tawarkan pilihan warna pink, gold, dan mint green. Sila nyatakan pilihan semasa tempahan."
            },
            {
              "question": "Berapa lama biskut boleh tahan?",
              "answer": "Biskut kami tahan 4-5 minggu dalam bekas asal. Untuk kesegaran maksimum, simpan di tempat sejuk dan kering."
            },
            {
              "question": "Ada perkhidmatan untuk hantaran?",
              "answer": "Ada! Kami menawarkan pakej hantaran lengkap dengan dulang dan hiasan. Hubungi kami untuk maklumat lanjut."
            },
            {
              "question": "Boleh print nama pada balang?",
              "answer": "Boleh! Perkhidmatan personalisasi tersedia untuk pesanan minimum 10 balang. Tambahan RM3 sebalang."
            },
            {
              "question": "Bagaimana dengan penghantaran?",
              "answer": "Penghantaran ke seluruh Malaysia. Semenanjung: RM10-15, Sabah/Sarawak: RM20-25. Percuma untuk pesanan RM200+."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "permata-cta",
        "type": "cta",
        "order": 8,
        "props": {
          "variant": "banner",
          "headline": "Jadikan Raya Anda Lebih Istimewa",
          "description": "Tempah biskut Permata Raya sekarang dan nikmati keindahan dalam setiap gigitan. Hadiah percuma untuk 100 pembeli pertama!",
          "buttonText": "Beli Sekarang",
          "buttonUrl": "#form_with_payment-5",
          "bgGradient": "linear-gradient(135deg, #9d174d 0%, #be185d 100%)"
        }
      },
      {
        "id": "permata-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "PERMATA RAYA",
          "description": "Biskut cantik dan sedap untuk Hari Raya yang istimewa. Setiap balang adalah permata.",
          "copyright": "2026 Permata Hari Raya. Hakcipta terpelihara.",
          "bgColor": "#9d174d",
          "textColor": "#fdf2f8",
          "columns": [
            {
              "title": "Pautan",
              "links": [
                { "label": "Koleksi Biskut", "url": "#product_carousel-4" },
                { "label": "Beli Sekarang", "url": "#form_with_payment-5" },
                { "label": "Reviews", "url": "#testimonials-6" },
                { "label": "FAQ", "url": "#faq-7" }
              ]
            },
            {
              "title": "Hubungi Kami",
              "links": [
                { "label": "WhatsApp: +60 16-777 8888", "url": "https://wa.me/60167778888" },
                { "label": "Email: love@permataraya.my", "url": "mailto:love@permataraya.my" }
              ]
            }
          ],
          "socialLinks": [
            { "platform": "instagram", "url": "https://instagram.com" },
            { "platform": "facebook", "url": "https://facebook.com" },
            { "platform": "tiktok", "url": "https://tiktok.com" }
          ]
        }
      }
    ],
    "seo_settings": {
      "title": "Permata Hari Raya - Biskut Cantik Untuk Raya Istimewa",
      "description": "Tempah biskut raya cantik dan sedap. Biskut Arab, Kuih Batang Buruk, Almond London. Pembungkusan eksklusif untuk hadiah dan hantaran.",
      "keywords": "permata hari raya, biskut arab, kuih batang buruk, almond london, biskut cantik, biskut raya, hantaran raya, malaysia"
    },
    "theme": {
      "primaryColor": "#9d174d",
      "fontFamily": "Inter"
    }
  }'::jsonb
);


-- FILE: 20260204120001_add_lens_moments_template.sql
-- Lens & Moments Template (Event Photography) - Variation 1
-- Theme: Deep Purple, Variants: hero=image_left, features=list, testimonials=slider, pricing=cards
INSERT INTO templates (
  id, name, slug, category, industry, description, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Lens & Moments',
  'lens-moments',
  'services',
  'Photography',
  'Professional event photography service page for corporate events, parties, and celebrations. Features packages, portfolio showcase, and booking form.',
  true,
  ARRAY['event', 'photography', 'services', 'packages', 'booking', 'corporate', 'party'],
  '{
    "elements": [
      {
        "id": "lens-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "Now Booking for 2026 Events - Early Bird Discount 15% Off!",
          "bgColor": "#581c87",
          "textColor": "#f3e8ff",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": true,
          "countdownLabel": "Early bird ends:",
          "countdownEndDate": "2026-03-31T23:59:59"
        }
      },
      {
        "id": "lens-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "LENS & MOMENTS",
          "logo": "",
          "menuItems": [
            { "label": "Home", "url": "#hero-2" },
            { "label": "Packages", "url": "#pricing-4" },
            { "label": "Why Us", "url": "#features-5" },
            { "label": "Book Now", "url": "#form_with_payment-6" }
          ],
          "bgColor": "#faf5ff",
          "textColor": "#581c87",
          "isSticky": true,
          "layout": "center",
          "ctaButton": {
            "text": "Get Quote",
            "url": "#form_with_payment-6"
          }
        }
      },
      {
        "id": "lens-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_left",
          "headline": "Capturing Every Moment That Matters",
          "subheadline": "Professional event photography for corporate functions, gala dinners, product launches, and celebrations. We turn your events into lasting memories.",
          "ctaText": "View Packages",
          "ctaUrl": "#pricing-4",
          "image": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&q=80",
          "bgColor": "#faf5ff",
          "headlineColor": "#581c87",
          "subheadlineColor": "#7c3aed",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 100,
          "buttonBgColor": "#581c87",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "id": "lens-pricing",
        "type": "pricing",
        "order": 4,
        "props": {
          "title": "Event Photography Packages",
          "subtitle": "Professional coverage for events of all sizes",
          "layout": "cards",
          "enablePaymentIntegration": false,
          "plans": [
            {
              "name": "Half Day",
              "price": "1,500",
              "currency": "RM",
              "period": "event",
              "description": "Perfect for short events and small gatherings",
              "image": "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
              "features": [
                "4 Hours Coverage",
                "1 Photographer",
                "150+ Edited Photos",
                "Online Gallery",
                "Digital Downloads",
                "Quick Turnaround (7 days)"
              ],
              "buttonText": "Choose Half Day",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": false
            },
            {
              "name": "Full Day",
              "price": "2,800",
              "currency": "RM",
              "period": "event",
              "description": "Complete coverage for full-day corporate events",
              "image": "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80",
              "features": [
                "8 Hours Coverage",
                "2 Photographers",
                "300+ Edited Photos",
                "Online Gallery + USB",
                "Same-Day Preview (20 photos)",
                "Event Highlights Slideshow",
                "Social Media Ready Images"
              ],
              "buttonText": "Choose Full Day",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": true
            },
            {
              "name": "Premium",
              "price": "5,000",
              "currency": "RM",
              "period": "event",
              "description": "Multi-day events and VIP functions",
              "image": "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
              "features": [
                "Up to 2 Days Coverage",
                "3 Photographers",
                "500+ Edited Photos",
                "Event Videography (3-5 min)",
                "Drone Aerial Shots",
                "Express Delivery (3 days)",
                "Dedicated Project Manager",
                "Printed Photo Book"
              ],
              "buttonText": "Choose Premium",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": false
            }
          ]
        }
      },
      {
        "id": "lens-features",
        "type": "features",
        "order": 5,
        "props": {
          "title": "Why Choose Lens & Moments",
          "variant": "list",
          "features": [
            {
              "icon": "camera",
              "title": "Professional Equipment",
              "description": "State-of-the-art cameras, lenses, and lighting equipment to capture stunning images in any environment."
            },
            {
              "icon": "users",
              "title": "Experienced Team",
              "description": "Over 200 corporate events photographed. We understand business etiquette and event flow."
            },
            {
              "icon": "zap",
              "title": "Fast Turnaround",
              "description": "Get your edited photos within 3-7 days. Same-day previews available for urgent needs."
            },
            {
              "icon": "shield",
              "title": "Insured & Professional",
              "description": "Fully insured with professional liability coverage. We sign NDAs for confidential events."
            },
            {
              "icon": "image",
              "title": "Variety of Shots",
              "description": "From candid moments to formal group photos, stage coverage to networking shots - we capture it all."
            },
            {
              "icon": "award",
              "title": "Award-Winning Quality",
              "description": "Recipient of Best Event Photography 2024 & 2025. Your event deserves the best."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "lens-form-payment",
        "type": "form_with_payment",
        "order": 6,
        "props": {
          "title": "Book Your Event Photography",
          "description": "Secure your date with a booking deposit. Tell us about your event and we will get back to you.",
          "submitButtonText": "Book & Pay Deposit",
          "submitButtonColor": "#581c87",
          "showName": true,
          "showMobile": true,
          "showEmail": true,
          "nameRequired": true,
          "mobileRequired": true,
          "emailRequired": true,
          "defaultCountryCode": "MY",
          "products": [
            {
              "id": "event-halfday",
              "name": "Half Day Package - Deposit",
              "description": "4 Hours, 1 Photographer, 150+ Photos",
              "price": 300
            },
            {
              "id": "event-fullday",
              "name": "Full Day Package - Deposit",
              "description": "8 Hours, 2 Photographers, 300+ Photos",
              "price": 500,
              "featured": true
            },
            {
              "id": "event-premium",
              "name": "Premium Package - Deposit",
              "description": "2 Days, 3 Photographers, Video, Drone",
              "price": 1000
            }
          ],
          "currency": "MYR",
          "bgColor": "#faf5ff",
          "companyName": "Lens & Moments Photography",
          "companyRegistration": ""
        }
      },
      {
        "id": "lens-testimonials",
        "type": "testimonials",
        "order": 7,
        "props": {
          "title": "What Our Clients Say",
          "variant": "slider",
          "testimonials": [
            {
              "name": "Maybank Corporate",
              "role": "Annual Gala Dinner 2025",
              "quote": "Lens & Moments delivered exceptional coverage of our 500-pax gala dinner. The team was professional and the photos were delivered within 5 days. Highly recommended!",
              "rating": 5
            },
            {
              "name": "TechStart Malaysia",
              "role": "Product Launch Event",
              "quote": "They captured every detail of our product launch perfectly. The same-day preview helped us share on social media immediately. Great work!",
              "rating": 5
            },
            {
              "name": "Hilton KL",
              "role": "Wedding Exhibition 2025",
              "quote": "We hired them for our 3-day exhibition. Professional, punctual, and the quality of photos was outstanding. Will definitely work with them again.",
              "rating": 5
            }
          ],
          "bgColor": "#faf5ff"
        }
      },
      {
        "id": "lens-whatsapp",
        "type": "whatsapp_button",
        "order": 8,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Hi! I am interested in your event photography services. I would like to get a quote for my upcoming event.",
          "buttonText": "WhatsApp Us",
          "buttonColor": "#25D366",
          "buttonSize": "md",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true
        }
      },
      {
        "id": "lens-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "Lens & Moments",
          "description": "Professional event photography that captures every moment",
          "copyright": "2026 Lens & Moments Photography. All rights reserved.",
          "bgColor": "#581c87",
          "textColor": "#f3e8ff",
          "columns": [
            {
              "title": "Quick Links",
              "links": [
                { "label": "Packages", "url": "#pricing-4" },
                { "label": "Why Choose Us", "url": "#features-5" },
                { "label": "Book Now", "url": "#form_with_payment-6" },
                { "label": "Reviews", "url": "#testimonials-7" }
              ]
            },
            {
              "title": "Services",
              "links": [
                { "label": "Corporate Events", "url": "#" },
                { "label": "Gala Dinners", "url": "#" },
                { "label": "Product Launches", "url": "#" },
                { "label": "Conferences", "url": "#" }
              ]
            }
          ],
          "socialLinks": [
            { "platform": "instagram", "url": "https://instagram.com" },
            { "platform": "facebook", "url": "https://facebook.com" },
            { "platform": "linkedin", "url": "https://linkedin.com" }
          ]
        }
      }
    ],
    "seo_settings": {
      "title": "Lens & Moments - Professional Event Photography",
      "description": "Capture your corporate events, gala dinners, and celebrations with our professional photography services. Fast turnaround and stunning quality.",
      "keywords": "event photography, corporate photography, gala dinner, product launch, conference photography, event photographer malaysia"
    },
    "theme": {
      "primaryColor": "#581c87",
      "fontFamily": "Inter"
    }
  }'::jsonb
);


-- FILE: 20260204120002_add_golden_hour_studios_template.sql
-- Golden Hour Studios Template (Portrait Photography) - Variation 2
-- Theme: Golden/Amber, Variants: hero=image_bg, features=alternating, testimonials=masonry, pricing=cards
INSERT INTO templates (
  id, name, slug, category, industry, description, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Golden Hour Studios',
  'golden-hour-studios',
  'services',
  'Photography',
  'Professional portrait photography studio for personal branding, headshots, and creative portraits. Warm and inviting aesthetic.',
  true,
  ARRAY['portrait', 'photography', 'headshots', 'personal branding', 'studio', 'professional'],
  '{
    "elements": [
      {
        "id": "golden-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "Spring Special - Free Hair & Makeup Touch-up With Every Portrait Session!",
          "bgColor": "#b45309",
          "textColor": "#fef3c7",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": true,
          "countdownLabel": "Offer ends:",
          "countdownEndDate": "2026-04-30T23:59:59"
        }
      },
      {
        "id": "golden-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "GOLDEN HOUR STUDIOS",
          "logo": "",
          "menuItems": [
            { "label": "Home", "url": "#hero-2" },
            { "label": "Sessions", "url": "#pricing-4" },
            { "label": "About", "url": "#features-5" },
            { "label": "Book", "url": "#form_with_payment-6" }
          ],
          "bgColor": "#fffbeb",
          "textColor": "#b45309",
          "isSticky": true,
          "layout": "split",
          "ctaButton": {
            "text": "Book Session",
            "url": "#form_with_payment-6"
          }
        }
      },
      {
        "id": "golden-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Your Story, Beautifully Told",
          "subheadline": "Professional portrait photography that captures your authentic self. From personal branding to creative portraits, we bring out the best in you.",
          "ctaText": "Explore Sessions",
          "ctaUrl": "#pricing-4",
          "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80",
          "bgColor": "#fffbeb",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#fef3c7",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 55,
          "buttonBgColor": "#b45309",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "id": "golden-pricing",
        "type": "pricing",
        "order": 4,
        "props": {
          "title": "Portrait Sessions",
          "subtitle": "Choose the perfect session for your needs",
          "layout": "cards",
          "enablePaymentIntegration": false,
          "plans": [
            {
              "name": "Mini Session",
              "price": "350",
              "currency": "RM",
              "period": "session",
              "description": "Quick refresh for your social profiles",
              "image": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
              "features": [
                "30 Minutes Session",
                "1 Outfit / 1 Look",
                "10 Edited Photos",
                "Online Gallery",
                "Digital Downloads",
                "1 Week Delivery"
              ],
              "buttonText": "Book Mini",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": false
            },
            {
              "name": "Signature",
              "price": "750",
              "currency": "RM",
              "period": "session",
              "description": "Complete personal branding experience",
              "image": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
              "features": [
                "1.5 Hours Session",
                "3 Outfits / Looks",
                "30 Edited Photos",
                "Hair & Makeup Touch-up",
                "Indoor + Outdoor Shots",
                "Print-Ready Files",
                "5 Days Delivery"
              ],
              "buttonText": "Book Signature",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": true
            },
            {
              "name": "Editorial",
              "price": "1,500",
              "currency": "RM",
              "period": "session",
              "description": "Magazine-style creative portraits",
              "image": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80",
              "features": [
                "3 Hours Session",
                "5 Outfits / Looks",
                "50 Edited Photos",
                "Professional Hair & Makeup",
                "Multiple Locations",
                "Creative Direction",
                "Behind-the-Scenes Video",
                "3 Days Delivery"
              ],
              "buttonText": "Book Editorial",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": false
            }
          ]
        }
      },
      {
        "id": "golden-features",
        "type": "features",
        "order": 5,
        "props": {
          "title": "The Golden Hour Experience",
          "variant": "alternating",
          "features": [
            {
              "icon": "sun",
              "title": "Natural Light Specialists",
              "description": "Our studio is designed to harness beautiful natural light. We also shoot during golden hour for that magical warm glow."
            },
            {
              "icon": "palette",
              "title": "Curated Wardrobe",
              "description": "Access our studio wardrobe with elegant pieces you can borrow. Perfect if you need outfit options."
            },
            {
              "icon": "sparkles",
              "title": "Professional Styling",
              "description": "Hair and makeup services included in Signature and Editorial packages. Look your absolute best."
            },
            {
              "icon": "heart",
              "title": "Confidence Coaching",
              "description": "Not comfortable in front of the camera? We guide you through poses and expressions naturally."
            },
            {
              "icon": "image",
              "title": "Artistic Editing",
              "description": "Each photo is carefully edited with our signature warm, timeless aesthetic. No over-filtered looks."
            },
            {
              "icon": "gift",
              "title": "Print Products Available",
              "description": "Order beautiful prints, canvases, and photo books. Perfect for gifts or decorating your space."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "golden-form-payment",
        "type": "form_with_payment",
        "order": 6,
        "props": {
          "title": "Book Your Portrait Session",
          "description": "Reserve your spot with a session deposit. We will contact you to discuss your vision and schedule.",
          "submitButtonText": "Book & Pay Deposit",
          "submitButtonColor": "#b45309",
          "showName": true,
          "showMobile": true,
          "showEmail": true,
          "nameRequired": true,
          "mobileRequired": true,
          "emailRequired": true,
          "defaultCountryCode": "MY",
          "products": [
            {
              "id": "portrait-mini",
              "name": "Mini Session - Deposit",
              "description": "30 min, 1 look, 10 photos",
              "price": 100
            },
            {
              "id": "portrait-signature",
              "name": "Signature Session - Deposit",
              "description": "1.5 hrs, 3 looks, 30 photos, H&MU",
              "price": 200,
              "featured": true
            },
            {
              "id": "portrait-editorial",
              "name": "Editorial Session - Deposit",
              "description": "3 hrs, 5 looks, 50 photos, Full styling",
              "price": 400
            }
          ],
          "currency": "MYR",
          "bgColor": "#fffbeb",
          "companyName": "Golden Hour Studios",
          "companyRegistration": ""
        }
      },
      {
        "id": "golden-testimonials",
        "type": "testimonials",
        "order": 7,
        "props": {
          "title": "Client Love",
          "variant": "masonry",
          "testimonials": [
            {
              "name": "Amanda Lee",
              "role": "Entrepreneur",
              "quote": "The Signature session was exactly what I needed for my personal brand. The photos are stunning and really capture my personality. Highly recommend!",
              "rating": 5
            },
            {
              "name": "Dr. Farah Ahmad",
              "role": "Medical Professional",
              "quote": "Needed new headshots for my clinic website. The team made me feel so comfortable and the results exceeded my expectations. Very professional!",
              "rating": 5
            },
            {
              "name": "Ryan Tan",
              "role": "Actor/Model",
              "quote": "The Editorial session was incredible! The creative direction and attention to detail made for an amazing portfolio update. Will definitely be back.",
              "rating": 5
            },
            {
              "name": "Sarah Yusof",
              "role": "Content Creator",
              "quote": "Love my new profile photos! The golden hour outdoor shots are absolutely dreamy. The styling advice was so helpful too.",
              "rating": 5
            }
          ],
          "bgColor": "#fffbeb"
        }
      },
      {
        "id": "golden-whatsapp",
        "type": "whatsapp_button",
        "order": 8,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Hi! I am interested in booking a portrait session at Golden Hour Studios. Can you share more details?",
          "buttonText": "Chat With Us",
          "buttonColor": "#25D366",
          "buttonSize": "md",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true
        }
      },
      {
        "id": "golden-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "Golden Hour Studios",
          "description": "Where every portrait tells your unique story",
          "copyright": "2026 Golden Hour Studios. All rights reserved.",
          "bgColor": "#b45309",
          "textColor": "#fef3c7",
          "columns": [
            {
              "title": "Sessions",
              "links": [
                { "label": "Mini Session", "url": "#pricing-4" },
                { "label": "Signature Session", "url": "#pricing-4" },
                { "label": "Editorial Session", "url": "#pricing-4" },
                { "label": "Book Now", "url": "#form_with_payment-6" }
              ]
            },
            {
              "title": "Contact",
              "links": [
                { "label": "Our Studio", "url": "#" },
                { "label": "FAQ", "url": "#" },
                { "label": "Portfolio", "url": "#" },
                { "label": "Reviews", "url": "#testimonials-7" }
              ]
            }
          ],
          "socialLinks": [
            { "platform": "instagram", "url": "https://instagram.com" },
            { "platform": "facebook", "url": "https://facebook.com" },
            { "platform": "tiktok", "url": "https://tiktok.com" }
          ]
        }
      }
    ],
    "seo_settings": {
      "title": "Golden Hour Studios - Professional Portrait Photography",
      "description": "Capture your authentic self with our professional portrait photography. Personal branding, headshots, and creative portraits in beautiful natural light.",
      "keywords": "portrait photography, headshots, personal branding, professional photos, studio photography, golden hour photographer"
    },
    "theme": {
      "primaryColor": "#b45309",
      "fontFamily": "Playfair Display, serif"
    }
  }'::jsonb
);


-- FILE: 20260204120003_add_frame_perfect_template.sql
-- Frame Perfect Template (Corporate Photography) - Variation 3
-- Theme: Navy Blue, Variants: hero=image_left, features=grid, testimonials=grid, pricing=table
INSERT INTO templates (
  id, name, slug, category, industry, description, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Frame Perfect',
  'frame-perfect',
  'services',
  'Photography',
  'Professional corporate photography services for businesses. Team photos, office shoots, LinkedIn headshots, and annual report imagery.',
  true,
  ARRAY['corporate', 'photography', 'business', 'headshots', 'linkedin', 'team photos', 'professional'],
  '{
    "elements": [
      {
        "id": "frame-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "Corporate Packages Now Available - Book Your Team Session Today!",
          "bgColor": "#1e3a5f",
          "textColor": "#e0f2fe",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": false
        }
      },
      {
        "id": "frame-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "FRAME PERFECT",
          "logo": "",
          "menuItems": [
            { "label": "Services", "url": "#pricing-4" },
            { "label": "Why Us", "url": "#features-5" },
            { "label": "Clients", "url": "#testimonials-7" },
            { "label": "Contact", "url": "#form_with_payment-6" }
          ],
          "bgColor": "#f0f9ff",
          "textColor": "#1e3a5f",
          "isSticky": true,
          "layout": "left",
          "ctaButton": {
            "text": "Get Quote",
            "url": "#form_with_payment-6"
          }
        }
      },
      {
        "id": "frame-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_left",
          "headline": "Elevate Your Corporate Image",
          "subheadline": "Professional photography services for businesses that understand the power of visual branding. From executive portraits to team photos, we help you look your best.",
          "ctaText": "View Services",
          "ctaUrl": "#pricing-4",
          "image": "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=1920&q=80",
          "bgColor": "#f0f9ff",
          "headlineColor": "#1e3a5f",
          "subheadlineColor": "#3b82f6",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 100,
          "buttonBgColor": "#1e3a5f",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "id": "frame-pricing",
        "type": "pricing",
        "order": 4,
        "props": {
          "title": "Corporate Photography Services",
          "subtitle": "Professional solutions for businesses of all sizes",
          "layout": "table",
          "enablePaymentIntegration": false,
          "plans": [
            {
              "name": "Executive Headshots",
              "price": "450",
              "currency": "RM",
              "period": "person",
              "description": "Professional headshots for executives and professionals",
              "features": [
                "30 Minutes Per Person",
                "3 Edited Photos",
                "Multiple Backgrounds",
                "LinkedIn Optimized",
                "Digital Downloads",
                "On-site or Studio"
              ],
              "buttonText": "Book Headshots",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": false
            },
            {
              "name": "Team Package",
              "price": "2,500",
              "currency": "RM",
              "period": "team",
              "description": "Up to 15 team members with individual and group shots",
              "features": [
                "Half Day Session",
                "Individual Headshots",
                "Team Group Photos",
                "Department Photos",
                "5 Photos Per Person",
                "Branded Backgrounds"
              ],
              "buttonText": "Book Team",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": true
            },
            {
              "name": "Enterprise",
              "price": "5,000",
              "currency": "RM",
              "period": "project",
              "description": "Complete corporate photography for large organizations",
              "features": [
                "Full Day Session",
                "Unlimited Team Members",
                "Office Environment Shots",
                "Annual Report Images",
                "Marketing Materials",
                "Video Clips Available"
              ],
              "buttonText": "Contact Us",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": false
            }
          ]
        }
      },
      {
        "id": "frame-features",
        "type": "features",
        "order": 5,
        "props": {
          "title": "Why Frame Perfect for Corporate",
          "variant": "grid",
          "features": [
            {
              "icon": "briefcase",
              "title": "Business Focused",
              "description": "We understand corporate environments. Our photographers are experienced with boardrooms, offices, and professional settings."
            },
            {
              "icon": "clock",
              "title": "Minimal Disruption",
              "description": "Efficient workflows designed to minimize impact on your workday. We work around your schedule."
            },
            {
              "icon": "users",
              "title": "Large Teams Welcome",
              "description": "From startups to enterprises, we have photographed teams of 5 to 500+. Scalable solutions for any size."
            },
            {
              "icon": "building",
              "title": "On-Site Service",
              "description": "We come to you with portable studio equipment. No need to transport your team anywhere."
            },
            {
              "icon": "image",
              "title": "Consistent Quality",
              "description": "Uniform lighting and editing ensures all team photos have a cohesive look for your website and materials."
            },
            {
              "icon": "lock",
              "title": "NDA & Confidentiality",
              "description": "We respect corporate privacy. NDA available upon request for sensitive locations and personnel."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "frame-form-payment",
        "type": "form_with_payment",
        "order": 6,
        "props": {
          "title": "Request Corporate Photography Quote",
          "description": "Tell us about your requirements and we will prepare a customized proposal for your organization.",
          "submitButtonText": "Submit Inquiry",
          "submitButtonColor": "#1e3a5f",
          "showName": true,
          "showMobile": true,
          "showEmail": true,
          "nameRequired": true,
          "mobileRequired": true,
          "emailRequired": true,
          "defaultCountryCode": "MY",
          "products": [
            {
              "id": "corp-headshots",
              "name": "Executive Headshots (1-5 persons)",
              "description": "Individual professional headshots",
              "price": 450
            },
            {
              "id": "corp-team",
              "name": "Team Package (up to 15 persons)",
              "description": "Individual + group photos",
              "price": 2500,
              "featured": true
            },
            {
              "id": "corp-enterprise",
              "name": "Enterprise (Custom Quote)",
              "description": "Full corporate coverage - we will contact you",
              "price": 500
            }
          ],
          "currency": "MYR",
          "bgColor": "#f0f9ff",
          "companyName": "Frame Perfect Corporate Photography",
          "companyRegistration": ""
        }
      },
      {
        "id": "frame-testimonials",
        "type": "testimonials",
        "order": 7,
        "props": {
          "title": "Trusted by Leading Companies",
          "variant": "grid",
          "testimonials": [
            {
              "name": "PETRONAS",
              "role": "HR Department",
              "quote": "Frame Perfect handled our executive team photography with utmost professionalism. The quality and efficiency were exceptional.",
              "rating": 5
            },
            {
              "name": "Grab Malaysia",
              "role": "Marketing Team",
              "quote": "We needed photos for our annual report and website refresh. They delivered stunning results on a tight timeline.",
              "rating": 5
            },
            {
              "name": "Deloitte MY",
              "role": "Office Management",
              "quote": "Over 200 staff headshots completed in just 2 days. Minimal disruption to operations and consistent quality across all photos.",
              "rating": 5
            },
            {
              "name": "Sunway Group",
              "role": "Corporate Communications",
              "quote": "Professional, punctual, and perfectly aligned with our brand guidelines. Highly recommend for any corporate photography needs.",
              "rating": 5
            },
            {
              "name": "Bank Negara Malaysia",
              "role": "Communications Division",
              "quote": "The team was respectful of our security protocols and delivered high-quality images suitable for official publications.",
              "rating": 5
            },
            {
              "name": "AirAsia",
              "role": "People Team",
              "quote": "Fun, efficient, and the photos captured our company culture perfectly. Our LinkedIn pages have never looked better!",
              "rating": 5
            }
          ],
          "bgColor": "#f0f9ff"
        }
      },
      {
        "id": "frame-whatsapp",
        "type": "whatsapp_button",
        "order": 8,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Hi! I would like to inquire about corporate photography services for my company. Can you provide more information?",
          "buttonText": "WhatsApp Us",
          "buttonColor": "#25D366",
          "buttonSize": "md",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true
        }
      },
      {
        "id": "frame-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "Frame Perfect",
          "description": "Professional corporate photography solutions",
          "copyright": "2026 Frame Perfect Photography. All rights reserved.",
          "bgColor": "#1e3a5f",
          "textColor": "#e0f2fe",
          "columns": [
            {
              "title": "Services",
              "links": [
                { "label": "Executive Headshots", "url": "#pricing-4" },
                { "label": "Team Photography", "url": "#pricing-4" },
                { "label": "Office Shoots", "url": "#pricing-4" },
                { "label": "Annual Reports", "url": "#pricing-4" }
              ]
            },
            {
              "title": "Company",
              "links": [
                { "label": "About Us", "url": "#features-5" },
                { "label": "Our Clients", "url": "#testimonials-7" },
                { "label": "Contact", "url": "#form_with_payment-6" },
                { "label": "Portfolio", "url": "#" }
              ]
            }
          ],
          "socialLinks": [
            { "platform": "linkedin", "url": "https://linkedin.com" },
            { "platform": "instagram", "url": "https://instagram.com" },
            { "platform": "facebook", "url": "https://facebook.com" }
          ]
        }
      }
    ],
    "seo_settings": {
      "title": "Frame Perfect - Professional Corporate Photography Services",
      "description": "Elevate your corporate image with professional photography. Executive headshots, team photos, office shoots, and annual report imagery for businesses.",
      "keywords": "corporate photography, business headshots, linkedin photos, team photography, executive portraits, office photography malaysia"
    },
    "theme": {
      "primaryColor": "#1e3a5f",
      "fontFamily": "Inter"
    }
  }'::jsonb
);


-- FILE: 20260204120004_add_candid_captures_template.sql
-- Candid Captures Template (Family Photography) - Variation 4
-- Theme: Warm Teal, Variants: hero=image_bg, features=list, testimonials=slider, pricing=cards
INSERT INTO templates (
  id, name, slug, category, industry, description, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Candid Captures',
  'candid-captures',
  'services',
  'Photography',
  'Heartwarming family photography that captures genuine moments. Perfect for family portraits, kids photography, and generational shoots.',
  true,
  ARRAY['family', 'photography', 'kids', 'children', 'portrait', 'outdoor', 'lifestyle'],
  '{
    "elements": [
      {
        "id": "candid-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "Family Holiday Sessions Now Open - Create Memories That Last Forever!",
          "bgColor": "#0d9488",
          "textColor": "#ccfbf1",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": true,
          "countdownLabel": "Holiday slots filling fast:",
          "countdownEndDate": "2026-06-30T23:59:59"
        }
      },
      {
        "id": "candid-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "CANDID CAPTURES",
          "logo": "",
          "menuItems": [
            { "label": "Home", "url": "#hero-2" },
            { "label": "Sessions", "url": "#pricing-4" },
            { "label": "About", "url": "#features-5" },
            { "label": "Book", "url": "#form_with_payment-6" }
          ],
          "bgColor": "#f0fdfa",
          "textColor": "#0d9488",
          "isSticky": true,
          "layout": "center",
          "ctaButton": {
            "text": "Book Session",
            "url": "#form_with_payment-6"
          }
        }
      },
      {
        "id": "candid-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Capturing Your Family Story",
          "subheadline": "Authentic, joyful photography that celebrates your unique family. From playful kids to multi-generational portraits, we capture the love that binds you.",
          "ctaText": "View Sessions",
          "ctaUrl": "#pricing-4",
          "image": "https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?w=1920&q=80",
          "bgColor": "#f0fdfa",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#ccfbf1",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 50,
          "buttonBgColor": "#0d9488",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "id": "candid-pricing",
        "type": "pricing",
        "order": 4,
        "props": {
          "title": "Family Photography Sessions",
          "subtitle": "Choose the perfect session for your family",
          "layout": "cards",
          "enablePaymentIntegration": false,
          "plans": [
            {
              "name": "Mini Session",
              "price": "450",
              "currency": "RM",
              "period": "session",
              "description": "Perfect for small families or quick updates",
              "image": "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&q=80",
              "features": [
                "30 Minutes",
                "1 Location",
                "15 Edited Photos",
                "Online Gallery",
                "Digital Downloads",
                "Print Credits (RM50)"
              ],
              "buttonText": "Book Mini",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": false
            },
            {
              "name": "Classic Family",
              "price": "850",
              "currency": "RM",
              "period": "session",
              "description": "Our most popular family session",
              "image": "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80",
              "features": [
                "1 Hour Session",
                "2 Locations",
                "40 Edited Photos",
                "Outfit Change",
                "Online Gallery + USB",
                "Print Credits (RM100)",
                "Family Portrait Print (8x10)"
              ],
              "buttonText": "Book Classic",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": true
            },
            {
              "name": "Extended Family",
              "price": "1,500",
              "currency": "RM",
              "period": "session",
              "description": "Multi-generational and large family sessions",
              "image": "https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?w=800&q=80",
              "features": [
                "2 Hours Session",
                "Multiple Locations",
                "80 Edited Photos",
                "All Family Combinations",
                "Canvas Print (16x20)",
                "Premium Photo Album",
                "Individual Family Groups",
                "Printed Thank You Cards"
              ],
              "buttonText": "Book Extended",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": false
            }
          ]
        }
      },
      {
        "id": "candid-features",
        "type": "features",
        "order": 5,
        "props": {
          "title": "Why Families Love Us",
          "variant": "list",
          "features": [
            {
              "icon": "heart",
              "title": "Kid-Friendly Photographer",
              "description": "We specialize in working with children of all ages. Patient, playful, and great at capturing genuine smiles."
            },
            {
              "icon": "sun",
              "title": "Beautiful Outdoor Locations",
              "description": "We know all the best spots in the city for gorgeous family photos - parks, beaches, urban settings and more."
            },
            {
              "icon": "camera",
              "title": "Candid & Natural Style",
              "description": "No stiff posed photos here! We capture your family being yourselves - laughing, playing, and loving."
            },
            {
              "icon": "palette",
              "title": "Wardrobe Guidance",
              "description": "Free styling guide to help coordinate outfits. We want your family to look effortlessly put-together."
            },
            {
              "icon": "image",
              "title": "Timeless Editing",
              "description": "Classic, warm editing that will never go out of style. Your photos will look beautiful for generations."
            },
            {
              "icon": "gift",
              "title": "Heirloom Products",
              "description": "Beautiful albums, canvases, and prints to display in your home. These become treasured family heirlooms."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "candid-form-payment",
        "type": "form_with_payment",
        "order": 6,
        "props": {
          "title": "Book Your Family Session",
          "description": "Reserve your session with a deposit. Tell us about your family and we will plan the perfect shoot.",
          "submitButtonText": "Book & Pay Deposit",
          "submitButtonColor": "#0d9488",
          "showName": true,
          "showMobile": true,
          "showEmail": true,
          "nameRequired": true,
          "mobileRequired": true,
          "emailRequired": true,
          "defaultCountryCode": "MY",
          "products": [
            {
              "id": "family-mini",
              "name": "Mini Session - Deposit",
              "description": "30 min, 15 photos, 1 location",
              "price": 150
            },
            {
              "id": "family-classic",
              "name": "Classic Family - Deposit",
              "description": "1 hr, 40 photos, 2 locations",
              "price": 250,
              "featured": true
            },
            {
              "id": "family-extended",
              "name": "Extended Family - Deposit",
              "description": "2 hrs, 80 photos, album included",
              "price": 400
            }
          ],
          "currency": "MYR",
          "bgColor": "#f0fdfa",
          "companyName": "Candid Captures Photography",
          "companyRegistration": ""
        }
      },
      {
        "id": "candid-testimonials",
        "type": "testimonials",
        "order": 7,
        "props": {
          "title": "Happy Families",
          "variant": "slider",
          "testimonials": [
            {
              "name": "The Wong Family",
              "role": "Family of 5",
              "quote": "Our kids are usually impossible to photograph but the photographer was amazing with them! The photos turned out better than we ever imagined. Absolutely love them!",
              "rating": 5
            },
            {
              "name": "The Lim Family",
              "role": "3 Generations",
              "quote": "We gathered our entire extended family for the first time in years. Candid Captures made everyone feel comfortable and captured so many beautiful moments.",
              "rating": 5
            },
            {
              "name": "The Ahmad Family",
              "role": "Parents + 2 Kids",
              "quote": "The classic session was perfect for us. We got so many wonderful shots at the beach. The kids had so much fun they forgot they were being photographed!",
              "rating": 5
            }
          ],
          "bgColor": "#f0fdfa"
        }
      },
      {
        "id": "candid-whatsapp",
        "type": "whatsapp_button",
        "order": 8,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Hi! I would like to book a family photography session. Can you share more details about your packages?",
          "buttonText": "Chat With Us",
          "buttonColor": "#25D366",
          "buttonSize": "md",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true
        }
      },
      {
        "id": "candid-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "Candid Captures",
          "description": "Capturing authentic family moments with love",
          "copyright": "2026 Candid Captures Photography. All rights reserved.",
          "bgColor": "#0d9488",
          "textColor": "#ccfbf1",
          "columns": [
            {
              "title": "Sessions",
              "links": [
                { "label": "Mini Session", "url": "#pricing-4" },
                { "label": "Classic Family", "url": "#pricing-4" },
                { "label": "Extended Family", "url": "#pricing-4" },
                { "label": "Book Now", "url": "#form_with_payment-6" }
              ]
            },
            {
              "title": "Connect",
              "links": [
                { "label": "About Us", "url": "#features-5" },
                { "label": "Portfolio", "url": "#" },
                { "label": "Reviews", "url": "#testimonials-7" },
                { "label": "Blog", "url": "#" }
              ]
            }
          ],
          "socialLinks": [
            { "platform": "instagram", "url": "https://instagram.com" },
            { "platform": "facebook", "url": "https://facebook.com" },
            { "platform": "tiktok", "url": "https://tiktok.com" }
          ]
        }
      }
    ],
    "seo_settings": {
      "title": "Candid Captures - Family Photography That Tells Your Story",
      "description": "Authentic family photography capturing genuine moments of love and joy. Family portraits, kids photography, and multi-generational sessions.",
      "keywords": "family photography, kids photography, family portraits, outdoor photography, lifestyle photography, family photographer malaysia"
    },
    "theme": {
      "primaryColor": "#0d9488",
      "fontFamily": "Quicksand, sans-serif"
    }
  }'::jsonb
);


-- FILE: 20260204120005_add_timeless_imagery_template.sql
-- Timeless Imagery Template (Maternity/Newborn Photography) - Variation 5
-- Theme: Soft Rose, Variants: hero=image_left, features=alternating, testimonials=masonry, pricing=cards
INSERT INTO templates (
  id, name, slug, category, industry, description, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Timeless Imagery',
  'timeless-imagery',
  'services',
  'Photography',
  'Delicate maternity and newborn photography capturing the miracle of new life. Soft, dreamy aesthetic for expecting mothers and precious newborns.',
  true,
  ARRAY['maternity', 'newborn', 'photography', 'baby', 'pregnancy', 'studio', 'portrait'],
  '{
    "elements": [
      {
        "id": "timeless-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "Capture These Precious Moments - Book Your Maternity or Newborn Session Today!",
          "bgColor": "#be185d",
          "textColor": "#fce7f3",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": false
        }
      },
      {
        "id": "timeless-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "TIMELESS IMAGERY",
          "logo": "",
          "menuItems": [
            { "label": "Home", "url": "#hero-2" },
            { "label": "Sessions", "url": "#pricing-4" },
            { "label": "Experience", "url": "#features-5" },
            { "label": "Book", "url": "#form_with_payment-6" }
          ],
          "bgColor": "#fdf2f8",
          "textColor": "#be185d",
          "isSticky": true,
          "layout": "split",
          "ctaButton": {
            "text": "Book Now",
            "url": "#form_with_payment-6"
          }
        }
      },
      {
        "id": "timeless-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_left",
          "headline": "Celebrating New Beginnings",
          "subheadline": "Exquisite maternity and newborn photography that captures the magic of new life. Every tiny detail, every loving glance, preserved forever in timeless images.",
          "ctaText": "View Sessions",
          "ctaUrl": "#pricing-4",
          "image": "https://images.unsplash.com/photo-1544126592-807ade215a0b?w=1920&q=80",
          "bgColor": "#fdf2f8",
          "headlineColor": "#be185d",
          "subheadlineColor": "#db2777",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 100,
          "buttonBgColor": "#be185d",
          "buttonTextColor": "#ffffff",
          "showCtaButton": true
        }
      },
      {
        "id": "timeless-pricing",
        "type": "pricing",
        "order": 4,
        "props": {
          "title": "Photography Sessions",
          "subtitle": "Capture these fleeting moments with our specialized sessions",
          "layout": "cards",
          "enablePaymentIntegration": false,
          "plans": [
            {
              "name": "Maternity",
              "price": "650",
              "currency": "RM",
              "period": "session",
              "description": "Celebrate your beautiful pregnancy journey",
              "image": "https://images.unsplash.com/photo-1493894473891-10fc1e5dbd22?w=800&q=80",
              "features": [
                "1 Hour Session",
                "Studio or Outdoor",
                "2 Outfit Changes",
                "Partner Included",
                "25 Edited Photos",
                "Online Gallery",
                "Print Credits (RM80)"
              ],
              "buttonText": "Book Maternity",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": false
            },
            {
              "name": "Newborn",
              "price": "950",
              "currency": "RM",
              "period": "session",
              "description": "Capture your tiny miracle in the first weeks",
              "image": "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&q=80",
              "features": [
                "2-3 Hours Session",
                "In-Studio with Props",
                "Multiple Setups & Poses",
                "Parent & Sibling Shots",
                "35 Edited Photos",
                "Online Gallery + USB",
                "Print Credits (RM100)",
                "Best within 14 days"
              ],
              "buttonText": "Book Newborn",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": true
            },
            {
              "name": "Bump to Baby",
              "price": "1,400",
              "currency": "RM",
              "period": "package",
              "description": "Complete journey from pregnancy to newborn",
              "image": "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80",
              "features": [
                "Maternity Session",
                "Newborn Session",
                "50 Edited Photos Total",
                "Premium Photo Album",
                "Canvas Print (16x20)",
                "Priority Booking",
                "10% Savings",
                "Milestone Session Add-on Available"
              ],
              "buttonText": "Book Package",
              "buttonUrl": "#form_with_payment-6",
              "highlighted": false
            }
          ]
        }
      },
      {
        "id": "timeless-features",
        "type": "features",
        "order": 5,
        "props": {
          "title": "The Timeless Experience",
          "variant": "alternating",
          "features": [
            {
              "icon": "baby",
              "title": "Newborn Safety Certified",
              "description": "Your baby safety is our top priority. Our photographers are trained in safe newborn posing and handling techniques."
            },
            {
              "icon": "sparkles",
              "title": "Dreamy Studio Setting",
              "description": "Climate-controlled studio with soft lighting, beautiful props, and a calming atmosphere for comfortable sessions."
            },
            {
              "icon": "heart",
              "title": "Patient & Gentle",
              "description": "We work at baby pace. Expect feeding breaks, soothing time, and plenty of patience for the perfect shot."
            },
            {
              "icon": "palette",
              "title": "Curated Prop Collection",
              "description": "Extensive collection of wraps, headbands, outfits, and props. Choose your style - natural, whimsical, or classic."
            },
            {
              "icon": "image",
              "title": "Artistic Retouching",
              "description": "Gentle editing that enhances natural beauty. Baby skin is perfected while keeping a natural, timeless look."
            },
            {
              "icon": "gift",
              "title": "Heirloom Products",
              "description": "Premium albums, fine art prints, and keepsake boxes. These become treasured family heirlooms for generations."
            }
          ],
          "bgColor": "#ffffff"
        }
      },
      {
        "id": "timeless-form-payment",
        "type": "form_with_payment",
        "order": 6,
        "props": {
          "title": "Book Your Session",
          "description": "Reserve your session with a deposit. For newborns, we recommend booking during pregnancy to secure your date.",
          "submitButtonText": "Book & Pay Deposit",
          "submitButtonColor": "#be185d",
          "showName": true,
          "showMobile": true,
          "showEmail": true,
          "nameRequired": true,
          "mobileRequired": true,
          "emailRequired": true,
          "defaultCountryCode": "MY",
          "products": [
            {
              "id": "maternity-session",
              "name": "Maternity Session - Deposit",
              "description": "1 hr, 25 photos, studio/outdoor",
              "price": 200
            },
            {
              "id": "newborn-session",
              "name": "Newborn Session - Deposit",
              "description": "2-3 hrs, 35 photos, full styling",
              "price": 300,
              "featured": true
            },
            {
              "id": "bump-to-baby",
              "name": "Bump to Baby Package - Deposit",
              "description": "Maternity + Newborn + Album",
              "price": 400
            }
          ],
          "currency": "MYR",
          "bgColor": "#fdf2f8",
          "companyName": "Timeless Imagery Photography",
          "companyRegistration": ""
        }
      },
      {
        "id": "timeless-testimonials",
        "type": "testimonials",
        "order": 7,
        "props": {
          "title": "From Our Happy Parents",
          "variant": "masonry",
          "testimonials": [
            {
              "name": "Jessica & Mark",
              "role": "Parents to Baby Aria",
              "quote": "The newborn session was magical. Our baby was just 10 days old and the photographer was so gentle and patient. The photos are absolutely stunning!",
              "rating": 5
            },
            {
              "name": "Nurin Aisyah",
              "role": "First-time Mom",
              "quote": "I was nervous about my maternity shoot but they made me feel beautiful and comfortable. The photos captured my pregnancy glow perfectly.",
              "rating": 5
            },
            {
              "name": "Emily Chen",
              "role": "Mom of 2",
              "quote": "We did the Bump to Baby package and it was worth every penny. Watching the album showing my pregnancy and then our newborn is so special.",
              "rating": 5
            },
            {
              "name": "Priya Sharma",
              "role": "Parents to Baby Arjun",
              "quote": "The prop collection is amazing! They had the perfect setup for our baby. The tiny poses are incredible. Will treasure these forever.",
              "rating": 5
            }
          ],
          "bgColor": "#fdf2f8"
        }
      },
      {
        "id": "timeless-whatsapp",
        "type": "whatsapp_button",
        "order": 8,
        "props": {
          "phoneNumber": "60123456789",
          "message": "Hi! I am interested in booking a maternity/newborn photography session. Can you share more details about availability?",
          "buttonText": "WhatsApp Us",
          "buttonColor": "#25D366",
          "buttonSize": "md",
          "position": "fixed",
          "fixedPosition": "bottom-right",
          "showIcon": true
        }
      },
      {
        "id": "timeless-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "Timeless Imagery",
          "description": "Capturing the miracle of new life, beautifully",
          "copyright": "2026 Timeless Imagery Photography. All rights reserved.",
          "bgColor": "#be185d",
          "textColor": "#fce7f3",
          "columns": [
            {
              "title": "Sessions",
              "links": [
                { "label": "Maternity", "url": "#pricing-4" },
                { "label": "Newborn", "url": "#pricing-4" },
                { "label": "Bump to Baby", "url": "#pricing-4" },
                { "label": "Book Now", "url": "#form_with_payment-6" }
              ]
            },
            {
              "title": "Info",
              "links": [
                { "label": "When to Book", "url": "#" },
                { "label": "What to Expect", "url": "#features-5" },
                { "label": "Portfolio", "url": "#" },
                { "label": "Reviews", "url": "#testimonials-7" }
              ]
            }
          ],
          "socialLinks": [
            { "platform": "instagram", "url": "https://instagram.com" },
            { "platform": "facebook", "url": "https://facebook.com" },
            { "platform": "pinterest", "url": "https://pinterest.com" }
          ]
        }
      }
    ],
    "seo_settings": {
      "title": "Timeless Imagery - Maternity & Newborn Photography",
      "description": "Exquisite maternity and newborn photography capturing the magic of new life. Safe, gentle sessions for expecting mothers and precious newborns.",
      "keywords": "newborn photography, maternity photography, baby photography, pregnancy photos, newborn photographer malaysia, bump to baby"
    },
    "theme": {
      "primaryColor": "#be185d",
      "fontFamily": "Cormorant Garamond, serif"
    }
  }'::jsonb
);


-- FILE: 20260219100000_add_pemborong_kuih_raya_template.sql
-- Pemborong Kuih Raya Template (E-commerce)
-- Theme: Maroon & Cream, Variants: hero=image_bg, features=list (with images), testimonials=grid, faq=two_column, cta=centered
-- Brand: SHAMEERA FOOD INDUSTRY SDN BHD (Pemborong Kuih Raya)
INSERT INTO templates (
  id, name, slug, category, industry, description, thumbnail_url, preview_url, is_public, tags, data
) VALUES (
  gen_random_uuid(),
  'Pemborong Kuih Raya',
  'pemborong-kuih-raya',
  'ecommerce',
  'Food & Beverage',
  'Template e-dagang premium untuk pemborong kuih raya. Tema maroon dan krim yang elegan dengan reka bentuk moden. Termasuk pameran produk, borang tempahan dengan pembayaran, testimoni, dan FAQ.',
  'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1200&h=800&fit=crop',
  true,
  ARRAY['pemborong kuih raya', 'kuih raya', 'cookies', 'tart nenas', 'makmur', 'chocolate chip', 'borong', 'raya', 'ecommerce', 'malaysia', 'wholesale'],
  '{
    "elements": [
      {
        "id": "pemborong-announcement",
        "type": "announcement_bar",
        "order": 0,
        "props": {
          "message": "Harga Borong Terendah! Tempahan Kuih Raya 2026 Kini Dibuka - Penghantaran Seluruh Malaysia",
          "bgColor": "#800020",
          "textColor": "#ffffff",
          "isSticky": false,
          "showCloseButton": true,
          "showCountdown": true,
          "countdownLabel": "Tempahan ditutup:",
          "countdownEndDate": "2026-03-20T23:59:59"
        }
      },
      {
        "id": "pemborong-navigation",
        "type": "navigation",
        "order": 1,
        "props": {
          "logoText": "PEMBORONG KUIH RAYA",
          "logo": "",
          "menuItems": [
            { "label": "Produk Kami", "url": "#product_carousel-4" },
            { "label": "Kelebihan", "url": "#features-3" },
            { "label": "Testimoni", "url": "#testimonials-6" },
            { "label": "Soalan Lazim", "url": "#faq-7" }
          ],
          "bgColor": "#fdf6f0",
          "textColor": "#800020",
          "isSticky": true,
          "layout": "left",
          "ctaButton": {
            "text": "Tempah Sekarang",
            "url": "#form_with_payment-5"
          }
        }
      },
      {
        "id": "pemborong-hero",
        "type": "hero",
        "order": 2,
        "props": {
          "variant": "image_bg",
          "headline": "Gedung Kuih Raya Terbesar & Termurah",
          "subheadline": "Pembekal utama kuih raya berkualiti tinggi dengan harga borong. Lebih 50 jenis kuih raya tradisional dan moden untuk pilihan anda. Penghantaran ke seluruh Malaysia.",
          "ctaText": "Lihat Koleksi Kami",
          "ctaUrl": "#product_carousel-4",
          "image": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1920&q=80",
          "bgColor": "#800020",
          "headlineColor": "#ffffff",
          "subheadlineColor": "#fde8d0",
          "headlineSize": "5xl",
          "subheadlineSize": "xl",
          "imageOpacity": 60,
          "buttonBgColor": "#d4a017",
          "buttonTextColor": "#3e2723",
          "showCtaButton": true
        }
      },
      {
        "id": "pemborong-features",
        "type": "features",
        "order": 3,
        "props": {
          "title": "Kenapa Pilih Kami?",
          "variant": "list",
          "backgroundImage": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&q=80",
          "backgroundOpacity": 85,
          "bgColor": "#fdf6f0",
          "features": [
            {
              "image": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&h=300&fit=crop",
              "title": "100% Buatan Tangan",
              "description": "Setiap kuih dihasilkan secara handmade menggunakan resipi turun-temurun. Rasa autentik yang tidak dapat ditandingi oleh produk kilang."
            },
            {
              "image": "https://bazaramadhanbangi.com/wp-content/uploads/2020/04/MAKMUR-300x300.jpeg",
              "title": "Bahan Premium Berkualiti",
              "description": "Hanya menggunakan mentega tulen, tepung terbaik, dan bahan-bahan import berkualiti tinggi. Tanpa pengawet dan pewarna tiruan."
            },
            {
              "image": "https://bazaramadhanbangi.com/wp-content/uploads/2020/04/TART-NENAS-2020-300x300.jpeg",
              "title": "Pembungkusan Eksklusif",
              "description": "Balang premium dengan label cantik dan pembungkusan kemas. Sesuai untuk dijadikan hadiah, doorgift, dan buah tangan Hari Raya."
            },
            {
              "image": "https://bazaramadhanbangi.com/wp-content/uploads/2020/04/CHOCOLATE-CHIP-1-300x300.jpeg",
              "title": "Harga Borong Terbaik",
              "description": "Harga terendah di pasaran dengan kualiti premium. Diskaun istimewa untuk pesanan pukal dan tempahan korporat."
            },
            {
              "image": "https://bazaramadhanbangi.com/wp-content/uploads/2020/04/MAMA-CARIE-300x300.jpeg",
              "title": "Penghantaran Selamat & Pantas",
              "description": "Dibungkus dengan teliti dan dihantar ke seluruh Malaysia. Penghantaran express tersedia. Percuma untuk pesanan RM200 ke atas."
            },
            {
              "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop",
              "title": "Jaminan Puas Hati 100%",
              "description": "Kami yakin dengan kualiti produk kami. Jika tidak berpuas hati, wang anda akan dikembalikan sepenuhnya tanpa soalan."
            }
          ]
        }
      },
      {
        "id": "pemborong-products",
        "type": "product_carousel",
        "order": 4,
        "props": {
          "title": "Koleksi Kuih Raya Pilihan",
          "subtitle": "Kuih raya berkualiti premium dengan harga borong yang berpatutan. Setiap balang dipenuhi dengan keenakan tradisional.",
          "cardStyle": "shadow",
          "products": [
            {
              "id": "chocolate-chip",
              "code": "PKR-001",
              "name": "Chocolate Chip Cookies",
              "description": "Biskut chocolate chip rangup di luar, lembut di dalam. Dipenuhi dengan cip coklat Belgium premium. Kegemaran semua peringkat umur!",
              "image_url": "https://bazaramadhanbangi.com/wp-content/uploads/2020/04/CHOCOLATE-CHIP-1-300x300.jpeg",
              "base_price": 25,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "kuih-makmur",
              "code": "PKR-002",
              "name": "Makmur Cookies",
              "description": "Kuih makmur lembut yang hancur di mulut dengan inti kacang tanah rangup. Resipi warisan yang terjamin keasliannya sejak turun-temurun.",
              "image_url": "https://bazaramadhanbangi.com/wp-content/uploads/2020/04/MAKMUR-300x300.jpeg",
              "base_price": 25,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "mama-carie",
              "code": "PKR-003",
              "name": "Mama Carie Cookies",
              "description": "Biskut mentega premium dengan rasa yang unik dan istimewa. Tekstur lembut dan cair di mulut. Pilihan eksklusif untuk Hari Raya.",
              "image_url": "https://bazaramadhanbangi.com/wp-content/uploads/2020/04/MAMA-CARIE-300x300.jpeg",
              "base_price": 25,
              "currency": "MYR",
              "status": "active"
            },
            {
              "id": "tart-nenas",
              "code": "PKR-004",
              "name": "Tart Nenas",
              "description": "Tart nenas rangup dengan jem nenas asli yang pekat dan manis. Dibakar sempurna dengan mentega berkualiti tinggi. Wajib ada setiap Raya!",
              "image_url": "https://bazaramadhanbangi.com/wp-content/uploads/2020/04/TART-NENAS-2020-300x300.jpeg",
              "base_price": 25,
              "currency": "MYR",
              "status": "active"
            }
          ],
          "bgColor": "#fdf6f0"
        }
      },
      {
        "id": "pemborong-form-payment",
        "type": "form_with_payment",
        "order": 5,
        "props": {
          "title": "Borang Tempahan Kuih Raya",
          "description": "Isikan maklumat anda dan pilih kuih raya kegemaran untuk meneruskan tempahan. Harga borong untuk semua pelanggan!",
          "nameLabel": "Nama Penuh",
          "mobileLabel": "No. Telefon",
          "emailLabel": "Email",
          "showName": true,
          "showMobile": true,
          "showEmail": true,
          "nameRequired": true,
          "mobileRequired": true,
          "emailRequired": false,
          "defaultCountryCode": "MY",
          "products": [
            {
              "id": "chocolate-chip",
              "name": "Chocolate Chip Cookies",
              "description": "1 balang (50 biji)",
              "price": 25
            },
            {
              "id": "kuih-makmur",
              "name": "Makmur Cookies",
              "description": "1 balang (40 biji)",
              "price": 25
            },
            {
              "id": "mama-carie",
              "name": "Mama Carie Cookies",
              "description": "1 balang (45 biji)",
              "price": 25
            },
            {
              "id": "tart-nenas",
              "name": "Tart Nenas",
              "description": "1 balang (50 biji)",
              "price": 25
            }
          ],
          "currency": "MYR",
          "submitButtonText": "Teruskan Pembayaran",
          "submitButtonColor": "#800020",
          "bgColor": "#ffffff",
          "companyName": "Pemborong Kuih Raya",
          "companyRegistration": "SHAMEERA FOOD INDUSTRY SDN BHD (202303033976)"
        }
      },
      {
        "id": "pemborong-testimonials",
        "type": "testimonials",
        "order": 6,
        "props": {
          "title": "Apa Kata Pelanggan Kami",
          "variant": "grid",
          "backgroundImage": "https://images.unsplash.com/photo-1548848221-0c2e497ed557?w=1920&q=80",
          "backgroundOpacity": 90,
          "bgColor": "#fdf6f0",
          "testimonials": [
            {
              "name": "Puan Aishah",
              "role": "Peniaga Kuih Raya, Klang",
              "quote": "Dah 3 tahun ambil stok sini. Harga memang paling murah dan kualiti terjamin. Pelanggan saya semua repeat order setiap tahun!",
              "rating": 5
            },
            {
              "name": "Encik Faizal",
              "role": "Pengurus HR, Syarikat Korporat",
              "quote": "Order 100 balang untuk hamper Raya syarikat. Semua staff puji rasa dan pembungkusan yang cantik. Harga borong sangat berbaloi!",
              "rating": 5
            },
            {
              "name": "Kak Zarina",
              "role": "Suri Rumah, Shah Alam",
              "quote": "Tart nenas dan chocolate chip memang terbaik! Anak-anak tak sabar tunggu Raya sebab nak makan kuih dari sini. Memang jadi langganan tetap.",
              "rating": 5
            },
            {
              "name": "Datin Mariam",
              "role": "Pelanggan Setia, Petaling Jaya",
              "quote": "Kuih makmur dia memang hancur di mulut. Sama macam arwah mak buat dulu. Setiap Raya mesti order minimum 20 balang untuk bagi sedara-mara.",
              "rating": 5
            }
          ]
        }
      },
      {
        "id": "pemborong-faq",
        "type": "faq",
        "order": 7,
        "props": {
          "title": "Soalan Lazim",
          "variant": "two_column",
          "bgColor": "#ffffff",
          "questions": [
            {
              "question": "Berapakah harga borong untuk kuih raya?",
              "answer": "Semua kuih raya kami bermula dari RM25 sebalang. Untuk pesanan pukal melebihi 50 balang, hubungi kami untuk harga istimewa yang lebih rendah."
            },
            {
              "question": "Adakah pesanan minimum untuk harga borong?",
              "answer": "Tiada pesanan minimum! Anda boleh order sebalang pun dengan harga borong kami. Namun, diskaun tambahan diberikan untuk pesanan 10 balang ke atas."
            },
            {
              "question": "Berapa lama jangka hayat kuih raya?",
              "answer": "Kuih raya kami tahan sehingga 3-4 minggu jika disimpan dalam bekas kedap udara pada suhu bilik. Lebih tahan lama jika disimpan dalam peti sejuk sehingga 6 minggu."
            },
            {
              "question": "Boleh buat tempahan untuk hamper korporat?",
              "answer": "Boleh! Kami menyediakan perkhidmatan hamper korporat dengan pembungkusan eksklusif. Hubungi kami melalui WhatsApp untuk sebut harga dan customisation."
            },
            {
              "question": "Bagaimana dengan penghantaran?",
              "answer": "Penghantaran ke seluruh Semenanjung Malaysia (2-3 hari bekerja) dan Sabah & Sarawak (5-7 hari bekerja). Percuma penghantaran untuk pesanan RM200 ke atas."
            },
            {
              "question": "Adakah sijil halal dan kelulusan MESTI?",
              "answer": "Ya, semua produk kami telah mendapat pengesahan halal dan mematuhi piawaian keselamatan makanan. Kami berdaftar di bawah SHAMEERA FOOD INDUSTRY SDN BHD."
            }
          ]
        }
      },
      {
        "id": "pemborong-cta",
        "type": "cta",
        "order": 8,
        "props": {
          "variant": "centered",
          "headline": "Tempah Kuih Raya Sekarang!",
          "description": "Jangan tunggu saat akhir! Tempah kuih raya berkualiti premium dengan harga borong terendah. Stok terhad untuk musim Raya 2026.",
          "buttonText": "Tempah Sekarang",
          "buttonUrl": "#form_with_payment-5",
          "backgroundImage": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&q=80",
          "backgroundOpacity": 70,
          "buttonColor": "#d4a017",
          "buttonTextColor": "#3e2723"
        }
      },
      {
        "id": "pemborong-footer",
        "type": "footer",
        "order": 9,
        "props": {
          "logo": "",
          "logoText": "PEMBORONG KUIH RAYA",
          "description": "Gedung kuih raya terbesar dan termurah. Pembekal utama kuih raya berkualiti tinggi dengan harga borong ke seluruh Malaysia.",
          "copyright": "2026 Pemborong Kuih Raya oleh SHAMEERA FOOD INDUSTRY SDN BHD. Hakcipta terpelihara.",
          "bgColor": "#800020",
          "textColor": "#fdf6f0",
          "columns": [
            {
              "title": "Pautan Pantas",
              "links": [
                { "label": "Koleksi Kuih Raya", "url": "#product_carousel-4" },
                { "label": "Tempah Sekarang", "url": "#form_with_payment-5" },
                { "label": "Testimoni", "url": "#testimonials-6" },
                { "label": "Soalan Lazim", "url": "#faq-7" }
              ]
            },
            {
              "title": "Hubungi Kami",
              "links": [
                { "label": "WhatsApp: +60 12-345 6789", "url": "https://wa.me/60123456789" },
                { "label": "Email: order@pemborongkuihraya.com", "url": "mailto:order@pemborongkuihraya.com" },
                { "label": "Alamat: No 49, Jalan Ehsan Perdana 4, Taman Ehsan Jaya, 42000 Pelabuhan Klang, Selangor", "url": "#" }
              ]
            }
          ],
          "socialLinks": [
            { "platform": "instagram", "url": "https://instagram.com/kuihraya.padu" },
            { "platform": "facebook", "url": "https://facebook.com/pemborongkuihraya" },
            { "platform": "tiktok", "url": "https://tiktok.com/@pemborongkuihraya" }
          ]
        }
      }
    ],
    "seo_settings": {
      "title": "Pemborong Kuih Raya - Gedung Kuih Raya Terbesar & Termurah",
      "description": "Tempah kuih raya berkualiti premium dengan harga borong. Chocolate chip cookies, kuih makmur, tart nenas dan pelbagai lagi. Penghantaran ke seluruh Malaysia.",
      "keywords": "pemborong kuih raya, kuih raya borong, harga borong kuih raya, tart nenas, kuih makmur, chocolate chip cookies, biskut raya, hari raya, malaysia"
    },
    "theme": {
      "primaryColor": "#800020",
      "fontFamily": "Inter"
    }
  }'::jsonb
);


