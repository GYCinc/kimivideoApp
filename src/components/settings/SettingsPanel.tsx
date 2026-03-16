import React from 'react';
import { Settings, User, Eye, X } from 'lucide-react';
import type { CEFRLevel } from '@/types/pedagogy';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const CEFR_LEVELS: { level: CEFRLevel; label: string; description: string }[] = [
  { level: 'A1', label: 'Beginner', description: 'Can understand and use familiar everyday expressions' },
  { level: 'A2', label: 'Elementary', description: 'Can communicate in simple and routine tasks' },
  { level: 'B1', label: 'Intermediate', description: 'Can deal with most situations likely to arise while traveling' },
  { level: 'B2', label: 'Upper-Intermediate', description: 'Can interact with a degree of fluency and spontaneity' },
  { level: 'C1', label: 'Advanced', description: 'Can express ideas fluently and spontaneously without much searching' },
  { level: 'C2', label: 'Mastery', description: 'Can express themselves spontaneously, very fluently and precisely' }
];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { 
    preferences, 
    setCefrLevel, 
    toggleSimplifiedGlosses, 
    toggleAutoAdvance 
  } = useUserPreferences();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[var(--charcoal-700)] rounded-xl shadow-2xl border border-[var(--charcoal-500)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--charcoal-500)]">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[var(--copper-400)]" />
            <h2 className="text-lg font-medium text-[var(--text-primary)]">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--charcoal-600)] transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text-tertiary)]" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* CEFR Level Selection */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-[var(--copper-400)]" />
              <h3 className="text-sm font-medium text-[var(--text-primary)]">Your CEFR Level</h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-3">
              Select your English proficiency level. Content above your level will be flagged.
            </p>
            <div className="space-y-2">
              {CEFR_LEVELS.map(({ level, label, description }) => (
                <button
                  key={level}
                  onClick={() => setCefrLevel(level)}
                  className={`
                    w-full p-3 rounded-lg border text-left transition-all
                    ${preferences.cefr_self_assessment === level
                      ? 'border-[var(--copper-500)] bg-[var(--copper-500)]/10'
                      : 'border-[var(--charcoal-500)] bg-[var(--charcoal-800)] hover:border-[var(--charcoal-400)]'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span 
                        className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono
                          ${preferences.cefr_self_assessment === level
                            ? 'bg-[var(--copper-500)] text-[var(--charcoal-900)]'
                            : 'bg-[var(--charcoal-600)] text-[var(--text-secondary)]'
                          }
                        `}
                      >
                        {level}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-[var(--text-primary)]">{label}</div>
                        <div className="text-xs text-[var(--text-tertiary)]">{description}</div>
                      </div>
                    </div>
                    {preferences.cefr_self_assessment === level && (
                      <div className="w-2 h-2 rounded-full bg-[var(--copper-500)]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Display Options */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Eye className="w-4 h-4 text-[var(--copper-400)]" />
              <h3 className="text-sm font-medium text-[var(--text-primary)]">Display Options</h3>
            </div>
            <div className="space-y-2">
              <button
                onClick={toggleSimplifiedGlosses}
                className="w-full p-3 rounded-lg border border-[var(--charcoal-500)] bg-[var(--charcoal-800)] hover:border-[var(--charcoal-400)] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-sm text-[var(--text-primary)]">Simplified Glosses</div>
                    <div className="text-xs text-[var(--text-tertiary)]">Show simplified definitions for advanced vocabulary</div>
                  </div>
                  <div 
                    className={`
                      w-10 h-5 rounded-full transition-colors relative
                      ${preferences.show_simplified_glosses ? 'bg-[var(--copper-500)]' : 'bg-[var(--charcoal-600)]'}
                    `}
                  >
                    <div 
                      className={`
                        absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform
                        ${preferences.show_simplified_glosses ? 'left-5' : 'left-0.5'}
                      `}
                    />
                  </div>
                </div>
              </button>

              <button
                onClick={toggleAutoAdvance}
                className="w-full p-3 rounded-lg border border-[var(--charcoal-500)] bg-[var(--charcoal-800)] hover:border-[var(--charcoal-400)] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="text-sm text-[var(--text-primary)]">Auto-Advance Segments</div>
                    <div className="text-xs text-[var(--text-tertiary)]">Automatically play next segment after completion</div>
                  </div>
                  <div 
                    className={`
                      w-10 h-5 rounded-full transition-colors relative
                      ${preferences.auto_advance_segments ? 'bg-[var(--copper-500)]' : 'bg-[var(--charcoal-600)]'}
                    `}
                  >
                    <div 
                      className={`
                        absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform
                        ${preferences.auto_advance_segments ? 'left-5' : 'left-0.5'}
                      `}
                    />
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--charcoal-500)] bg-[var(--charcoal-800)]">
          <button
            onClick={onClose}
            className="w-full py-2 bg-[var(--copper-500)] text-[var(--charcoal-900)] rounded-lg font-medium hover:bg-[var(--copper-400)] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
