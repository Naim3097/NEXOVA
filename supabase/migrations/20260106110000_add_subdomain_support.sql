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
