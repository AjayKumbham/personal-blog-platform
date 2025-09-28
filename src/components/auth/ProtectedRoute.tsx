import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    // Preserve the secret query parameter when redirecting to login
    const searchParams = new URLSearchParams(location.search);
    const loginPath = searchParams.toString() 
      ? `/admin/login?${searchParams.toString()}` 
      : '/admin/login';
    
    return <Navigate to={loginPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;