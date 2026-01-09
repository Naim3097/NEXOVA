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
