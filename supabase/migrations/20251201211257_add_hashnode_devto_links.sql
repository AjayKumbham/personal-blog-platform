-- Add Hashnode and Dev.to profile links to site_settings
-- Migration: Add author_hashnode and author_devto columns

-- Add new columns to site_settings table
ALTER TABLE site_settings
ADD COLUMN IF NOT EXISTS author_hashnode text,
ADD COLUMN IF NOT EXISTS author_devto text;

-- Update existing settings to include new fields in JSONB structure
UPDATE site_settings
SET settings = jsonb_set(
  jsonb_set(
    settings,
    '{author,hashnode}',
    to_jsonb(COALESCE(author_hashnode, ''::text))
  ),
  '{author,devto}',
  to_jsonb(COALESCE(author_devto, ''::text))
)
WHERE settings IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN site_settings.author_hashnode IS 'Author Hashnode profile URL';
COMMENT ON COLUMN site_settings.author_devto IS 'Author Dev.to profile URL';
