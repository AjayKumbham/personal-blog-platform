/*
  # Add newsletter settings to site_settings
  
  This migration adds newsletter configuration to the existing
  flexible site_settings JSONB structure.
*/

-- Add newsletter settings to existing site_settings
UPDATE site_settings 
SET settings_data = settings_data || '{
  "newsletter": {
    "enabled": true,
    "provider": "brevo",
    "title": "Stay Updated",
    "description": "Get notified when I publish new articles about web development and programming."
  }
}'::jsonb,
updated_at = NOW();