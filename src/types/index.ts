export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  publishedAt: Date;
  readTime: number;
  featured: boolean;
  published: boolean;
  coverImage?: string;
}

export interface CareerHighlight {
  id: string;
  title: string;
  subtitle: string;
  points: string[];
  metrics: Array<{
    label: string;
    value: string;
  }>;
  period: string;
  icon: string; // Icon name as string
  order: number;
}

export interface Author {
  name: string;
  bio: string;
  avatar: string;
  title: string;
  location: string;
  email: string;
  github: string;
  twitter: string;
  linkedin: string;
  website: string;
  hashnode?: string;
  devto?: string;
  resume?: string; // URL to resume file
  skills?: string[];
  careerHighlights?: CareerHighlight[];
  stats?: Array<{
    id?: string;
    icon: string; // Icon name as string to match admin panel
    label: string;
    value: string;
  }>;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  author: Author;
  hashnodeApiKey: string;
  hashnodePublicationId: string;
  devToApiKey: string;
  newsletter?: {
    enabled?: boolean;
    provider?: 'brevo';
    title?: string;
    description?: string;
    brevoApiKey?: string;
    brevoListId?: number;
  };
  // Optional future-ready fields
  theme?: {
    primaryColor: string;
    darkMode: boolean;
  };
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

// Admin-specific interfaces
export interface NavigationItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

export interface NotificationStatus {
  configured: boolean;
  subscriberCount: number;
  senderVerified?: boolean;
  lastError?: string;
  lastChecked?: string;
}

export interface AdminSettingsState {
  // API Keys
  hashnodeApiKey: string;
  hashnodePublicationId: string;
  devToApiKey: string;
  // About Content
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  authorName: string;
  authorBio: string;
  authorTitle: string;
  authorLocation: string;
  authorEmail: string;
  github: string;
  linkedin: string;
  twitter: string;
  website: string;
  hashnode: string;
  devto: string;
  resume: string;
  skills: string;
  careerHighlights: CareerHighlight[];
  stats: Array<{ id?: string; icon: string; label: string; value: string }>;
  // Newsletter
  newsletterEnabled: boolean;
}

export interface StatsFormData {
  label: string;
  value: string;
  icon: string;
}

export interface CareerHighlightFormData {
  title: string;
  subtitle: string;
  points: string[];
  metrics: Array<{ label: string; value: string }>;
  period: string;
  icon: string;
  order: number;
}