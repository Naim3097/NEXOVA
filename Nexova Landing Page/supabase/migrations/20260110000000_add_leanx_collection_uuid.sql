-- Migration: Add LeanX Collection UUID to profiles
-- Description: Adds collection_uuid column to store LeanX payment collection ID
-- Date: 2026-01-10

-- Add collection_uuid column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS leanx_collection_uuid TEXT;

-- Add comment for documentation
COMMENT ON COLUMN profiles.leanx_collection_uuid IS 'LeanX Collection UUID (Dc-... or CL-...) for payment gateway integration';
