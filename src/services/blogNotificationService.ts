import { BlogPost } from '../types';
import { newsletterService, BlogNotificationData } from './newsletterService';
import { settingsService } from './settingsService';

interface NotificationResult {
  success: boolean;
  message: string;
  subscriberCount?: number;
  error?: string;
}

class BlogNotificationService {
  /**
   * Send notification email to all subscribers when a blog post is published
   */
  async notifySubscribersOfNewPost(post: BlogPost): Promise<NotificationResult> {
    try {
      // Check if newsletter service is configured
      if (!newsletterService.isConfigured()) {
        return {
          success: false,
          message: 'Newsletter service is not configured',
          error: 'Missing Brevo API key or list ID'
        };
      }

      // Get site settings for author info and site URL
      const settings = await settingsService.getSiteSettings();
      
      // Prepare blog notification data
      const blogData: BlogNotificationData = {
        title: post.title,
        excerpt: post.excerpt,
        slug: post.slug,
        tags: post.tags,
        readTime: post.readTime,
        publishedAt: post.publishedAt,
        coverImage: post.coverImage,
        authorName: settings.author.name || 'Blog Author',
        siteUrl: settings.siteUrl || window.location.origin
      };

      // Send notification to all subscribers
      const result = await newsletterService.sendBlogNotification(blogData);
      
      if (result.success) {
        // Log successful notification
        console.log(`Blog notification sent successfully: ${result.message}`);
        
        return {
          success: true,
          message: result.message,
          subscriberCount: this.extractSubscriberCount(result.message)
        };
      } else {
        console.error('Failed to send blog notification:', result.error);
        return {
          success: false,
          message: result.message,
          error: result.error
        };
      }
    } catch (error) {
      console.error('Blog notification service error:', error);
      return {
        success: false,
        message: 'Failed to send blog notification',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send a test notification to verify the system is working
   */
  async sendTestNotification(): Promise<NotificationResult> {
    const testPost: BlogPost = {
      id: 'test-' + Date.now(),
      title: 'Test Blog Notification',
      slug: 'test-blog-notification',
      excerpt: 'This is a test notification to verify that the blog notification system is working correctly. You should receive this email if you are subscribed to the newsletter.',
      content: 'This is test content for the notification system.',
      tags: ['test', 'notification'],
      publishedAt: new Date(),
      readTime: 2,
      featured: false,
      published: true,
      coverImage: undefined
    };

    return this.notifySubscribersOfNewPost(testPost);
  }

  /**
   * Get subscriber count from Brevo
   */
  async getSubscriberCount(): Promise<number> {
    try {
      if (!newsletterService.isConfigured()) {
        return 0;
      }

      const subscribers = await newsletterService.getSubscribers();
      return subscribers.length;
    } catch (error) {
      console.error('Error getting subscriber count:', error);
      return 0;
    }
  }

  /**
   * Check if notification system is properly configured
   */
  async getSystemStatus(): Promise<{
    configured: boolean;
    subscriberCount: number;
    senderVerified?: boolean;
    lastError?: string;
  }> {
    try {
      const configured = newsletterService.isConfigured();
      const subscriberCount = configured ? await this.getSubscriberCount() : 0;
      
      // Check sender verification status
      let senderVerified = false;
      if (configured) {
        const senderStatus = await newsletterService.checkSenderStatus();
        senderVerified = senderStatus.verified;
        console.log('Brevo sender status:', senderStatus);
      }

      return {
        configured,
        subscriberCount,
        senderVerified
      };
    } catch (error) {
      return {
        configured: false,
        subscriberCount: 0,
        senderVerified: false,
        lastError: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Extract subscriber count from success message
   */
  private extractSubscriberCount(message: string): number {
    const match = message.match(/(\d+)\s+subscribers?/);
    return match ? parseInt(match[1], 10) : 0;
  }
}

// Export singleton instance
export const blogNotificationService = new BlogNotificationService();
export type { NotificationResult };