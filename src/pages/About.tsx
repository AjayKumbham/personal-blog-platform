import React from 'react';
import { useState, useEffect } from 'react';
import { Mail, Github, Twitter, Linkedin, MapPin, Code2, Award, Users, Coffee, Globe, Briefcase, Trophy, Rocket, Target, Zap } from 'lucide-react';
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

  // Get skills from settings or use default
  const skills = settings.author?.skills || [
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
<section className="py-20 bg-gray-50 relative">
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
      {highlights.map((highlight, index) => {
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
                  {/* Personal Logo */}
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <img 
                      src="/personal-logo.jpg" 
                      alt="Personal Logo" 
                      className="w-8 h-8 object-contain rounded-lg"
                    />
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