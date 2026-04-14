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
