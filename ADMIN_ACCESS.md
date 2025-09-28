# Admin Panel Access Guide

## Overview

The admin panel is protected by a secret query parameter to prevent unauthorized access. This adds an extra layer of security beyond the standard authentication.

## Configuration

### Environment Variables

Add the following to your `.env` file:

```env
VITE_ADMIN_SECRET=your_secure_admin_secret_here
```

**Important:** Choose a strong, unique secret that's difficult to guess.

## Accessing the Admin Panel

### Direct URL Access

Access the admin panel by adding the secret parameter to any admin URL:

```
https://yourdomain.com/admin/login?secret=your_secure_admin_secret_here
https://yourdomain.com/admin/dashboard?secret=your_secure_admin_secret_here
```



## Security Features

### 1. Secret Parameter Protection
- All admin routes require the correct secret parameter
- Invalid or missing secret redirects to the home page
- Secret is preserved during navigation within admin panel

### 2. Lazy Loading Optimization
- Admin components are lazy-loaded (separate ~98KB chunk)
- Public users never download admin code
- Faster initial page load for regular visitors

### 3. Authentication Flow
- Secret parameter is preserved during login redirects
- Logout maintains secret for easy re-access
- Session management works normally after secret validation

## Admin Routes

All these routes require the secret parameter:

- `/admin/login?secret=YOUR_SECRET` - Admin login page
- `/admin/dashboard?secret=YOUR_SECRET` - Main dashboard
- `/admin/posts?secret=YOUR_SECRET` - Blog post management
- `/admin/notifications?secret=YOUR_SECRET` - Email notifications
- `/admin/about?secret=YOUR_SECRET` - About page content
- `/admin/settings?secret=YOUR_SECRET` - Site settings
- `/admin/posts/new?secret=YOUR_SECRET` - Create new post
- `/admin/posts/edit/:id?secret=YOUR_SECRET` - Edit existing post

## Production Security

- Admin URLs must be manually constructed with the secret parameter
- No development aids or helper widgets in production
- Enhanced security through obscurity and secret parameter protection

## Best Practices

1. **Keep the secret private** - Only share with authorized administrators
2. **Use a strong secret** - Minimum 20 characters, mix of letters, numbers, symbols
3. **Rotate secrets periodically** - Update the secret regularly for security
4. **Bookmark admin URLs** - Save the complete URL with secret for easy access
5. **Use HTTPS** - Always access admin panel over secure connections

## Troubleshooting

### "Access Denied" or Redirect to Home
- Check that the secret parameter is included in the URL
- Verify the secret matches your `.env` configuration
- Ensure the secret is URL-encoded if it contains special characters

### Admin Components Not Loading
- Check browser console for JavaScript errors
- Verify all admin components are properly lazy-loaded
- Clear browser cache and try again

### Navigation Issues
- The secret parameter should be automatically preserved during admin navigation
- If lost, manually add it back to the URL
- Check that the `useAdminNavigation` hook is working correctly

## Example Usage

```javascript
// Get admin URLs programmatically
import { getAdminUrl, getAdminAccessInfo } from './src/utils/adminAccess';

// Generate admin URL
const dashboardUrl = getAdminUrl('/admin/dashboard');

// Get access information
const accessInfo = getAdminAccessInfo();
console.log(accessInfo.loginUrl);
```

## Security Considerations

- The secret parameter provides security through obscurity
- It's not a replacement for proper authentication
- Consider additional security measures for high-security environments
- Monitor access logs for unauthorized attempts
- Use environment-specific secrets (different for dev/staging/prod)