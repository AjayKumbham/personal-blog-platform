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
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Career Highlights</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Key achievements and milestones that define my professional journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Highlight 1 */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-3">50+ Projects Delivered</h4>
                <p className="text-blue-100 mb-4 leading-relaxed">
                  Successfully delivered complex web applications for startups and enterprises, ranging from e-commerce platforms to SaaS solutions.
                </p>
                <div className="flex items-center text-blue-200 text-sm">
                  <Star className="w-4 h-4 mr-1" />
                  <span>2020 - Present</span>
                </div>
              </div>
            </div>

            {/* Highlight 2 */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-3">Open Source Contributor</h4>
                <p className="text-purple-100 mb-4 leading-relaxed">
                  Active contributor to popular React libraries with 1000+ GitHub stars. Passionate about giving back to the developer community.
                </p>
                <div className="flex items-center text-purple-200 text-sm">
                  <Star className="w-4 h-4 mr-1" />
                  <span>2022 - Present</span>
                </div>
              </div>
            </div>

            {/* Highlight 3 */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-3">Performance Optimization</h4>
                <p className="text-green-100 mb-4 leading-relaxed">
                  Improved application performance by 60% on average through code optimization, lazy loading, and modern build techniques.
                </p>
                <div className="flex items-center text-green-200 text-sm">
                  <Star className="w-4 h-4 mr-1" />
                  <span>Ongoing Excellence</span>
                </div>
              </div>
            </div>

            {/* Highlight 4 */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-500 text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-3">Team Leadership</h4>
                <p className="text-orange-100 mb-4 leading-relaxed">
                  Led cross-functional teams of 5-8 developers, implementing agile methodologies and mentoring junior developers.
                </p>
                <div className="flex items-center text-orange-200 text-sm">
                  <Star className="w-4 h-4 mr-1" />
                  <span>2023 - Present</span>
                </div>
              </div>
            </div>

            {/* Highlight 5 */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-3">Technical Innovation</h4>
                <p className="text-indigo-100 mb-4 leading-relaxed">
                  Pioneered the adoption of modern frameworks and tools, reducing development time by 40% and improving code quality.
                </p>
                <div className="flex items-center text-indigo-200 text-sm">
                  <Star className="w-4 h-4 mr-1" />
                  <span>Continuous Innovation</span>
                </div>
              </div>
            </div>

            {/* Highlight 6 */}
            <div className="group relative overflow-hidden bg-gradient-to-br from-pink-500 to-rose-500 text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-2xl font-bold mb-3">Client Satisfaction</h4>
                <p className="text-pink-100 mb-4 leading-relaxed">
                  Maintained 98% client satisfaction rate with consistent delivery of high-quality solutions on time and within budget.
                </p>
                <div className="flex items-center text-pink-200 text-sm">
                  <Star className="w-4 h-4 mr-1" />
                  <span>Proven Track Record</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full text-gray-700 font-medium shadow-lg">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span>Ready to create something amazing together?</span>
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