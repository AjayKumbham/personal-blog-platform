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
  resume?: string; // URL to resume file
  skills?: string[];
  careerHighlights?: CareerHighlight[];
  stats?: Array<{
    id?: string;
    icon: React.ComponentType<{ className?: string }>; // React component
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
    provider?: 'brevo' | 'substack';
    title?: string;
    description?: string;
    brevoApiKey?: string;
    brevoListId?: number;
    // Legacy support
    substackUrl?: string;
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