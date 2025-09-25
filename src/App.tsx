import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './hooks/useToast';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPosts from './pages/admin/AdminPosts';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminAbout from './pages/admin/AdminAbout';
import AdminSettings from './pages/admin/AdminSettings';
import NewPost from './pages/admin/NewPost';
import EditPost from './pages/admin/EditPost';
import Unsubscribe from './pages/Unsubscribe';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
          <Routes>
          {/* Admin routes without header/footer */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Redirect /admin to /admin/dashboard */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          
          {/* Admin dashboard routes with AdminLayout */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/posts" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminPosts />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/notifications" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminNotifications />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/about" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminAbout />
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminSettings />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          {/* Admin post management routes */}
          <Route path="/admin/posts/new" element={
            <ProtectedRoute>
              <NewPost />
            </ProtectedRoute>
          } />
          <Route path="/admin/posts/edit/:id" element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
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
                </Routes>
              </main>
              <Footer />
            </>
          } />
          </Routes>
          </div>
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;