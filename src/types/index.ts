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
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  author: Author;
  hashnodeApiKey: string;
  hashnodePublicationId: string;
  devToApiKey: string;
}