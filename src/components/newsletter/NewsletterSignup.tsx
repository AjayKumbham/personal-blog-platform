import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';

interface NewsletterSignupProps {
  substackUrl?: string;
  className?: string;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  substackUrl,
  className = ''
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    try {
      setStatus('loading');
      const baseUrl = substackUrl || 'https://kumbhamajaygoud.substack.com';

      // Create a hidden form and submit it to Substack (this bypasses CORS)
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = `${baseUrl}/api/v1/free`;
      form.target = '_blank';
      form.style.display = 'none';

      // Add email field
      const emailField = document.createElement('input');
      emailField.type = 'email';
      emailField.name = 'email';
      emailField.value = email;
      form.appendChild(emailField);

      // Add referrer fields
      const firstUrlField = document.createElement('input');
      firstUrlField.type = 'hidden';
      firstUrlField.name = 'first_url';
      firstUrlField.value = window.location.href;
      form.appendChild(firstUrlField);

      const currentUrlField = document.createElement('input');
      currentUrlField.type = 'hidden';
      currentUrlField.name = 'current_url';
      currentUrlField.value = window.location.href;
      form.appendChild(currentUrlField);

      // Submit the form
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);

      // Show success message
      setStatus('success');
      setMessage('Subscription form submitted! Please check the new tab and your email.');
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
          <h3 className="text-xl font-semibold text-white mb-2">Thank you!</h3>
          <p className="text-blue-100 mb-4">{message || 'Please complete your subscription on Substack.'}</p>
          <Button
            onClick={() => setStatus('idle')}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            Subscribe Another Email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`newsletter-signup ${className}`}>
      <div className="max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-white mr-2" />
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
              <div className="flex items-center text-red-300 text-sm">
                <AlertCircle className="w-4 h-4 mr-2" />
                {message}
              </div>
            )}

            <Button
              type="submit"
              disabled={!email || status === 'loading'}
              className="w-full !bg-gradient-to-r !from-purple-500 !to-blue-500 !text-white hover:!from-purple-600 hover:!to-blue-600 font-semibold py-3 border-0 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              aria-label="Subscribe to newsletter"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;