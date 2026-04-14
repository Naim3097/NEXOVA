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
