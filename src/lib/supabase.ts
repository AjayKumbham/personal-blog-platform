import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);

// Database types
export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          tags: string[];
          published_at: string;
          read_time: number;
          featured: boolean;
          published: boolean;
          cover_image: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string;
          tags: string[];
          published_at?: string;
          read_time: number;
          featured?: boolean;
          published?: boolean;
          cover_image?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string;
          content?: string;
          tags?: string[];
          published_at?: string;
          read_time?: number;
          featured?: boolean;
          published?: boolean;
          cover_image?: string | null;
          updated_at?: string;
        };
      };
      site_settings: {
        Row: {
          id: string;
          site_name: string;
          site_description: string;
          site_url: string;
          author_name: string;
          author_bio: string;
          author_avatar: string;
          author_title: string;
          author_location: string;
          author_email: string;
          author_github: string;
          author_twitter: string;
          author_linkedin: string;
          author_website: string;
          hashnode_api_key: string | null;
          hashnode_publication_id: string | null;
          dev_to_api_key: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          site_name: string;
          site_description: string;
          site_url: string;
          author_name: string;
          author_bio: string;
          author_avatar: string;
          author_title: string;
          author_location: string;
          author_email: string;
          author_github: string;
          author_twitter: string;
          author_linkedin: string;
          author_website: string;
          hashnode_api_key?: string | null;
          hashnode_publication_id?: string | null;
          dev_to_api_key?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          site_name?: string;
          site_description?: string;
          site_url?: string;
          author_name?: string;
          author_bio?: string;
          author_avatar?: string;
          author_title?: string;
          author_location?: string;
          author_email?: string;
          author_github?: string;
          author_twitter?: string;
          author_linkedin?: string;
          author_website?: string;
          hashnode_api_key?: string | null;
          hashnode_publication_id?: string | null;
          dev_to_api_key?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}