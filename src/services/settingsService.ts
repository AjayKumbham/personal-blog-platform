import { supabase } from '../lib/supabase';
import { SiteSettings, CareerHighlight } from '../types';

export const settingsService = {
  // Get site settings using the new JSON schema only
  async getSiteSettings(): Promise<SiteSettings> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('settings_data')
      .single();

    if (error) {
      // If no settings exist, return default values
      if (error.code === 'PGRST116') {
        return this.getDefaultSettings();
      }
      throw error;
    }

    // Merge with defaults to ensure all required fields exist
    const defaultSettings = this.getDefaultSettings();
    const savedSettings = data.settings_data || {};
    
    return {
      ...defaultSettings,
      ...savedSettings,
      author: {
        ...defaultSettings.author,
        ...savedSettings.author,
      },
      newsletter: {
        ...defaultSettings.newsletter,
        ...savedSettings.newsletter,
      },
      theme: {
        ...defaultSettings.theme,
        ...savedSettings.theme,
      },
      seo: {
        ...defaultSettings.seo,
        ...savedSettings.seo,
      },
      // Backward compatibility for old API key fields
      hashnodeApiKey: savedSettings.apiKeys?.hashnode?.apiKey || savedSettings.hashnodeApiKey || '',
      hashnodePublicationId: savedSettings.apiKeys?.hashnode?.publicationId || savedSettings.hashnodePublicationId || '',
      devToApiKey: savedSettings.apiKeys?.devTo?.apiKey || savedSettings.devToApiKey || '',
    } as SiteSettings;
  },

  // Get default settings when no database record exists - returns empty structure
  getDefaultSettings(): SiteSettings {
    return {
      siteName: '',
      siteDescription: '',
      siteUrl: '',
      author: {
        name: '',
        bio: '',
        avatar: '',
        title: '',
        location: '',
        email: '',
        github: '',
        twitter: '',
        linkedin: '',
        website: '',
        resume: '',
        skills: [],
        careerHighlights: [],
        stats: [],
      },
      hashnodeApiKey: '',
      hashnodePublicationId: '',
      devToApiKey: '',
      newsletter: {
        enabled: true,
        substackUrl: '',
      },
      theme: {
        primaryColor: '#3B82F6',
        darkMode: false,
      },
      seo: {
        metaTitle: '',
        metaDescription: '',
        keywords: [],
      },
    };
  },

  // Admin: Update site settings using flexible JSON storage
  async updateSiteSettings(settings: Partial<SiteSettings>) {
    // Get current settings to merge with new ones
    const currentSettings = await this.getSiteSettings();
    
    // Merge the new settings with existing ones
    const updatedSettings = {
      ...currentSettings,
      ...settings,
      author: {
        ...currentSettings.author,
        ...settings.author,
      },
      // Store API keys in structured format for future flexibility
      apiKeys: {
        hashnode: {
          apiKey: settings.hashnodeApiKey || currentSettings.hashnodeApiKey,
          publicationId: settings.hashnodePublicationId || currentSettings.hashnodePublicationId,
        },
        devTo: {
          apiKey: settings.devToApiKey || currentSettings.devToApiKey,
        },
      },
      // Add extensible sections for future features
      theme: {
        primaryColor: '#3B82F6',
        darkMode: false,
        ...currentSettings.theme,
      },
      seo: {
        metaTitle: settings.siteName || currentSettings.siteName,
        metaDescription: settings.siteDescription || currentSettings.siteDescription,
        keywords: [],
        ...currentSettings.seo,
      },
    };

    // Remove the old API key fields from the main object to avoid duplication
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashnodeApiKey, hashnodePublicationId, devToApiKey, ...settingsToStore } = updatedSettings;

    // First, try to get existing record
    const { data: existingData } = await supabase
      .from('site_settings')
      .select('id')
      .single();

    let result;
    if (existingData) {
      // Update existing record
      result = await supabase
        .from('site_settings')
        .update({
          settings_data: settingsToStore,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingData.id)
        .select()
        .single();
    } else {
      // Insert new record
      result = await supabase
        .from('site_settings')
        .insert({
          settings_data: settingsToStore,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
    }

    if (result.error) throw result.error;
    return result.data;
  },

  // Future: Add specific methods for different setting categories
  async updateThemeSettings(theme: { primaryColor?: string; darkMode?: boolean }) {
    const currentSettings = await this.getSiteSettings();
    const updatedTheme = { ...currentSettings.theme, ...theme };
    return this.updateSiteSettings({
      theme: {
        primaryColor: updatedTheme.primaryColor || '#3B82F6',
        darkMode: updatedTheme.darkMode || false,
      }
    });
  },

  async updateSeoSettings(seo: { metaTitle?: string; metaDescription?: string; keywords?: string[] }) {
    const currentSettings = await this.getSiteSettings();
    const updatedSeo = { ...currentSettings.seo, ...seo };
    return this.updateSiteSettings({
      seo: {
        metaTitle: updatedSeo.metaTitle || currentSettings.siteName,
        metaDescription: updatedSeo.metaDescription || currentSettings.siteDescription,
        keywords: updatedSeo.keywords || [],
      }
    });
  },

  async updateCareerHighlights(careerHighlights: CareerHighlight[]) {
    const currentSettings = await this.getSiteSettings();
    return this.updateSiteSettings({
      author: { ...currentSettings.author, careerHighlights }
    });
  },

  async updateSkills(skills: string[]) {
    const currentSettings = await this.getSiteSettings();
    return this.updateSiteSettings({
      author: { ...currentSettings.author, skills }
    });
  },
};