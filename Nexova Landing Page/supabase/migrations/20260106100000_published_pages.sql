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
