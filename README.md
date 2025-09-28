# Professional Developer Blog Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Live Site](https://img.shields.io/badge/Live%20Site-blog--ajaykumbham.vercel.app-brightgreen)](https://blog-ajaykumbham.vercel.app/)

> A modern blogging platform built with React, TypeScript, and Supabase for developers who want to share their technical knowledge.

## 🌐 Live Site

> 🚀 Visit the platform live: [blog-ajaykumbham.vercel.app](https://blog-ajaykumbham.vercel.app/) — Explore modern blogging, beautiful UI, and powerful admin features in action!


## ✨ Features

### Public Features
- **Modern Landing Page** with animated backgrounds and hero section
- **Blog Listing** with search, filtering by tags, read time, and sorting
- **Individual Blog Posts** with syntax highlighting and reading time
- **About Page** with career highlights, skills, and downloadable resume
- **Contact Form** with FormSubmit integration for email delivery
- **Newsletter Signup** with Brevo integration and email validation
- **Unsubscribe Page** for newsletter compliance

### Admin Features
- **Secure Admin Panel** with Supabase authentication
- **Blog Management** - create, edit, delete, and publish posts
- **Rich Text Editor** with markdown support and image uploads
- **Email Notifications** - automatic subscriber notifications when posts are published
- **Site Settings** - configure author info, social links, and site metadata
- **Career Management** - add/edit career highlights with metrics and achievements
- **Newsletter Management** - view subscriber count and send test notifications
- **File Upload** - resume upload with automatic storage management

### Technical Features
- **Responsive Design** - mobile-first approach with Tailwind CSS
- **TypeScript** - full type safety throughout the application
- **Real-time Database** - Supabase PostgreSQL with Row Level Security
- **Image Storage** - Supabase storage for blog covers and resume files
- **Email Automation** - Brevo integration for transactional emails
- **Error Handling** - comprehensive error boundaries and user feedback
- **Performance Optimized** - Vite build system with code splitting

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, React Router, React Hook Form
- **Backend**: Supabase (PostgreSQL, Auth, Storage, RLS)
- **Email**: Brevo (Sendinblue) for newsletters and notifications
- **Build Tool**: Vite with ESLint and PostCSS
- **Icons**: Lucide React
- **Validation**: Yup schema validation
- **Date Handling**: date-fns

## 🚀 Quick Start

1. **Clone and install**
   ```bash
   git clone https://github.com/AjayKumbham/personal-blog-platform.git
   cd personal-blog-platform
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Configure your environment variables:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_BREVO_API_KEY=your_brevo_api_key
   VITE_BREVO_LIST_ID=your_newsletter_list_id
   VITE_SENDER_EMAIL=your_verified_sender_email
   ```

3. **Database setup** - See [SETUP.md](./SETUP.md) for detailed instructions

4. **Start development**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (Button, Card, Toast)
│   ├── layout/          # Header, Footer layout components
│   ├── blog/            # BlogCard, blog-specific components
│   ├── newsletter/      # Newsletter signup and Brevo integration
│   └── auth/            # Authentication components
├── pages/
│   ├── admin/           # Admin dashboard, login, post management
│   ├── Home.tsx         # Landing page with hero and recent posts
│   ├── Blog.tsx         # Blog listing with search and filters
│   ├── BlogPost.tsx     # Individual blog post display
│   ├── About.tsx        # About page with career info
│   ├── Contact.tsx      # Contact form page
│   └── Unsubscribe.tsx  # Newsletter unsubscribe page
├── services/            # API integrations (blog, newsletter, email, settings)
├── hooks/               # Custom React hooks (useAuth, useToast)
├── types/               # TypeScript type definitions
└── lib/                 # Supabase client configuration
```

## 📚 Documentation

- **[Setup Guide](./SETUP.md)** - Complete installation and configuration
- **[Admin Access Guide](./ADMIN_ACCESS.md)** - How to access the admin panel securely
- **[Contributing](./CONTRIBUTING.md)** - Development workflow and guidelines
- **[Code of Conduct](./CODE_OF_CONDUCT.md)** - Community standards
- **[License](./LICENSE.md)** - MIT License terms

## 🔧 Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # TypeScript type checking
npm run lint         # ESLint code linting
```

## 📄 License

MIT License - see [LICENSE.md](./LICENSE.md) for details.

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

<div align="center">

**Built with ❤️ by [Ajay Goud Kumbham](https://github.com/AjayKumbham)**

[⭐ Star this repo](https://github.com/AjayKumbham/personal-blog-platform) • [🐛 Report Bug](https://github.com/AjayKumbham/personal-blog-platform/issues) • [✨ Request Feature](https://github.com/AjayKumbham/personal-blog-platform/issues)

</div>
