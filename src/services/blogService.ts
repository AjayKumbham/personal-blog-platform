import { supabase } from '../lib/supabase';
import { BlogPost } from '../types';

export const blogService = {
  // Get all published posts for public viewing
  async getPublishedPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    
    return data.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      tags: post.tags,
      publishedAt: new Date(post.published_at),
      readTime: post.read_time,
      featured: post.featured,
      published: post.published,
      coverImage: post.cover_image,
    })) as BlogPost[];
  },

  // Get single post by slug
  async getPostBySlug(slug: string) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      tags: data.tags,
      publishedAt: new Date(data.published_at),
      readTime: data.read_time,
      featured: data.featured,
      published: data.published,
      coverImage: data.cover_image,
    } as BlogPost;
  },

  // Admin: Get all posts
  async getAllPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      tags: post.tags,
      publishedAt: new Date(post.published_at),
      readTime: post.read_time,
      featured: post.featured,
      published: post.published,
      coverImage: post.cover_image,
    })) as BlogPost[];
  },

  // Admin: Create new post
  async createPost(post: Omit<BlogPost, 'id' | 'publishedAt'>) {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        tags: post.tags,
        read_time: post.readTime,
        featured: post.featured,
        published: post.published,
        cover_image: post.coverImage,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Admin: Update post
  async updatePost(id: string, updates: Partial<BlogPost>) {
    const updateData: any = {};
    
    if (updates.title) updateData.title = updates.title;
    if (updates.slug) updateData.slug = updates.slug;
    if (updates.excerpt) updateData.excerpt = updates.excerpt;
    if (updates.content) updateData.content = updates.content;
    if (updates.tags) updateData.tags = updates.tags;
    if (updates.readTime) updateData.read_time = updates.readTime;
    if (updates.featured !== undefined) updateData.featured = updates.featured;
    if (updates.published !== undefined) updateData.published = updates.published;
    if (updates.coverImage !== undefined) updateData.cover_image = updates.coverImage;

    const { data, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Admin: Delete post
  async deletePost(id: string) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Upload cover image
  async uploadCoverImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `covers/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('blog-covers')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('blog-covers')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },
};