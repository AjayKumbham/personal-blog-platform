import { Suspense } from 'react';
import { Analytics } from "@vercel/analytics/react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/ToastProvider';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SecretProtectedRoute from './components/auth/SecretProtectedRoute';
import AdminLoadingSpinner from './components/admin/AdminLoadingSpinner';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import About from './pages/About';
import Contact from './pages/Contact';
import Unsubscribe from './pages/Unsubscribe';
import NotFound from './pages/NotFound';

// Lazy load admin components to reduce initial bundle size
import {
  AdminLogin,
  AdminLayout,
  AdminDashboard,
  AdminPosts,
  AdminNotifications,
  AdminAbout,
  AdminSettings,
  NewPost,
  EditPost
} from './components/admin/LazyAdminComponents';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Routes>
              {/* Admin routes with secret protection and lazy loading */}
              <Route path="/admin/login" element={
                <SecretProtectedRoute>
                  <Suspense fallback={<AdminLoadingSpinner />}>
                    <AdminLogin />
                  </Suspense>
                </SecretProtectedRoute>
              } />

              {/* Redirect /admin to /admin/dashboard with secret preservation */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

              {/* Admin dashboard routes with secret protection, auth protection, and lazy loading */}
              <Route path="/admin/dashboard" element={
                <SecretProtectedRoute>
                  <ProtectedRoute>
                    <Suspense fallback={<AdminLoadingSpinner />}>
                      <AdminLayout>
                        <AdminDashboard />
                      </AdminLayout>
                    </Suspense>
                  </ProtectedRoute>
                </SecretProtectedRoute>
              } />
              <Route path="/admin/posts" element={
                <SecretProtectedRoute>
                  <ProtectedRoute>
                    <Suspense fallback={<AdminLoadingSpinner />}>
                      <AdminLayout>
                        <AdminPosts />
                      </AdminLayout>
                    </Suspense>
                  </ProtectedRoute>
                </SecretProtectedRoute>
              } />
              <Route path="/admin/notifications" element={
                <SecretProtectedRoute>
                  <ProtectedRoute>
                    <Suspense fallback={<AdminLoadingSpinner />}>
                      <AdminLayout>
                        <AdminNotifications />
                      </AdminLayout>
                    </Suspense>
                  </ProtectedRoute>
                </SecretProtectedRoute>
              } />
              <Route path="/admin/about" element={
                <SecretProtectedRoute>
                  <ProtectedRoute>
                    <Suspense fallback={<AdminLoadingSpinner />}>
                      <AdminLayout>
                        <AdminAbout />
                      </AdminLayout>
                    </Suspense>
                  </ProtectedRoute>
                </SecretProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <SecretProtectedRoute>
                  <ProtectedRoute>
                    <Suspense fallback={<AdminLoadingSpinner />}>
                      <AdminLayout>
                        <AdminSettings />
                      </AdminLayout>
                    </Suspense>
                  </ProtectedRoute>
                </SecretProtectedRoute>
              } />

              {/* Admin post management routes */}
              <Route path="/admin/posts/new" element={
                <SecretProtectedRoute>
                  <ProtectedRoute>
                    <Suspense fallback={<AdminLoadingSpinner />}>
                      <NewPost />
                    </Suspense>
                  </ProtectedRoute>
                </SecretProtectedRoute>
              } />
              <Route path="/admin/posts/edit/:id" element={
                <SecretProtectedRoute>
                  <ProtectedRoute>
                    <Suspense fallback={<AdminLoadingSpinner />}>
                      <EditPost />
                    </Suspense>
                  </ProtectedRoute>
                </SecretProtectedRoute>
              } />

              {/* Public routes with header/footer */}
              <Route path="/*" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:slug" element={<BlogPost />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/unsubscribe" element={<Unsubscribe />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              } />
            </Routes>
          </div>
        </Router>
      </ToastProvider>
      <Analytics />
    </ErrorBoundary>
  );
}

export default App;