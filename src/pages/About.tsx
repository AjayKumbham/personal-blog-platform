import React from 'react';
import { useState, useEffect } from 'react';
import { Mail, Github, Twitter, Linkedin, MapPin, Code2, Award, Users, Coffee, Globe } from 'lucide-react';
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

      {/* Experience Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">My Journey</h3>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200"></div>

            <div className="space-y-12">
              <div className="relative flex items-center">
                <div className="flex-1 pr-8 text-right">
                  <h4 className="text-xl font-bold text-gray-900">Started Open Source Contributions</h4>
                  <p className="text-blue-600 font-medium">GitHub & Community</p>
                  <p className="text-gray-600">Contributing to popular React libraries and sharing knowledge through blog posts</p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full"></div>
                <div className="flex-1 pl-8">
                  <p className="text-gray-500">2023 - Present</p>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="flex-1 pr-8 text-right">
                  <p className="text-gray-500">2022 - 2023</p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-400 rounded-full"></div>
                <div className="flex-1 pl-8">
                  <h4 className="text-xl font-bold text-gray-900">Launched Personal Blog</h4>
                  <p className="text-blue-600 font-medium">DevBlog Pro</p>
                  <p className="text-gray-600">Started sharing technical insights and tutorials with the developer community</p>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="flex-1 pr-8 text-right">
                  <h4 className="text-xl font-bold text-gray-900">First Full-Stack Project</h4>
                  <p className="text-blue-600 font-medium">Personal Portfolio</p>
                  <p className="text-gray-600">Built my first complete web application using React and Node.js</p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-300 rounded-full"></div>
                <div className="flex-1 pl-8">
                  <p className="text-gray-500">2021 - 2022</p>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="flex-1 pr-8 text-right">
                  <p className="text-gray-500">2020 - 2021</p>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-200 rounded-full"></div>
                <div className="flex-1 pl-8">
                  <h4 className="text-xl font-bold text-gray-900">Started Learning Web Development</h4>
                  <p className="text-blue-600 font-medium">Self-Taught Journey</p>
                  <p className="text-gray-600">Began my coding journey with HTML, CSS, and JavaScript fundamentals</p>
                </div>
              </div>
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