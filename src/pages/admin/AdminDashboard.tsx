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
    careerHighlights: [] as any[],
  });

  // Career Highlights Modal State
  const [showHighlightModal, setShowHighlightModal] = useState(false);
  const [editingHighlight, setEditingHighlight] = useState<any>(null);
  const [highlightForm, setHighlightForm] = useState({
    title: '',
    subtitle: '',
    points: ['', '', ''],
    metrics: [
      { label: '', value: '' },
      { label: '', value: '' },
      { label: '', value: '' }
    ],
    period: '',
    icon: 'Code2',
    order: 1
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
        // About Content with sample data
        siteName: data.siteName || 'Kumbham Ajay Goud',
        siteDescription: data.siteDescription || 'Passionate Full-Stack Developer specializing in React, TypeScript, and modern web technologies. I create scalable applications and contribute to open-source projects while mentoring the next generation of developers.',
        siteUrl: data.siteUrl || 'https://ajaykumbham-portfolio.vercel.app',
        title: data.author?.title || 'Senior Full-Stack Developer',
        location: data.author?.location || 'Hyderabad, India',
        email: data.author?.email || 'ajaygoud.kumbham@gmail.com',
        github: data.author?.github || 'https://github.com/AjayKumbham',
        linkedin: data.author?.linkedin || 'https://linkedin.com/in/ajaykumbham',
        twitter: data.author?.twitter || 'https://twitter.com/ajaykumbham',
        skills: data.author?.skills?.join(', ') || 'JavaScript, TypeScript, React, Next.js, Node.js, Express.js, MongoDB, PostgreSQL, AWS, Docker, Git, GraphQL, REST APIs, Tailwind CSS, Material-UI, Redux, Zustand',
        careerHighlights: data.author?.careerHighlights || [],
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
          careerHighlights: settings.careerHighlights || [],
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

  // Career Highlights CRUD Operations
  const openHighlightModal = (highlight?: any) => {
    if (highlight) {
      setEditingHighlight(highlight);
      setHighlightForm({
        title: highlight.title || '',
        subtitle: highlight.subtitle || '',
        points: highlight.points || ['', '', ''],
        metrics: highlight.metrics || [
          { label: '', value: '' },
          { label: '', value: '' },
          { label: '', value: '' }
        ],
        period: highlight.period || '',
        icon: highlight.icon || 'Code2',
        order: highlight.order || 1
      });
    } else {
      setEditingHighlight(null);
      setHighlightForm({
        title: '',
        subtitle: '',
        points: ['', '', ''],
        metrics: [
          { label: '', value: '' },
          { label: '', value: '' },
          { label: '', value: '' }
        ],
        period: '',
        icon: 'Code2',
        order: settings.careerHighlights.length + 1
      });
    }
    setShowHighlightModal(true);
  };

  const closeHighlightModal = () => {
    setShowHighlightModal(false);
    setEditingHighlight(null);
  };

  const saveHighlight = () => {
    const newHighlight = {
      id: editingHighlight?.id || Date.now().toString(),
      ...highlightForm,
      points: highlightForm.points.filter(p => p.trim()),
      metrics: highlightForm.metrics.filter(m => m.label.trim() && m.value.trim())
    };

    let updatedHighlights;
    if (editingHighlight) {
      updatedHighlights = settings.careerHighlights.map(h => 
        h.id === editingHighlight.id ? newHighlight : h
      );
    } else {
      updatedHighlights = [...settings.careerHighlights, newHighlight];
    }

    setSettings(prev => ({
      ...prev,
      careerHighlights: updatedHighlights
    }));

    closeHighlightModal();
    showSuccess(
      editingHighlight ? 'Highlight updated' : 'Highlight added',
      `Career highlight has been ${editingHighlight ? 'updated' : 'added'} successfully.`
    );
  };

  const deleteHighlight = (id: string) => {
    if (window.confirm('Are you sure you want to delete this career highlight?')) {
      const updatedHighlights = settings.careerHighlights.filter(h => h.id !== id);
      setSettings(prev => ({
        ...prev,
        careerHighlights: updatedHighlights
      }));
      showSuccess('Highlight deleted', 'Career highlight has been deleted successfully.');
    }
  };

  const updateHighlightForm = (field: string, value: any, index?: number) => {
    setHighlightForm(prev => {
      if (field === 'points' && index !== undefined) {
        const newPoints = [...prev.points];
        newPoints[index] = value;
        return { ...prev, points: newPoints };
      } else if (field === 'metrics' && index !== undefined) {
        const newMetrics = [...prev.metrics];
        newMetrics[index] = value;
        return { ...prev, metrics: newMetrics };
      } else {
        return { ...prev, [field]: value };
      }
    });
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
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Career Highlights</h3>
                  <Button onClick={() => openHighlightModal()} icon={PlusCircle}>
                    Add New Highlight
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Manage your professional achievements and career milestones. Each highlight will be displayed as a card on your About page.
                </p>
                <div className="space-y-4">
                  {settings.careerHighlights.length > 0 ? (
                    settings.careerHighlights
                      .sort((a: any, b: any) => a.order - b.order)
                      .map((highlight: any, index: number) => (
                      <div key={highlight.id || index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{highlight.title}</h4>
                            <p className="text-sm text-gray-600">{highlight.subtitle}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openHighlightModal(highlight)}
                              icon={Edit}
                            >
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 hover:text-red-700"
                              onClick={() => deleteHighlight(highlight.id)}
                              icon={Trash2}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mb-3">
                          {highlight.points?.slice(0, 3).map((point: string, i: number) => (
                            <div key={i} className="mb-1">• {point}</div>
                          ))}
                          {highlight.points?.length > 3 && (
                            <div className="text-gray-400">• +{highlight.points.length - 3} more points...</div>
                          )}
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <div className="flex gap-4">
                            <span>Icon: {highlight.icon}</span>
                            <span>Order: {highlight.order}</span>
                          </div>
                          <span>{highlight.period}</span>
                        </div>
                        {highlight.metrics?.length > 0 && (
                          <div className="mt-2 flex gap-2">
                            {highlight.metrics.slice(0, 3).map((metric: any, i: number) => (
                              <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {metric.label}: {metric.value}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p className="mb-4">No career highlights added yet.</p>
                      <p className="text-sm">Add your first highlight to showcase your achievements!</p>
                    </div>
                  )}
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

      {/* Career Highlight Modal */}
      {showHighlightModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingHighlight ? 'Edit Career Highlight' : 'Add New Career Highlight'}
                </h3>
                <button
                  onClick={closeHighlightModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={highlightForm.title}
                      onChange={(e) => updateHighlightForm('title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Full-Stack Projects"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtitle *
                    </label>
                    <input
                      type="text"
                      value={highlightForm.subtitle}
                      onChange={(e) => updateHighlightForm('subtitle', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Web Development"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Period *
                    </label>
                    <input
                      type="text"
                      value={highlightForm.period}
                      onChange={(e) => updateHighlightForm('period', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 2020 - Present"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    <select
                      value={highlightForm.icon}
                      onChange={(e) => updateHighlightForm('icon', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Code2">Code2</option>
                      <option value="Rocket">Rocket</option>
                      <option value="Trophy">Trophy</option>
                      <option value="Target">Target</option>
                      <option value="Briefcase">Briefcase</option>
                      <option value="Zap">Zap</option>
                      <option value="Users">Users</option>
                      <option value="Award">Award</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={highlightForm.order}
                    onChange={(e) => updateHighlightForm('order', parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Key Points */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Points (up to 4)
                  </label>
                  {highlightForm.points.map((point, index) => (
                    <div key={index} className="mb-2">
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => updateHighlightForm('points', e.target.value, index)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Key point ${index + 1}`}
                      />
                    </div>
                  ))}
                  {highlightForm.points.length < 4 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateHighlightForm('points', [...highlightForm.points, ''])}
                    >
                      Add Point
                    </Button>
                  )}
                </div>

                {/* Metrics */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Metrics (up to 3)
                  </label>
                  {highlightForm.metrics.map((metric, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2 mb-2">
                      <input
                        type="text"
                        value={metric.label}
                        onChange={(e) => updateHighlightForm('metrics', { ...metric, label: e.target.value }, index)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Label (e.g., Projects)"
                      />
                      <input
                        type="text"
                        value={metric.value}
                        onChange={(e) => updateHighlightForm('metrics', { ...metric, value: e.target.value }, index)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Value (e.g., 50+)"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <Button variant="outline" onClick={closeHighlightModal}>
                  Cancel
                </Button>
                <Button onClick={saveHighlight}>
                  {editingHighlight ? 'Update Highlight' : 'Add Highlight'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;