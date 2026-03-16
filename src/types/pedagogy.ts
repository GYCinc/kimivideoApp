/**
 * Pedagogical Data Types for AI-Powered Educational Video Platform
 * Computational discourse analysis with CEFR leveling and segmentation
 */

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type SegmentationRationale = 'topic_shift' | 'pause_boundary' | 'speaker_change' | 'structural_marker' | 'semantic_boundary';
export type FrequencyBand = 'K1' | 'K2' | 'AWL' | 'low_freq';
export type ExerciseType = 'matching' | 'categorization' | 'gap_fill' | 'discourse_analysis';

export interface TimeBounds {
  start: number;
  end: number;
}

export interface ComplexityMetrics {
  lexical_density: number;
  awl_ratio: number;
  mean_sentence_length: number;
  type_token_ratio: number;
}

export interface DifficultyProfile {
  overall_cefr: CEFRLevel;
  overall_score: number;
  lexical_sophistication: number;
  syntactic_complexity: 'low' | 'moderate' | 'moderate_high' | 'high';
  complexity_metrics: ComplexityMetrics;
  recommendations: {
    target_audience: string;
    prerequisite_knowledge: string[];
  };
}

export interface SegmentDifficulty {
  cefr: CEFRLevel;
  complexity_factors: string[];
  comprehension_checkpoints: string[];
}

export interface Segment {
  id: string;
  time_bounds: TimeBounds;
  transcript: string;
  segmentation_rationale: SegmentationRationale;
  lexical_density_score: number;
  speech_rate_wpm: number;
  segment_difficulty: SegmentDifficulty;
  pedagogical_focus: string;
}

export interface VocabularyItem {
  term: string;
  segment_id: string;
  timestamp_occurrence: number;
  frequency_band: FrequencyBand;
  cefr_level: CEFRLevel;
  deductive_context: string;
  full_definition: string;
  collocations: string[];
  pronunciation: string;
}

export interface PhrasalVerb {
  verb: string;
  meaning: string;
  example: string;
  segment_id: string;
}

export interface ExerciseItem {
  id: string;
  question: string;
  answer: string;
  options?: string[];
  context?: string;
}

export interface SegmentExercise {
  segment_id: string;
  exercise_type: ExerciseType;
  items: ExerciseItem[];
}

export interface GlobalReview {
  categorization_tasks: ExerciseItem[];
  matching_sets: ExerciseItem[];
}

export interface Exercises {
  segment_specific: SegmentExercise[];
  global_review: GlobalReview;
}

export interface VideoMetadata {
  title: string;
  duration_seconds: number;
  source_url: string;
  thumbnail?: string;
}

export interface VideoAnalysis {
  metadata: VideoMetadata;
  difficulty_profile: DifficultyProfile;
  segments: Segment[];
  vocabulary_items: VocabularyItem[];
  phrasal_verbs: PhrasalVerb[];
  exercises: Exercises;
}

// User preference types
export interface UserPreferences {
  cefr_self_assessment: CEFRLevel;
  show_simplified_glosses: boolean;
  auto_advance_segments: boolean;
}

// Component prop types
export interface SegmentMarkerProps {
  segment: Segment;
  isActive: boolean;
  onClick: () => void;
  userLevel: CEFRLevel;
}

export interface DifficultyBarProps {
  metrics: ComplexityMetrics;
  cefr: CEFRLevel;
}

export interface VocabularyCardProps {
  item: VocabularyItem;
  isExpanded: boolean;
  onToggle: () => void;
}
