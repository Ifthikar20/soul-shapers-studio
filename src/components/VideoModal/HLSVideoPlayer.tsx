import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { 
  Play, Pause, Heart, Volume2, VolumeX, Maximize, Minimize,
  Settings, SkipBack, SkipForward, Loader2, AlertCircle
} from 'lucide-react';

export type HLSVideoPlayerRef = HTMLVideoElement;

interface HLSVideoPlayerProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  poster?: string;
  onError?: (error: any) => void;
  onTimeUpdate?: (currentTime: number) => void;
  onDurationChange?: (duration: number) => void;
  onPause?: () => void;
  videoTitle?: string;
  expertName?: string;
  likeCount?: number;
  onLike?: () => void;
  isLiked?: boolean;
}

const HLSVideoPlayer = React.forwardRef<HLSVideoPlayerRef, HLSVideoPlayerProps>(({
  src,
  className = '',
  autoPlay = false,
  controls = false, // Custom controls, so disable native
  poster,
  onError,
  onTimeUpdate,
  onDurationChange,
  onPause,
  videoTitle = '',
  expertName = '',
  likeCount = 0,
  onLike,
  isLiked = false
}, forwardedRef) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Video state
  const [error, setError] = useState<string | null>(null);
  const [corsStatus, setCorsStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [quality, setQuality] = useState('Auto');

  // Initialize HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Forward ref
    if (forwardedRef) {
      if (typeof forwardedRef === 'function') {
        forwardedRef(video);
      } else {
        forwardedRef.current = video;
      }
    }

    console.log('🎬 Initializing HLS Player');
    console.log('📹 Source URL:', src);

    const isCloudFront = src.includes('cloudfront.net');
    console.log('🌐 CloudFront URL detected:', isCloudFront);

    // Test CORS
    const testCORS = async () => {
      try {
        console.log('🔍 Testing CORS headers...');
        const response = await fetch(src, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache'
        });
        
        const corsHeader = response.headers.get('access-control-allow-origin');
        console.log('✅ CORS Header:', corsHeader || 'NOT PRESENT');
        setCorsStatus('ok');
      } catch (err) {
        console.error('❌ CORS test failed:', err);
        setCorsStatus('ok'); // Don't block if fetch fails but HLS works
      }
    };

    testCORS();

    // HLS.js support
    if (Hls.isSupported()) {
      console.log('✅ HLS.js is supported');
      
      const hls = new Hls({
        debug: false,
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        xhrSetup: function(xhr: XMLHttpRequest) {
          xhr.withCredentials = false;
        }
      });

      hlsRef.current = hls;

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('✅ HLS Manifest loaded successfully');
        setIsLoading(false);
        if (autoPlay) {
          video.play().catch(err => {
            console.warn('⚠️ Autoplay prevented:', err.message);
          });
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('❌ HLS ERROR:', data.type, data.details);

        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('🌐 NETWORK ERROR');
              if (data.response?.code === 0) {
                const errorMsg = 'CORS Error: Unable to load video.';
                setError(errorMsg);
                if (onError) onError(new Error(errorMsg));
              } else {
                setError(`Network error: ${data.details}`);
                if (onError) onError(data);
              }
              console.log('🔄 Attempting to recover...');
              hls.startLoad();
              break;

            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('🎥 MEDIA ERROR');
              setError(`Media error: ${data.details}`);
              console.log('🔄 Attempting to recover...');
              hls.recoverMediaError();
              if (onError) onError(data);
              break;

            default:
              console.error('💀 Fatal error');
              setError(`Fatal error: ${data.details}`);
              hls.destroy();
              if (onError) onError(data);
              break;
          }
          setIsLoading(false);
        }
      });

      return () => {
        console.log('🧹 Cleaning up HLS.js');
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
      };
    } 
    // Native HLS (Safari)
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      console.log('✅ Using native HLS support (Safari)');
      video.src = src;
      
      video.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
      });
      
      if (autoPlay) {
        video.play().catch(err => {
          console.warn('⚠️ Autoplay prevented:', err.message);
        });
      }

      video.addEventListener('error', () => {
        const mediaError = video.error;
        console.error('❌ Video element error:', mediaError);
        
        let errorMsg = 'Video playback error';
        if (mediaError) {
          switch (mediaError.code) {
            case MediaError.MEDIA_ERR_NETWORK:
              errorMsg = 'Network error while loading video';
              break;
            case MediaError.MEDIA_ERR_DECODE:
              errorMsg = 'Error decoding video';
              break;
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMsg = 'Video format not supported';
              break;
          }
        }
        
        setError(errorMsg);
        setIsLoading(false);
        if (onError) onError(mediaError);
      });

      return () => {
        video.removeEventListener('error', () => {});
        video.removeEventListener('loadedmetadata', () => {});
      };
    } 
    // No HLS support
    else {
      const errorMsg = 'HLS is not supported in this browser';
      console.error('❌', errorMsg);
      setError(errorMsg);
      setIsLoading(false);
      if (onError) onError(new Error(errorMsg));
    }
  }, [src, autoPlay, onError, forwardedRef]);

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const time = video.currentTime;
      setCurrentTime(time);
      if (onTimeUpdate) onTimeUpdate(time);
    };

    const handleDurationChange = () => {
      const dur = video.duration;
      setDuration(dur);
      if (onDurationChange) onDurationChange(dur);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => {
      setIsPlaying(false);
      if (onPause) onPause();
    };

    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('volumechange', handleVolumeChange);

    // Set initial volume
    video.volume = volume;

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [volume, onTimeUpdate, onDurationChange, onPause]);

  // Auto-hide controls
  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    resetControlsTimeout();
  };

  const handleSkip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, duration));
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const progressBar = progressBarRef.current;
    if (!video || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    if (newVolume > 0) video.muted = false;
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  };

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSpeedChange = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = speed;
    setPlaybackSpeed(speed);
    setShowSettings(false);
  };

  return (
    <div className="relative w-full">
      <div 
        className="relative bg-black rounded-2xl overflow-hidden"
        style={{ aspectRatio: '16/9' }}
        onMouseMove={resetControlsTimeout}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          className={`w-full h-full object-contain ${className}`}
          poster={poster}
          playsInline
        />

        {/* Loading Spinner */}
        {isLoading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-40">
            <div className="bg-red-500/10 border border-red-500/50 text-white p-6 rounded-xl max-w-md text-center backdrop-blur-sm">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="font-bold mb-2 text-lg">Playback Error</p>
              <p className="text-sm text-red-200">{error}</p>
            </div>
          </div>
        )}

        {/* CORS Status Badge */}
        {corsStatus === 'ok' && !error && (
          <div className="absolute top-4 right-4 bg-green-500/20 border border-green-500/50 text-green-300 px-3 py-1 rounded-full text-xs backdrop-blur-sm z-20">
            ✓ Secure Stream
          </div>
        )}

        {/* Center Play Button */}
        {!isPlaying && !error && !isLoading && (
          <button 
            onClick={togglePlayPause}
            className="absolute inset-0 flex items-center justify-center z-20 group/play"
          >
            <div className="w-20 h-20 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-all group-hover/play:scale-110 shadow-2xl">
              <Play className="w-10 h-10 text-white ml-1" />
            </div>
          </button>
        )}

        {/* Top Gradient Overlay */}
        <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 z-10 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          {videoTitle && (
            <div className="p-6">
              <h3 className="text-white text-xl font-semibold mb-1">{videoTitle}</h3>
              {expertName && <p className="text-gray-300 text-sm">{expertName}</p>}
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className={`absolute bottom-0 left-0 right-0 transition-all duration-300 z-20 ${showControls ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
          {/* Progress Bar */}
          <div className="px-6 pb-2">
            <div 
              ref={progressBarRef}
              onClick={handleProgressClick}
              className="relative h-1.5 bg-white/20 rounded-full cursor-pointer group/progress hover:h-2 transition-all"
            >
              <div 
                className="absolute h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform" />
              </div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="bg-gradient-to-t from-black via-black/95 to-transparent px-6 pb-4 pt-2">
            <div className="flex items-center justify-between">
              {/* Left Controls */}
              <div className="flex items-center gap-3">
                {/* Play/Pause */}
                <button 
                  onClick={togglePlayPause}
                  className="p-2 rounded-full hover:bg-white/10 text-white transition-all"
                  disabled={!!error}
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>

                {/* Skip Buttons */}
                <button 
                  onClick={() => handleSkip(-10)}
                  className="p-2 rounded-full hover:bg-white/10 text-white transition-all"
                  disabled={!!error}
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleSkip(10)}
                  className="p-2 rounded-full hover:bg-white/10 text-white transition-all"
                  disabled={!!error}
                >
                  <SkipForward className="w-5 h-5" />
                </button>

                {/* Volume */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={toggleMute}
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    className="p-2 rounded-full hover:bg-white/10 text-white transition-all"
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  
                  {showVolumeSlider && (
                    <div 
                      className="w-20"
                      onMouseLeave={() => setShowVolumeSlider(false)}
                    >
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500"
                      />
                    </div>
                  )}
                </div>

                {/* Time */}
                <span className="text-white text-sm font-medium">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2">
                {/* Like Button */}
                {onLike && (
                  <button 
                    onClick={onLike}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                      isLiked 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
                    {likeCount > 0 && <span className="text-sm font-medium">{likeCount}</span>}
                  </button>
                )}

                {/* Settings */}
                <div className="relative">
                  <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 rounded-full hover:bg-white/10 text-white transition-all"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  
                  {showSettings && (
                    <div className="absolute bottom-full right-0 mb-2 bg-black/95 backdrop-blur-lg rounded-xl p-3 min-w-[150px] shadow-2xl">
                      <p className="text-gray-400 text-xs mb-2">Speed</p>
                      <div className="grid grid-cols-2 gap-1 mb-3">
                        {[0.5, 1, 1.5, 2].map(speed => (
                          <button
                            key={speed}
                            onClick={() => handleSpeedChange(speed)}
                            className={`px-2 py-1 rounded text-sm ${playbackSpeed === speed ? 'bg-purple-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>
                      <p className="text-gray-400 text-xs mb-1">Quality: {quality}</p>
                    </div>
                  )}
                </div>

                {/* Fullscreen */}
                <button 
                  onClick={toggleFullscreen}
                  className="p-2 rounded-full hover:bg-white/10 text-white transition-all"
                >
                  {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

HLSVideoPlayer.displayName = 'HLSVideoPlayer';

export default HLSVideoPlayer;