import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Linkedin, Github, Send, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '../hooks/useToastHook';
import { settingsService } from '../services/settingsService';
import { emailService, ContactFormData } from '../services/emailService';
import { SiteSettings } from '../types';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    loadSettings();
    checkEmailServiceStatus();

    // Check URL for success parameter (if redirected back from FormSubmit)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('sent') === 'true') {
      setSubmitStatus('success');
      setSubmitMessage('Message sent successfully! I\'ll get back to you soon.');
      showSuccess("Message Sent!", "Thank you for your message. I'll get back to you soon.");

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [showSuccess]);

  const loadSettings = async () => {
    try {
      const data = await settingsService.getSiteSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const checkEmailServiceStatus = () => {
    const status = emailService.getServiceStatus();
    if (!status.configured) {
      console.warn('Email service not configured - using demo email');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setFieldErrors({});
    setSubmitStatus('idle');
    setSubmitMessage('');
    setIsSubmitting(true);

    try {
      // Client-side validation first
      const validationErrors = emailService.validateFormData(formData);
      if (validationErrors.length > 0) {
        const errorMap: Record<string, string> = {};
        validationErrors.forEach(error => {
          errorMap[error.field] = error.message;
        });
        setFieldErrors(errorMap);
        setSubmitStatus('error');
        setSubmitMessage('Please fix the errors below and try again.');
        return;
      }

      // Send email
      const result = await emailService.sendEmail(formData);

      if (result.success) {
        setSubmitStatus('success');
        setSubmitMessage(result.message);
        showSuccess("Message Sent Successfully!", result.message);

        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.message);
        showError("Failed to Send Message", result.message);
      }
    } catch (error) {
      console.error('Unexpected error sending message:', error);
      setSubmitStatus('error');
      setSubmitMessage('An unexpected error occurred. Please try again.');
      showError(
        "Unexpected Error",
        "An unexpected error occurred. Please try again or contact me directly via email."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ''
      });
    }

    // Clear submit status when user modifies form
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setSubmitMessage('');
    }
  };

  const ContactCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    info: string;
    href: string
  }> = ({ icon, title, info, href }) => (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 hover:transform hover:scale-105 flex flex-col cursor-pointer no-underline"
    >
      <div className="flex items-center space-x-4 mb-3">
        <div className="p-3 bg-blue-100 rounded-full text-blue-600 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
      </div>
      <div className="text-gray-600 group-hover:text-blue-600 transition-colors duration-300">
        {info}
      </div>
    </a>
  );

  // Show loading state
  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { author } = settings;

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Get In <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have a project in mind or want to collaborate? I'd love to hear from you. Let's create something amazing together.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Let's Connect</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
              <ContactCard
                icon={<Mail className="w-6 h-6" />}
                title="Email"
                info={author.email || 'Contact via form'}
                href={`mailto:${author.email || 'demo@example.com'}`}
              />
              <ContactCard
                icon={<MapPin className="w-6 h-6" />}
                title="Location"
                info={author.location || 'Remote'}
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(author.location || 'Remote')}`}
              />
              {author.linkedin && (
                <ContactCard
                  icon={<Linkedin className="w-6 h-6" />}
                  title="LinkedIn"
                  info="Connect with me"
                  href={author.linkedin}
                />
              )}
              {author.github && (
                <ContactCard
                  icon={<Github className="w-6 h-6" />}
                  title="GitHub"
                  info="Check out my code"
                  href={author.github}
                />
              )}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 transition-colors duration-200 ${fieldErrors.name
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    placeholder="Your full name"
                    aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                  />
                  {fieldErrors.name && (
                    <p id="name-error" className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {fieldErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    maxLength={254}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 transition-colors duration-200 ${fieldErrors.email
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    placeholder="your.email@example.com"
                    aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                  />
                  {fieldErrors.email && (
                    <p id="email-error" className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  maxLength={200}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 transition-colors duration-200 ${fieldErrors.subject
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  placeholder="What's this about?"
                  aria-describedby={fieldErrors.subject ? 'subject-error' : undefined}
                />
                {fieldErrors.subject && (
                  <p id="subject-error" className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {fieldErrors.subject}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  maxLength={5000}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 resize-none transition-colors duration-200 ${fieldErrors.message
                    ? 'border-red-300 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  placeholder="Tell me about your project or just say hello..."
                  aria-describedby={fieldErrors.message ? 'message-error' : undefined}
                />
                <div className="flex justify-between items-center mt-1">
                  {fieldErrors.message ? (
                    <p id="message-error" className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {fieldErrors.message}
                    </p>
                  ) : (
                    <div></div>
                  )}
                  <span className="text-xs text-gray-500">
                    {formData.message.length}/5000
                  </span>
                </div>
              </div>
              {/* Status Message */}
              {submitStatus !== 'idle' && (
                <div className={`p-4 rounded-lg flex items-start space-x-3 ${submitStatus === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
                  }`}>
                  {submitStatus === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`text-sm font-medium ${submitStatus === 'success' ? 'text-green-800' : 'text-red-800'
                      }`}>
                      {submitStatus === 'success' ? 'Success!' : 'Error'}
                    </p>
                    <p className={`text-sm ${submitStatus === 'success' ? 'text-green-700' : 'text-red-700'
                      }`}>
                      {submitMessage}
                    </p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || Object.values(fieldErrors).some(error => error !== '')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
            <p className="text-sm text-gray-500 mt-4 text-center">
              Your message will be sent directly to my email inbox
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;