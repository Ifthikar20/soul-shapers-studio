// src/components/AudioPlayer.tsx
import React, { useState } from 'react';
import { Play, Pause, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface AudioPlayerProps {
  audio: any;
  onPlay?: () => void;
  onPause?: () => void;
  onProgressChange?: (progress: number) => void;
}

export const AudioPlayer = ({ audio, onPlay, onPause, onProgressChange }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState([0]);

  const durationParts = audio.duration.split(':');
  const duration = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      onPause?.();
    } else {
      setIsPlaying(true);
      onPlay?.();
    }
  };

  const handleProgressChange = (value: number[]) => {
    setProgress(value);
    onProgressChange?.(value[0]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = (progress[0] / 100) * duration;

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Plant Image with improved blending */}
      <div className="flex justify-center lg:justify-end">
        <div className="relative">
          <img
            src={audio.thumbnail}
            alt={audio.title}
            className="
              w-[28rem] h-[28rem] object-contain 
              transition-all duration-700 hover:scale-105
              opacity-85 mix-blend-multiply 
              filter drop-shadow-2xl
              hover:opacity-95 hover:brightness-110
            "
          />
          {/* Subtle background glow for better integration */}
          <div className="absolute inset-0 bg-wellness-soft/10 rounded-full blur-3xl -z-10 scale-75" />
        </div>
      </div>
      
      {/* Player Controls */}
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-foreground">
            {audio.title}
          </h1>
          <p className="text-muted-foreground">{audio.description}</p>
        </div>
        
        <div className="flex flex-col items-center space-y-8">
          {/* Play/Pause Button */}
          <Button
            onClick={handleTogglePlay}
            size="lg"
            className="
              w-20 h-20 rounded-full bg-wellness text-white 
              hover:bg-wellness/90 transition-all duration-300 
              shadow-[var(--shadow-gentle)] hover:shadow-[var(--shadow-breathing)]
              hover:scale-105 active:scale-95
            "
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </Button>

          {/* Progress Bar */}
          <div className="w-full max-w-md space-y-3">
            <Slider
              value={progress}
              onValueChange={handleProgressChange}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Save Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full hover:bg-wellness-soft/20 transition-colors"
          >
            <Heart className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
