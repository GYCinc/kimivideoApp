import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Volume2, BookOpen } from 'lucide-react';
import type { VocabularyItem, Segment, PhrasalVerb, CEFRLevel } from '@/types/pedagogy';

interface VocabularyPanelProps {
  vocabulary: VocabularyItem[];
  phrasalVerbs: PhrasalVerb[];
  activeSegment: Segment | null;
}

const CEFR_COLORS: Record<CEFRLevel, string> = {
  A1: 'var(--level-a1)',
  A2: 'var(--level-a2)',
  B1: 'var(--level-b1)',
  B2: 'var(--level-b2)',
  C1: 'var(--level-c1)',
  C2: 'var(--level-c2)'
};



export const VocabularyPanel: React.FC<VocabularyPanelProps> = ({
  vocabulary,
  phrasalVerbs,
  activeSegment
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'segment' | 'K1' | 'K2' | 'AWL'>('all');

  // Filter vocabulary based on selection
  const filteredVocabulary = useMemo(() => {
    let items = vocabulary;

    // Filter by segment if selected
    if (filter === 'segment' && activeSegment) {
      items = items.filter(v => v.segment_id === activeSegment.id);
    }

    // Filter by frequency band
    if (filter === 'K1' || filter === 'K2' || filter === 'AWL') {
      items = items.filter(v => v.frequency_band === filter);
    }

    return items;
  }, [vocabulary, filter, activeSegment]);

  // Get phrasal verbs for active segment
  const segmentPhrasalVerbs = useMemo(() => {
    if (!activeSegment) return [];
    return phrasalVerbs.filter(pv => pv.segment_id === activeSegment.id);
  }, [phrasalVerbs, activeSegment]);

  // Toggle expanded state
  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Text-to-speech for pronunciation
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[var(--charcoal-800)]">
      {/* Header */}
      <div className="p-4 border-b border-[var(--charcoal-500)]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[var(--copper-400)]" />
            Vocabulary
          </h3>
          <span className="text-xs font-mono text-[var(--text-tertiary)]">
            {filteredVocabulary.length} items
          </span>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1">
          {(['all', 'segment', 'K1', 'K2', 'AWL'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                px-2 py-1 text-xs rounded transition-colors
                ${filter === f 
                  ? 'bg-[var(--copper-500)] text-[var(--charcoal-900)]' 
                  : 'bg-[var(--charcoal-600)] text-[var(--text-secondary)] hover:bg-[var(--charcoal-500)]'
                }
              `}
            >
              {f === 'segment' ? 'Current' : f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Vocabulary List */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {filteredVocabulary.map((item) => {
            const isExpanded = expandedItems.has(item.term);
            const isFromActiveSegment = activeSegment?.id === item.segment_id;

            return (
              <div
                key={item.term}
                className={`
                  border rounded-lg overflow-hidden transition-all
                  ${isExpanded 
                    ? 'border-[var(--copper-500)] bg-[var(--charcoal-700)]' 
                    : 'border-[var(--charcoal-500)] bg-[var(--charcoal-800)] hover:border-[var(--charcoal-400)]'
                  }
                  ${isFromActiveSegment ? 'ring-1 ring-[var(--copper-500)]/30' : ''}
                `}
              >
                {/* Header - Always Visible */}
                <button
                  onClick={() => toggleExpanded(item.term)}
                  className="w-full p-3 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-[var(--text-primary)]">
                      {item.term}
                    </span>
                    <span 
                      className="text-xs px-1.5 py-0.5 rounded font-mono"
                      style={{ 
                        backgroundColor: `${CEFR_COLORS[item.cefr_level]}15`,
                        color: CEFR_COLORS[item.cefr_level]
                      }}
                    >
                      {item.cefr_level}
                    </span>
                    <span className="text-xs text-[var(--text-tertiary)] font-mono">
                      {item.frequency_band}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isFromActiveSegment && (
                      <span className="text-xs text-[var(--copper-400)]">Current</span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[var(--text-tertiary)]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)]" />
                    )}
                  </div>
                </button>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-3 pb-3 border-t border-[var(--charcoal-600)]">
                    {/* Pronunciation */}
                    <div className="flex items-center gap-2 py-2">
                      <span className="font-mono text-sm text-[var(--copper-400)]">
                        {item.pronunciation}
                      </span>
                      <button
                        onClick={() => speak(item.term)}
                        className="p-1 rounded hover:bg-[var(--charcoal-600)] transition-colors"
                      >
                        <Volume2 className="w-3 h-3 text-[var(--text-tertiary)]" />
                      </button>
                    </div>

                    {/* Deductive Context (i+1 Scaffolding) */}
                    <div className="mb-3">
                      <div className="text-xs font-mono text-[var(--copper-400)] uppercase tracking-wider mb-1">
                        Context Clue
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] italic leading-relaxed">
                        "{item.deductive_context}"
                      </p>
                    </div>

                    {/* Full Definition */}
                    <div className="mb-3">
                      <div className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                        Definition
                      </div>
                      <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                        {item.full_definition}
                      </p>
                    </div>

                    {/* Collocations */}
                    {item.collocations.length > 0 && (
                      <div>
                        <div className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
                          Common Collocations
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.collocations.map((col, idx) => (
                            <span 
                              key={idx}
                              className="text-xs px-2 py-1 bg-[var(--charcoal-600)] rounded text-[var(--text-secondary)]"
                            >
                              {col}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Phrasal Verbs Section */}
        {segmentPhrasalVerbs.length > 0 && (
          <div className="mt-6">
            <div className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
              Phrasal Verbs in This Segment
            </div>
            <div className="space-y-2">
              {segmentPhrasalVerbs.map((pv, idx) => (
                <div 
                  key={idx}
                  className="p-3 bg-[var(--charcoal-700)] rounded-lg border border-[var(--charcoal-500)]"
                >
                  <div className="font-medium text-[var(--copper-400)] mb-1">{pv.verb}</div>
                  <div className="text-sm text-[var(--text-secondary)] mb-1">{pv.meaning}</div>
                  <div className="text-xs text-[var(--text-tertiary)] italic">"{pv.example}"</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabularyPanel;
