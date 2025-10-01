import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Button from '../ui/Button';

interface NewsletterSignupProps {
  className?: string;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  className = ''
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Load Brevo form script
  useEffect(() => {
    // Add Brevo styles to head if not already present
    if (!document.querySelector('link[href*="sib-styles.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://sibforms.com/forms/end-form/build/sib-styles.css';
      document.head.appendChild(link);
    }

    // Add Brevo script if not already present
    if (!document.querySelector('script[src*="main.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://sibforms.com/forms/end-form/build/main.js';
      script.defer = true;
      document.body.appendChild(script);

      // Set global variables for Brevo
      (window as unknown as Record<string, unknown>).REQUIRED_CODE_ERROR_MESSAGE = 'Please choose a country code';
      (window as unknown as Record<string, unknown>).LOCALE = 'en';
      (window as unknown as Record<string, unknown>).EMAIL_INVALID_MESSAGE = 'The information provided is invalid. Please review the field format and try again.';
      (window as unknown as Record<string, unknown>).REQUIRED_ERROR_MESSAGE = 'This field cannot be left blank.';
      (window as unknown as Record<string, unknown>).GENERIC_INVALID_MESSAGE = 'The information provided is invalid. Please review the field format and try again.';
      (window as unknown as Record<string, unknown>).AUTOHIDE = false;
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      // Send manual confirmation email using SMTP API
      const confirmationToken = btoa(email.trim() + Date.now()).replace(/[^a-zA-Z0-9]/g, '');
      const confirmationUrl = `${window.location.origin}?confirm=${confirmationToken}&email=${encodeURIComponent(email.trim())}`;

      const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': import.meta.env.VITE_BREVO_API_KEY
        },
        body: JSON.stringify({
          sender: {
            name: 'Kumbham Ajay Goud',
            email: import.meta.env.VITE_SENDER_EMAIL || 'ajaygoud.kumbham@gmail.com'
          },
          to: [{ email: email.trim() }],
          subject: 'Confirm your newsletter subscription',
          htmlContent: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Confirm Newsletter Subscription</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center;">
                  <h1 style="margin: 0; font-size: 28px; font-weight: 700;">📧 Confirm Your Subscription</h1>
                  <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">You're almost there!</p>
                </div>
                
                <div style="padding: 40px 30px; text-align: center;">
                  <h2 style="color: #1a202c; margin-bottom: 20px;">Welcome to our newsletter!</h2>
                  <p style="color: #4a5568; font-size: 16px; margin-bottom: 30px;">
                    Thank you for subscribing to our newsletter. To complete your subscription and start receiving updates about web development, programming tutorials, and tech insights, please click the button below.
                  </p>
                  
                  <a href="${confirmationUrl}" 
                     style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 20px 0;">
                    Confirm Subscription
                  </a>
                  
                  <p style="color: #718096; font-size: 14px; margin-top: 30px;">
                    If you didn't subscribe to this newsletter, you can safely ignore this email.
                  </p>
                  
                  <p style="color: #718096; font-size: 12px; margin-top: 20px;">
                    Or copy and paste this link in your browser:<br>
                    <span style="word-break: break-all;">${confirmationUrl}</span>
                  </p>
                </div>
                
                <div style="background-color: #f7fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="margin: 0; color: #718096; font-size: 12px;">
                    © ${new Date().getFullYear()} Kumbham Ajay Goud. All rights reserved.
                  </p>
                </div>
              </div>
            </body>
            </html>
          `,
          textContent: `
Confirm Your Newsletter Subscription

Thank you for subscribing to our newsletter! To complete your subscription and start receiving updates, please visit:

${confirmationUrl}

If you didn't subscribe to this newsletter, you can safely ignore this email.

© ${new Date().getFullYear()} Kumbham Ajay Goud. All rights reserved.
          `
        })
      });

      console.log('Confirmation email response:', { status: emailResponse.status });

      if (emailResponse.ok) {
        setStatus('success');
        setMessage('Please check your email to confirm your subscription.');
        setEmail('');
      } else {
        const errorData = await emailResponse.json();
        console.error('Failed to send confirmation email:', errorData);
        setStatus('error');
        setMessage('Failed to send confirmation email. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setStatus('error');
      setMessage('Subscription failed. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className={`text-center ${className}`}>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 max-w-md mx-auto">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Almost there</h3>
          <p className="text-blue-100 mb-4">{message}</p>
          <div className="space-y-3">
            <Button
              onClick={() => setStatus('idle')}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 w-full"
            >
              Subscribe Another Email
            </Button>
            <p className="text-xs text-blue-200">
              Didn't receive an email? Check your spam folder or contact us for help.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`newsletter-signup ${className}`}>
      <div className="max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-center mb-4">
            <Mail className="w-5 h-5 text-white mr-2" />
            <h3 className="text-lg font-semibold text-white">Subscribe to Newsletter</h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                required
                aria-label="Email address for newsletter subscription"
                autoComplete="email"
              />
            </div>

            {status === 'error' && (
              <div className="flex items-center text-red-300 text-sm bg-red-900/20 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={!email.trim() || status === 'loading'}
              className="w-full !bg-gradient-to-r !from-purple-500 !to-blue-500 !text-white hover:!from-purple-600 hover:!to-blue-600 font-semibold py-3 border-0 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:!opacity-50 disabled:!transform-none"
              aria-label="Subscribe to newsletter"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Subscribing...
                </>
              ) : (
                'Subscribe'
              )}
            </Button>

            <p className="text-xs text-blue-200 text-center">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;