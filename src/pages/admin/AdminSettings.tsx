// React
import React, { useEffect } from 'react';

// Local components
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// Hooks
import { useAdminSettings } from '../../hooks/admin/useAdminSettings';

const AdminSettings: React.FC = () => {
  const {
    settings,
    setSettings,
    loadingSettings,
    savingSettings,
    loadSettings,
    handleSaveSettings,
  } = useAdminSettings();

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  if (loadingSettings) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
        <Button
          onClick={handleSaveSettings}
          disabled={savingSettings}
          loading={savingSettings}
          className="w-full sm:w-auto"
        >
          Save Settings
        </Button>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Site Information */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Site Information</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your Site Name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site URL
              </label>
              <input
                type="url"
                value={settings.siteUrl}
                onChange={(e) => setSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://yoursite.com"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Description
            </label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="A brief description of your site"
            />
          </div>
        </Card>

        {/* Author Details */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Author Details</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author Name
              </label>
              <input
                type="text"
                value={settings.authorName}
                onChange={(e) => setSettings(prev => ({ ...prev, authorName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your Name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author Title
              </label>
              <input
                type="text"
                value={settings.authorTitle}
                onChange={(e) => setSettings(prev => ({ ...prev, authorTitle: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your Professional Title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={settings.authorLocation}
                onChange={(e) => setSettings(prev => ({ ...prev, authorLocation: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your Location"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={settings.authorEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, authorEmail: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author Bio
            </label>
            <textarea
              value={settings.authorBio}
              onChange={(e) => setSettings(prev => ({ ...prev, authorBio: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Tell us about yourself..."
            />
          </div>
        </Card>

        {/* Social Links */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub
              </label>
              <input
                type="url"
                value={settings.github}
                onChange={(e) => setSettings(prev => ({ ...prev, github: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://github.com/username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                value={settings.linkedin}
                onChange={(e) => setSettings(prev => ({ ...prev, linkedin: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Twitter
              </label>
              <input
                type="url"
                value={settings.twitter}
                onChange={(e) => setSettings(prev => ({ ...prev, twitter: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://twitter.com/username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <input
                type="url"
                value={settings.website}
                onChange={(e) => setSettings(prev => ({ ...prev, website: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </Card>

        {/* API Keys */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">API Keys</h3>
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h4 className="text-sm sm:text-md font-medium text-gray-800 mb-3">Hashnode Integration</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hashnode API Key
                  </label>
                  <input
                    type="password"
                    value={settings.hashnodeApiKey}
                    onChange={(e) => setSettings(prev => ({ ...prev, hashnodeApiKey: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your Hashnode API Key"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hashnode Publication ID
                  </label>
                  <input
                    type="text"
                    value={settings.hashnodePublicationId}
                    onChange={(e) => setSettings(prev => ({ ...prev, hashnodePublicationId: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your Publication ID"
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm sm:text-md font-medium text-gray-800 mb-3">Dev.to Integration</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dev.to API Key
                </label>
                <input
                  type="password"
                  value={settings.devToApiKey}
                  onChange={(e) => setSettings(prev => ({ ...prev, devToApiKey: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your Dev.to API Key"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Newsletter Settings */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Newsletter Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="newsletter-enabled"
                checked={settings.newsletterEnabled}
                onChange={(e) => setSettings(prev => ({ ...prev, newsletterEnabled: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="newsletter-enabled" className="ml-2 block text-sm text-gray-900">
                Enable newsletter signup
              </label>
            </div>
            <p className="text-sm text-gray-500">
              When enabled, visitors can subscribe to your newsletter to receive updates about new posts.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminSettings;