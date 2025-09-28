import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useAdminNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the current secret parameter
  const getSecretParam = useCallback(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('secret');
  }, [location.search]);

  // Navigate to admin route while preserving secret parameter
  const navigateToAdmin = useCallback((path: string) => {
    const secret = getSecretParam();
    const fullPath = secret ? `${path}?secret=${secret}` : path;
    navigate(fullPath);
  }, [navigate, getSecretParam]);

  // Check if current route has valid secret
  const hasValidSecret = useCallback(() => {
    const providedSecret = getSecretParam();
    const requiredSecret = import.meta.env.VITE_ADMIN_SECRET;
    return providedSecret === requiredSecret;
  }, [getSecretParam]);

  return {
    navigateToAdmin,
    hasValidSecret,
    getSecretParam
  };
};