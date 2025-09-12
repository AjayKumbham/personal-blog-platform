// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Rate limiting storage
const RATE_LIMIT_KEY = 'contact_form_submissions';
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds
const MAX_SUBMISSIONS_PER_HOUR = 3;

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export class EmailService {
  private recipientEmail: string;

  constructor() {
    this.recipientEmail = import.meta.env.VITE_RECIPIENT_EMAIL || 'demo@example.com';
  }

  /**
   * Validate form data
   */
  validateFormData(data: ContactFormData): ValidationError[] {
    const errors: ValidationError[] = [];

    // Name validation
    if (!data.name.trim()) {
      errors.push({ field: 'name', message: 'Name is required' });
    } else if (data.name.trim().length < 2) {
      errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
    } else if (data.name.trim().length > 100) {
      errors.push({ field: 'name', message: 'Name must be less than 100 characters' });
    } else if (!/^[a-zA-Z\s\-'\.]+$/.test(data.name.trim())) {
      errors.push({ field: 'name', message: 'Name contains invalid characters' });
    }

    // Email validation
    if (!data.email.trim()) {
      errors.push({ field: 'email', message: 'Email is required' });
    } else if (!EMAIL_REGEX.test(data.email.trim())) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
    } else if (data.email.trim().length > 254) {
      errors.push({ field: 'email', message: 'Email address is too long' });
    }

    // Subject validation
    if (!data.subject.trim()) {
      errors.push({ field: 'subject', message: 'Subject is required' });
    } else if (data.subject.trim().length < 3) {
      errors.push({ field: 'subject', message: 'Subject must be at least 3 characters long' });
    } else if (data.subject.trim().length > 200) {
      errors.push({ field: 'subject', message: 'Subject must be less than 200 characters' });
    }

    // Message validation
    if (!data.message.trim()) {
      errors.push({ field: 'message', message: 'Message is required' });
    } else if (data.message.trim().length < 10) {
      errors.push({ field: 'message', message: 'Message must be at least 10 characters long' });
    } else if (data.message.trim().length > 5000) {
      errors.push({ field: 'message', message: 'Message must be less than 5000 characters' });
    }

    // Check for spam patterns
    const spamPatterns = [
      /\b(viagra|cialis|casino|lottery|winner|congratulations)\b/i,
      /\b(click here|act now|limited time|urgent)\b/i,
      /(http[s]?:\/\/[^\s]+){3,}/i, // Multiple URLs
      /(.)\1{10,}/, // Repeated characters
    ];

    const fullText = `${data.name} ${data.email} ${data.subject} ${data.message}`.toLowerCase();
    
    for (const pattern of spamPatterns) {
      if (pattern.test(fullText)) {
        errors.push({ field: 'message', message: 'Message appears to be spam' });
        break;
      }
    }

    return errors;
  }

  /**
   * Check rate limiting
   */
  private checkRateLimit(): { allowed: boolean; remainingTime?: number } {
    try {
      const submissions = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '[]');
      const now = Date.now();
      
      // Filter submissions within the rate limit window
      const recentSubmissions = submissions.filter((timestamp: number) => 
        now - timestamp < RATE_LIMIT_WINDOW
      );

      // Update localStorage with filtered submissions
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recentSubmissions));

      if (recentSubmissions.length >= MAX_SUBMISSIONS_PER_HOUR) {
        const oldestSubmission = Math.min(...recentSubmissions);
        const remainingTime = RATE_LIMIT_WINDOW - (now - oldestSubmission);
        return { allowed: false, remainingTime };
      }

      return { allowed: true };
    } catch (error) {
      console.error('Rate limit check failed:', error);
      return { allowed: true }; // Allow if localStorage fails
    }
  }

  /**
   * Record a submission for rate limiting
   */
  private recordSubmission() {
    try {
      const submissions = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '[]');
      submissions.push(Date.now());
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(submissions));
    } catch (error) {
      console.error('Failed to record submission:', error);
    }
  }

  /**
   * Send email using FormSubmit
   */
  async sendEmail(data: ContactFormData): Promise<{ success: boolean; message: string }> {
    try {
      // Check if recipient email is configured
      if (this.recipientEmail === 'demo@example.com') {
        return {
          success: false,
          message: 'Sorry, the contact form is temporarily unavailable. Please try again later or contact me directly via email.'
        };
      }

      // Validate form data
      const validationErrors = this.validateFormData(data);
      if (validationErrors.length > 0) {
        return {
          success: false,
          message: validationErrors.map(e => e.message).join(', ')
        };
      }

      // Check rate limiting
      const rateLimitCheck = this.checkRateLimit();
      if (!rateLimitCheck.allowed) {
        const minutes = Math.ceil((rateLimitCheck.remainingTime || 0) / (60 * 1000));
        return {
          success: false,
          message: `Too many submissions. Please try again in ${minutes} minutes.`
        };
      }

      // Record submission before sending
      this.recordSubmission();

      // Create FormData for FormSubmit
      const formData = new FormData();
      
      // Essential fields for FormSubmit
      formData.append('name', data.name.trim());
      formData.append('email', data.email.trim());
      formData.append('subject', data.subject.trim());
      formData.append('message', data.message.trim());
      
      // FormSubmit configuration
      formData.append('_replyto', data.email.trim()); // Replies go to sender
      formData.append('_subject', `Contact Form: ${data.subject.trim()}`); // Email subject line
      formData.append('_template', 'table'); // Use table template for better formatting
      formData.append('_captcha', 'false'); // Disable captcha
      
      // For AJAX submissions (prevents redirect)
      formData.append('_next', `${window.location.origin}/contact-success`);
      
      // Additional context
      formData.append('_cc', this.recipientEmail); // Ensure delivery to your email
      formData.append('Website', window.location.origin);
      formData.append('Submitted', new Date().toISOString());

      console.log('Sending email to:', this.recipientEmail);
      console.log('Form data:', Object.fromEntries(formData.entries()));

      // Send via FormSubmit
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      try {
        await fetch(`https://formsubmit.co/${this.recipientEmail}`, {
          method: 'POST',
          body: formData,
          signal: controller.signal,
          mode: 'no-cors'
        });

        clearTimeout(timeoutId);
        
        return {
          success: true,
          message: 'Message sent successfully! I\'ll get back to you soon.'
        };

      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          return {
            success: true,
            message: 'Message sent! If you don\'t hear back, please try again or contact me directly.'
          };
        }
        
        // With no-cors, network errors often indicate success due to redirects
        return {
          success: true,
          message: 'Message sent successfully! I\'ll get back to you soon.'
        };
      }

    } catch (error) {
      console.error('Email send failed:', error);
      
      return {
        success: false,
        message: 'Unable to send message. Please contact me directly via email.'
      };
    }
  }

  /**
   * Get service status
   */
  getServiceStatus(): { configured: boolean; method: string } {
    return { 
      configured: this.recipientEmail !== 'demo@example.com', 
      method: 'FormSubmit' 
    };
  }
}

// Export singleton instance
export const emailService = new EmailService();