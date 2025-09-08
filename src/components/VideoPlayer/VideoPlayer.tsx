// src/components/VideoPlayer/VideoPlayer.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { 
  Play, Pause, Volume2, VolumeX, Volume1, Settings, 
  SkipBack, SkipForward, Maximize, Minimize, Check, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { VideoPlayerControls } from "./VideoPlayerControls";

interface VideoPlayerProps {
  videoSrc: string;
  poster: string;
  title: string;
  currentLesson?: number;
  totalLessons?: number;
  isFullscreen: boolean;
  onFullscreenToggle: () => void;
  onClose: () => void;
}

export const VideoPlayer = ({ 
  videoSrc, 
  poster, 
  title, 
  currentLesson = 1, 
  totalLessons = 7,
  isFullscreen,
  onFullscreenToggle,
  onClose
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Video control methods
  const togglePlayPause = useCallback(async () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    try {
      if (videoElement.paused) {
        await videoElement.play();
      } else {
        videoElement.pause();
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  }, []);

  const handleSeek = useCallback((newTime: number[]) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    videoElement.currentTime = newTime[0];
  }, []);

  const handleVolumeChange = useCallback((newVolume: number[]) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const volumeValue = newVolume[0] / 100;
    videoElement.volume = volumeValue;
    setVolume(newVolume);
    
    if (volumeValue === 0) {
      setIsMuted(true);
      videoElement.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      videoElement.muted = false;
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.muted = !videoElement.muted;
    setIsMuted(!isMuted);
  }, [isMuted]);

  const skipTime = useCallback((seconds: number) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    videoElement.currentTime = newTime;
  }, [currentTime, duration]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div ref={containerRef} className="relative w-full bg-black">
      <div className={`relative mx-auto ${isFullscreen ? 'w-full h-screen' : ''}`}>
        <div className={`relative ${isFullscreen ? 'w-full h-full' : 'aspect-video w-full'}`}>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            poster={poster}
            onClick={togglePlayPause}
            playsInline
            preload="metadata"
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {isFullscreen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className={`absolute top-4 right-4 z-50 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white w-10 h-10 transition-opacity duration-300 ${
                showControls ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
          
          <VideoPlayerControls
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            isMuted={isMuted}
            playbackRate={playbackRate}
            showControls={showControls}
            isFullscreen={isFullscreen}
            currentLesson={currentLesson}
            totalLessons={totalLessons}
            title={title}
            onPlayPause={togglePlayPause}
            onSeek={handleSeek}
            onVolumeChange={handleVolumeChange}
            onMute={toggleMute}
            onSkip={skipTime}
            onPlaybackRateChange={setPlaybackRate}
            onFullscreen={onFullscreenToggle}
            formatTime={formatTime}
          />
        </div>
      </div>
    </div>
  );
};
