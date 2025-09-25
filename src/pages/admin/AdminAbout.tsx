// React
import React, { useEffect } from 'react';

// Third-party
import { Plus, Edit, Trash2, Upload, FileText, X } from 'lucide-react';

// Local components
import CareerHighlightModal from '../../components/admin/shared/CareerHighlightModal';
import StatsModal from '../../components/admin/shared/StatsModal';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// Hooks
import { useAdminSettings } from '../../hooks/admin/useAdminSettings';

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">About Content Management</h1>
        <Button
          onClick={handleSaveSettings}
          disabled={savingSettings}
          loading={savingSettings}
        >
          Save Changes
        </Button>
      </div>

      <div className="space-y-8">
        {/* Resume Section */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume</h3>
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
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
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
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Career Highlights</h3>
            <Button
              onClick={() => openHighlightModal()}
              icon={Plus}
              size="sm"
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
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Statistics</h3>
            <Button
              onClick={() => openStatsModal()}
              icon={Plus}
              size="sm"
              disabled={settings.stats.length >= 6}
            >
              Add Stat
            </Button>
          </div>
          
          {settings.stats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No statistics added yet.</p>
              <p className="text-sm">Click "Add Stat" to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {settings.stats.map((stat) => (
                <div key={stat.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 text-sm font-medium">
                          {stat.icon}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
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
            </div>
          )}
          
          {settings.stats.length >= 6 && (
            <p className="text-sm text-gray-500 mt-4 text-center">
              Maximum of 6 statistics reached. Delete existing stats to add new ones.
            </p>
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
        maxStatsReached={settings.stats.length >= 6}
      />
    </div>
  );
};

export default AdminAbout;