import React from 'react';
import { useState, useEffect } from 'react';
import { Mail, Github, Twitter, Linkedin, MapPin, Code2, Award, Users, Coffee, Globe, Briefcase, Trophy, Rocket, Star, Target, Zap } from 'lucide-react';
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

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Settings not found</h1>
          <p className="text-gray-600">Unable to load site settings.</p>
        </div>
      </div>
    );
  }

  const { author } = settings;

  const skills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Next.js', 'Vue.js',
    'Python', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'GraphQL'
  ];

  const stats = [
    { icon: Code2, label: 'Years of Experience', value: '5+' },
    { icon: Award, label: 'Projects Completed', value: '50+' },
    { icon: Users, label: 'Clients Worked With', value: '25+' },
    { icon: Coffee, label: 'Cups of Coffee', value: '∞' }
  ];

  const highlights = [
    {
      id: 1,
      icon: Rocket,
      title: 'Projects Delivered',
      subtitle: 'Full-Stack Development',
      points: [
        'E-commerce platforms for startups',
        'SaaS solutions for enterprises',
        'Mobile-responsive web apps',
        'API integrations & databases'
      ],
      metrics: [
        { label: 'Projects', value: '50+' },
        { label: 'Success Rate', value: '98%' },
        { label: 'On-Time', value: '95%' }
      ],
      period: '2020 - Present',
      gradient: 'from-blue-500 to-blue-600',
      textColors: {
        light: 'text-blue-100',
        lighter: 'text-blue-200'
      }
    },
    {
      id: 2,
      icon: Trophy,
      title: 'Open Source',
      subtitle: 'Community Impact',
      points: [
        'React library contributions',
        'GitHub community engagement',
        'Technical blog writing',
        'Developer mentoring'
      ],
      metrics: [
        { label: 'Stars', value: '1K+' },
        { label: 'Commits', value: '500+' },
        { label: 'Repos', value: '25+' }
      ],
      period: '2022 - Present',
      gradient: 'from-purple-500 to-purple-600',
      textColors: {
        light: 'text-purple-100',
        lighter: 'text-purple-200'
      }
    },
    {
      id: 3,
      icon: Target,
      title: 'Performance',
      subtitle: 'Technical Excellence',
      points: [
        'Code optimization techniques',
        'Lazy loading implementation',
        'Bundle size reduction',
        'Modern build tools'
      ],
      metrics: [
        { label: 'Speed', value: '+60%' },
        { label: 'Load Time', value: '-40%' },
        { label: 'Bundle', value: '-35%' }
      ],
      period: 'Ongoing',
      gradient: 'from-green-500 to-green-600',
      textColors: {
        light: 'text-green-100',
        lighter: 'text-green-200'
      }
    },
    {
      id: 4,
      icon: Briefcase,
      title: 'Leadership',
      subtitle: 'Team Management',
      points: [
        'Cross-functional team lead',
        'Agile methodology implementation',
        'Junior developer mentoring',
        'Project planning & execution'
      ],
      metrics: [
        { label: 'Team Size', value: '5-8' },
        { label: 'Projects', value: '15+' },
        { label: 'Mentored', value: '20+' }
      ],
      period: '2023 - Present',
      gradient: 'from-orange-500 to-red-500',
      textColors: {
        light: 'text-orange-100',
        lighter: 'text-orange-200'
      }
    },
    {
      id: 5,
      icon: Zap,
      title: 'Innovation',
      subtitle: 'Modern Solutions',
      points: [
        'Modern framework adoption',
        'Development workflow optimization',
        'Code quality improvements',
        'Best practices implementation'
      ],
      metrics: [
        { label: 'Time Saved', value: '40%' },
        { label: 'Quality', value: '+85%' },
        { label: 'Bugs', value: '-50%' }
      ],
      period: 'Continuous',
      gradient: 'from-indigo-500 to-indigo-600',
      textColors: {
        light: 'text-indigo-100',
        lighter: 'text-indigo-200'
      }
    },
    {
      id: 6,
      icon: Users,
      title: 'Client Relations',
      subtitle: 'Satisfaction & Growth',
      points: [
        'High-quality solution delivery',
        'On-time project completion',
        'Budget-conscious development',
        'Long-term partnerships'
      ],
      metrics: [
        { label: 'Satisfaction', value: '98%' },
        { label: 'Retention', value: '85%' },
        { label: 'Referrals', value: '70%' }
      ],
      period: 'Proven Record',
      gradient: 'from-pink-500 to-rose-500',
      textColors: {
        light: 'text-pink-100',
        lighter: 'text-pink-200'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-20">
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
                {author.bio}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg">
                  <a href={author.website} target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    View Portfolio
                  </a>
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:!bg-white hover:!text-slate-900">
                  <a href="#" className="flex items-center">
                    Download Resume
                  </a>
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

      {/* Stats Section */}
      <section className="py-16 -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Details */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Story */}
            <Card className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">My Story</h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  I started my journey in web development over 5 years ago, driven by a passion for creating
                  digital experiences that make a difference. What began as curiosity about how websites work
                  has evolved into a career dedicated to building scalable, user-centric applications.
                </p>
                <p>
                  Throughout my career, I've had the privilege of working with startups and established companies,
                  helping them transform ideas into robust digital solutions. I specialize in modern JavaScript
                  frameworks and have a deep appreciation for clean, maintainable code.
                </p>
                <p>
                  When I'm not coding, you can find me contributing to open source projects, writing technical
                  articles, or exploring the latest web technologies. I believe in continuous learning and
                  sharing knowledge with the developer community.
                </p>
              </div>
            </Card>

            {/* Skills */}
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
          </div>
        </div>
      </section>

      {/* Career Highlights */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full -translate-x-48 -translate-y-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-200/20 to-pink-200/20 rounded-full translate-x-48 translate-y-48"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Highlights</span>
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Key achievements and milestones that define my professional journey and showcase the impact I've made
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {highlights.map((highlight) => {
              const IconComponent = highlight.icon;
              return (
                <div
                  key={highlight.id}
                  className={`group relative overflow-hidden bg-gradient-to-br ${highlight.gradient} text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:rotate-1 cursor-pointer`}
                >
                  {/* Background decorations */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-125 transition-transform duration-500"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10 group-hover:scale-150 transition-transform duration-700"></div>

                  <div className="relative z-10">
                    {/* Header with icon and title */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                        <IconComponent className="w-7 h-7 text-white drop-shadow-sm" />
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-white/90 uppercase tracking-wider bg-white/10 px-2 py-1 rounded-full">
                          {highlight.subtitle}
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="text-xl font-bold mb-3 leading-tight group-hover:text-white transition-colors duration-300">
                      {highlight.title}
                    </h4>

                    {/* Key Points */}
                    <div className={`${highlight.textColors.light} mb-4 text-sm space-y-2`}>
                      {highlight.points.slice(0, 2).map((point, index) => (
                        <div key={index} className="flex items-start group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: `${index * 50}ms` }}>
                          <div className="w-1.5 h-1.5 bg-white/70 rounded-full mt-2 mr-3 flex-shrink-0 group-hover:bg-white transition-colors duration-300"></div>
                          <span className="leading-relaxed font-medium">{point}</span>
                        </div>
                      ))}
                      {highlight.points.length > 2 && (
                        <div className={`text-xs ${highlight.textColors.lighter} font-semibold bg-white/10 px-2 py-1 rounded-full inline-block`}>
                          +{highlight.points.length - 2} more achievements
                        </div>
                      )}
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {highlight.metrics.map((metric, index) => (
                        <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-2 group-hover:bg-white/20 transition-all duration-300" style={{ transitionDelay: `${index * 100}ms` }}>
                          <div className="text-lg font-bold text-white drop-shadow-sm">{metric.value}</div>
                          <div className={`text-xs ${highlight.textColors.lighter} font-semibold`}>
                            {metric.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Period and Status */}
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center ${highlight.textColors.lighter} text-sm font-medium`}>
                        <Star className="w-3 h-3 mr-1 group-hover:text-yellow-300 transition-colors duration-300" />
                        <span>{highlight.period}</span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white/40 rounded-full group-hover:bg-white/80 transition-colors duration-300"></div>
                        <div className="w-2 h-2 bg-white/20 rounded-full group-hover:bg-white/60 transition-colors duration-300" style={{ transitionDelay: '100ms' }}></div>
                        <div className="w-2 h-2 bg-white/10 rounded-full group-hover:bg-white/40 transition-colors duration-300" style={{ transitionDelay: '200ms' }}></div>
                      </div>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm px-8 py-4 rounded-full text-gray-700 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg">Ready to create something amazing together?</span>
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-6">Let's Connect</h3>
          <p className="text-xl text-blue-100 mb-8">
            I'm always interested in new opportunities and interesting projects.
          </p>

          <div className="flex justify-center gap-6 mb-8">
            <a
              href={author.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href={author.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href={author.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href={`mailto:${author.email}`}
              className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>

          <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
            <a href={`mailto:${author.email}`}>
              Send me an email
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;