import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { newsletterService } from '../services/newsletterService';
import Button from '../components/ui/Button';

const Unsubscribe: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Get email from URL parameters if provided
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const handleUnsubscribe = async (e: React.FormEvent) => {
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
      const result = await newsletterService.unsubscribe(email);
      
      if (result.success) {
        setStatus('success');
        setMessage(result.message);
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    } catch (error) {
      console.error('Unsubscribe error:', error);
      setStatus('error');
      setMessage('An error occurred. Please try again or contact support.');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Successfully Unsubscribed
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {message}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center space-y-4">
              <p className="text-gray-700">
                You have been successfully removed from our newsletter. You will no longer receive email notifications about new blog posts.
              </p>
              
              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  Changed your mind? You can always subscribe again from our website.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/">
                    <Button variant="outline" className="w-full sm:w-auto">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Website
                    </Button>
                  </Link>
                  <Link to="/#newsletter">
                    <Button className="w-full sm:w-auto">
                      <Mail className="w-4 h-4 mr-2" />
                      Subscribe Again
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              If you continue to receive emails, please contact us for assistance.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Mail className="mx-auto h-16 w-16 text-gray-400" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Unsubscribe from Newsletter
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We're sorry to see you go. Enter your email address to unsubscribe from our newsletter.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleUnsubscribe} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                required
                disabled={status === 'loading'}
              />
            </div>

            {status === 'error' && (
              <div className="flex items-center text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <Button
              type="submit"
              disabled={!email.trim() || status === 'loading'}
              className="w-full"
            >
              {status === 'loading' ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Unsubscribing...
                </>
              ) : (
                'Unsubscribe'
              )}
            </Button>

            <div className="text-center">
              <Link 
                to="/" 
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Website
              </Link>
            </div>
          </form>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            You will stop receiving newsletter emails within 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unsubscribe;