import React, { useRef, useEffect } from 'react';
import { Clock, BarChart3 } from 'lucide-react';
import type { Segment, CEFRLevel, DifficultyProfile } from '@/types/pedagogy';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface SegmentSidebarProps {
  segments: Segment[];
  difficultyProfile: DifficultyProfile;
  activeSegment: Segment | null;
  currentTime: number;
  onSegmentClick: (segment: Segment) => void;
}

const CEFR_COLORS: Record<CEFRLevel, string> = {
  A1: 'var(--level-a1)',
  A2: 'var(--level-a2)',
  B1: 'var(--level-b1)',
  B2: 'var(--level-b2)',
  C1: 'var(--level-c1)',
  C2: 'var(--level-c2)'
};



export const SegmentSidebar: React.FC<SegmentSidebarProps> = ({
  segments,
  difficultyProfile,
  activeSegment,
  currentTime,
  onSegmentClick
}) => {
  const { isContentAdvanced } = useUserPreferences();
  const activeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active segment without jarring jumps
  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeElement = activeRef.current;
      
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeElement.getBoundingClientRect();
      
      const isVisible = 
        activeRect.top >= containerRect.top && 
        activeRect.bottom <= containerRect.bottom;
      
      if (!isVisible) {
        activeElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest' 
        });
      }
    }
  }, [activeSegment]);

  // Format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get segment progress within the segment
  const getSegmentProgress = (segment: Segment): number => {
    if (currentTime < segment.time_bounds.start) return 0;
    if (currentTime >= segment.time_bounds.end) return 100;
    const segmentDuration = segment.time_bounds.end - segment.time_bounds.start;
    const elapsed = currentTime - segment.time_bounds.start;
    return (elapsed / segmentDuration) * 100;
  };

  // Get difficulty bar height based on complexity
  const getDifficultyHeight = (segment: Segment): string => {
    const density = segment.lexical_density_score;
    if (density < 0.65) return '20%';
    if (density < 0.70) return '40%';
    if (density < 0.75) return '60%';
    if (density < 0.80) return '80%';
    return '100%';
  };

  return (
    <div className="h-full flex flex-col bg-[var(--charcoal-700)] border-l border-[var(--charcoal-500)]">
      {/* Header - Difficulty Overview */}
      <div className="p-4 border-b border-[var(--charcoal-500)]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-[var(--text-primary)]">Video Analysis</h3>
          <span 
            className="px-2 py-0.5 text-xs font-mono rounded"
            style={{ 
              backgroundColor: `${CEFR_COLORS[difficultyProfile.overall_cefr]}20`,
              color: CEFR_COLORS[difficultyProfile.overall_cefr]
            }}
          >
            {difficultyProfile.overall_cefr}
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-[var(--charcoal-600)] rounded p-2">
            <div className="text-xs text-[var(--text-tertiary)] mb-1">Lexical Density</div>
            <div className="font-mono text-sm text-[var(--copper-400)]">
              {Math.round(difficultyProfile.complexity_metrics.lexical_density * 100)}%
            </div>
          </div>
          <div className="bg-[var(--charcoal-600)] rounded p-2">
            <div className="text-xs text-[var(--text-tertiary)] mb-1">Type-Token Ratio</div>
            <div className="font-mono text-sm text-[var(--copper-400)]">
              {Math.round(difficultyProfile.complexity_metrics.type_token_ratio * 100)}%
            </div>
          </div>
        </div>

        {/* Target Audience */}
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          {difficultyProfile.recommendations.target_audience}
        </p>
      </div>

      {/* Segment List */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto"
      >
        <div className="p-3">
          <div className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
            Segments ({segments.length})
          </div>

          <div className="space-y-2">
            {segments.map((segment, index) => {
              const isActive = activeSegment?.id === segment.id;
              const isAboveLevel = isContentAdvanced(segment.segment_difficulty.cefr);
              const progress = isActive ? getSegmentProgress(segment) : 0;

              return (
                <div
                  key={segment.id}
                  ref={isActive ? activeRef : null}
                  onClick={() => onSegmentClick(segment)}
                  className={`
                    relative rounded-lg cursor-pointer transition-all duration-200
                    ${isActive 
                      ? 'bg-[var(--charcoal-600)] border-l-2 border-[var(--copper-500)]' 
                      : 'bg-[var(--charcoal-800)] border-l-2 border-transparent hover:bg-[var(--charcoal-600)]'
                    }
                    ${isAboveLevel ? 'border-l-amber-600' : ''}
                  `}
                >
                  {/* Progress Bar (when active) */}
                  {isActive && (
                    <div 
                      className="absolute bottom-0 left-0 h-0.5 bg-[var(--copper-500)] transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  )}

                  <div className="p-3">
                    {/* Header Row */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[var(--text-tertiary)]">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span 
                          className="text-xs font-mono px-1.5 py-0.5 rounded"
                          style={{ 
                            backgroundColor: `${CEFR_COLORS[segment.segment_difficulty.cefr]}15`,
                            color: CEFR_COLORS[segment.segment_difficulty.cefr]
                          }}
                        >
                          {segment.segment_difficulty.cefr}
                        </span>
                      </div>
                      
                      {/* Difficulty Visualization Bar */}
                      <div className="flex items-end gap-0.5 h-4">
                        <div 
                          className="w-1 bg-[var(--copper-500)] rounded-sm opacity-40"
                          style={{ height: getDifficultyHeight(segment) }}
                        />
                      </div>
                    </div>

                    {/* Time & Focus */}
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-3 h-3 text-[var(--text-tertiary)]" />
                      <span className="text-xs font-mono text-[var(--text-secondary)]">
                        {formatTime(segment.time_bounds.start)} - {formatTime(segment.time_bounds.end)}
                      </span>
                    </div>

                    {/* Pedagogical Focus */}
                    <div className="text-xs text-[var(--text-primary)] capitalize mb-2">
                      {segment.pedagogical_focus.replace(/_/g, ' ')}
                    </div>

                    {/* Metrics Row */}
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-mono text-[var(--text-tertiary)]">
                        {segment.speech_rate_wpm} WPM
                      </span>
                      <span className="text-[var(--charcoal-400)]">|</span>
                      <span className="font-mono text-[var(--text-tertiary)]">
                        LD: {Math.round(segment.lexical_density_score * 100)}%
                      </span>
                    </div>

                    {/* Warning for above-level content */}
                    {isAboveLevel && (
                      <div className="mt-2 text-xs text-amber-500/80 flex items-center gap-1">
                        <BarChart3 className="w-3 h-3" />
                        Above your level
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer - Legend */}
      <div className="p-3 border-t border-[var(--charcoal-500)] bg-[var(--charcoal-800)]">
        <div className="text-xs font-mono text-[var(--text-tertiary)] mb-2">CEFR Levels</div>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(CEFR_COLORS) as CEFRLevel[]).map((level) => (
            <div 
              key={level}
              className="flex items-center gap-1"
            >
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: CEFR_COLORS[level] }}
              />
              <span className="text-xs text-[var(--text-tertiary)]">{level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SegmentSidebar;
