import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useAuth } from '@/contexts/AuthContext';
import { useVideoAccess } from '@/hooks/useVideoAccess';
import { 
  Play, Clock, User, Star, Users, Crown, Lock, X, 
  Pause, Volume2, VolumeX, Volume1, Settings, Plus, ThumbsUp, Share2, 
  Check, BookOpen, ChevronRight, SkipBack, SkipForward, Maximize, Minimize
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VideoContent } from '@/types/video.types';

interface VideoModalProps {
  video: VideoContent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  accessTier: 'free' | 'premium';
  isFirstEpisode: boolean;
}

interface CommunityPost {
  id: number;
  author: string;
  avatar: string;
  timeAgo: string;
  content: string;
  likes: number;
  replies: number;
}

interface PracticeQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const VideoModal = ({ video, open, onOpenChange }: VideoModalProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentLesson, setCurrentLesson] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: number}>({});
  const [showResults, setShowResults] = useState(false);
  
  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [quality, setQuality] = useState('Auto');
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  
  const { user } = useAuth();
  const { canWatchVideo, getAccessMessage } = useVideoAccess();
  
  const canWatch = canWatchVideo(video, []);
  const accessMessage = getAccessMessage(video);

  // Video event handlers
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
      console.log('Video loaded, duration:', videoElement.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
    };

    const handlePlay = () => {
      console.log('Video playing');
      setIsPlaying(true);
    };

    const handlePause = () => {
      console.log('Video paused');
      setIsPlaying(false);
    };

    const handleVolumeChange = () => {
      setVolume([videoElement.volume * 100]);
      setIsMuted(videoElement.muted);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleCanPlay = () => {
      console.log('Video can play');
    };

    const handleError = (e) => {
      console.error('Video error:', e);
    };

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('volumechange', handleVolumeChange);
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('canplay', handleCanPlay);
    videoElement.addEventListener('error', handleError);

    // Set initial volume
    videoElement.volume = volume[0] / 100;

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('volumechange', handleVolumeChange);
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('canplay', handleCanPlay);
      videoElement.removeEventListener('error', handleError);
    };
  }, [volume]);

  // Fullscreen change handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      
      // Reset controls visibility when entering/exiting fullscreen
      if (isCurrentlyFullscreen) {
        setShowControls(true);
        // Auto-hide controls after 3 seconds in fullscreen
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      } else {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Auto-hide controls - show only on bottom hover or mouse movement in fullscreen
  useEffect(() => {
    const resetControlsTimeout = () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      setShowControls(true);
      if (isFullscreen) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isFullscreen) {
        resetControlsTimeout();
        return;
      }
      
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      const mouseY = e.clientY;
      const containerBottom = rect.bottom;
      const hoverZone = 150; // pixels from bottom to show controls
      
      if (mouseY > containerBottom - hoverZone) {
        resetControlsTimeout();
      } else {
        setShowControls(false);
      }
    };

    const handleMouseLeave = () => {
      if (!isFullscreen) {
        setShowControls(false);
      }
    };

    const container = isFullscreen ? fullscreenContainerRef.current : containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      if (!isFullscreen) {
        container.addEventListener('mouseleave', handleMouseLeave);
      }
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isFullscreen]);

  // Control functions
  const togglePlayPause = useCallback(async () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    try {
      if (videoElement.paused) {
        await videoElement.play();
        setIsPlaying(true);
      } else {
        videoElement.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const container = fullscreenContainerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        // Try different fullscreen methods for browser compatibility
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) {
          await (container as any).webkitRequestFullscreen();
        } else if ((container as any).mozRequestFullScreen) {
          await (container as any).mozRequestFullScreen();
        } else if ((container as any).msRequestFullscreen) {
          await (container as any).msRequestFullscreen();
        }
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
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

    if (isMuted) {
      videoElement.muted = false;
      setIsMuted(false);
      if (volume[0] === 0) {
        setVolume([50]);
        videoElement.volume = 0.5;
      }
    } else {
      videoElement.muted = true;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const handleSeek = useCallback((newTime: number[]) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.currentTime = newTime[0];
    setCurrentTime(newTime[0]);
  }, []);

  const handlePlaybackRateChange = useCallback((rate: number) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.playbackRate = rate;
    setPlaybackRate(rate);
  }, []);

  const skipTime = useCallback((seconds: number) => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    videoElement.currentTime = newTime;
    setCurrentTime(newTime);
  }, [currentTime, duration]);

  const formatTime = useCallback((time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const getVolumeIcon = () => {
    if (isMuted || volume[0] === 0) return VolumeX;
    if (volume[0] < 50) return Volume1;
    return Volume2;
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipTime(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipTime(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange([Math.min(100, volume[0] + 10)]);
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange([Math.max(0, volume[0] - 10)]);
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Escape':
          if (isFullscreen) {
            e.preventDefault();
            toggleFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [open, togglePlayPause, skipTime, handleVolumeChange, volume, toggleMute, toggleFullscreen, isFullscreen]);

  // Memoized mock data
  const lessons = useMemo<Lesson[]>(() => [
    {
      id: 1,
      title: "Understanding Your Triggers",
      description: "Identify what causes your cravings and learn to recognize patterns",
      duration: "12:30",
      thumbnail: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=250&fit=crop",
      accessTier: 'free',
      isFirstEpisode: true
    },
    {
      id: 2,
      title: "Breaking the Sugar Cycle",
      description: "Learn the science behind sugar addiction and how to break free",
      duration: "15:45",
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
      accessTier: 'premium',
      isFirstEpisode: false
    },
    {
      id: 3,
      title: "Mindful Eating Techniques",
      description: "Develop awareness around your eating habits and food choices",
      duration: "18:20",
      thumbnail: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=400&h=250&fit=crop",
      accessTier: 'premium',
      isFirstEpisode: false
    },
    {
      id: 4,
      title: "Healthy Alternatives",
      description: "Discover satisfying alternatives to sugary foods and drinks",
      duration: "14:15",
      thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=250&fit=crop",
      accessTier: 'premium',
      isFirstEpisode: false
    },
    {
      id: 5,
      title: "Managing Withdrawal",
      description: "Navigate the challenges of sugar withdrawal with proven strategies",
      duration: "16:40",
      thumbnail: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=250&fit=crop",
      accessTier: 'premium',
      isFirstEpisode: false
    },
    {
      id: 6,
      title: "Building New Habits",
      description: "Create sustainable habits that support your sugar-free lifestyle",
      duration: "20:10",
      thumbnail: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=250&fit=crop",
      accessTier: 'premium',
      isFirstEpisode: false
    },
    {
      id: 7,
      title: "Long-term Success Strategies",
      description: "Maintain your progress and prevent relapse with these techniques",
      duration: "22:55",
      thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      accessTier: 'premium',
      isFirstEpisode: false
    }
  ], []);

  const communityPosts = useMemo<CommunityPost[]>(() => [
    {
      id: 1,
      author: "Sarah M.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
      timeAgo: "2 hours ago",
      content: "Day 30 sugar-free! This course changed my life. The withdrawal was tough but the strategies in lesson 5 really helped.",
      likes: 124,
      replies: 18
    },
    {
      id: 2,
      author: "John D.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      timeAgo: "5 hours ago",
      content: "Just finished lesson 3 about mindful eating. Never realized how much I was eating on autopilot. Anyone else have this revelation?",
      likes: 89,
      replies: 12
    },
    {
      id: 3,
      author: "Emily R.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      timeAgo: "1 day ago",
      content: "Success story: Lost 15 pounds in 2 months after breaking my sugar addiction. Energy levels are through the roof! 🚀",
      likes: 256,
      replies: 34
    }
  ], []);

  const practiceQuestions = useMemo<PracticeQuestion[]>(() => [
    {
      id: 1,
      question: "What is the primary hormone responsible for sugar cravings?",
      options: ["Insulin", "Ghrelin", "Dopamine", "Cortisol"],
      correctAnswer: 2
    },
    {
      id: 2,
      question: "How long does it typically take to break a sugar addiction?",
      options: ["3-5 days", "1 week", "21-30 days", "6 months"],
      correctAnswer: 2
    },
    {
      id: 3,
      question: "Which strategy is most effective for managing sugar withdrawal symptoms?",
      options: ["Cold turkey approach", "Gradual reduction", "Substitution with artificial sweeteners", "Increased protein intake"],
      correctAnswer: 1
    }
  ], []);

  // Optimized handlers
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const handleLessonSelect = useCallback((lessonId: number) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (lesson && canWatchVideo(lesson as any, [])) {
      setCurrentLesson(lessonId);
    }
  }, [lessons, canWatchVideo]);

  const handleAnswerSelect = useCallback((questionId: number, optionIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  }, []);

  const handleQuizReset = useCallback(() => {
    setSelectedAnswers({});
    setShowResults(false);
  }, []);

  const handleUpgradeClick = useCallback(() => {
    onOpenChange(false);
    window.location.href = '/upgrade';
  }, [onOpenChange]);

  // Access denied modal
  if (!canWatch) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <div className="text-center p-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Premium Content
            </h2>
            
            <p className="text-gray-600 mb-6">
              {accessMessage}
            </p>
            
            <div className="space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
                onClick={handleUpgradeClick}
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => onOpenChange(false)}
              >
                Back to Videos
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const currentLessonData = lessons[currentLesson - 1];
  const VolumeIcon = getVolumeIcon();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[100vw] w-full h-[100vh] m-0 p-0 bg-black border-0 rounded-none overflow-hidden">
        <div className="relative w-full h-full overflow-y-auto overflow-x-hidden bg-gradient-to-b from-zinc-900 to-black">
          
          {/* Close Button - Hidden in fullscreen */}
          {!isFullscreen && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="fixed top-4 right-4 z-50 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white w-10 h-10"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
          
          {/* Video Player Section */}
          <div className="relative w-full" ref={containerRef}>
            <div className="relative w-full bg-black">
              {/* Fullscreen Container */}
              <div 
                ref={fullscreenContainerRef}
                className={`relative mx-auto ${isFullscreen ? 'w-full h-screen' : ''}`} 
                style={{ maxWidth: isFullscreen ? 'none' : '1400px' }}
              >
                <div className={`relative ${isFullscreen ? 'w-full h-full' : 'aspect-video w-full'}`}>
                  {/* Video Element */}
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    poster={video.thumbnail}
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('Video clicked, isPlaying:', isPlaying);
                      togglePlayPause();
                    }}
                    playsInline
                    preload="metadata"
                  >
                    <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Fullscreen Exit Button - Only visible in fullscreen */}
                  {isFullscreen && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onOpenChange(false)}
                      className={`absolute top-4 right-4 z-50 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white w-10 h-10 transition-opacity duration-300 ${
                        showControls ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                  
                  {/* Video Controls Overlay */}
                  <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent transition-opacity duration-300 ${
                    showControls ? 'opacity-100' : 'opacity-0'
                  } ${isFullscreen ? 'p-8 pb-12' : 'p-8 pb-12'}`}>
                    <div className={`mx-auto ${isFullscreen ? 'max-w-none' : 'max-w-[1400px]'}`}>
                      <div className="mb-4">
                        <p className="text-white/80 text-sm">Lesson {currentLesson} of {lessons.length}</p>
                        <h2 className={`text-white font-bold ${isFullscreen ? 'text-3xl' : 'text-2xl'}`}>
                          {currentLessonData?.title}
                        </h2>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="space-y-2 mb-4">
                        <Slider
                          value={[currentTime]}
                          max={duration || 100}
                          step={1}
                          onValueChange={handleSeek}
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
                          {/* Play/Pause */}
                          <Button 
                            size="icon" 
                            className={`rounded-full bg-white/20 backdrop-blur hover:bg-white/30 text-white ${
                              isFullscreen ? 'w-14 h-14' : 'w-12 h-12'
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('Play/Pause button clicked, current state:', isPlaying);
                              togglePlayPause();
                            }}
                          >
                            {isPlaying ? (
                              <Pause className={`${isFullscreen ? 'h-7 w-7' : 'h-6 w-6'}`} />
                            ) : (
                              <Play className={`${isFullscreen ? 'h-7 w-7' : 'h-6 w-6'} fill-white`} />
                            )}
                          </Button>
                          
                          {/* Skip Back */}
                          <Button 
                            size="icon" 
                            className={`rounded-full bg-white/20 backdrop-blur hover:bg-white/30 text-white ${
                              isFullscreen ? 'w-12 h-12' : 'w-10 h-10'
                            }`}
                            onClick={() => skipTime(-10)}
                          >
                            <SkipBack className={`${isFullscreen ? 'h-5 w-5' : 'h-4 w-4'}`} />
                          </Button>
                          
                          {/* Skip Forward */}
                          <Button 
                            size="icon" 
                            className={`rounded-full bg-white/20 backdrop-blur hover:bg-white/30 text-white ${
                              isFullscreen ? 'w-12 h-12' : 'w-10 h-10'
                            }`}
                            onClick={() => skipTime(10)}
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
                              onClick={toggleMute}
                            >
                              <VolumeIcon className={`${isFullscreen ? 'h-5 w-5' : 'h-4 w-4'}`} />
                            </Button>
                            <div className={`${isFullscreen ? 'w-28' : 'w-20'}`}>
                              <Slider
                                value={volume}
                                max={100}
                                step={1}
                                onValueChange={handleVolumeChange}
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
                                  onClick={() => handlePlaybackRateChange(rate)}
                                  className={playbackRate === rate ? 'bg-accent' : ''}
                                >
                                  {rate}x {rate === 1 && '(Normal)'}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                          
                          {/* Quality Settings */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                size="icon" 
                                className={`rounded-full bg-white/20 backdrop-blur hover:bg-white/30 text-white ${
                                  isFullscreen ? 'w-12 h-12' : 'w-10 h-10'
                                }`}
                              >
                                <Settings className={`${isFullscreen ? 'h-5 w-5' : 'h-4 w-4'}`} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <div className="p-2">
                                <p className="text-sm font-medium mb-2">Quality</p>
                                {['Auto', '1080p', '720p', '480p', '360p'].map((q) => (
                                  <DropdownMenuItem 
                                    key={q}
                                    onClick={() => setQuality(q)}
                                    className={quality === q ? 'bg-accent' : ''}
                                  >
                                    {q} {quality === q && <Check className="w-4 h-4 ml-auto" />}
                                  </DropdownMenuItem>
                                ))}
                              </div>
                              <div className="border-t p-2">
                                <p className="text-sm font-medium mb-2">Playback Speed</p>
                                <p className="text-sm text-muted-foreground">{playbackRate}x</p>
                              </div>
                              <div className="border-t p-2">
                                <p className="text-sm font-medium mb-2">Volume</p>
                                <p className="text-sm text-muted-foreground">{Math.round(volume[0])}%</p>
                              </div>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          
                          {/* Fullscreen Button */}
                          <Button 
                            size="icon" 
                            className={`rounded-full bg-white/20 backdrop-blur hover:bg-white/30 text-white ${
                              isFullscreen ? 'w-12 h-12' : 'w-10 h-10'
                            }`}
                            onClick={toggleFullscreen}
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
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Section - Hidden in fullscreen */}
          {!isFullscreen && (
            <div className="relative px-8 lg:px-12 pb-20">
              <div className="max-w-[1400px] mx-auto">
                
                {/* Title and Actions */}
                <div className="mb-8">
                  <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                    {video.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400 mb-6">
                    <span className="text-green-500 font-semibold">95% Match</span>
                    <span>{new Date().getFullYear()}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {video.duration}
                    </span>
                    <span className="px-2 py-0.5 border border-zinc-600 rounded text-xs">HD</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {video.views}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <Button 
                      size="lg" 
                      className="bg-white hover:bg-white/90 text-black font-bold rounded px-8"
                      onClick={togglePlayPause}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-5 h-5 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5 mr-2 fill-black" />
                          Play
                        </>
                      )}
                    </Button>
                    <Button size="lg" variant="outline" className="bg-zinc-800/80 hover:bg-zinc-700 text-white border-zinc-700 rounded px-8">
                      <Plus className="w-5 h-5 mr-2" />
                      My List
                    </Button>
                    <Button size="icon" variant="outline" className="rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white border-zinc-700 w-12 h-12">
                      <ThumbsUp className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="outline" className="rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white border-zinc-700 w-12 h-12">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                
                {/* Expert Info */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{video.expert}</p>
                    <p className="text-zinc-400 text-sm">Wellness Expert</p>
                  </div>
                </div>
                
                {/* Tabs Navigation */}
                <div className="border-b border-zinc-800 mb-8">
                  <div className="flex gap-8 overflow-x-auto">
                    {['Overview', 'Lessons', 'Practice', 'Community'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => handleTabChange(tab.toLowerCase())}
                        className={`pb-4 px-1 text-lg font-semibold transition-all relative whitespace-nowrap ${
                          activeTab === tab.toLowerCase() ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {tab}
                        {activeTab === tab.toLowerCase() && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500 rounded-t" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Tab Content */}
                <div className="pb-12">
                  {activeTab === 'overview' && (
                    <div className="grid lg:grid-cols-3 gap-8">
                      {/* Stats Cards */}
                      <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-6 border border-zinc-800">
                          <div className="flex items-center gap-3 mb-2">
                            <BookOpen className="w-5 h-5 text-purple-400" />
                            <span className="text-2xl font-bold text-white">{lessons.length} Lessons</span>
                          </div>
                          <p className="text-zinc-500 text-sm">Interactive content</p>
                        </div>
                        <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-6 border border-zinc-800">
                          <div className="flex items-center gap-3 mb-2">
                            <ThumbsUp className="w-5 h-5 text-blue-400" />
                            <span className="text-2xl font-bold text-white">80K Liked</span>
                          </div>
                          <p className="text-zinc-500 text-sm">Community approved</p>
                        </div>
                        <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-6 border border-zinc-800">
                          <div className="flex items-center gap-3 mb-2">
                            <Users className="w-5 h-5 text-green-400" />
                            <span className="text-2xl font-bold text-white">88,800 Enrolled</span>
                          </div>
                          <p className="text-zinc-500 text-sm">Active learners</p>
                        </div>
                      </div>
                      
                      {/* Main Content */}
                      <div className="lg:col-span-2">
                        <h2 className="text-3xl font-bold text-white mb-4">Transform your wellness journey!</h2>
                        <p className="text-zinc-300 text-lg leading-relaxed mb-6">
                          {video.fullDescription || video.description}
                        </p>
                        
                        {video.learningObjectives && (
                          <div className="mt-8">
                            <h3 className="text-xl font-bold text-white mb-4">What you'll learn</h3>
                            <div className="space-y-3">
                              {video.learningObjectives.map((objective, index) => (
                                <div key={index} className="flex items-start gap-3">
                                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Check className="w-3 h-3 text-purple-400" />
                                  </div>
                                  <span className="text-zinc-300">{objective}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Sidebar */}
                      <div className="lg:col-span-1">
                        <div className="bg-zinc-900/50 backdrop-blur rounded-lg p-6 border border-zinc-800">
                          <h3 className="text-lg font-bold text-white mb-4">Course Details</h3>
                          <div className="space-y-4">
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Category</span>
                              <span className="text-white">{video.category}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Level</span>
                              <span className="text-white">All Levels</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Rating</span>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="text-white">{video.rating}</span>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Access</span>
                              <span className="text-white capitalize">{video.accessTier}</span>
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white"
                            onClick={togglePlayPause}
                          >
                            {isPlaying ? (
                              <>
                                <Pause className="w-4 h-4 mr-2" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2 fill-white" />
                                Continue Learning
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'lessons' && (
                    <div className="space-y-4">
                      {lessons.map((lesson, index) => {
                        const canWatchLesson = canWatchVideo(lesson as any, []);
                        return (
                          <div 
                            key={lesson.id}
                            onClick={() => handleLessonSelect(lesson.id)}
                            className={`flex gap-4 p-4 rounded-lg transition-all ${
                              currentLesson === lesson.id 
                                ? 'bg-zinc-800/80 border border-purple-500/50' 
                                : canWatchLesson
                                ? 'bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800/50 cursor-pointer'
                                : 'bg-zinc-900/30 border border-zinc-800 opacity-60'
                            }`}
                          >
                            <div className="text-2xl font-bold text-zinc-600 w-12">{index + 1}</div>
                            <div className="relative flex-shrink-0">
                              <img 
                                src={lesson.thumbnail} 
                                alt={lesson.title}
                                className="w-32 h-20 object-cover rounded"
                              />
                              <div className="absolute inset-0 bg-black/40 rounded flex items-center justify-center">
                                {canWatchLesson ? (
                                  <Play className="w-8 h-8 text-white/80" />
                                ) : (
                                  <Lock className="w-6 h-6 text-white/60" />
                                )}
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-white font-semibold mb-1">{lesson.title}</h3>
                              <p className="text-zinc-400 text-sm mb-2">{lesson.description}</p>
                              <div className="flex items-center gap-3">
                                <span className="text-zinc-500 text-xs">{lesson.duration}</span>
                                {lesson.accessTier === 'premium' && !lesson.isFirstEpisode && (
                                  <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                                    <Crown className="w-3 h-3 mr-1" />
                                    Premium
                                  </Badge>
                                )}
                                {lesson.isFirstEpisode && (
                                  <Badge className="bg-green-500/20 text-green-400 text-xs">
                                    Free
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {currentLesson === lesson.id && canWatchLesson && (
                              <div className="text-purple-400 text-sm self-center">Currently Playing</div>
                            )}
                            {!canWatchLesson && (
                              <div className="text-orange-400 text-sm self-center">
                                <Crown className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  {activeTab === 'practice' && (
                    <div className="space-y-6">
                      <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
                        <h3 className="text-xl font-bold text-white mb-4">Test Your Knowledge</h3>
                        <p className="text-zinc-400 mb-6">Answer these questions to reinforce your learning</p>
                        
                        {practiceQuestions.map((q, index) => (
                          <div key={q.id} className="mb-8 pb-8 border-b border-zinc-800 last:border-0">
                            <h4 className="text-white font-semibold mb-4">
                              Question {index + 1}: {q.question}
                            </h4>
                            <div className="space-y-3">
                              {q.options.map((option, optionIndex) => (
                                <label
                                  key={optionIndex}
                                  className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                                    selectedAnswers[q.id] === optionIndex
                                      ? 'bg-purple-900/30 border-purple-500'
                                      : 'bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`question-${q.id}`}
                                    className="mr-3"
                                    checked={selectedAnswers[q.id] === optionIndex}
                                    onChange={() => handleAnswerSelect(q.id, optionIndex)}
                                  />
                                  <span className="text-white">{option}</span>
                                  {showResults && q.correctAnswer === optionIndex && (
                                    <Check className="w-5 h-5 text-green-500 ml-auto" />
                                  )}
                                  {showResults && selectedAnswers[q.id] === optionIndex && q.correctAnswer !== optionIndex && (
                                    <X className="w-5 h-5 text-red-500 ml-auto" />
                                  )}
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                        
                        <div className="flex gap-4">
                          <Button 
                            onClick={() => setShowResults(!showResults)}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            {showResults ? 'Hide Results' : 'Check Answers'}
                          </Button>
                          {showResults && (
                            <Button 
                              onClick={handleQuizReset}
                              variant="outline"
                              className="border-zinc-700 text-white hover:bg-zinc-800"
                            >
                              Reset Quiz
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'community' && (
                    <div className="space-y-6">
                      {/* Post Input */}
                      <div className="bg-zinc-900/50 rounded-lg p-6 border border-zinc-800">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500"></div>
                          <div className="flex-1">
                            <textarea 
                              placeholder="Share your thoughts, experiences, or success story..."
                              className="w-full bg-zinc-800 text-white placeholder-zinc-500 rounded-lg p-3 border border-zinc-700 focus:border-purple-500 focus:outline-none resize-none"
                              rows={3}
                            />
                            <div className="flex justify-end mt-3">
                              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                                Share
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                   
                      <div className="text-center">
                        <Button variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                          Load More Posts
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;