import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Lightbulb, TrendingUp } from 'lucide-react';
import { blogService } from '../services/blogService';
import { settingsService } from '../services/settingsService';
import { BlogPost, SiteSettings } from '../types';
import BlogCard from '../components/blog/BlogCard';
import Button from '../components/ui/Button';

const Home: React.FC = () => {
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [posts, siteSettings] = await Promise.all([
        blogService.getPublishedPosts(),
        settingsService.getSiteSettings(),
      ]);
      setRecentPosts(posts.slice(0, 6));
      setSettings(siteSettings);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Code, Create,
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                {' '}Inspire
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              {settings?.siteDescription || 'Welcome to my developer journey. Sharing insights on modern web development, programming techniques, and the latest industry trends.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-4">
                <Link to="/blog" className="flex items-center">
                  Read Latest Posts
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-slate-900">
                <Link to="/about">Learn About Me</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What You'll Find Here
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Deep dives into modern web development, practical tutorials, and insights from real-world projects.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code2 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Technical Deep Dives</h3>
              <p className="text-gray-600">
                Comprehensive tutorials and guides on React, TypeScript, and modern web technologies.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Best Practices</h3>
              <p className="text-gray-600">
                Learn industry best practices, coding patterns, and architectural decisions that scale.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Performance Tips</h3>
              <p className="text-gray-600">
                Optimize your applications with proven techniques for better user experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Recent Posts</h2>
            <Link
              to="/blog"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center transition-colors"
            >
              View All Posts
              <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          
          {/* Horizontal Scrolling Posts */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll space-x-6" style={{ width: 'max-content' }}>
              {recentPosts.length > 0 && [...recentPosts, ...recentPosts].map((post, index) => (
                <div key={`${post.id}-${index}`} className="flex-shrink-0 w-80 h-[28rem]">
                  <BlogCard post={post} />
                </div>
              ))}
              {recentPosts.length === 0 && (
                <div className="flex-shrink-0 w-80 h-[28rem]">
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <p className="text-gray-600">No posts available yet.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get notified when I publish new articles about web development and programming.
          </p>
          <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
            <Link to="/about">Get In Touch</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;