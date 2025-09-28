import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface SecretProtectedRouteProps {
  children: React.ReactNode;
}

const SecretProtectedRoute: React.FC<SecretProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const providedSecret = searchParams.get('secret');
  const requiredSecret = import.meta.env.VITE_ADMIN_SECRET;

  // Check if secret is provided and matches
  if (!providedSecret || providedSecret !== requiredSecret) {
    // Redirect to home page if secret is invalid or missing
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default SecretProtectedRoute;