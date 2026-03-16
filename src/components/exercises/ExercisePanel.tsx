import React, { useState, useMemo } from 'react';
import { Check, X, RotateCcw, HelpCircle, Trophy, Target } from 'lucide-react';
import type { Exercises, Segment, ExerciseItem, ExerciseType } from '@/types/pedagogy';

interface ExercisePanelProps {
  exercises: Exercises;
  activeSegment: Segment | null;
}

type ExerciseState = 'unanswered' | 'correct' | 'incorrect';

interface ExerciseAnswer {
  state: ExerciseState;
  selectedOption?: string;
}

export const ExercisePanel: React.FC<ExercisePanelProps> = ({
  exercises,
  activeSegment
}) => {
  const [activeTab, setActiveTab] = useState<'segment' | 'review'>('segment');
  const [answers, setAnswers] = useState<Record<string, ExerciseAnswer>>({});
  const [showHints, setShowHints] = useState<Set<string>>(new Set());

  // Get exercises for active segment
  const segmentExercises = useMemo(() => {
    if (!activeSegment) return [];
    return exercises.segment_specific.filter(
      ex => ex.segment_id === activeSegment.id
    );
  }, [exercises, activeSegment]);

  // Calculate progress
  const progress = useMemo(() => {
    const allExercises = activeTab === 'segment' 
      ? segmentExercises.flatMap(ex => ex.items)
      : exercises.global_review.matching_sets;
    
    const answered = allExercises.filter(item => answers[item.id]?.state !== 'unanswered').length;
    const correct = allExercises.filter(item => answers[item.id]?.state === 'correct').length;
    
    return {
      answered,
      total: allExercises.length,
      correct,
      percentage: allExercises.length > 0 ? Math.round((correct / allExercises.length) * 100) : 0
    };
  }, [answers, segmentExercises, exercises, activeTab]);

  // Handle answer selection
  const handleAnswer = (itemId: string, answer: string, correctAnswer: string) => {
    setAnswers(prev => ({
      ...prev,
      [itemId]: {
        state: answer === correctAnswer ? 'correct' : 'incorrect',
        selectedOption: answer
      }
    }));
  };

  // Reset exercise
  const resetExercise = (itemId: string) => {
    setAnswers(prev => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  // Toggle hint
  const toggleHint = (itemId: string) => {
    setShowHints(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  // Render gap fill exercise
  const renderGapFill = (item: ExerciseItem) => {
    const answer = answers[item.id];
    const isAnswered = answer?.state !== 'unanswered';

    return (
      <div className="space-y-3">
        <p className="text-sm text-[var(--text-primary)] leading-relaxed">
          {item.question.split('__________').map((part, idx, arr) => (
            <React.Fragment key={idx}>
              {part}
              {idx < arr.length - 1 && (
                <span 
                  className={`
                    inline-block min-w-[80px] px-2 py-0.5 mx-1 rounded text-center font-mono text-sm
                    ${isAnswered 
                      ? answer?.state === 'correct'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                        : 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-[var(--charcoal-600)] border border-[var(--charcoal-500)]'
                    }
                  `}
                >
                  {isAnswered ? answer.selectedOption : '...'}
                </span>
              )}
            </React.Fragment>
          ))}
        </p>

        {!isAnswered && (
          <div className="flex gap-2">
            <button
              onClick={() => handleAnswer(item.id, item.answer, item.answer)}
              className="px-3 py-1.5 text-sm bg-[var(--copper-500)] text-[var(--charcoal-900)] rounded hover:bg-[var(--copper-400)] transition-colors"
            >
              Check Answer
            </button>
            <button
              onClick={() => toggleHint(item.id)}
              className="px-3 py-1.5 text-sm bg-[var(--charcoal-600)] text-[var(--text-secondary)] rounded hover:bg-[var(--charcoal-500)] transition-colors flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              Hint
            </button>
          </div>
        )}

        {showHints.has(item.id) && item.context && (
          <div className="p-2 bg-[var(--charcoal-600)] rounded text-xs text-[var(--text-tertiary)]">
            <span className="text-[var(--copper-400)]">Hint:</span> {item.context}
          </div>
        )}

        {isAnswered && (
          <div className={`
            flex items-center gap-2 text-sm
            ${answer?.state === 'correct' ? 'text-green-400' : 'text-red-400'}
          `}>
            {answer?.state === 'correct' ? (
              <>
                <Check className="w-4 h-4" />
                Correct!
              </>
            ) : (
              <>
                <X className="w-4 h-4" />
                Incorrect. The answer is: <span className="font-medium">{item.answer}</span>
              </>
            )}
            <button
              onClick={() => resetExercise(item.id)}
              className="ml-2 p-1 rounded hover:bg-[var(--charcoal-600)] transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    );
  };

  // Render matching exercise
  const renderMatching = (item: ExerciseItem) => {
    const answer = answers[item.id];
    const isAnswered = answer?.state !== 'unanswered';

    return (
      <div className="space-y-3">
        <p className="text-sm text-[var(--text-primary)]">{item.question}</p>

        {!isAnswered && item.options && (
          <div className="grid grid-cols-1 gap-2">
            {item.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(item.id, option, item.answer)}
                className="p-3 text-left text-sm bg-[var(--charcoal-700)] border border-[var(--charcoal-500)] rounded-lg hover:border-[var(--copper-500)] hover:bg-[var(--charcoal-600)] transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {isAnswered && (
          <div className={`
            p-3 rounded-lg border
            ${answer?.state === 'correct' 
              ? 'bg-green-500/10 border-green-500/30 text-green-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
            }
          `}>
            <div className="flex items-center gap-2 mb-2">
              {answer?.state === 'correct' ? (
                <Check className="w-4 h-4" />
              ) : (
                <X className="w-4 h-4" />
              )}
              <span className="font-medium">
                {answer?.state === 'correct' ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            {answer?.state === 'incorrect' && (
              <p className="text-sm">The correct answer is: <span className="font-medium">{item.answer}</span></p>
            )}
            <button
              onClick={() => resetExercise(item.id)}
              className="mt-2 text-xs flex items-center gap-1 hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              Try again
            </button>
          </div>
        )}
      </div>
    );
  };

  // Render categorization exercise
  const renderCategorization = (item: ExerciseItem) => {
    const answer = answers[item.id];
    const isAnswered = answer?.state !== 'unanswered';

    return (
      <div className="space-y-3">
        <p className="text-sm text-[var(--text-primary)]">{item.question}</p>

        {!isAnswered && item.options && (
          <div className="flex flex-wrap gap-2">
            {item.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(item.id, option, item.answer)}
                className="px-4 py-2 text-sm bg-[var(--charcoal-700)] border border-[var(--charcoal-500)] rounded-lg hover:border-[var(--copper-500)] hover:bg-[var(--charcoal-600)] transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {isAnswered && (
          <div className={`
            flex items-center gap-2 text-sm
            ${answer?.state === 'correct' ? 'text-green-400' : 'text-red-400'}
          `}>
            {answer?.state === 'correct' ? (
              <>
                <Check className="w-4 h-4" />
                Correct! This belongs to: <span className="font-medium">{item.answer}</span>
              </>
            ) : (
              <>
                <X className="w-4 h-4" />
                Incorrect. This belongs to: <span className="font-medium">{item.answer}</span>
              </>
            )}
            <button
              onClick={() => resetExercise(item.id)}
              className="ml-2 p-1 rounded hover:bg-[var(--charcoal-600)] transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    );
  };

  // Render exercise based on type
  const renderExercise = (type: ExerciseType, item: ExerciseItem) => {
    switch (type) {
      case 'gap_fill':
        return renderGapFill(item);
      case 'matching':
        return renderMatching(item);
      case 'categorization':
        return renderCategorization(item);
      default:
        return renderGapFill(item);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[var(--charcoal-800)]">
      {/* Header */}
      <div className="p-4 border-b border-[var(--charcoal-500)]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2">
            <Target className="w-4 h-4 text-[var(--copper-400)]" />
            Exercises
          </h3>
          {progress.total > 0 && (
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[var(--copper-400)]" />
              <span className="text-sm font-mono text-[var(--copper-400)]">
                {progress.correct}/{progress.total}
              </span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('segment')}
            className={`
              flex-1 px-3 py-1.5 text-xs rounded transition-colors
              ${activeTab === 'segment'
                ? 'bg-[var(--copper-500)] text-[var(--charcoal-900)]'
                : 'bg-[var(--charcoal-600)] text-[var(--text-secondary)] hover:bg-[var(--charcoal-500)]'
              }
            `}
          >
            Segment ({segmentExercises.reduce((acc, ex) => acc + ex.items.length, 0)})
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`
              flex-1 px-3 py-1.5 text-xs rounded transition-colors
              ${activeTab === 'review'
                ? 'bg-[var(--copper-500)] text-[var(--charcoal-900)]'
                : 'bg-[var(--charcoal-600)] text-[var(--text-secondary)] hover:bg-[var(--charcoal-500)]'
              }
            `}
          >
            Review ({exercises.global_review.matching_sets.length})
          </button>
        </div>

        {/* Progress Bar */}
        {progress.total > 0 && (
          <div className="mt-3">
            <div className="h-1.5 bg-[var(--charcoal-600)] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[var(--copper-600)] to-[var(--copper-400)] transition-all"
                style={{ width: `${(progress.answered / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Exercise Content */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'segment' ? (
          <div className="space-y-4">
            {!activeSegment ? (
              <div className="text-center py-8 text-[var(--text-tertiary)]">
                <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Select a segment to view exercises</p>
              </div>
            ) : segmentExercises.length === 0 ? (
              <div className="text-center py-8 text-[var(--text-tertiary)]">
                <p className="text-sm">No exercises for this segment</p>
              </div>
            ) : (
              segmentExercises.map((exercise) => (
                <div key={exercise.segment_id} className="space-y-3">
                  <div className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider">
                    {exercise.exercise_type.replace(/_/g, ' ')}
                  </div>
                  {exercise.items.map((item, itemIndex) => (
                    <div 
                      key={item.id}
                      className="p-3 bg-[var(--charcoal-700)] rounded-lg border border-[var(--charcoal-500)]"
                    >
                      <div className="text-xs text-[var(--text-tertiary)] mb-2">
                        Question {itemIndex + 1} of {exercise.items.length}
                      </div>
                      {renderExercise(exercise.exercise_type, item)}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-wider">
              Global Review
            </div>
            {exercises.global_review.matching_sets.map((item, index) => (
              <div 
                key={item.id}
                className="p-3 bg-[var(--charcoal-700)] rounded-lg border border-[var(--charcoal-500)]"
              >
                <div className="text-xs text-[var(--text-tertiary)] mb-2">
                  Question {index + 1} of {exercises.global_review.matching_sets.length}
                </div>
                {renderMatching(item)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExercisePanel;
