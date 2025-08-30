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

  // Get default settings when no database record exists
  getDefaultSettings(): SiteSettings {
    return {
      siteName: 'Kumbham Ajay Goud',
      siteDescription: 'Passionate Full-Stack Developer specializing in React, TypeScript, and modern web technologies. I create scalable applications and contribute to open-source projects while mentoring the next generation of developers.',
      siteUrl: 'https://ajaykumbham-portfolio.vercel.app',
      author: {
        name: 'Kumbham Ajay Goud',
        bio: 'Passionate Full-Stack Developer specializing in React, TypeScript, and modern web technologies. I create scalable applications and contribute to open-source projects while mentoring the next generation of developers.',
        avatar: '/personal-logo.jpg',
        title: 'Senior Full-Stack Developer',
        location: 'Hyderabad, India',
        email: 'ajaygoud.kumbham@gmail.com',
        github: 'https://github.com/AjayKumbham',
        twitter: 'https://twitter.com/ajaykumbham',
        linkedin: 'https://linkedin.com/in/ajaykumbham',
        website: 'https://ajaykumbham-portfolio.vercel.app',
        skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Git', 'GraphQL', 'REST APIs', 'Tailwind CSS', 'Material-UI', 'Redux', 'Zustand'],
        careerHighlights: [
          {
            id: '1',
            title: 'Full-Stack Projects',
            subtitle: 'Web Development',
            points: [
              'Built 50+ responsive web applications',
              'Developed e-commerce platforms for startups',
              'Created SaaS solutions for enterprises',
              'Implemented real-time chat applications'
            ],
            metrics: [
              { label: 'Projects', value: '50+' },
              { label: 'Success Rate', value: '98%' },
              { label: 'Client Satisfaction', value: '4.9/5' }
            ],
            period: '2020 - Present',
            icon: 'Rocket',
            order: 1
          },
          {
            id: '2',
            title: 'Open Source Contributions',
            subtitle: 'Community Impact',
            points: [
              'Contributed to React ecosystem libraries',
              'Maintained popular npm packages',
              'Mentored 20+ junior developers',
              'Wrote technical articles with 100K+ views'
            ],
            metrics: [
              { label: 'GitHub Stars', value: '2.5K+' },
              { label: 'Contributions', value: '800+' },
              { label: 'Repositories', value: '35+' }
            ],
            period: '2021 - Present',
            icon: 'Trophy',
            order: 2
          },
          {
            id: '3',
            title: 'Performance Optimization',
            subtitle: 'Technical Excellence',
            points: [
              'Improved app load times by 60%',
              'Reduced bundle sizes by 40%',
              'Implemented advanced caching strategies',
              'Optimized database queries for scale'
            ],
            metrics: [
              { label: 'Speed Boost', value: '+60%' },
              { label: 'Bundle Reduction', value: '-40%' },
              { label: 'Performance Score', value: '95+' }
            ],
            period: 'Ongoing',
            icon: 'Zap',
            order: 3
          },
          {
            id: '4',
            title: 'Team Leadership',
            subtitle: 'Management & Mentoring',
            points: [
              'Led cross-functional teams of 8+ members',
              'Implemented Agile development practices',
              'Conducted code reviews and architecture decisions',
              'Delivered projects 95% on-time and within budget'
            ],
            metrics: [
              { label: 'Team Size', value: '8+' },
              { label: 'Projects Led', value: '15+' },
              { label: 'On-Time Delivery', value: '95%' }
            ],
            period: '2022 - Present',
            icon: 'Users',
            order: 4
          },
          {
            id: '5',
            title: 'Modern Tech Stack',
            subtitle: 'Innovation & Adoption',
            points: [
              'Early adopter of React 18 and Next.js 13',
              'Implemented TypeScript across all projects',
              'Integrated AI/ML features using modern APIs',
              'Built scalable microservices architecture'
            ],
            metrics: [
              { label: 'Technologies', value: '25+' },
              { label: 'Frameworks', value: '10+' },
              { label: 'Innovation Score', value: 'A+' }
            ],
            period: 'Continuous',
            icon: 'Code2',
            order: 5
          },
          {
            id: '6',
            title: 'Client Success Stories',
            subtitle: 'Business Impact',
            points: [
              'Delivered solutions that increased client revenue by 40%',
              'Built platforms serving 100K+ daily active users',
              'Achieved 99.9% uptime across all deployed applications',
              'Maintained long-term partnerships with 85% client retention'
            ],
            metrics: [
              { label: 'Revenue Impact', value: '+40%' },
              { label: 'Daily Users', value: '100K+' },
              { label: 'Uptime', value: '99.9%' }
            ],
            period: 'Proven Track Record',
            icon: 'Target',
            order: 6
          }
        ],
      },
      hashnodeApiKey: '',
      hashnodePublicationId: '',
      devToApiKey: '',
      theme: {
        primaryColor: '#3B82F6',
        darkMode: false,
      },
      seo: {
        metaTitle: 'Kumbham Ajay Goud - Full-Stack Developer',
        metaDescription: 'Passionate Full-Stack Developer specializing in React, TypeScript, and modern web technologies. I create scalable applications and contribute to open-source projects while mentoring the next generation of developers.',
        keywords: ['Full-Stack Developer', 'React', 'TypeScript', 'JavaScript', 'Node.js'],
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
        keywords: ['Full-Stack Developer', 'React', 'TypeScript', 'JavaScript', 'Node.js'],
        ...currentSettings.seo,
      },
    };

    // Remove the old API key fields from the main object to avoid duplication
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
        keywords: updatedSeo.keywords || ['Full-Stack Developer', 'React', 'TypeScript'],
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