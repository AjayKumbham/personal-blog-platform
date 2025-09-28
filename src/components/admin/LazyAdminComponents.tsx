import { lazy } from 'react';

// Lazy load all admin components to reduce initial bundle size
export const AdminLogin = lazy(() => import('../../pages/admin/AdminLogin'));
export const AdminLayout = lazy(() => import('./AdminLayout'));
export const AdminDashboard = lazy(() => import('../../pages/admin/AdminDashboard'));
export const AdminPosts = lazy(() => import('../../pages/admin/AdminPosts'));
export const AdminNotifications = lazy(() => import('../../pages/admin/AdminNotifications'));
export const AdminAbout = lazy(() => import('../../pages/admin/AdminAbout'));
export const AdminSettings = lazy(() => import('../../pages/admin/AdminSettings'));
export const NewPost = lazy(() => import('../../pages/admin/NewPost'));
export const EditPost = lazy(() => import('../../pages/admin/EditPost'));