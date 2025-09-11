/*
  # Migrate to flexible JSONB-based site_settings schema
  
  This migration replaces the column-based site_settings table with a flexible
  JSONB-based approach that allows unlimited customization without schema changes.
  
  1. Backup existing data
  2. Drop old table structure
  3. Create new flexible structure
  4. Restore data in new format
*/

-- Backup existing site_settings data
CREATE TEMP TABLE site_settings_backup AS 
SELECT * FROM site_settings;

-- Drop the old table
DROP TABLE IF EXISTS site_settings CASCADE;

-- Create new flexible site_settings table
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  settings_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for common JSON queries
CREATE INDEX idx_site_settings_site_name ON site_settings USING GIN ((settings_data->'siteName'));
CREATE INDEX idx_site_settings_author_name ON site_settings USING GIN ((settings_data->'author'->'name'));

-- Add comments for documentation
COMMENT ON TABLE site_settings IS 'Flexible site settings using JSONB for schema-less storage';
COMMENT ON COLUMN site_settings.settings_data IS 'All site and author settings stored as flexible JSON';

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to basic site info
CREATE POLICY "Public can read site settings"
  ON site_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy for authenticated admin access to all settings
CREATE POLICY "Admin can manage site settings"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Trigger to automatically update updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Migrate existing data to new format (if backup exists)
INSERT INTO site_settings (settings_data, created_at, updated_at)
SELECT 
  jsonb_build_object(
    'siteName', COALESCE(site_name, 'Kumbham Ajay Goud'),
    'siteDescription', COALESCE(site_description, 'Passionate Full-Stack Developer specializing in React, TypeScript, and modern web technologies.'),
    'siteUrl', COALESCE(site_url, 'https://ajaykumbham-portfolio.vercel.app'),
    'author', jsonb_build_object(
      'name', COALESCE(author_name, 'Kumbham Ajay Goud'),
      'bio', COALESCE(author_bio, 'Passionate Full-Stack Developer specializing in React, TypeScript, and modern web technologies.'),
      'avatar', COALESCE(author_avatar, '/personal-logo.jpg'),
      'title', COALESCE(author_title, 'Senior Full-Stack Developer'),
      'location', COALESCE(author_location, 'Hyderabad, India'),
      'email', COALESCE(author_email, 'ajaygoud.kumbham@gmail.com'),
      'github', COALESCE(author_github, 'https://github.com/AjayKumbham'),
      'twitter', COALESCE(author_twitter, 'https://twitter.com/ajaykumbham'),
      'linkedin', COALESCE(author_linkedin, 'https://linkedin.com/in/ajaykumbham'),
      'website', COALESCE(author_website, 'https://ajaykumbham-portfolio.vercel.app'),
      'resume', null,
      'skills', ARRAY['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Git', 'GraphQL', 'REST APIs', 'Tailwind CSS', 'Material-UI', 'Redux', 'Zustand'],
      'careerHighlights', ARRAY[
        jsonb_build_object(
          'id', '1',
          'title', 'Full-Stack Projects',
          'subtitle', 'Web Development',
          'points', ARRAY[
            'Built 50+ responsive web applications',
            'Developed e-commerce platforms for startups',
            'Created SaaS solutions for enterprises',
            'Implemented real-time chat applications'
          ],
          'metrics', ARRAY[
            jsonb_build_object('label', 'Projects', 'value', '50+'),
            jsonb_build_object('label', 'Success Rate', 'value', '98%'),
            jsonb_build_object('label', 'Client Satisfaction', 'value', '4.9/5')
          ],
          'period', '2020 - Present',
          'icon', 'Rocket',
          'order', 1
        )
      ]
    ),
    'apiKeys', jsonb_build_object(
      'hashnode', jsonb_build_object(
        'apiKey', hashnode_api_key,
        'publicationId', hashnode_publication_id
      ),
      'devTo', jsonb_build_object(
        'apiKey', dev_to_api_key
      )
    ),
    'theme', jsonb_build_object(
      'primaryColor', '#3B82F6',
      'darkMode', false
    ),
    'seo', jsonb_build_object(
      'metaTitle', 'Kumbham Ajay Goud - Full-Stack Developer',
      'metaDescription', 'Passionate Full-Stack Developer specializing in React, TypeScript, and modern web technologies.',
      'keywords', ARRAY['Full-Stack Developer', 'React', 'TypeScript', 'JavaScript', 'Node.js']
    )
  ),
  COALESCE(created_at, NOW()),
  COALESCE(updated_at, NOW())
FROM site_settings_backup
WHERE EXISTS (SELECT 1 FROM site_settings_backup)
LIMIT 1;

-- Insert default settings if no backup data exists
INSERT INTO site_settings (settings_data, created_at, updated_at)
SELECT 
  '{
    "siteName": "Kumbham Ajay Goud",
    "siteDescription": "Passionate Full-Stack Developer specializing in React, TypeScript, and modern web technologies. I create scalable applications and contribute to open-source projects while mentoring the next generation of developers.",
    "siteUrl": "https://ajaykumbham-portfolio.vercel.app",
    "author": {
      "name": "Kumbham Ajay Goud",
      "bio": "Passionate Full-Stack Developer specializing in React, TypeScript, and modern web technologies. I create scalable applications and contribute to open-source projects while mentoring the next generation of developers.",
      "avatar": "/personal-logo.jpg",
      "title": "Senior Full-Stack Developer",
      "location": "Hyderabad, India",
      "email": "ajaygoud.kumbham@gmail.com",
      "github": "https://github.com/AjayKumbham",
      "twitter": "https://twitter.com/ajaykumbham",
      "linkedin": "https://linkedin.com/in/ajaykumbham",
      "website": "https://ajaykumbham-portfolio.vercel.app",
      "resume": null,
      "skills": ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express.js", "MongoDB", "PostgreSQL", "AWS", "Docker", "Git", "GraphQL", "REST APIs", "Tailwind CSS", "Material-UI", "Redux", "Zustand"],
      "careerHighlights": [
        {
          "id": "1",
          "title": "Full-Stack Projects",
          "subtitle": "Web Development",
          "points": [
            "Built 50+ responsive web applications",
            "Developed e-commerce platforms for startups",
            "Created SaaS solutions for enterprises",
            "Implemented real-time chat applications"
          ],
          "metrics": [
            {"label": "Projects", "value": "50+"},
            {"label": "Success Rate", "value": "98%"},
            {"label": "Client Satisfaction", "value": "4.9/5"}
          ],
          "period": "2020 - Present",
          "icon": "Rocket",
          "order": 1
        }
      ]
    },
    "apiKeys": {
      "hashnode": {
        "apiKey": null,
        "publicationId": null
      },
      "devTo": {
        "apiKey": null
      }
    },
    "theme": {
      "primaryColor": "#3B82F6",
      "darkMode": false
    },
    "seo": {
      "metaTitle": "Kumbham Ajay Goud - Full-Stack Developer",
      "metaDescription": "Passionate Full-Stack Developer specializing in React, TypeScript, and modern web technologies.",
      "keywords": ["Full-Stack Developer", "React", "TypeScript", "JavaScript", "Node.js"]
    }
  }'::jsonb,
  NOW(),
  NOW()
WHERE NOT EXISTS (SELECT 1 FROM site_settings LIMIT 1);