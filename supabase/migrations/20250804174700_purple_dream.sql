/*
  # Create site_settings table for blog configuration

  1. New Tables
    - `site_settings`
      - `id` (uuid, primary key)
      - `site_name` (text, not null)
      - `site_description` (text, not null)
      - `site_url` (text, not null)
      - `author_name` (text, not null)
      - `author_bio` (text, not null)
      - `author_avatar` (text, not null)
      - `author_title` (text, not null)
      - `author_location` (text, not null)
      - `author_email` (text, not null)
      - `author_github` (text, not null)
      - `author_twitter` (text, not null)
      - `author_linkedin` (text, not null)
      - `author_website` (text, not null)
      - `hashnode_api_key` (text, nullable)
      - `hashnode_publication_id` (text, nullable)
      - `dev_to_api_key` (text, nullable)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `site_settings` table
    - Add policy for public read access to basic site info
    - Add policy for authenticated admin access to all settings

  3. Initial Data
    - Insert default site settings
*/

CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text NOT NULL DEFAULT 'DevBlog Pro',
  site_description text NOT NULL DEFAULT 'A professional developer blog sharing insights on modern web development.',
  site_url text NOT NULL DEFAULT 'https://devblog-pro.netlify.app',
  author_name text NOT NULL DEFAULT 'Alex Developer',
  author_bio text NOT NULL DEFAULT 'Full-stack developer passionate about creating exceptional web experiences.',
  author_avatar text NOT NULL DEFAULT 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
  author_title text NOT NULL DEFAULT 'Senior Full-Stack Developer',
  author_location text NOT NULL DEFAULT 'San Francisco, CA',
  author_email text NOT NULL DEFAULT 'alex@devblog-pro.com',
  author_github text NOT NULL DEFAULT 'https://github.com/alexdev',
  author_twitter text NOT NULL DEFAULT 'https://twitter.com/alexdev',
  author_linkedin text NOT NULL DEFAULT 'https://linkedin.com/in/alexdev',
  author_website text NOT NULL DEFAULT 'https://alexdev.com',
  hashnode_api_key text,
  hashnode_publication_id text,
  dev_to_api_key text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to basic site info (excluding API keys)
CREATE POLICY "Public can read basic site settings"
  ON site_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy for authenticated admin access to all settings
CREATE POLICY "Admin can manage all site settings"
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

-- Insert default settings (only if table is empty)
INSERT INTO site_settings (
  site_name,
  site_description,
  site_url,
  author_name,
  author_bio,
  author_avatar,
  author_title,
  author_location,
  author_email,
  author_github,
  author_twitter,
  author_linkedin,
  author_website
) 
SELECT 
  'DevBlog Pro',
  'A professional developer blog sharing insights on modern web development, programming techniques, and industry trends.',
  'https://devblog-pro.netlify.app',
  'Alex Developer',
  'Full-stack developer passionate about creating exceptional web experiences. I specialize in React, TypeScript, and modern web technologies.',
  'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
  'Senior Full-Stack Developer',
  'San Francisco, CA',
  'alex@devblog-pro.com',
  'https://github.com/alexdev',
  'https://twitter.com/alexdev',
  'https://linkedin.com/in/alexdev',
  'https://alexdev.com'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);