-- Migration: Redesign site_settings table with flexible JSON-based schema
-- This approach allows for unlimited flexibility without schema changes

-- Drop the old table if it exists (backup data first if needed)
DROP TABLE IF EXISTS site_settings;

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

-- Insert default settings as JSON
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
        },
        {
          "id": "2",
          "title": "Open Source Contributions",
          "subtitle": "Community Impact",
          "points": [
            "Contributed to React ecosystem libraries",
            "Maintained popular npm packages",
            "Mentored 20+ junior developers",
            "Wrote technical articles with 100K+ views"
          ],
          "metrics": [
            {"label": "GitHub Stars", "value": "2.5K+"},
            {"label": "Contributions", "value": "800+"},
            {"label": "Repositories", "value": "35+"}
          ],
          "period": "2021 - Present",
          "icon": "Trophy",
          "order": 2
        },
        {
          "id": "3",
          "title": "Performance Optimization",
          "subtitle": "Technical Excellence",
          "points": [
            "Improved app load times by 60%",
            "Reduced bundle sizes by 40%",
            "Implemented advanced caching strategies",
            "Optimized database queries for scale"
          ],
          "metrics": [
            {"label": "Speed Boost", "value": "+60%"},
            {"label": "Bundle Reduction", "value": "-40%"},
            {"label": "Performance Score", "value": "95+"}
          ],
          "period": "Ongoing",
          "icon": "Zap",
          "order": 3
        },
        {
          "id": "4",
          "title": "Team Leadership",
          "subtitle": "Management & Mentoring",
          "points": [
            "Led cross-functional teams of 8+ members",
            "Implemented Agile development practices",
            "Conducted code reviews and architecture decisions",
            "Delivered projects 95% on-time and within budget"
          ],
          "metrics": [
            {"label": "Team Size", "value": "8+"},
            {"label": "Projects Led", "value": "15+"},
            {"label": "On-Time Delivery", "value": "95%"}
          ],
          "period": "2022 - Present",
          "icon": "Users",
          "order": 4
        },
        {
          "id": "5",
          "title": "Modern Tech Stack",
          "subtitle": "Innovation & Adoption",
          "points": [
            "Early adopter of React 18 and Next.js 13",
            "Implemented TypeScript across all projects",
            "Integrated AI/ML features using modern APIs",
            "Built scalable microservices architecture"
          ],
          "metrics": [
            {"label": "Technologies", "value": "25+"},
            {"label": "Frameworks", "value": "10+"},
            {"label": "Innovation Score", "value": "A+"}
          ],
          "period": "Continuous",
          "icon": "Code2",
          "order": 5
        },
        {
          "id": "6",
          "title": "Client Success Stories",
          "subtitle": "Business Impact",
          "points": [
            "Delivered solutions that increased client revenue by 40%",
            "Built platforms serving 100K+ daily active users",
            "Achieved 99.9% uptime across all deployed applications",
            "Maintained long-term partnerships with 85% client retention"
          ],
          "metrics": [
            {"label": "Revenue Impact", "value": "+40%"},
            {"label": "Daily Users", "value": "100K+"},
            {"label": "Uptime", "value": "99.9%"}
          ],
          "period": "Proven Track Record",
          "icon": "Target",
          "order": 6
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