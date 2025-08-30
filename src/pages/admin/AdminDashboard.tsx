import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart3, FileText, Settings, Users, PlusCircle, LogOut, Eye, Edit, Trash2 } from 'lucide-react';
import { BlogPost } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { blogService } from '../../services/blogService';
import { settingsService } from '../../services/settingsService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { showSuccess, showError } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settings, setSettings] = useState({
    // API Keys
    hashnodeApiKey: '',
    hashnodePublicationId: '',
    devToApiKey: '',
    // About Content
    siteName: '',
    siteDescription: '',
    siteUrl: '',
    title: '',
    location: '',
    email: '',
    github: '',
    linkedin: '',
    twitter: '',
    skills: '',
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
        // API Keys
        hashnodeApiKey: data.hashnodeApiKey || '',
        hashnodePublicationId: data.hashnodePublicationId || '',
        devToApiKey: data.devToApiKey || '',
        // About Content
        siteName: data.siteName || '',
        siteDescription: data.siteDescription || '',
        siteUrl: data.siteUrl || '',
        title: data.author?.title || '',
        location: data.author?.location || '',
        email: data.author?.email || '',
        github: data.author?.github || '',
        linkedin: data.author?.linkedin || '',
        twitter: data.author?.twitter || '',
        skills: data.author?.skills?.join(', ') || '',
      });
    } catch (error) {
      console.error('Error loading settings:', error);
      showError('Failed to load settings', 'Please refresh the page and try again.');
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
        showSuccess('Post deleted', 'The post has been successfully deleted.');
      } catch (error) {
        console.error('Error deleting post:', error);
        showError('Failed to delete post', 'Please try again later.');
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
        showSuccess(
          `Post ${post.published ? 'unpublished' : 'published'}`,
          `"${post.title}" has been ${post.published ? 'unpublished' : 'published'}.`
        );
      }
    } catch (error) {
      console.error('Error updating post:', error);
      showError('Failed to update post', 'Please try again later.');
    }
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      // Prepare the settings object with proper structure
      const settingsToSave = {
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        siteUrl: settings.siteUrl,
        hashnodeApiKey: settings.hashnodeApiKey,
        hashnodePublicationId: settings.hashnodePublicationId,
        devToApiKey: settings.devToApiKey,
        author: {
          name: settings.siteName, // Use siteName as author name
          bio: settings.siteDescription,
          avatar: '/personal-logo.jpg', // Default avatar
          title: settings.title,
          location: settings.location,
          email: settings.email,
          github: settings.github,
          twitter: settings.twitter,
          linkedin: settings.linkedin,
          website: settings.siteUrl,
          skills: settings.skills ? settings.skills.split(',').map(s => s.trim()).filter(s => s) : [],
        }
      };
      
      await settingsService.updateSiteSettings(settingsToSave);
      showSuccess('Settings saved', 'Your settings have been successfully updated.');
    } catch (error) {
      console.error('Error saving settings:', error);
      showError('Failed to save settings', 'Please check your inputs and try again.');
    } finally {
      setSavingSettings(false);
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
    { id: 'about', name: 'About Content', icon: Users },
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

        {activeTab === 'about' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">About Content Management</h1>
            
            <div className="space-y-8">
              {/* Personal Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      value={settings.title}
                      onChange={(e) => setSettings(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Full Stack Developer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={settings.location}
                      onChange={(e) => setSettings(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City, Country"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio / About Description
                  </label>
                  <textarea
                    rows={4}
                    value={settings.siteDescription}
                    onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Write a brief description about yourself..."
                  />
                </div>
              </Card>

              {/* Social Links */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website/Portfolio
                    </label>
                    <input
                      type="url"
                      value={settings.siteUrl}
                      onChange={(e) => setSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GitHub
                    </label>
                    <input
                      type="url"
                      value={settings.github}
                      onChange={(e) => setSettings(prev => ({ ...prev, github: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://github.com/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={settings.linkedin}
                      onChange={(e) => setSettings(prev => ({ ...prev, linkedin: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter
                    </label>
                    <input
                      type="url"
                      value={settings.twitter}
                      onChange={(e) => setSettings(prev => ({ ...prev, twitter: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://twitter.com/username"
                    />
                  </div>
                </div>
              </Card>

              {/* Skills */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Technologies</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills (comma-separated)
                  </label>
                  <textarea
                    rows={3}
                    value={settings.skills}
                    onChange={(e) => setSettings(prev => ({ ...prev, skills: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="JavaScript, TypeScript, React, Node.js, Python, AWS, Docker..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Enter skills separated by commas. They will be displayed as individual tags.
                  </p>
                </div>
              </Card>

              {/* Career Highlights */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Career Highlights</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Manage your professional achievements and career milestones. Each highlight will be displayed as a card on your About page.
                </p>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-900">Projects Delivered</h4>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Full-Stack Development</p>
                    <div className="text-xs text-gray-500">
                      • E-commerce platforms for startups<br/>
                      • SaaS solutions for enterprises<br/>
                      • Mobile-responsive web apps<br/>
                      • API integrations & databases
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-900">Open Source</h4>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Community Impact</p>
                    <div className="text-xs text-gray-500">
                      • React library contributions<br/>
                      • GitHub community engagement<br/>
                      • Technical blog writing<br/>
                      • Developer mentoring
                    </div>
                  </div>
                  
                  <Button variant="outline" icon={PlusCircle}>
                    Add New Highlight
                  </Button>
                </div>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} disabled={savingSettings} size="lg">
                  {savingSettings ? 'Saving...' : 'Save About Content'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
            
            <div className="max-w-2xl">
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
                  <Button onClick={handleSaveSettings} disabled={savingSettings}>
                    {savingSettings ? 'Saving...' : 'Save API Keys'}
                  </Button>
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