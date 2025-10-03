import React from 'react';
import { useState, useEffect } from 'react';
import { Mail, Github, X, Linkedin, MapPin, Code2, Award, Users, Globe, Briefcase, Trophy, Rocket, Target, Zap } from 'lucide-react';
import { settingsService } from '../services/settingsService';
import { SiteSettings } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';


const About: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsService.getSiteSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
      // If settings fail to load, set to null to show empty state
      setSettings(null);
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

  // Show empty state when no settings are available or author name is missing
  if (!settings || !settings.author?.name) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Content Available</h2>
          <p className="text-gray-600 mb-4">About page content has not been configured yet.</p>
          <p className="text-sm text-gray-500">Please configure your author information in the admin panel.</p>
        </div>
      </div>
    );
  }

  const { author } = settings;

  // Get skills from settings
  const skills = settings.author?.skills || [];

  // Stats should come from settings or be empty
  const stats = settings.author?.stats || [];



  // Get career highlights from settings
  const highlights = settings.author?.careerHighlights || [];

  // Icon component that properly handles lucide-react icons
  const DynamicIcon: React.FC<{ iconName: string; className?: string }> = ({ iconName, className }) => {
    switch (iconName) {
      case 'Rocket':
        return <Rocket className={className} />;
      case 'Trophy':
        return <Trophy className={className} />;
      case 'Target':
        return <Target className={className} />;
      case 'Briefcase':
        return <Briefcase className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Users':
        return <Users className={className} />;
      case 'Code2':
        return <Code2 className={className} />;
      case 'Award':
        return <Award className={className} />;
      default:
        return <Award className={className} />;
    }
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{author.name}</span>
              </h1>
              <h2 className="text-2xl md:text-3xl text-blue-200 mb-6">{author.title}</h2>
              <div className="flex items-center text-blue-200 mb-6">
                <MapPin className="w-5 h-5 mr-2" />
                {author.location}
              </div>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                {settings.siteDescription || 'Welcome to my professional portfolio and blog.'}
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  disabled={!author.website || !author.website.trim()}
                >
                  {author.website && author.website.trim() ? (
                    <a href={author.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                      <Globe className="w-5 h-5 mr-2" />
                      View Portfolio
                    </a>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Globe className="w-5 h-5 mr-2" />
                      No Portfolio Available
                    </span>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white text-white hover:!bg-white hover:!text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!author.resume || !author.resume.trim()}
                  onClick={() => author.resume && author.resume.trim() && window.open(author.resume, '_blank', 'noopener,noreferrer')}
                >
                  {author.resume && author.resume.trim() ? 'Download Resume' : 'No Resume Available'}
                </Button>
              </div>
            </div>

            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-80 h-80 rounded-full object-cover border-8 border-white/10"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-blue-600/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Always show with 4 slots */}
      <section className="pt-16 pb-12 -mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => {
              const stat = stats[index];

              if (stat) {
                const iconName = typeof stat.icon === 'string' ? stat.icon : 'Award';

                return (
                  <div
                    key={stat.id || index}
                    className="group relative bg-blue-50 rounded-2xl border border-blue-100 shadow-sm p-8 text-center hover:bg-blue-100 hover:border-blue-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden"
                  >
                    {/* Subtle gradient background on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
                    
                    {/* Accent bar at top */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon with enhanced styling */}
                      <div className="relative mx-auto mb-6 w-16 h-16">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-300" />
                        <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <DynamicIcon iconName={iconName} className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      {/* Value with enhanced typography */}
                      <div className="text-3xl font-extrabold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300 tabular-nums">
                        {stat.value}
                      </div>
                      
                      {/* Label */}
                      <div className="text-sm font-medium text-gray-600 group-hover:text-gray-700 transition-colors duration-300 uppercase tracking-wide">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                );
              } else {
                // Enhanced empty state
                return (
                  <div
                    key={`empty-${index}`}
                    className="relative bg-gray-100/80 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300/70 shadow-sm p-8 text-center hover:border-gray-400/80 hover:bg-gray-200/60 transition-all duration-300 overflow-hidden"
                  >
                    {/* Subtle pattern for empty state */}
                    <div className="absolute inset-0 opacity-[0.02]">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
                        backgroundSize: '20px 20px'
                      }} />
                    </div>

                    <div className="relative z-10">
                      {/* Empty icon */}
                      <div className="relative mx-auto mb-6 w-16 h-16">
                        <div className="w-full h-full bg-gray-200 rounded-2xl flex items-center justify-center">
                          <Award className="w-8 h-8 text-gray-400" />
                        </div>
                      </div>

                      {/* Empty value */}
                      <div className="text-3xl font-extrabold text-gray-300 mb-2 tabular-nums">
                        --
                      </div>
                      
                      {/* Empty label */}
                      <div className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                        No data
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </section>

      {/* About Details - Only show if bio or skills exist */}
      {(settings.author.bio || skills.length > 0) && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Story - Only show if bio exists */}
              {settings.author.bio && (
                <Card className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">My Story</h3>
                  <div className="space-y-4 text-gray-700">
                    {settings.author.bio.split('\n').filter(paragraph => paragraph.trim()).map((paragraph, index) => (
                      <p key={index}>{paragraph.trim()}</p>
                    ))}
                  </div>
                </Card>
              )}

              {/* Skills - Only show if skills exist */}
              {skills.length > 0 && (
                <Card className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Skills & Technologies</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {skills.map((skill) => (
                      <div
                        key={skill}
                        className="bg-blue-50 text-blue-800 px-4 py-2 rounded-lg text-center font-medium"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Career Highlights - Only show if highlights exist */}
      {highlights.length > 0 && (
        <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Highlights</span>
              </h3>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Key achievements and milestones that define my professional journey and showcase the impact I've made
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {highlights.sort((a, b) => a.order - b.order).map((highlight, index) => {
                // Define distinct gradient backgrounds for each card
                const gradients = [
                  'from-blue-500 to-blue-600',
                  'from-emerald-500 to-green-600',
                  'from-orange-500 to-red-500',
                  'from-violet-500 to-purple-600',
                  'from-cyan-500 to-teal-600',
                  'from-pink-500 to-rose-500'
                ];

                const textColors = [
                  'text-blue-100',
                  'text-emerald-100',
                  'text-orange-100',
                  'text-violet-100',
                  'text-cyan-100',
                  'text-pink-100'
                ];

                const lightTextColors = [
                  'text-blue-200',
                  'text-emerald-200',
                  'text-orange-200',
                  'text-violet-200',
                  'text-cyan-200',
                  'text-pink-200'
                ];

                const currentGradient = gradients[index % gradients.length];
                const currentTextColor = textColors[index % textColors.length];
                const currentLightColor = lightTextColors[index % lightTextColors.length];

                return (
                  <div
                    key={highlight.id}
                    className={`group relative overflow-hidden bg-gradient-to-br ${currentGradient} text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-700 ease-out cursor-pointer hover:scale-[1.02]`}
                  >
                    <div className="relative z-10">
                      {/* Header with logo and subtitle */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center space-x-4">
                          {/* Dynamic Icon */}
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                            <DynamicIcon iconName={highlight.icon || 'Code2'} className="w-7 h-7 text-white drop-shadow-sm" />
                          </div>
                          <span className="text-sm font-semibold text-white/90 uppercase tracking-wide">
                            {highlight.subtitle}
                          </span>
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="text-2xl font-bold mb-4 text-white leading-tight group-hover:translate-x-2 transition-transform duration-500 ease-out">
                        {highlight.title}
                      </h4>

                      {/* Key Points - Show 3 points */}
                      <div className={`${currentTextColor} mb-6 space-y-3`}>
                        {highlight.points.slice(0, 3).map((point, pointIndex) => (
                          <div key={pointIndex} className="flex items-start opacity-90 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500 ease-out" style={{ transitionDelay: `${pointIndex * 150}ms` }}>
                            <div className="w-2 h-2 bg-white/60 rounded-full mt-2 mr-3 flex-shrink-0 group-hover:bg-white group-hover:scale-125 transition-all duration-400"></div>
                            <span className="leading-relaxed font-medium text-sm">{point}</span>
                          </div>
                        ))}
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-3 gap-4 mb-5">
                        {highlight.metrics.map((metric, metricIndex) => (
                          <div key={metricIndex} className="text-center bg-white/20 backdrop-blur-sm rounded-lg p-3 group-hover:bg-white/30 group-hover:scale-105 transition-all duration-500 ease-out" style={{ transitionDelay: `${metricIndex * 100}ms` }}>
                            <div className="text-xl font-bold text-white group-hover:scale-110 transition-transform duration-400">{metric.value}</div>
                            <div className="text-xs text-white/80 font-medium mt-1">
                              {metric.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Period */}
                      <div className="pt-4 border-t border-white/20">
                        <div className={`${currentLightColor} text-sm font-medium group-hover:text-white transition-colors duration-400`}>
                          <span>{highlight.period}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-20">
              <div className="inline-flex items-center gap-4 bg-white/90 backdrop-blur-sm border border-gray-200/50 px-10 py-5 rounded-2xl text-gray-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:rotate-3 transition-transform duration-300">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg">Ready to create something amazing together?</span>
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-6">Let's Connect</h3>
          <p className="text-xl text-blue-100 mb-10">
            I'm always interested in new opportunities and interesting projects.
          </p>

          <div className="flex justify-center gap-6 mb-10">
            {/* GitHub */}
            {author.github && author.github.trim() && (
              <a
                href={author.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
            )}

            {/* X (formerly Twitter) */}
            {author.twitter && author.twitter.trim() && (
              <a
                href={author.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6" />
              </a>
            )}

            {/* LinkedIn */}
            {author.linkedin && author.linkedin.trim() && (
              <a
                href={author.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            )}

            {/* Email - Always show if available */}
            {author.email && author.email.trim() && (
              <a
                href={`mailto:${author.email}`}
                className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Mail className="w-6 h-6" />
              </a>
            )}
          </div>

          <Button
            variant="outline"
            size="lg"
            className="border-white text-white hover:!bg-white hover:!text-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!author.email || !author.email.trim()}
          >
            {author.email && author.email.trim() ? (
              <a href={`mailto:${author.email}`} className="block w-full h-full">
                Send me an email
              </a>
            ) : (
              <span className="block w-full h-full">
                No email available
              </span>
            )}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;