-- Add newsletter settings to existing site_settings
UPDATE site_settings 
SET settings_data = settings_data || '{
  "newsletter": {
    "enabled": true,
    "substackUrl": "https://kumbhamajaygoud.substack.com",
    "title": "Stay Updated",
    "description": "Get notified when I publish new articles about web development and programming."
  }
}'::jsonb,
updated_at = NOW();