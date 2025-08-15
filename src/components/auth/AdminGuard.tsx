import React, { useState, useEffect } from 'react';
import { Code2, Lock } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);

  // Secret access key (in production, this should be more sophisticated)
  const ADMIN_ACCESS_KEY = 'DEVBLOG_ADMIN_2024';

  useEffect(() => {
    // Check if already authorized in this session
    const authorized = sessionStorage.getItem('admin_authorized');
    if (authorized === 'true') {
      setIsAuthorized(true);
    }

    // Check if blocked due to too many attempts
    const blockedUntil = localStorage.getItem('admin_blocked_until');
    if (blockedUntil && new Date().getTime() < parseInt(blockedUntil)) {
      setIsBlocked(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      setError('Access temporarily blocked. Please try again later.');
      return;
    }

    if (secretKey === ADMIN_ACCESS_KEY) {
      setIsAuthorized(true);
      sessionStorage.setItem('admin_authorized', 'true');
      setError('');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError(`Invalid access key. Attempt ${newAttempts}/3`);
      
      if (newAttempts >= 3) {
        // Block for 1 hour
        const blockUntil = new Date().getTime() + (60 * 60 * 1000);
        localStorage.setItem('admin_blocked_until', blockUntil.toString());
        setIsBlocked(true);
        setError('Too many failed attempts. Access blocked for 1 hour.');
      }
    }
    
    setSecretKey('');
  };

  if (isAuthorized) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Lock className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Restricted Access</h1>
          <p className="text-gray-600">This area is restricted to authorized personnel only</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {!isBlocked ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Key
              </label>
              <input
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter admin access key"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Verify Access
            </Button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-red-600 mb-4">Access temporarily blocked due to multiple failed attempts.</p>
            <p className="text-gray-600 text-sm">Please try again later.</p>
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">
            <strong>⚠️ Authorized Access Only</strong><br />
            Unauthorized access attempts are logged and monitored.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default AdminGuard;