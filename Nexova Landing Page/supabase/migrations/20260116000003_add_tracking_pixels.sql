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
