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
          settings_data: Record<string, unknown>; // JSONB column containing all flexible settings
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          settings_data: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          settings_data?: Record<string, unknown>;
          updated_at?: string;
        };
      };
    };
  };
}