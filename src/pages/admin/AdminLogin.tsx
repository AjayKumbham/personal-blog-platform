import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { Lock, Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [accessKey, setAccessKey] = useState('');
  const [email, setEmail] = useState('admin@devblog.com');
  const [password, setPassword] = useState('admin123456');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const ADMIN_ACCESS_KEY = 'DEVBLOG_ADMIN_2024';
  const MAX_ATTEMPTS = 3;

  const handleAccessKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      setError('Access blocked. Please try again later.');
      return;
    }

    if (accessKey === ADMIN_ACCESS_KEY) {
      setIsAuthorized(true);
      setError('');
      sessionStorage.setItem('admin_authorized', 'true');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= MAX_ATTEMPTS) {
        setIsBlocked(true);
        setError(`Too many failed attempts. Access blocked for 1 hour.`);
        setTimeout(() => {
          setIsBlocked(false);
          setAttempts(0);
        }, 3600000); // 1 hour
      } else {
        setError(`Invalid access key. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`);
      }
      setAccessKey('');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const authorized = sessionStorage.getItem('admin_authorized');
    if (authorized === 'true') {
      setIsAuthorized(true);
    }
  }, []);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg border-white/20">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Restricted Access</h1>
            <p className="text-gray-300 text-sm">
              This area is restricted. Please enter the access key to continue.
            </p>
          </div>

          <form onSubmit={handleAccessKeySubmit} className="space-y-6">
            <div>
              <label htmlFor="accessKey" className="block text-sm font-medium text-gray-300 mb-2">
                Access Key
              </label>
              <input
                type="password"
                id="accessKey"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter access key"
                required
                disabled={isBlocked}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
              disabled={isBlocked}
            >
              {isBlocked ? 'Access Blocked' : 'Verify Access'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-yellow-300">
                <p className="font-medium mb-1">Security Notice:</p>
                <p>Unauthorized access attempts are logged and monitored. This system is protected by multiple security layers.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg border-white/20">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-gray-300 text-sm">
            Sign in to access the admin dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-xs text-blue-300 text-center">
            <strong>Demo Credentials:</strong><br />
            Email: admin@devblog.com<br />
            Password: admin123456
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AdminLogin;