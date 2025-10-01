// React
import React from 'react';

// Third-party
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, FileText, Settings, Users, LogOut, Home, Globe, Menu, X } from 'lucide-react';

// Local components
import Button from '../ui/Button';

// Hooks
import { useAuth } from '../../hooks/useAuth';
import { useAdminNavigation } from '../../hooks/useAdminNavigation';

// Types
import { NavigationItem } from '../../types';

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { getSecretParam } = useAdminNavigation();

  const navigation: NavigationItem[] = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3, path: '/admin/dashboard' },
    { id: 'posts', name: 'Posts', icon: FileText, path: '/admin/posts' },
    { id: 'notifications', name: 'Email Notifications', icon: Users, path: '/admin/notifications' },
    { id: 'about', name: 'About Content', icon: Users, path: '/admin/about' },
    { id: 'settings', name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      // Preserve secret parameter when redirecting to login
      const secret = getSecretParam();
      const loginPath = secret ? `/admin/login?secret=${secret}` : '/admin/login';
      navigate(loginPath);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile header with menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <h1 className="ml-3 text-lg font-semibold text-gray-900">Admin Panel</h1>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
          </div>

          <nav className="flex-1 p-4">
            {/* Admin Panel Navigation */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Admin Panel</h3>
              <ul className="space-y-2">
                {navigation.map((item) => {
                  const secret = getSecretParam();
                  const linkPath = secret ? `${item.path}?secret=${secret}` : item.path;
                  
                  return (
                    <li key={item.id}>
                      <Link
                        to={linkPath}
                        onClick={() => setSidebarOpen(false)}
                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                          isActiveRoute(item.path)
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Quick Navigation to Site Pages */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Navigation</h3>
              <ul className="space-y-1">
                <li>
                  <Link
                    to="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
                  >
                    <Home className="w-4 h-4 mr-3" />
                    View Home Page
                    <Globe className="w-3 h-3 ml-auto opacity-50" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/blog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
                  >
                    <FileText className="w-4 h-4 mr-3" />
                    View Posts Page
                    <Globe className="w-3 h-3 ml-auto opacity-50" />
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
                  >
                    <Users className="w-4 h-4 mr-3" />
                    View About Page
                    <Globe className="w-3 h-3 ml-auto opacity-50" />
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          <div className="p-4 border-t">
            <Button variant="ghost" onClick={handleLogout} icon={LogOut} className="w-full justify-start">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;