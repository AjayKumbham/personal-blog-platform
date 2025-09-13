interface NewsletterSubscription {
  email: string;
  firstName?: string;
  lastName?: string;
  attributes?: Record<string, unknown>;
}

interface NewsletterResponse {
  success: boolean;
  message: string;
  error?: string;
}

interface BlogNotificationData {
  title: string;
  excerpt: string;
  slug: string;
  tags: string[];
  readTime: number;
  publishedAt: Date;
  coverImage?: string;
  authorName: string;
  siteUrl: string;
}

interface BrevoContact {
  email: string;
  attributes?: Record<string, unknown>;
}

class NewsletterService {
  private apiKey: string;
  private apiUrl = 'https://api.brevo.com/v3';
  private listId: number;

  constructor() {
    this.apiKey = import.meta.env.VITE_BREVO_API_KEY || '';
    this.listId = parseInt(import.meta.env.VITE_BREVO_LIST_ID || '1');
  }

  async subscribe(subscription: NewsletterSubscription): Promise<NewsletterResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        message: 'Newsletter service is not configured',
        error: 'Missing API key'
      };
    }

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(subscription.email)) {
        return {
          success: false,
          message: 'Please enter a valid email address',
          error: 'Invalid email format'
        };
      }

      const response = await fetch(`${this.apiUrl}/contacts`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': this.apiKey
        },
        body: JSON.stringify({
          email: subscription.email,
          attributes: {
            FIRSTNAME: subscription.firstName || '',
            LASTNAME: subscription.lastName || '',
            ...subscription.attributes
          },
          listIds: [this.listId],
          updateEnabled: true // Update if contact already exists
        })
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: 'Successfully subscribed! Please check your email to confirm.'
        };
      } else {
        // Handle specific Brevo error codes
        if (response.status === 400 && data.code === 'duplicate_parameter') {
          return {
            success: true,
            message: 'You are already subscribed to our newsletter!'
          };
        }

        return {
          success: false,
          message: 'Subscription failed. Please try again.',
          error: data.message || 'Unknown error'
        };
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection and try again.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async unsubscribe(email: string): Promise<NewsletterResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        message: 'Newsletter service is not configured',
        error: 'Missing API key'
      };
    }

    try {
      const response = await fetch(`${this.apiUrl}/contacts/${encodeURIComponent(email)}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'api-key': this.apiKey
        }
      });

      if (response.ok || response.status === 404) {
        return {
          success: true,
          message: 'Successfully unsubscribed from newsletter.'
        };
      } else {
        const data = await response.json();
        return {
          success: false,
          message: 'Unsubscribe failed. Please try again.',
          error: data.message || 'Unknown error'
        };
      }
    } catch (error) {
      console.error('Newsletter unsubscribe error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get all subscribers from the list
  async getSubscribers(): Promise<BrevoContact[]> {
    if (!this.apiKey) {
      throw new Error('Newsletter service is not configured');
    }

    try {
      const response = await fetch(`${this.apiUrl}/contacts?listIds=${this.listId}&limit=500`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'api-key': this.apiKey
        }
      });

      const data = await response.json();

      console.log('Brevo Contacts API Response:', {
        status: response.status,
        contactCount: data.contacts?.length || 0,
        data: data
      });

      if (response.ok) {
        return data.contacts || [];
      } else {
        console.error('❌ Failed to fetch subscribers:', data);
        throw new Error(data.message || 'Failed to fetch subscribers');
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      throw error;
    }
  }

  // Send blog notification email to all subscribers
  async sendBlogNotification(blogData: BlogNotificationData): Promise<NewsletterResponse> {
    if (!this.apiKey) {
      return {
        success: false,
        message: 'Newsletter service is not configured',
        error: 'Missing API key'
      };
    }

    try {
      // Get all subscribers
      const subscribers = await this.getSubscribers();
      
      console.log(`📧 Found ${subscribers.length} subscribers:`, subscribers.map(s => s.email));
      
      if (subscribers.length === 0) {
        return {
          success: true,
          message: 'No subscribers to notify'
        };
      }

      // Create email template
      const emailTemplate = this.createBlogNotificationTemplate(blogData);
      
      // Send transactional email using your verified email
      const response = await fetch(`${this.apiUrl}/smtp/email`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': this.apiKey
        },
        body: JSON.stringify({
          sender: {
            name: blogData.authorName,
            email: import.meta.env.VITE_SENDER_EMAIL || 'ajaygoud.kumbham@gmail.com'
          },
          to: subscribers.map(sub => ({ email: sub.email })),
          subject: `New Blog Post: ${blogData.title}`,
          htmlContent: emailTemplate.html,
          textContent: emailTemplate.text,
          tags: ['blog-notification']
        })
      });

      const data = await response.json();

      console.log('Brevo API Response:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });

      if (response.ok) {
        console.log(`✅ Successfully sent blog notification to ${subscribers.length} subscribers`);
        return {
          success: true,
          message: `Blog notification sent to ${subscribers.length} subscribers`
        };
      } else {
        console.error('❌ Brevo API Error:', data);
        return {
          success: false,
          message: 'Failed to send blog notification',
          error: data.message || `HTTP ${response.status}: ${response.statusText}`
        };
      }
    } catch (error) {
      console.error('Blog notification error:', error);
      return {
        success: false,
        message: 'Failed to send blog notification',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Create HTML and text email templates for blog notifications
  private createBlogNotificationTemplate(blogData: BlogNotificationData): { html: string; text: string } {
    const blogUrl = `${blogData.siteUrl}/blog/${blogData.slug}`;
    const unsubscribeUrl = `${blogData.siteUrl}/unsubscribe`; // You'll need to create this page
    
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Blog Post: ${blogData.title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; font-size: 16px; }
        .content { padding: 40px 30px; }
        .blog-card { border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 30px; }
        .blog-image { width: 100%; height: 200px; object-fit: cover; }
        .blog-content { padding: 25px; }
        .blog-title { font-size: 24px; font-weight: 700; color: #1a202c; margin: 0 0 15px 0; line-height: 1.3; }
        .blog-excerpt { color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0; }
        .blog-meta { display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 25px; font-size: 14px; color: #718096; }
        .blog-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 25px; }
        .tag { background-color: #edf2f7; color: #4a5568; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; font-size: 16px; text-align: center; transition: transform 0.2s; }
        .cta-button:hover { transform: translateY(-2px); }
        .footer { background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }
        .footer p { margin: 0 0 10px 0; color: #718096; font-size: 14px; }
        .footer a { color: #667eea; text-decoration: none; }
        .social-links { margin: 20px 0; }
        .social-links a { display: inline-block; margin: 0 10px; color: #667eea; text-decoration: none; }
        @media (max-width: 600px) {
            .header, .content, .footer { padding: 20px; }
            .blog-content { padding: 20px; }
            .blog-title { font-size: 20px; }
            .blog-meta { flex-direction: column; gap: 5px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📝 New Blog Post!</h1>
            <p>Fresh content from ${blogData.authorName}</p>
        </div>
        
        <div class="content">
            <div class="blog-card">
                ${blogData.coverImage ? `<img src="${blogData.coverImage}" alt="${blogData.title}" class="blog-image">` : ''}
                <div class="blog-content">
                    <h2 class="blog-title">${blogData.title}</h2>
                    <div class="blog-meta">
                        <span>📅 ${blogData.publishedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <span>⏱️ ${blogData.readTime} min read</span>
                    </div>
                    ${blogData.tags.length > 0 ? `
                    <div class="blog-tags">
                        ${blogData.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    ` : ''}
                    <p class="blog-excerpt">${blogData.excerpt}</p>
                    <a href="${blogUrl}" class="cta-button">Read Full Article →</a>
                </div>
            </div>
            
            <p style="color: #718096; font-size: 14px; text-align: center; margin-top: 30px;">
                Thanks for being a subscriber! I hope you enjoy this new post.
            </p>
        </div>
        
        <div class="footer">
            <p>You're receiving this because you subscribed to ${blogData.authorName}'s newsletter.</p>
            <p><a href="${unsubscribeUrl}">Unsubscribe</a> | <a href="${blogData.siteUrl}">Visit Website</a></p>
            <p style="margin-top: 20px; font-size: 12px; color: #a0aec0;">
                © ${new Date().getFullYear()} ${blogData.authorName}. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>`;

    const text = `
New Blog Post: ${blogData.title}

${blogData.excerpt}

Published: ${blogData.publishedAt.toLocaleDateString()}
Reading time: ${blogData.readTime} minutes
${blogData.tags.length > 0 ? `Tags: ${blogData.tags.join(', ')}` : ''}

Read the full article: ${blogUrl}

---
You're receiving this because you subscribed to ${blogData.authorName}'s newsletter.
Unsubscribe: ${unsubscribeUrl}
Visit website: ${blogData.siteUrl}

© ${new Date().getFullYear()} ${blogData.authorName}. All rights reserved.
`;

    return { html, text };
  }

  // Check sender verification status
  async checkSenderStatus(): Promise<{ verified: boolean; senders: unknown[]; currentSender?: string }> {
    try {
      const currentSenderEmail = import.meta.env.VITE_SENDER_EMAIL || 'ajaygoud.kumbham@gmail.com';
      
      const response = await fetch(`${this.apiUrl}/senders`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'api-key': this.apiKey
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        const verifiedSenders = data.senders?.filter((sender: { active: boolean; email: string }) => 
          sender.active && sender.email === currentSenderEmail
        ) || [];
        
        return {
          verified: verifiedSenders.length > 0,
          senders: verifiedSenders,
          currentSender: currentSenderEmail
        };
      } else {
        console.error('Failed to check sender status:', data);
        return { verified: false, senders: [], currentSender: currentSenderEmail };
      }
    } catch (error) {
      console.error('Error checking sender status:', error);
      return { verified: false, senders: [], currentSender: import.meta.env.VITE_SENDER_EMAIL || 'ajaygoud.kumbham@gmail.com' };
    }
  }

  // Check if the service is properly configured
  isConfigured(): boolean {
    return !!(this.apiKey && this.listId);
  }
}

export const newsletterService = new NewsletterService();
export type { NewsletterSubscription, NewsletterResponse, BlogNotificationData };