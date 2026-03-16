import { useState, useEffect, useCallback } from 'react';
import type { CEFRLevel, UserPreferences } from '@/types/pedagogy';

const STORAGE_KEY = 'linguacore_preferences';

const DEFAULT_PREFERENCES: UserPreferences = {
  cefr_self_assessment: 'B2',
  show_simplified_glosses: false,
  auto_advance_segments: false
};

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      } catch (error) {
        console.error('Failed to save preferences:', error);
      }
    }
  }, [preferences, isLoaded]);

  const setCefrLevel = useCallback((level: CEFRLevel) => {
    setPreferences(prev => ({ ...prev, cefr_self_assessment: level }));
  }, []);

  const toggleSimplifiedGlosses = useCallback(() => {
    setPreferences(prev => ({ ...prev, show_simplified_glosses: !prev.show_simplified_glosses }));
  }, []);

  const toggleAutoAdvance = useCallback(() => {
    setPreferences(prev => ({ ...prev, auto_advance_segments: !prev.auto_advance_segments }));
  }, []);

  // Check if content is above user's level
  const isContentAdvanced = useCallback((contentLevel: CEFRLevel): boolean => {
    const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const userIndex = levels.indexOf(preferences.cefr_self_assessment);
    const contentIndex = levels.indexOf(contentLevel);
    return contentIndex > userIndex;
  }, [preferences.cefr_self_assessment]);

  // Get level difference for display
  const getLevelDifference = useCallback((contentLevel: CEFRLevel): number => {
    const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const userIndex = levels.indexOf(preferences.cefr_self_assessment);
    const contentIndex = levels.indexOf(contentLevel);
    return contentIndex - userIndex;
  }, [preferences.cefr_self_assessment]);

  return {
    preferences,
    isLoaded,
    setCefrLevel,
    toggleSimplifiedGlosses,
    toggleAutoAdvance,
    isContentAdvanced,
    getLevelDifference
  };
}
