import { useState, useCallback } from 'react';
import { Menu, X, Settings, BookOpen, PlayCircle, BarChart3 } from 'lucide-react';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import { SegmentSidebar } from '@/components/sidebar/SegmentSidebar';
import { VocabularyPanel } from '@/components/vocabulary/VocabularyPanel';
import { ExercisePanel } from '@/components/exercises/ExercisePanel';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import type { Segment } from '@/types/pedagogy';
import { businessEnglishVideo } from '@/data/videoAnalysis';

// Demo video URL (using a sample video)
const DEMO_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

type SidebarView = 'segments' | 'vocabulary' | 'exercises';

function App() {
  const [activeSegment, setActiveSegment] = useState<Segment | null>(null);
  const [currentTime] = useState(0);
  const [sidebarView, setSidebarView] = useState<SidebarView>('segments');
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const { preferences, isLoaded } = useUserPreferences();

  // Handle segment change from video player
  const handleSegmentChange = useCallback((segment: Segment | null) => {
    setActiveSegment(segment);
  }, []);

  // Handle segment click in sidebar
  const handleSegmentClick = useCallback((segment: Segment) => {
    setActiveSegment(segment);
    // The video player will handle the actual seeking
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[var(--charcoal-800)] flex items-center justify-center">
        <div className="text-[var(--copper-400)] text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--charcoal-800)] flex flex-col">
      {/* Header */}
      <header className="h-14 bg-[var(--charcoal-900)] border-b border-[var(--charcoal-500)] flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-[var(--charcoal-700)] transition-colors lg:hidden"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-[var(--text-secondary)]" />
            ) : (
              <Menu className="w-5 h-5 text-[var(--text-secondary)]" />
            )}
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--copper-500)] to-[var(--copper-700)] flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-[var(--charcoal-900)]" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-[var(--text-primary)]">LinguaCore AI</h1>
              <p className="text-xs text-[var(--text-tertiary)]">Educational Video Platform</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* CEFR Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[var(--charcoal-700)] rounded-lg">
            <span className="text-xs text-[var(--text-tertiary)]">Your Level:</span>
            <span className="text-xs font-mono text-[var(--copper-400)]">{preferences.cefr_self_assessment}</span>
          </div>

          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 rounded-lg hover:bg-[var(--charcoal-700)] transition-colors"
          >
            <Settings className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Player Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Video Container */}
          <div className="flex-1 bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
              <VideoPlayer
                videoUrl={DEMO_VIDEO_URL}
                segments={businessEnglishVideo.segments}
                overallCefr={businessEnglishVideo.difficulty_profile.overall_cefr}
                userCefr={preferences.cefr_self_assessment}
                onSegmentChange={handleSegmentChange}
              />
            </div>
          </div>

          {/* Video Info Bar */}
          <div className="h-12 bg-[var(--charcoal-700)] border-t border-[var(--charcoal-500)] flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <h2 className="text-sm font-medium text-[var(--text-primary)] truncate">
                {businessEnglishVideo.metadata.title}
              </h2>
              <span className="text-xs text-[var(--text-tertiary)] hidden sm:inline">
                {Math.floor(businessEnglishVideo.metadata.duration_seconds / 60)}:{String(Math.floor(businessEnglishVideo.metadata.duration_seconds % 60)).padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span 
                className="px-2 py-1 text-xs font-mono rounded"
                style={{ 
                  backgroundColor: `var(--level-${businessEnglishVideo.difficulty_profile.overall_cefr.toLowerCase()})20`,
                  color: `var(--level-${businessEnglishVideo.difficulty_profile.overall_cefr.toLowerCase()})`
                }}
              >
                {businessEnglishVideo.difficulty_profile.overall_cefr}
              </span>
            </div>
          </div>

          {/* Mobile Sidebar Toggle */}
          <div className="lg:hidden bg-[var(--charcoal-700)] border-t border-[var(--charcoal-500)] p-2">
            <div className="flex gap-1">
              <button
                onClick={() => {
                  setSidebarView('segments');
                  setSidebarOpen(true);
                }}
                className={`flex-1 py-2 text-xs rounded flex items-center justify-center gap-1 ${
                  sidebarView === 'segments' 
                    ? 'bg-[var(--copper-500)] text-[var(--charcoal-900)]' 
                    : 'bg-[var(--charcoal-600)] text-[var(--text-secondary)]'
                }`}
              >
                <BarChart3 className="w-3 h-3" />
                Segments
              </button>
              <button
                onClick={() => {
                  setSidebarView('vocabulary');
                  setSidebarOpen(true);
                }}
                className={`flex-1 py-2 text-xs rounded flex items-center justify-center gap-1 ${
                  sidebarView === 'vocabulary' 
                    ? 'bg-[var(--copper-500)] text-[var(--charcoal-900)]' 
                    : 'bg-[var(--charcoal-600)] text-[var(--text-secondary)]'
                }`}
              >
                <BookOpen className="w-3 h-3" />
                Vocab
              </button>
              <button
                onClick={() => {
                  setSidebarView('exercises');
                  setSidebarOpen(true);
                }}
                className={`flex-1 py-2 text-xs rounded flex items-center justify-center gap-1 ${
                  sidebarView === 'exercises' 
                    ? 'bg-[var(--copper-500)] text-[var(--charcoal-900)]' 
                    : 'bg-[var(--charcoal-600)] text-[var(--text-secondary)]'
                }`}
              >
                <PlayCircle className="w-3 h-3" />
                Practice
              </button>
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside 
          className={`
            fixed inset-y-0 right-0 z-40 w-80 bg-[var(--charcoal-800)] border-l border-[var(--charcoal-500)]
            transform transition-transform duration-300 lg:relative lg:transform-none
            ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:hidden'}
          `}
          style={{ top: '3.5rem', height: 'calc(100vh - 3.5rem)' }}
        >
          {/* Desktop Sidebar Tabs */}
          <div className="hidden lg:flex border-b border-[var(--charcoal-500)]">
            <button
              onClick={() => setSidebarView('segments')}
              className={`flex-1 py-3 text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                sidebarView === 'segments' 
                  ? 'text-[var(--copper-400)] border-b-2 border-[var(--copper-500)]' 
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              <BarChart3 className="w-3 h-3" />
              Segments
            </button>
            <button
              onClick={() => setSidebarView('vocabulary')}
              className={`flex-1 py-3 text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                sidebarView === 'vocabulary' 
                  ? 'text-[var(--copper-400)] border-b-2 border-[var(--copper-500)]' 
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              Vocabulary
            </button>
            <button
              onClick={() => setSidebarView('exercises')}
              className={`flex-1 py-3 text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                sidebarView === 'exercises' 
                  ? 'text-[var(--copper-400)] border-b-2 border-[var(--copper-500)]' 
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
              }`}
            >
              <PlayCircle className="w-3 h-3" />
              Practice
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="h-full">
            {sidebarView === 'segments' && (
              <SegmentSidebar
                segments={businessEnglishVideo.segments}
                difficultyProfile={businessEnglishVideo.difficulty_profile}
                activeSegment={activeSegment}
                currentTime={currentTime}
                onSegmentClick={handleSegmentClick}
              />
            )}
            {sidebarView === 'vocabulary' && (
              <VocabularyPanel
                vocabulary={businessEnglishVideo.vocabulary_items}
                phrasalVerbs={businessEnglishVideo.phrasal_verbs}
                activeSegment={activeSegment}
              />
            )}
            {sidebarView === 'exercises' && (
              <ExercisePanel
                exercises={businessEnglishVideo.exercises}
                activeSegment={activeSegment}
              />
            )}
          </div>
        </aside>
      </div>

      {/* Settings Modal */}
      <SettingsPanel 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          style={{ top: '3.5rem' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
