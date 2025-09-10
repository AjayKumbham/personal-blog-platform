import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Lock, Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  const MAX_ATTEMPTS = 5;

  // Rate limiting for failed login attempts
  const handleRateLimit = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    if (newAttempts >= MAX_ATTEMPTS) {
      setIsBlocked(true);
      setError(`Too many failed attempts. Access blocked for 15 minutes.`);
      
      // Store block time in localStorage with expiry
      const blockUntil = Date.now() + (15 * 60 * 1000); // 15 minutes
      localStorage.setItem('admin_blocked_until', blockUntil.toString());
      
      setTimeout(() => {
        setIsBlocked(false);
        setAttempts(0);
        localStorage.removeItem('admin_blocked_until');
      }, 15 * 60 * 1000); // 15 minutes
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      setError('Access blocked. Please try again later.');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        handleRateLimit();
        setError(error.message || 'Login failed. Please check your credentials.');
      } else {
        // Clear any previous blocks on successful login
        localStorage.removeItem('admin_blocked_until');
        setAttempts(0);
        navigate('/admin');
      }
    } catch (err: any) {
      handleRateLimit();
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    // Check if user is already authenticated
    if (user) {
      navigate('/admin');
      return;
    }
    
    // Check if currently blocked
    const blockedUntil = localStorage.getItem('admin_blocked_until');
    if (blockedUntil && Date.now() < parseInt(blockedUntil)) {
      setIsBlocked(true);
      const remainingTime = Math.ceil((parseInt(blockedUntil) - Date.now()) / 60000);
      setError(`Access blocked. Try again in ${remainingTime} minutes.`);
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-7 h-7 text-gray-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600 text-sm">
            Sign in to access the admin dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || isBlocked}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading ? 'Signing in...' : isBlocked ? 'Access Blocked' : 'Sign In'}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
            <Shield className="w-3 h-3" />
            <span>Secure • Encrypted • Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;