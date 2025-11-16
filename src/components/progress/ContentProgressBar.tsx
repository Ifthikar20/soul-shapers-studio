// ============================================
// FILE: src/components/progress/ContentProgressBar.tsx
// Content Watch/Listen Progress Bar Component
// ============================================

import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Play } from 'lucide-react';

interface ContentProgressBarProps {
  contentId: string;
  contentType: 'video' | 'audio';
  currentTime?: number; // Current playback time in seconds
  duration?: number; // Total duration in seconds
  onContinue?: () => void; // Callback to resume playback
  className?: string;
}

const ContentProgressBar: React.FC<ContentProgressBarProps> = ({
  contentId,
  contentType,
  currentTime = 0,
  duration = 0,
  onContinue,
  className = '',
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [savedProgress, setSavedProgress] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Load saved progress on mount
  useEffect(() => {
    loadProgress();
  }, [contentId]);

  // Update progress when playback changes
  useEffect(() => {
    if (duration > 0 && currentTime > 0) {
      const progressPercent = Math.round((currentTime / duration) * 100);
      setProgress(progressPercent);

      // Auto-save progress every 5 seconds
      saveProgress(currentTime, duration);

      // Mark as completed if watched/listened >90%
      if (progressPercent >= 90) {
        setIsCompleted(true);
      }
    }
  }, [currentTime, duration]);

  const loadProgress = () => {
    try {
      const storageKey = `${contentType}_progress_${contentId}`;
      const stored = localStorage.getItem(storageKey);

      if (stored) {
        const data = JSON.parse(stored);
        const savedPercent = Math.round((data.currentTime / data.duration) * 100);
        setSavedProgress(savedPercent);
        setProgress(savedPercent);
        setIsCompleted(savedPercent >= 90);
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  const saveProgress = (time: number, dur: number) => {
    try {
      const storageKey = `${contentType}_progress_${contentId}`;
      const data = {
        currentTime: time,
        duration: dur,
        lastWatched: new Date().toISOString(),
      };
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Don't show if no progress yet
  if (progress === 0 && savedProgress === 0) {
    return null;
  }

  const displayProgress = progress > 0 ? progress : savedProgress;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Progress Bar */}
      <div className="relative">
        <Progress
          value={displayProgress}
          className="h-2"
          // @ts-ignore - Custom className for the indicator
          indicatorClassName={isCompleted ? 'bg-green-500' : 'bg-primary'}
        />
      </div>

      {/* Status Text */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-green-600 dark:text-green-400 font-medium">
                Completed
              </span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">
                {progress > 0 ? 'Playing' : 'Continue'} {contentType === 'video' ? 'watching' : 'listening'}
              </span>
            </>
          )}
        </div>

        <span className="text-muted-foreground font-medium">
          {displayProgress}% complete
        </span>
      </div>

      {/* Continue Button (if there's saved progress but not currently playing) */}
      {savedProgress > 0 && progress === 0 && !isCompleted && onContinue && (
        <button
          onClick={onContinue}
          className="w-full mt-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
        >
          <Play className="w-4 h-4" />
          Continue from {formatTime((savedProgress / 100) * (duration || 0))}
        </button>
      )}
    </div>
  );
};

export default ContentProgressBar;
