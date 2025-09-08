import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
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
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    // Show success message and open Substack
    setStatus('success');
    setEmail('');
    
    // Open Substack subscription page
    window.open(`${substackUrl}/subscribe`, '_blank');
  };

  if (status === 'success') {
    return (
      <div className={`text-center ${className}`}>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 max-w-md mx-auto">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Thank you!</h3>
          <p className="text-blue-100 mb-4">Your subscription has been processed.</p>
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
              disabled={!email}
              className="w-full bg-blue-600 text-white hover:bg-blue-700 font-semibold py-3 border-0 flex items-center justify-center"
            >
              Subscribe
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;