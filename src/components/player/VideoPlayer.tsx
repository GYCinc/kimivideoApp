import { useRef, useState, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Settings } from 'lucide-react';
import type { Segment, CEFRLevel } from '@/types/pedagogy';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';

interface VideoPlayerProps {
  videoUrl: string;
  segments: Segment[];
  overallCefr: CEFRLevel;
  userCefr: CEFRLevel;
  onSegmentChange?: (segment: Segment | null) => void;
}

const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  segments,
  overallCefr,
  userCefr,
  onSegmentChange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [volume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  const {
    currentTime,
    duration,
    isPlaying,
    activeSegment,
    playbackRate,
    videoRef,
    togglePlay,
    seekTo,
    setPlaybackRate,
    skipForward,
    skipBackward,
    formatTime
  } = useVideoPlayer({ segments, onSegmentChange });

  // Check if content is above user's level
  const isAdvanced = (() => {
    const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    return levels.indexOf(overallCefr) > levels.indexOf(userCefr);
  })();

  // Handle timeline click with millisecond precision
  const handleTimelineClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    seekTo(newTime);
  }, [duration, seekTo]);

  // Handle volume toggle
  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume, videoRef]);

  // Calculate segment positions for timeline markers
  const getSegmentStyle = (segment: Segment) => {
    if (!duration) return {};
    const left = (segment.time_bounds.start / duration) * 100;
    const width = ((segment.time_bounds.end - segment.time_bounds.start) / duration) * 100;
    return { left: `${left}%`, width: `${width}%` };
  };

  // Get difficulty color for segment
  const getSegmentColor = (cefr: CEFRLevel) => {
    const colors: Record<CEFRLevel, string> = {
      A1: 'var(--level-a1)',
      A2: 'var(--level-a2)',
      B1: 'var(--level-b1)',
      B2: 'var(--level-b2)',
      C1: 'var(--level-c1)',
      C2: 'var(--level-c2)'
    };
    return colors[cefr];
  };

  return (
    <div 
      ref={containerRef}
      className="video-container relative w-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Advanced Content Warning */}
      {isAdvanced && (
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent px-4 py-3">
          <div className="flex items-center gap-2 text-amber-400 text-sm">
            <span className="font-mono text-xs uppercase tracking-wider">Advanced Content</span>
            <span className="text-white/60">—</span>
            <span className="text-white/80">{overallCefr} Level Detected</span>
          </div>
        </div>
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full aspect-video bg-black"
        onClick={togglePlay}
        playsInline
      />

      {/* Custom Controls Overlay */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 pb-4 pt-12 transition-opacity duration-300 ${isHovering || !isPlaying ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Timeline with Segment Markers */}
        <div className="relative mb-4">
          {/* Segment Backgrounds */}
          <div className="absolute inset-0 flex h-2 rounded-full overflow-hidden">
            {segments.map((seg) => (
              <div
                key={seg.id}
                className="h-full opacity-30"
                style={{
                  ...getSegmentStyle(seg),
                  backgroundColor: getSegmentColor(seg.segment_difficulty.cefr),
                  position: 'absolute'
                }}
              />
            ))}
          </div>

          {/* Clickable Timeline */}
          <div 
            className="relative h-2 bg-white/20 rounded-full cursor-pointer group"
            onClick={handleTimelineClick}
          >
            {/* Progress Fill */}
            <div 
              className="absolute h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />

            {/* Segment Boundary Markers */}
            {segments.map((seg, index) => {
              if (index === 0) return null;
              const left = (seg.time_bounds.start / duration) * 100;
              return (
                <div
                  key={`marker-${seg.id}`}
                  className="absolute top-0 bottom-0 w-0.5 bg-white/40"
                  style={{ left: `${left}%` }}
                />
              );
            })}

            {/* Hover Indicator */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="h-full bg-white/10 rounded-full" />
            </div>
          </div>

          {/* Segment Labels (on hover) */}
          {isHovering && activeSegment && (
            <div className="absolute -top-6 left-0 text-xs text-white/70 font-mono">
              {activeSegment.pedagogical_focus.replace(/_/g, ' ')}
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white ml-0.5" />
              )}
            </button>

            {/* Skip Buttons */}
            <button
              onClick={() => skipBackward(10)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
              <SkipBack className="w-4 h-4 text-white/80" />
            </button>
            <button
              onClick={() => skipForward(10)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
              <SkipForward className="w-4 h-4 text-white/80" />
            </button>

            {/* Volume */}
            <button
              onClick={toggleMute}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-white/80" />
              ) : (
                <Volume2 className="w-4 h-4 text-white/80" />
              )}
            </button>

            {/* Time Display */}
            <div className="text-sm font-mono text-white/80 ml-2">
              <span>{formatTime(currentTime)}</span>
              <span className="text-white/40 mx-1">/</span>
              <span className="text-white/60">{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Playback Rate */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-2 py-1 text-xs font-mono text-white/70 hover:text-white bg-white/10 rounded hover:bg-white/20 transition-colors"
              >
                {playbackRate}x
              </button>

              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg shadow-xl border border-white/10 overflow-hidden">
                  {PLAYBACK_RATES.map((rate) => (
                    <button
                      key={rate}
                      onClick={() => {
                        setPlaybackRate(rate);
                        setShowSettings(false);
                      }}
                      className={`block w-full px-4 py-2 text-xs font-mono text-left hover:bg-white/10 transition-colors ${
                        rate === playbackRate ? 'text-amber-400 bg-white/5' : 'text-white/70'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Settings */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
            >
              <Settings className="w-4 h-4 text-white/80" />
            </button>
          </div>
        </div>
      </div>

      {/* Center Play Button (when paused) */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity"
        >
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
        </button>
      )}
    </div>
  );
};

export default VideoPlayer;
