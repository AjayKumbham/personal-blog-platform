/**
 * Utility functions for admin access with secret parameter
 */

/**
 * Generate admin URL with secret parameter
 * @param path - Admin path (e.g., '/admin/dashboard')
 * @returns Full URL with secret parameter
 */
export const getAdminUrl = (path: string = '/admin/dashboard'): string => {
  const secret = import.meta.env.VITE_ADMIN_SECRET;
  const baseUrl = window.location.origin;
  
  if (!secret) {
    console.warn('Admin secret not configured');
    return `${baseUrl}${path}`;
  }
  
  const separator = path.includes('?') ? '&' : '?';
  return `${baseUrl}${path}${separator}secret=${secret}`;
};

/**
 * Check if current URL has valid admin secret
 * @returns boolean indicating if secret is valid
 */
export const hasValidAdminSecret = (): boolean => {
  const urlParams = new URLSearchParams(window.location.search);
  const providedSecret = urlParams.get('secret');
  const requiredSecret = import.meta.env.VITE_ADMIN_SECRET;
  
  return providedSecret === requiredSecret;
};

/**
 * Get the admin access URL for sharing (use with caution)
 * This should only be used for initial setup or by administrators
 */
export const getAdminAccessInfo = () => {
  const secret = import.meta.env.VITE_ADMIN_SECRET;
  
  if (!secret) {
    return {
      configured: false,
      message: 'Admin secret not configured in environment variables'
    };
  }
  
  return {
    configured: true,
    loginUrl: getAdminUrl('/admin/login'),
    dashboardUrl: getAdminUrl('/admin/dashboard'),
    message: 'Admin URLs generated with secret parameter'
  };
};