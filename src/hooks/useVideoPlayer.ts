import { useState, useRef, useCallback, useEffect } from 'react';
import type { Segment } from '@/types/pedagogy';

interface UseVideoPlayerProps {
  segments: Segment[];
  onSegmentChange?: (segment: Segment | null) => void;
}

interface UseVideoPlayerReturn {
  // State
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  activeSegment: Segment | null;
  playbackRate: number;
  
  // Refs
  videoRef: React.RefObject<HTMLVideoElement | null>;
  
  // Actions
  togglePlay: () => void;
  seekTo: (time: number) => void;
  setPlaybackRate: (rate: number) => void;
  skipToSegment: (segment: Segment) => void;
  skipForward: (seconds?: number) => void;
  skipBackward: (seconds?: number) => void;
  formatTime: (time: number) => string;
}

const THROTTLE_MS = 250; // Throttle timeupdate to 250ms as specified

export function useVideoPlayer({ segments, onSegmentChange }: UseVideoPlayerProps): UseVideoPlayerReturn {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSegment, setActiveSegment] = useState<Segment | null>(null);
  const [playbackRate, setPlaybackRateState] = useState(1);
  
  const lastUpdateRef = useRef(0);

  // Find active segment based on current time with millisecond precision
  const findActiveSegment = useCallback((time: number): Segment | null => {
    return segments.find(
      seg => time >= seg.time_bounds.start && time < seg.time_bounds.end
    ) || null;
  }, [segments]);

  // Throttled time update handler
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const now = Date.now();
    if (now - lastUpdateRef.current < THROTTLE_MS) return;
    
    lastUpdateRef.current = now;
    const newTime = video.currentTime;
    setCurrentTime(newTime);
    
    const newSegment = findActiveSegment(newTime);
    setActiveSegment(prev => {
      if (prev?.id !== newSegment?.id) {
        onSegmentChange?.(newSegment);
        return newSegment;
      }
      return prev;
    });
  }, [findActiveSegment, onSegmentChange]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(console.error);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  // Seek to specific time (with millisecond precision)
  const seekTo = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;

    const clampedTime = Math.max(0, Math.min(time, duration || time));
    video.currentTime = clampedTime;
    setCurrentTime(clampedTime);
    
    const newSegment = findActiveSegment(clampedTime);
    setActiveSegment(newSegment);
    onSegmentChange?.(newSegment);
  }, [duration, findActiveSegment, onSegmentChange]);

  // Set playback rate
  const setPlaybackRate = useCallback((rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRateState(rate);
  }, []);

  // Skip to specific segment
  const skipToSegment = useCallback((segment: Segment) => {
    seekTo(segment.time_bounds.start);
    const video = videoRef.current;
    if (video && video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  }, [seekTo]);

  // Skip forward/backward
  const skipForward = useCallback((seconds = 10) => {
    seekTo(currentTime + seconds);
  }, [currentTime, seekTo]);

  const skipBackward = useCallback((seconds = 10) => {
    seekTo(currentTime - seconds);
  }, [currentTime, seekTo]);

  // Format time display (mm:ss.ms)
  const formatTime = useCallback((time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const ms = Math.floor((time % 1) * 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms}`;
  }, []);

  // Setup video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [handleTimeUpdate]);

  return {
    currentTime,
    duration,
    isPlaying,
    activeSegment,
    playbackRate,
    videoRef,
    togglePlay,
    seekTo,
    setPlaybackRate,
    skipToSegment,
    skipForward,
    skipBackward,
    formatTime
  };
}
