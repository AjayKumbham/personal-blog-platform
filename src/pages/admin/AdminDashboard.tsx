import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart3, FileText, Settings, Users, PlusCircle, LogOut, Eye, Edit, Trash2 } from 'lucide-react';
import { BlogPost } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { blogService } from '../../services/blogService';
import { settingsService } from '../../services/settingsService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    siteName: '',
    siteDescription: '',
    siteUrl: '',
    hashnodeApiKey: '',
    hashnodePublicationId: '',
    devToApiKey: '',
  });

  useEffect(() => {
    loadPosts();
    loadSettings();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await blogService.getAllPosts();
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    try {
      const data = await settingsService.getSiteSettings();
      setSettings({
        siteName: data.siteName,
        siteDescription: data.siteDescription,
        siteUrl: data.siteUrl,
        hashnodeApiKey: data.hashnodeApiKey,
        hashnodePublicationId: data.hashnodePublicationId,
        devToApiKey: data.devToApiKey,
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await blogService.deletePost(id);
        setPosts(posts.filter(post => post.id !== id));
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting post');
      }
    }
  };

  const togglePublished = async (id: string) => {
    try {
      const post = posts.find(p => p.id === id);
      if (post) {
        await blogService.updatePost(id, { published: !post.published });
        setPosts(posts.map(p => 
          p.id === id ? { ...p, published: !p.published } : p
        ));
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post');
    }
  };

  const handleSaveSettings = async () => {
    try {
      await settingsService.updateSiteSettings(settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    }
  };

  const stats = [
    { icon: FileText, label: 'Total Posts', value: posts.length, color: 'blue' },
    { icon: Eye, label: 'Published', value: posts.filter(p => p.published).length, color: 'green' },
    { icon: Edit, label: 'Drafts', value: posts.filter(p => !p.published).length, color: 'orange' },
    { icon: Users, label: 'Featured', value: posts.filter(p => p.featured).length, color: 'purple' }
  ];

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'posts', name: 'Posts', icon: FileText },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
          </div>
          
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t">
            <Button variant="ghost" onClick={handleLogout} icon={LogOut} className="w-full justify-start">
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {activeTab === 'dashboard' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <Link to="/admin/posts/new">
                <Button icon={PlusCircle}>
                  New Post
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {stats.map((stat, index) => (
                    <Card key={index} className="p-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <stat.icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Recent Posts */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
                  <div className="space-y-4">
                    {posts.slice(0, 5).map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{post.title}</h4>
                          <p className="text-sm text-gray-600">
                            {post.published ? 'Published' : 'Draft'} • {post.readTime} min read
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}
          </div>
        )}

        {activeTab === 'posts' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
              <Link to="/admin/posts/new">
                <Button icon={PlusCircle}>
                New Post
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Published
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {posts.map((post) => (
                      <tr key={post.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{post.title}</div>
                            <div className="text-sm text-gray-500">{post.readTime} min read</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {post.publishedAt.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => togglePublished(post.id)}
                            >
                              {post.published ? 'Unpublish' : 'Publish'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                              icon={Edit}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              icon={Trash2}
                              onClick={() => handleDeletePost(post.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">API Keys</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hashnode API Key
                    </label>
                    <input
                      type="password"
                      value={settings.hashnodeApiKey}
                      onChange={(e) => setSettings(prev => ({ ...prev, hashnodeApiKey: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter Hashnode API key"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hashnode Publication ID
                    </label>
                    <input
                      type="text"
                      value={settings.hashnodePublicationId}
                      onChange={(e) => setSettings(prev => ({ ...prev, hashnodePublicationId: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter publication ID"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dev.to API Key
                    </label>
                    <input
                      type="password"
                      value={settings.devToApiKey}
                      onChange={(e) => setSettings(prev => ({ ...prev, devToApiKey: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter Dev.to API key"
                    />
                  </div>
                  <Button onClick={handleSaveSettings}>Save API Keys</Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Site Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Description
                    </label>
                    <textarea
                      rows={3}
                      value={settings.siteDescription}
                      onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site URL
                    </label>
                    <input
                      type="url"
                      value={settings.siteUrl}
                      onChange={(e) => setSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <Button onClick={handleSaveSettings}>Save Settings</Button>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;