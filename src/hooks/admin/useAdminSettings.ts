// React
import { useState, useCallback } from 'react';

// Third-party
// (No third-party imports needed)

// Services
import { settingsService } from '../../services/settingsService';
import { fileUploadService } from '../../services/fileUploadService';

// Hooks
import { useToast } from '../useToast';

// Types
import { CareerHighlight, AdminSettingsState, StatsFormData, CareerHighlightFormData } from '../../types';

// Helper function to deduplicate stats by id and label
const deduplicateStats = (stats: Array<{ id?: string; icon: string; label: string; value: string }>) => {
  const seen = new Set<string>();
  return stats.filter(stat => {
    const key = stat.id || `${stat.label}-${stat.value}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

interface UseAdminSettingsReturn {
  settings: AdminSettingsState;
  setSettings: React.Dispatch<React.SetStateAction<AdminSettingsState>>;
  loadingSettings: boolean;
  savingSettings: boolean;
  uploadingResume: boolean;
  loadSettings: () => Promise<void>;
  handleSaveSettings: () => Promise<void>;
  handleResumeUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleRemoveResume: () => Promise<void>;
  // Career Highlights
  showHighlightModal: boolean;
  editingHighlight: CareerHighlight | null;
  highlightForm: CareerHighlightFormData;
  openHighlightModal: (highlight?: CareerHighlight) => void;
  closeHighlightModal: () => void;
  saveHighlight: () => Promise<void>;
  deleteHighlight: (id: string) => Promise<void>;
  updateHighlightForm: (field: string, value: string | number | string[] | { label: string; value: string }[] | { label: string; value: string }, index?: number) => void;
  // Stats
  showStatsModal: boolean;
  editingStats: { id?: string; icon: string; label: string; value: string } | null;
  statsForm: StatsFormData;
  openStatsModal: (stats?: { id?: string; icon: string; label: string; value: string }) => void;
  closeStatsModal: () => void;
  saveStat: () => Promise<void>;
  deleteStat: (id: string) => Promise<void>;
  updateStatsForm: (updates: Partial<StatsFormData>) => void;
}

export const useAdminSettings = (): UseAdminSettingsReturn => {
  const { showSuccess, showError } = useToast();
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  
  const [settings, setSettings] = useState<AdminSettingsState>({
    // API Keys
    hashnodeApiKey: '',
    hashnodePublicationId: '',
    devToApiKey: '',
    // About Content
    siteName: '',
    siteDescription: '',
    siteUrl: '',
    authorName: '',
    authorBio: '',
    authorTitle: '',
    authorLocation: '',
    authorEmail: '',
    github: '',
    linkedin: '',
    twitter: '',
    website: '',
    resume: '',
    skills: '',
    careerHighlights: [] as CareerHighlight[],
    stats: [] as Array<{ id?: string; icon: string; label: string; value: string }>,
    // Newsletter
    newsletterEnabled: true,
  });

  // Career Highlights Modal State
  const [showHighlightModal, setShowHighlightModal] = useState(false);
  const [editingHighlight, setEditingHighlight] = useState<CareerHighlight | null>(null);
  const [highlightForm, setHighlightForm] = useState({
    title: '',
    subtitle: '',
    points: ['', '', ''],
    metrics: [
      { label: '', value: '' },
      { label: '', value: '' },
      { label: '', value: '' }
    ],
    period: '',
    icon: 'Code2',
    order: 1
  });

  // Stats Modal State
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [editingStats, setEditingStats] = useState<{ id?: string; icon: string; label: string; value: string } | null>(null);
  const [statsForm, setStatsForm] = useState({
    label: '',
    value: '',
    icon: 'Code2'
  });

  const loadSettings = useCallback(async () => {
    try {
      const data = await settingsService.getSiteSettings();

      // Transform the data to match our form structure
      setSettings({
        siteName: data.siteName || '',
        siteDescription: data.siteDescription || '',
        siteUrl: data.siteUrl || '',
        hashnodeApiKey: data.hashnodeApiKey || '',
        hashnodePublicationId: data.hashnodePublicationId || '',
        devToApiKey: data.devToApiKey || '',
        authorName: data.author?.name || '',
        authorBio: data.author?.bio || '',
        authorTitle: data.author?.title || '',
        authorLocation: data.author?.location || '',
        authorEmail: data.author?.email || '',
        github: data.author?.github || '',
        linkedin: data.author?.linkedin || '',
        twitter: data.author?.twitter || '',
        website: data.author?.website || '',
        resume: data.author?.resume || '',
        skills: data.author?.skills?.join(', ') || '',
        careerHighlights: data.author?.careerHighlights || [],
        stats: deduplicateStats((data.author?.stats || []).map((stat, index) => ({
          id: stat.id || `stat-${Date.now()}-${index}`,
          icon: typeof stat.icon === 'string' ? stat.icon : 'Code2',
          label: stat.label,
          value: stat.value
        }))),
        // Newsletter
        newsletterEnabled: data.newsletter?.enabled ?? true,
      });
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoadingSettings(false);
    }
  }, []);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      // Prepare the settings object with proper structure
      const settingsToSave = {
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        siteUrl: settings.siteUrl,
        hashnodeApiKey: settings.hashnodeApiKey,
        hashnodePublicationId: settings.hashnodePublicationId,
        devToApiKey: settings.devToApiKey,
        newsletter: {
          enabled: settings.newsletterEnabled,
        },
        author: {
          name: settings.authorName,
          bio: settings.authorBio,
          avatar: '/personal-logo.jpg', // Default avatar
          title: settings.authorTitle,
          location: settings.authorLocation,
          email: settings.authorEmail,
          github: settings.github,
          twitter: settings.twitter,
          linkedin: settings.linkedin,
          website: settings.website,
          resume: settings.resume,
          skills: settings.skills ? settings.skills.split(',').map(s => s.trim()).filter(s => s) : [],
          careerHighlights: settings.careerHighlights || [],
          stats: deduplicateStats(settings.stats || []).slice(0, 4).map(stat => ({
            id: stat.id,
            icon: stat.icon, // Keep as string for consistency
            label: stat.label,
            value: stat.value
          })),
        }
      };

      await settingsService.updateSiteSettings(settingsToSave);
      showSuccess('Settings saved', 'Your settings have been successfully updated.');
    } catch (error) {
      console.error('Error saving settings:', error);
      showError('Failed to save settings', 'Please check your inputs and try again.');
    } finally {
      setSavingSettings(false);
    }
  };

  // Handle resume upload
  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = fileUploadService.validateResumeFile(file);
    if (!validation.isValid) {
      showError('Invalid file', validation.error || 'Please select a valid resume file');
      return;
    }

    setUploadingResume(true);
    try {
      // Delete old resume if exists
      if (settings.resume) {
        await fileUploadService.deleteResume(settings.resume);
      }

      // Upload new resume
      const resumeUrl = await fileUploadService.uploadResume(file);

      // Update settings
      setSettings(prev => ({ ...prev, resume: resumeUrl }));

      showSuccess('Resume uploaded', 'Your resume has been successfully uploaded');
    } catch (error) {
      console.error('Error uploading resume:', error);
      showError('Upload failed', 'Failed to upload resume. Please try again.');
    } finally {
      setUploadingResume(false);
      // Reset file input
      event.target.value = '';
    }
  };

  // Handle resume removal
  const handleRemoveResume = async () => {
    if (!settings.resume) return;

    if (!window.confirm('Are you sure you want to remove your resume? This action cannot be undone.')) {
      return;
    }

    try {
      await fileUploadService.deleteResume(settings.resume);
      setSettings(prev => ({ ...prev, resume: '' }));
      showSuccess('Resume removed', 'Your resume has been successfully removed');
    } catch (error) {
      console.error('Error removing resume:', error);
      showError('Remove failed', error instanceof Error ? error.message : 'Failed to remove resume. Please try again.');
    }
  };

  // Career Highlights CRUD Operations
  const openHighlightModal = (highlight?: CareerHighlight) => {
    if (highlight) {
      setEditingHighlight(highlight);
      setHighlightForm({
        title: highlight.title || '',
        subtitle: highlight.subtitle || '',
        points: highlight.points || ['', '', ''],
        metrics: highlight.metrics || [
          { label: '', value: '' },
          { label: '', value: '' },
          { label: '', value: '' }
        ],
        period: highlight.period || '',
        icon: highlight.icon || 'Code2',
        order: highlight.order || 1
      });
    } else {
      setEditingHighlight(null);
      setHighlightForm({
        title: '',
        subtitle: '',
        points: ['', '', ''],
        metrics: [
          { label: '', value: '' },
          { label: '', value: '' },
          { label: '', value: '' }
        ],
        period: '',
        icon: 'Code2',
        order: settings.careerHighlights.length + 1
      });
    }
    setShowHighlightModal(true);
  };

  const closeHighlightModal = () => {
    setShowHighlightModal(false);
    setEditingHighlight(null);
  };

  const saveHighlight = async () => {
    const newHighlight = {
      id: editingHighlight?.id || `highlight-${Date.now()}`,
      ...highlightForm,
      points: highlightForm.points.filter(p => p.trim()),
      metrics: highlightForm.metrics.filter(m => m.label.trim() && m.value.trim())
    };

    let updatedHighlights;
    if (editingHighlight) {
      updatedHighlights = settings.careerHighlights.map(h =>
        h.id === editingHighlight.id ? newHighlight : h
      );
    } else {
      updatedHighlights = [...settings.careerHighlights, newHighlight];
    }

    // Update local state first for immediate UI feedback
    setSettings(prev => ({
      ...prev,
      careerHighlights: updatedHighlights
    }));

    // Save to database immediately
    try {
      const currentSettings = await settingsService.getSiteSettings();
      await settingsService.updateSiteSettings({
        author: {
          ...currentSettings.author,
          careerHighlights: updatedHighlights
        }
      });

      closeHighlightModal();
      showSuccess(
        editingHighlight ? 'Highlight updated' : 'Highlight added',
        `Career highlight has been ${editingHighlight ? 'updated' : 'added'} and saved to database.`
      );
    } catch (error) {
      console.error('Error saving highlight to database:', error);
      // Revert local state on error
      setSettings(prev => ({
        ...prev,
        careerHighlights: editingHighlight ? settings.careerHighlights : settings.careerHighlights.filter(h => h.id !== newHighlight.id)
      }));
      showError('Failed to save highlight', 'The career highlight could not be saved to the database. Please try again.');
    }
  };

  const deleteHighlight = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this career highlight? This action cannot be undone.')) {
      return;
    }

    const originalHighlights = [...settings.careerHighlights];
    const updatedHighlights = settings.careerHighlights.filter(h => h.id !== id);

    // Update local state first for immediate UI feedback
    setSettings(prev => ({
      ...prev,
      careerHighlights: updatedHighlights
    }));

    // Save to database immediately
    try {
      const currentSettings = await settingsService.getSiteSettings();
      await settingsService.updateSiteSettings({
        author: {
          ...currentSettings.author,
          careerHighlights: updatedHighlights
        }
      });

      showSuccess('Highlight deleted', 'Career highlight has been deleted and removed from database.');
    } catch (error) {
      console.error('Error deleting highlight from database:', error);
      // Revert local state on error
      setSettings(prev => ({
        ...prev,
        careerHighlights: originalHighlights
      }));
      showError('Failed to delete highlight', 'The career highlight could not be deleted from the database. Please try again.');
    }
  };

  const updateHighlightForm = (
    field: string,
    value: string | number | string[] | { label: string; value: string }[] | { label: string; value: string },
    index?: number
  ) => {
    setHighlightForm(prev => {
      if (field === 'points' && index !== undefined) {
        const newPoints = [...prev.points];
        newPoints[index] = value as string;
        return { ...prev, points: newPoints };
      } else if (field === 'metrics' && index !== undefined) {
        const newMetrics = [...prev.metrics];
        newMetrics[index] = value as { label: string; value: string };
        return { ...prev, metrics: newMetrics };
      } else if (field === 'points' && Array.isArray(value)) {
        return { ...prev, points: value as string[] };
      } else if (field === 'metrics' && Array.isArray(value)) {
        return { ...prev, metrics: value as { label: string; value: string }[] };
      } else {
        return { ...prev, [field]: value };
      }
    });
  };

  // Stats CRUD Operations
  const openStatsModal = (stat?: { id?: string; icon: string; label: string; value: string }) => {
    if (stat) {
      setEditingStats(stat);
      setStatsForm({
        label: stat.label || '',
        value: stat.value || '',
        icon: stat.icon || 'Code2'
      });
    } else {
      setEditingStats(null);
      setStatsForm({
        label: '',
        value: '',
        icon: 'Code2'
      });
    }
    setShowStatsModal(true);
  };

  const closeStatsModal = () => {
    setShowStatsModal(false);
    setEditingStats(null);
  };

  const saveStat = async () => {
    const newStat = {
      id: editingStats?.id || `stat-${Date.now()}`,
      ...statsForm
    };

    let updatedStats;
    if (editingStats) {
      updatedStats = settings.stats.map(s =>
        s.id === editingStats.id ? newStat : s
      );
    } else {
      updatedStats = [...settings.stats, newStat];
    }

    // Update local state first for immediate UI feedback
    setSettings(prev => ({
      ...prev,
      stats: updatedStats
    }));

    // Save to database immediately
    try {
      const currentSettings = await settingsService.getSiteSettings();
      await settingsService.updateSiteSettings({
        author: {
          ...currentSettings.author,
          stats: deduplicateStats(updatedStats).slice(0, 4).map(stat => ({
            id: stat.id,
            icon: stat.icon,
            label: stat.label,
            value: stat.value
          }))
        }
      });

      closeStatsModal();
      showSuccess(
        editingStats ? 'Stat updated' : 'Stat added',
        `Stat has been ${editingStats ? 'updated' : 'added'} and saved to database.`
      );
    } catch (error) {
      console.error('Error saving stat to database:', error);
      // Revert local state on error
      setSettings(prev => ({
        ...prev,
        stats: editingStats ? settings.stats : settings.stats.filter(s => s.id !== newStat.id)
      }));
      showError('Failed to save stat', 'The stat could not be saved to the database. Please try again.');
    }
  };

  const deleteStat = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this stat? This action cannot be undone.')) {
      return;
    }

    const originalStats = [...settings.stats];
    const updatedStats = settings.stats.filter(s => s.id !== id);

    // Update local state first for immediate UI feedback
    setSettings(prev => ({
      ...prev,
      stats: updatedStats
    }));

    // Save to database immediately
    try {
      const currentSettings = await settingsService.getSiteSettings();
      await settingsService.updateSiteSettings({
        author: {
          ...currentSettings.author,
          stats: deduplicateStats(updatedStats).slice(0, 4).map(stat => ({
            id: stat.id,
            icon: stat.icon,
            label: stat.label,
            value: stat.value
          }))
        }
      });

      showSuccess('Stat deleted', 'Stat has been deleted and removed from database.');
    } catch (error) {
      console.error('Error deleting stat from database:', error);
      // Revert local state on error
      setSettings(prev => ({
        ...prev,
        stats: originalStats
      }));
      showError('Failed to delete stat', 'The stat could not be deleted from the database. Please try again.');
    }
  };

  const updateStatsForm = (updates: Partial<{ label: string; value: string; icon: string }>) => {
    setStatsForm(prev => ({ ...prev, ...updates }));
  };

  return {
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
  };
};