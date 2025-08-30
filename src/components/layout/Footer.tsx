import React, { useState, useEffect } from 'react';
import { Github, Mail, Globe } from 'lucide-react';
import { settingsService } from '../../services/settingsService';
import { SiteSettings } from '../../types';

const Footer: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsService.getSiteSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  // Fallback values if settings haven't loaded yet
  const author = settings?.author || {
    name: 'Loading...',
    bio: 'Loading...',
    github: '#',
    website: '#',
    email: 'loading@example.com'
  };

  return (
    <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/personal-logo.jpg"
                alt={author.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-blue-400 shadow-sm"
              />
              <div className="relative">
                <span className="font-bold text-xl bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
                  {author.name}
                </span>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              {author.bio}
            </p>
            <div className="flex space-x-4">
              {author.github && (
                <a href={author.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              )}
              {author.website && (
                <a href={author.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Globe className="w-5 h-5" />
                </a>
              )}
              {author.email && (
                <a href={`mailto:${author.email}`} className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
              <li><a href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-white transition-colors">About</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">React</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">TypeScript</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Web Development</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">JavaScript</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 {author.name}. Built with ❤️ and lots of ☕
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;