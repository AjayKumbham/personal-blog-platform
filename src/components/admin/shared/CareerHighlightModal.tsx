// React
import React from 'react';

// Local components
import Button from '../../ui/Button';

// Types
import { CareerHighlight, CareerHighlightFormData } from '../../../types';

interface CareerHighlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingHighlight: CareerHighlight | null;
  highlightForm: CareerHighlightFormData;
  onUpdateForm: (
    field: string,
    value: string | number | string[] | { label: string; value: string }[] | { label: string; value: string },
    index?: number
  ) => void;
}

const CareerHighlightModal: React.FC<CareerHighlightModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingHighlight,
  highlightForm,
  onUpdateForm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingHighlight ? 'Edit Career Highlight' : 'Add New Career Highlight'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={highlightForm.title}
                  onChange={(e) => onUpdateForm('title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Full-Stack Projects"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle *
                </label>
                <input
                  type="text"
                  value={highlightForm.subtitle}
                  onChange={(e) => onUpdateForm('subtitle', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Web Development"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Period *
                </label>
                <input
                  type="text"
                  value={highlightForm.period}
                  onChange={(e) => onUpdateForm('period', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 2020 - Present"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <select
                  value={highlightForm.icon}
                  onChange={(e) => onUpdateForm('icon', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Code2">Code2</option>
                  <option value="Rocket">Rocket</option>
                  <option value="Trophy">Trophy</option>
                  <option value="Target">Target</option>
                  <option value="Briefcase">Briefcase</option>
                  <option value="Zap">Zap</option>
                  <option value="Users">Users</option>
                  <option value="Award">Award</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                min="1"
                value={highlightForm.order}
                onChange={(e) => onUpdateForm('order', parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Key Points */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Points (up to 4)
              </label>
              {highlightForm.points.map((point, index) => (
                <div key={index} className="mb-2">
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => onUpdateForm('points', e.target.value, index)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Key point ${index + 1}`}
                  />
                </div>
              ))}
              {highlightForm.points.length < 4 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateForm('points', [...highlightForm.points, ''])}
                >
                  Add Point
                </Button>
              )}
            </div>

            {/* Metrics */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metrics (up to 3)
              </label>
              {highlightForm.metrics.map((metric, index) => (
                <div key={index} className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    value={metric.label}
                    onChange={(e) => onUpdateForm('metrics', { ...metric, label: e.target.value }, index)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Label (e.g., Projects)"
                  />
                  <input
                    type="text"
                    value={metric.value}
                    onChange={(e) => onUpdateForm('metrics', { ...metric, value: e.target.value }, index)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Value (e.g., 50+)"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSave}>
              {editingHighlight ? 'Update Highlight' : 'Add Highlight'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerHighlightModal;