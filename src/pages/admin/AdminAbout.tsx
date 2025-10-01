// React
import React, { useEffect } from 'react';

// Third-party
import { Plus, Edit, Trash2, Upload, FileText, X, Code2, Award, Users, Trophy, Target, Briefcase, Zap, Rocket, Calendar, Clock, Star, TrendingUp, Globe, Home, Eye, BarChart3, Settings } from 'lucide-react';

// Local components
import CareerHighlightModal from '../../components/admin/shared/CareerHighlightModal';
import StatsModal from '../../components/admin/shared/StatsModal';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// Hooks
import { useAdminSettings } from '../../hooks/admin/useAdminSettings';

// Icon mapping for dynamic icons
const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Code2,
  Award,
  Users,
  Trophy,
  Target,
  Briefcase,
  Zap,
  Rocket,
  Calendar,
  Clock,
  Star,
  TrendingUp,
  Globe,
  Home,
  Eye,
  BarChart3,
  Settings,
  Edit,
  FileText,
};

const AdminAbout: React.FC = () => {
  const {
    settings,
    setSettings,
    loadingSettings,
    savingSettings,
    uploadingResume,
    loadSettings,
    handleSaveSettings,
    handleResumeUpload,
    handleRemoveResume,
    // Career Highlights
    showHighlightModal,
    editingHighlight,
    highlightForm,
    openHighlightModal,
    closeHighlightModal,
    saveHighlight,
    deleteHighlight,
    updateHighlightForm,
    // Stats
    showStatsModal,
    editingStats,
    statsForm,
    openStatsModal,
    closeStatsModal,
    saveStat,
    deleteStat,
    updateStatsForm,
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">About Content Management</h1>
        <Button
          onClick={handleSaveSettings}
          disabled={savingSettings}
          loading={savingSettings}
          className="w-full sm:w-auto"
        >
          Save Changes
        </Button>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Author Information Section */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Author Information</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={settings.authorName}
                onChange={(e) => setSettings(prev => ({ ...prev, authorName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Title
              </label>
              <input
                type="text"
                value={settings.authorTitle}
                onChange={(e) => setSettings(prev => ({ ...prev, authorTitle: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Full Stack Developer"
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
                placeholder="e.g., San Francisco, CA"
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
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GitHub URL
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
                LinkedIn URL
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
                Twitter URL
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
                Website URL
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

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={settings.authorBio}
              onChange={(e) => setSettings(prev => ({ ...prev, authorBio: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="Write a brief bio about yourself..."
            />
          </div>
        </Card>

        {/* Resume Section */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Resume</h3>
          <div className="space-y-4">
            {settings.resume ? (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Resume uploaded</p>
                    <p className="text-sm text-gray-600">
                      <a
                        href={settings.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View current resume
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                      disabled={uploadingResume}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={uploadingResume}
                      loading={uploadingResume}
                    >
                      Replace
                    </Button>
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveResume}
                    icon={X}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No resume uploaded</p>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                    disabled={uploadingResume}
                  />
                  <Button
                    disabled={uploadingResume}
                    loading={uploadingResume}
                    icon={Upload}
                  >
                    Upload Resume
                  </Button>
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  Supported formats: PDF, DOC, DOCX (max 5MB)
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Skills Section */}
        <Card className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Skills</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Skills (comma-separated)
            </label>
            <textarea
              value={settings.skills}
              onChange={(e) => setSettings(prev => ({ ...prev, skills: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="e.g., JavaScript, TypeScript, React, Node.js, Python"
            />
            <p className="text-sm text-gray-500 mt-2">
              Enter your skills separated by commas. These will be displayed as tags on your about page.
            </p>
          </div>
        </Card>

        {/* Career Highlights Section */}
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Career Highlights</h3>
            <Button
              onClick={() => openHighlightModal()}
              icon={Plus}
              size="sm"
              className="w-full sm:w-auto"
            >
              Add Highlight
            </Button>
          </div>

          {settings.careerHighlights.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No career highlights added yet.</p>
              <p className="text-sm">Click "Add Highlight" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {settings.careerHighlights
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((highlight) => (
                  <div key={highlight.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{highlight.title}</h4>
                        <p className="text-sm text-gray-600">{highlight.subtitle}</p>
                        <p className="text-sm text-gray-500">{highlight.period}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openHighlightModal(highlight)}
                          icon={Edit}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteHighlight(highlight.id)}
                          icon={Trash2}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>

                    {highlight.points && highlight.points.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Key Points:</p>
                        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                          {highlight.points.map((point, index) => (
                            <li key={index}>{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {highlight.metrics && highlight.metrics.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Metrics:</p>
                        <div className="flex flex-wrap gap-2">
                          {highlight.metrics.map((metric, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {metric.label}: {metric.value}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </Card>

        {/* Stats Section */}
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Statistics</h3>
              <p className="text-sm text-gray-600 mt-1">
                Add up to 4 key statistics to showcase on your about page
              </p>
            </div>
            <Button
              onClick={() => openStatsModal()}
              icon={Plus}
              size="sm"
              disabled={settings.stats.length >= 4}
              className="w-full sm:w-auto"
            >
              Add Stat
            </Button>
          </div>

          {settings.stats.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No statistics added yet</h4>
              <p className="text-gray-600 mb-4">Add statistics to showcase your achievements and metrics</p>
              <Button
                onClick={() => openStatsModal()}
                icon={Plus}
                size="sm"
              >
                Add Your First Stat
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {settings.stats.map((stat) => (
                  <div key={stat.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {(() => {
                            const IconComponent = iconMap[stat.icon] || Award;
                            return <IconComponent className="w-4 h-4 text-blue-600" />;
                          })()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 truncate">{stat.value}</p>
                          <p className="text-sm text-gray-600 truncate">{stat.label}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openStatsModal(stat)}
                          icon={Edit}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteStat(stat.id!)}
                          icon={Trash2}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Empty slots for visual consistency */}
                {Array.from({ length: 4 - settings.stats.length }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex items-center justify-center bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer"
                    onClick={() => openStatsModal()}
                  >
                    <div className="text-center">
                      <Plus className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Add Stat</p>
                    </div>
                  </div>
                ))}
              </div>

              {settings.stats.length >= 4 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm text-amber-800 text-center">
                    <span className="font-medium">Maximum reached:</span> You can have up to 4 statistics. Delete existing ones to add new stats.
                  </p>
                </div>
              )}
            </>
          )}
        </Card>
      </div>

      {/* Career Highlight Modal */}
      <CareerHighlightModal
        isOpen={showHighlightModal}
        onClose={closeHighlightModal}
        onSave={saveHighlight}
        editingHighlight={editingHighlight}
        highlightForm={highlightForm}
        onUpdateForm={updateHighlightForm}
      />

      {/* Stats Modal */}
      <StatsModal
        isOpen={showStatsModal}
        onClose={closeStatsModal}
        onSave={saveStat}
        editingStats={editingStats}
        statsForm={statsForm}
        onUpdateForm={updateStatsForm}
        maxStatsReached={settings.stats.length >= 4}
      />
    </div>
  );
};

export default AdminAbout;