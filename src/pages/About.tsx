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
<section className="py-20 bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100 relative overflow-hidden">
  {/* Modern background elements */}
  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
  <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-3xl"></div>
  <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-tl from-purple-400/10 to-transparent rounded-full blur-3xl"></div>

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
        return (
          <div
            key={highlight.id}
            className="group relative overflow-hidden bg-white border border-gray-200 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-700 ease-out cursor-pointer"
          >
            {/* Animated border effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-blue-500/20 group-hover:via-purple-500/20 group-hover:to-blue-500/20 transition-all duration-700 ease-out"></div>
            
            {/* Subtle hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50/0 to-gray-100/0 group-hover:from-gray-50/50 group-hover:to-gray-100/30 transition-all duration-700 ease-out rounded-xl"></div>

            <div className="relative z-10">
              {/* Header with subtitle and status indicator */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full group-hover:scale-125 transition-transform duration-500"></div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {highlight.subtitle}
                  </span>
                </div>
                <div className="flex space-x-1">
                  <div className="w-1 h-8 bg-gray-200 rounded-full group-hover:bg-gradient-to-b group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-500"></div>
                  <div className="w-1 h-6 bg-gray-200 rounded-full group-hover:bg-gradient-to-b group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-600" style={{ transitionDelay: '100ms' }}></div>
                  <div className="w-1 h-4 bg-gray-200 rounded-full group-hover:bg-gradient-to-b group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-700" style={{ transitionDelay: '200ms' }}></div>
                </div>
              </div>

              {/* Title */}
              <h4 className="text-2xl font-bold mb-5 text-gray-900 leading-tight group-hover:translate-x-2 transition-transform duration-500 ease-out">
                {highlight.title}
              </h4>

              {/* Key Points - Show 3 points */}
              <div className="text-gray-600 mb-7 space-y-4">
                {highlight.points.slice(0, 3).map((point, index) => (
                  <div key={index} className="flex items-start opacity-90 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500 ease-out" style={{ transitionDelay: `${index * 150}ms` }}>
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2.5 mr-4 flex-shrink-0 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 group-hover:scale-125 transition-all duration-400"></div>
                    <span className="leading-relaxed font-medium text-sm">{point}</span>
                  </div>
                ))}
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {highlight.metrics.map((metric, index) => (
                  <div key={index} className="text-center bg-gray-50 rounded-lg p-4 group-hover:bg-gray-100 group-hover:scale-105 transition-all duration-500 ease-out" style={{ transitionDelay: `${index * 100}ms` }}>
                    <div className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-400">{metric.value}</div>
                    <div className="text-xs text-gray-500 font-medium mt-1">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Period and Progress Indicators */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-gray-500 text-sm font-medium group-hover:text-gray-700 transition-colors duration-400">
                  <span>{highlight.period}</span>
                </div>
                <div className="flex space-x-1">
                  <div className="w-8 h-1 bg-gray-200 rounded-full group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-500"></div>
                  <div className="w-4 h-1 bg-gray-200 rounded-full group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-600" style={{ transitionDelay: '100ms' }}></div>
                  <div className="w-2 h-1 bg-gray-200 rounded-full group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-700" style={{ transitionDelay: '200ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {/* Bottom CTA */}
    <div className="text-center mt-16">
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