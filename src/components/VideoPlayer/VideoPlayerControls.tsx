// src/components/VideoPlayer/VideoPlayerControls.tsx
import { 
  Play, Pause, Volume2, VolumeX, Volume1, Settings, 
  SkipBack, SkipForward, Maximize, Minimize, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VideoPlayerControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number[];
  isMuted: boolean;
  playbackRate: number;
  showControls: boolean;
  isFullscreen: boolean;
  currentLesson: number;
  totalLessons: number;
  title: string;
  onPlayPause: () => void;
  onSeek: (time: number[]) => void;
  onVolumeChange: (volume: number[]) => void;
  onMute: () => void;
  onSkip: (seconds: number) => void;
  onPlaybackRateChange: (rate: number) => void;
  onFullscreen: () => void;
  formatTime: (time: number) => string;
}

export const VideoPlayerControls = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  playbackRate,
  showControls,
  isFullscreen,
  currentLesson,
  totalLessons,
  title,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onMute,
  onSkip,
  onPlaybackRateChange,
  onFullscreen,
  formatTime
}: VideoPlayerControlsProps) => {
  const getVolumeIcon = () => {
    if (isMuted || volume[0] === 0) return VolumeX;
    if (volume[0] < 50) return Volume1;
    return Volume2;
  };

  const VolumeIcon = getVolumeIcon();

  return (
    <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent transition-opacity duration-300 ${
      showControls ? 'opacity-100' : 'opacity-0'
    } ${isFullscreen ? 'p-8 pb-12' : 'p-8 pb-12'}`}>
      <div className={`mx-auto ${isFullscreen ? 'max-w-none' : 'max-w-[1400px]'}`}>
        <div className="mb-4">
          <p className="text-white/80 text-sm">Lesson {currentLesson} of {totalLessons}</p>
          <h2 className={`text-white font-bold ${isFullscreen ? 'text-3xl' : 'text-2xl'}`}>
            {title}
          </h2>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2 mb-4">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={onSeek}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-white/70">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              size="icon" 
              className={`rounded-full bg-white/20 backdrop-blur hover:bg-white/30 text-white ${
                isFullscreen ? 'w-14 h-14' : 'w-12 h-12'
              }`}
              onClick={onPlayPause}
            >
              {isPlaying ? (
                <Pause className={`${isFullscreen ? 'h-7 w-7' : 'h-6 w-6'}`} />
              ) : (
                <Play className={`${isFullscreen ? 'h-7 w-7' : 'h-6 w-6'} fill-white`} />
              )}
            </Button>
            
            <Button 
              size="icon" 
              className={`rounded-full bg-white/20 backdrop-blur hover:bg-white/30 text-white ${
                isFullscreen ? 'w-12 h-12' : 'w-10 h-10'
              }`}
              onClick={() => onSkip(-10)}
            >
              <SkipBack className={`${isFullscreen ? 'h-5 w-5' : 'h-4 w-4'}`} />
            </Button>
            
            <Button 
              size="icon" 
              className={`rounded-full bg-white/20 backdrop-blur hover:bg-white/30 text-white ${
                isFullscreen ? 'w-12 h-12' : 'w-10 h-10'
              }`}
              onClick={() => onSkip(10)}
            >
              <SkipForward className={`${isFullscreen ? 'h-5 w-5' : 'h-4 w-4'}`} />
            </Button>
            
            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <Button 
                size="icon" 
                className={`rounded-full bg-white/20 backdrop-blur hover:bg-white/30 text-white ${
                  isFullscreen ? 'w-12 h-12' : 'w-10 h-10'
                }`}
                onClick={onMute}
              >
                <VolumeIcon className={`${isFullscreen ? 'h-5 w-5' : 'h-4 w-4'}`} />
              </Button>
              <div className={`${isFullscreen ? 'w-28' : 'w-20'}`}>
                <Slider
                  value={volume}
                  max={100}
                  step={1}
                  onValueChange={onVolumeChange}
                  className="w-full"
                />
              </div>
              <span className={`text-xs text-white/70 ${isFullscreen ? 'w-10 text-sm' : 'w-8'}`}>
                {Math.round(volume[0])}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Playback Speed */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="sm" 
                  className={`rounded-full bg-white/20 backdrop-blur hover:bg-white/30 text-white ${
                    isFullscreen ? 'text-base px-4 py-2' : ''
                  }`}
                >
                  {playbackRate}x
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((rate) => (
                  <DropdownMenuItem 
                    key={rate}
                    onClick={() => onPlaybackRateChange(rate)}
                    className={playbackRate === rate ? 'bg-accent' : ''}
                  >
                    {rate}x {rate === 1 && '(Normal)'}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              size="icon" 
              className={`rounded-full bg-white/20 backdrop-blur hover:bg-white/30 text-white ${
                isFullscreen ? 'w-12 h-12' : 'w-10 h-10'
              }`}
              onClick={onFullscreen}
            >
              {isFullscreen ? (
                <Minimize className={`${isFullscreen ? 'h-5 w-5' : 'h-4 w-4'}`} />
              ) : (
                <Maximize className={`${isFullscreen ? 'h-5 w-5' : 'h-4 w-4'}`} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};