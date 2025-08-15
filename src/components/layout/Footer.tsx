import React from 'react';
import { Github, Mail, BookOpen, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="w-6 h-6 text-blue-400 relative top-0.5" />
              <div className="relative">
                <span className="font-bold text-xl bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
                  Kumbham Ajay Goud
                </span>
              </div>
            </div>
            <p className="text-gray-300 mb-4">
              Sharing insights on modern web development, programming techniques, and industry trends.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/AjayKumbham" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://ajaykumbham-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="mailto:ajaygoud.kumbham@gmail.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
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
              © 2025 Kumbham Ajay Goud. Built with ❤️ and lots of ☕
            </p>
          </div>
      </div>
    </footer>
  );
};

export default Footer;