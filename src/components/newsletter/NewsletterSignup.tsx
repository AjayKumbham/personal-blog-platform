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

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      // Submit to Brevo form endpoint
      const formData = new FormData();
      formData.append('EMAIL', email);
      formData.append('email_address_check', '');
      formData.append('locale', 'en');

      await fetch('https://62abc80e.sibforms.com/serve/MUIFADUYWcA1EWsi-aIpRk1Sw_-bGpnLmFTKAJo8j0sMvtXEnerHZxASAv9N08xno9ynbAHw-i3V83WDAWlKN_Tgu_5zg7zjX9kwX-yc1I_4f1HroxhpDK-hFY1ZUr7klgegYAZcG_pjjtv_0KDhCL2J-gaC8eLX8iqCvc0ohi4l9qMV5MQLxG9Y1YS-_qp0hFRujt7PQ36uWhyJ', {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Brevo handles CORS, we use no-cors to avoid issues
      });

      // Since we're using no-cors, we can't read the response
      // But if we get here without error, assume success
      setStatus('success');
      setMessage('Please check your email to confirm your subscription.');
      setEmail('');

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