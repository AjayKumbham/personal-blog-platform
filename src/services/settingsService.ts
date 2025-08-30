import { supabase } from '../lib/supabase';
import { SiteSettings } from '../types';

export const settingsService = {
  // Get site settings (public data only for non-authenticated users)
  async getSiteSettings() {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    if (error) throw error;
    
    return {
      siteName: data.site_name,
      siteDescription: data.site_description,
      siteUrl: data.site_url,
      author: {
        name: data.author_name,
        bio: data.author_bio,
        avatar: data.author_avatar,
        title: data.author_title,
        location: data.author_location,
        email: data.author_email,
        github: data.author_github,
        twitter: data.author_twitter,
        linkedin: data.author_linkedin,
        website: data.author_website,
        skills: data.author_skills ? data.author_skills.split(',').map((s: string) => s.trim()) : [],
      },
      hashnodeApiKey: data.hashnode_api_key || '',
      hashnodePublicationId: data.hashnode_publication_id || '',
      devToApiKey: data.dev_to_api_key || '',
    } as SiteSettings;
  },

  // Admin: Update site settings
  async updateSiteSettings(settings: Partial<SiteSettings>) {
    const updateData: any = {};
    
    if (settings.siteName !== undefined) updateData.site_name = settings.siteName;
    if (settings.siteDescription !== undefined) updateData.site_description = settings.siteDescription;
    if (settings.siteUrl !== undefined) updateData.site_url = settings.siteUrl;
    if (settings.hashnodeApiKey !== undefined) updateData.hashnode_api_key = settings.hashnodeApiKey;
    if (settings.hashnodePublicationId !== undefined) updateData.hashnode_publication_id = settings.hashnodePublicationId;
    if (settings.devToApiKey !== undefined) updateData.dev_to_api_key = settings.devToApiKey;
    
    if (settings.author) {
      if (settings.author.name !== undefined) updateData.author_name = settings.author.name;
      if (settings.author.bio !== undefined) updateData.author_bio = settings.author.bio;
      if (settings.author.avatar !== undefined) updateData.author_avatar = settings.author.avatar;
      if (settings.author.title !== undefined) updateData.author_title = settings.author.title;
      if (settings.author.location !== undefined) updateData.author_location = settings.author.location;
      if (settings.author.email !== undefined) updateData.author_email = settings.author.email;
      if (settings.author.github !== undefined) updateData.author_github = settings.author.github;
      if (settings.author.twitter !== undefined) updateData.author_twitter = settings.author.twitter;
      if (settings.author.linkedin !== undefined) updateData.author_linkedin = settings.author.linkedin;
      if (settings.author.website !== undefined) updateData.author_website = settings.author.website;
      if (settings.author.skills !== undefined) updateData.author_skills = settings.author.skills.join(', ');
    }

    const { data, error } = await supabase
      .from('site_settings')
      .update(updateData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};