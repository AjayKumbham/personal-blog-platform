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

  // Check if the service is properly configured
  isConfigured(): boolean {
    return !!(this.apiKey && this.listId);
  }
}

export const newsletterService = new NewsletterService();
export type { NewsletterSubscription, NewsletterResponse };