// React
import React from 'react';

// Local components
import Button from '../../ui/Button';

// Types
import { StatsFormData } from '../../../types';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingStats: { id?: string; icon: string; label: string; value: string } | null;
  statsForm: StatsFormData;
  onUpdateForm: (updates: Partial<StatsFormData>) => void;
  maxStatsReached: boolean;
}

const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingStats,
  statsForm,
  onUpdateForm,
  maxStatsReached,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingStats ? 'Edit Statistic' : 'Add New Statistic'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Label *
              </label>
              <input
                type="text"
                value={statsForm.label}
                onChange={(e) => onUpdateForm({ label: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Years of Experience"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Value *
              </label>
              <input
                type="text"
                value={statsForm.value}
                onChange={(e) => onUpdateForm({ value: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 5+"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
              </label>
              <select
                value={statsForm.icon}
                onChange={(e) => onUpdateForm({ icon: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Code2">Code2</option>
                <option value="Award">Award</option>
                <option value="Users">Users</option>
                <option value="Trophy">Trophy</option>
                <option value="Target">Target</option>
                <option value="Briefcase">Briefcase</option>
                <option value="Zap">Zap</option>
                <option value="Rocket">Rocket</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={onSave}
              disabled={!statsForm.label.trim() || !statsForm.value.trim() || (!editingStats && maxStatsReached)}
            >
              {editingStats ? 'Update Stat' : 'Add Stat'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;