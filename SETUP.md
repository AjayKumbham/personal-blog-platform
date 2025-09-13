# Setup Guide

Complete setup instructions for the Professional Developer Blog Platform.

## 🔧 Prerequisites

- **Node.js** (v18 or higher)
- **npm** 
- **Git**
- **Supabase account** - [supabase.com](https://supabase.com/)
- **Brevo account** - [brevo.com](https://www.brevo.com/)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AjayKumbham/personal-blog-platform.git
   cd personal-blog-platform
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   # Database Configuration
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   
   # Contact Form Configuration (FormSubmit)
   VITE_RECIPIENT_EMAIL=your-email@domain.com
   
   # Newsletter Configuration (Brevo)
   VITE_BREVO_API_KEY=your-brevo-api-key
   VITE_BREVO_LIST_ID=1
   VITE_SENDER_EMAIL=your-verified-email@domain.com
   ```

## 🗄️ Database Setup

### 1. Create Supabase Project
1. Sign up at [supabase.com](https://supabase.com/)
2. Create a new project with a secure password
3. Go to **Settings** → **API** and copy your credentials to `.env`

### 2. Database Schema
Run these SQL commands in the Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  published_at TIMESTAMPTZ DEFAULT now(),
  read_time INTEGER DEFAULT 5,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  cover_image TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX posts_published_at_idx ON posts(published_at DESC);
CREATE INDEX posts_slug_idx ON posts(slug);
CREATE INDEX posts_published_idx ON posts(published);
CREATE INDEX posts_featured_idx ON posts(featured);

-- Trigger to automatically update updated_at
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create flexible site_settings table with JSONB storage
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  settings_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for common JSON queries
CREATE INDEX idx_site_settings_site_name ON site_settings USING GIN ((settings_data->'siteName'));
CREATE INDEX idx_site_settings_author_name ON site_settings USING GIN ((settings_data->'author'->'name'));

-- Trigger to automatically update updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create newsletter_subscribers table
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  active BOOLEAN DEFAULT true
);

-- Insert default site settings with flexible JSONB structure
INSERT INTO site_settings (settings_data) VALUES (
  '{
    "siteName": "My Developer Blog",
    "siteDescription": "A modern blog about web development, programming, and technology",
    "siteUrl": "https://myblog.com",
    "author": {
      "name": "Your Name",
      "bio": "Full-stack developer passionate about creating amazing web experiences",
      "avatar": "/personal-logo.jpg",
      "title": "Full-Stack Developer",
      "location": "Your Location",
      "email": "your@email.com",
      "github": "https://github.com/yourusername",
      "twitter": "https://twitter.com/yourusername",
      "linkedin": "https://linkedin.com/in/yourusername",
      "website": "https://yourwebsite.com",
      "resume": null,
      "skills": ["JavaScript", "TypeScript", "React", "Node.js"],
      "careerHighlights": [],
      "stats": []
    },
    "newsletter": {
      "enabled": true,
      "substackUrl": "https://yourname.substack.com",
      "title": "Stay Updated",
      "description": "Get notified when I publish new articles about web development and programming."
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
      "metaTitle": "My Developer Blog",
      "metaDescription": "A modern blog about web development, programming, and technology",
      "keywords": ["Web Development", "Programming", "JavaScript", "React"]
    }
  }'::jsonb
);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('blog-covers', 'blog-covers', true),
  ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Posts policies
CREATE POLICY "Public can read published posts" ON posts
  FOR SELECT TO anon, authenticated
  USING (published = true);

CREATE POLICY "Admin can manage all posts" ON posts
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Site settings policies
CREATE POLICY "Public can read site settings" ON site_settings
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admin can manage site settings" ON site_settings
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Newsletter policies
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can manage newsletter subscribers" ON newsletter_subscribers
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Storage policies for blog covers
CREATE POLICY "Public blog covers are viewable" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-covers');

CREATE POLICY "Authenticated users can upload blog covers" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'blog-covers' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update blog covers" ON storage.objects
  FOR UPDATE USING (bucket_id = 'blog-covers' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete blog covers" ON storage.objects
  FOR DELETE USING (bucket_id = 'blog-covers' AND auth.uid() IS NOT NULL);

-- Storage policies for uploads
CREATE POLICY "Public uploads are viewable" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads');

CREATE POLICY "Authenticated users can upload files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'uploads' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update uploads" ON storage.objects
  FOR UPDATE USING (bucket_id = 'uploads' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete uploads" ON storage.objects
  FOR DELETE USING (bucket_id = 'uploads' AND auth.uid() IS NOT NULL);
```

### 3. Create Admin User
1. Go to **Authentication** → **Users**
2. Click **Add user** and enter your email/password
3. Confirm the user

## 📧 Email Configuration

### 1. Contact Form (FormSubmit)
The contact form uses FormSubmit for reliable email delivery without backend setup:

1. **No signup required** - FormSubmit works directly with your email
2. **Set recipient email** in your `.env` file as `VITE_RECIPIENT_EMAIL`
3. **Test the form** - First submission may require email verification
4. **FormSubmit features used:**
   - Spam protection
   - Email templates
   - Reply-to functionality
   - No redirects (AJAX mode)

### 2. Newsletter (Brevo Setup)
For automated blog notifications and newsletter management:

1. **Sign up** at [brevo.com](https://www.brevo.com/)
2. **Generate API key**: Go to **Account** → **SMTP & API** → **Generate API key**
3. **Create contact list**: Go to **Contacts** → **Lists** → **Create List** (note the List ID)
4. **Verify sender email**: Go to **Senders & IP** → **Add sender** → verify your email
5. **Add credentials** to your `.env` file:
   - `VITE_BREVO_API_KEY` - Your API key
   - `VITE_BREVO_LIST_ID` - Your list ID (usually 1 for first list)
   - `VITE_SENDER_EMAIL` - Your verified sender email

## 💻 Development

### Start Development Server
```bash
npm run dev
# Available at http://localhost:5173
```

### Access Admin Panel
1. Go to `http://localhost:5173/admin/login`
2. Log in with your Supabase credentials
3. Configure site settings and create your first post

### Test Integrations
1. **Contact Form**: Go to `/contact` and submit a test message
2. **Newsletter**: Sign up on the homepage and check Brevo dashboard
3. **Blog Notifications**: Publish a post and verify email is sent to subscribers
4. **File Uploads**: Upload a resume in admin settings

### Available Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview build
npm run type-check   # TypeScript checking
npm run lint         # Code linting
```

## 🌐 Production Deployment

### Vercel (Recommended)
1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in your project directory
3. Set environment variables in Vercel dashboard
4. Deploy with `vercel --prod`

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Environment Variables for Production
Make sure to set all these in your deployment platform:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `VITE_RECIPIENT_EMAIL` - Email where contact form messages are sent
- `VITE_BREVO_API_KEY` - Brevo API key for newsletters
- `VITE_BREVO_LIST_ID` - Brevo contact list ID
- `VITE_SENDER_EMAIL` - Verified sender email for Brevo

## 🔧 Troubleshooting

### Common Issues

**Supabase Connection Issues**
- Verify your URL and API key are correct
- Check if your Supabase project is active
- Ensure RLS policies are set up correctly

**Contact Form Not Working**
- Verify `VITE_RECIPIENT_EMAIL` is set correctly
- Check spam folder for FormSubmit verification email
- Ensure email address is valid and accessible
- Test form submission and check browser network tab

**Newsletter Notifications Not Working**
- Verify Brevo API key is correct
- Check if sender email is verified in Brevo
- Ensure `VITE_BREVO_LIST_ID` matches your actual list ID
- Test with admin panel test notification feature

**Build Errors**
```bash
# Check for TypeScript errors
npm run type-check

# Fix linting issues
npm run lint

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Authentication Issues**
- Verify user exists in Supabase Auth
- Check if user is confirmed
- Ensure RLS policies allow authenticated access

### Getting Help
1. Check browser console and terminal logs
2. Search existing GitHub issues
3. Create a new issue with:
   - Error messages
   - Steps to reproduce
   - Environment details
   - Screenshots if applicable

## 🎯 Next Steps

After successful setup:
1. Customize site branding and content in admin settings
2. Write your first blog posts
3. Test email notification system
4. Configure social media links
5. Set up custom domain (if desired)
6. Plan your content strategy

---

**Need help?** Check our [Contributing Guide](./CONTRIBUTING.md) or create an issue on GitHub.