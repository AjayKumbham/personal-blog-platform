import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, FileText, User, Mail } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Text */}
        <div className="mb-8">
          <div className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            404
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-xl text-blue-200 mb-6 leading-relaxed">
            The page you're looking for seems to have wandered off into the digital void. 
            Don't worry, it happens to the best of us!
          </p>
          <p className="text-blue-300 text-lg">
            Let's get you back on track with some helpful options below.
          </p>
        </div>

        {/* Navigation Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Link to="/">
            <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105">
              <Home className="w-8 h-8 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold mb-2">Go Home</h3>
              <p className="text-blue-200 text-sm">Return to the homepage</p>
            </div>
          </Link>

          <Link to="/blog">
            <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105">
              <FileText className="w-8 h-8 text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold mb-2">Read Blog</h3>
              <p className="text-blue-200 text-sm">Explore latest articles</p>
            </div>
          </Link>

          <Link to="/about">
            <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105">
              <User className="w-8 h-8 text-green-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold mb-2">About Me</h3>
              <p className="text-blue-200 text-sm">Learn more about me</p>
            </div>
          </Link>

          <Link to="/contact">
            <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105">
              <Mail className="w-8 h-8 text-yellow-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold mb-2">Contact</h3>
              <p className="text-blue-200 text-sm">Get in touch with me</p>
            </div>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105 transition-all duration-300"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>

          <Link to="/">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
            >
              <Home className="w-5 h-5 mr-2" />
              Take Me Home
            </Button>
          </Link>
        </div>

        {/* Fun Message */}
        <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
          <p className="text-blue-200 text-sm">
            💡 <strong>Pro tip:</strong> If you think this page should exist, feel free to{' '}
            <Link to="/contact" className="text-blue-400 hover:text-blue-300 underline">
              let me know
            </Link>
            {' '}and I'll look into it!
          </p>
        </div>

        {/* Floating elements for visual appeal */}
        <div className="absolute top-20 left-10 w-20 h-20 border border-blue-400/30 rounded-full animate-bounce opacity-20" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-40 right-20 w-16 h-16 border border-purple-400/30 rounded-lg rotate-45 animate-bounce opacity-20" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 border border-blue-300/30 rounded-full animate-bounce opacity-20" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        <div className="absolute bottom-20 right-40 w-14 h-14 border border-purple-300/30 rounded-lg rotate-12 animate-bounce opacity-20" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
      </div>
    </div>
  );
};

export default NotFound;