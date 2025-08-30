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
        careerHighlights: data.author_career_highlights ? JSON.parse(data.author_career_highlights) : [
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
      if (settings.author.careerHighlights !== undefined) updateData.author_career_highlights = JSON.stringify(settings.author.careerHighlights);
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