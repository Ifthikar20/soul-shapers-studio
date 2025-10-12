import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import Hls from 'hls.js';

interface HLSVideoPlayerProps {
  src: string; // HLS manifest URL (.m3u8)
  poster?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onDurationChange?: (duration: number) => void;
  onError?: (error: any) => void;
  className?: string;
  autoPlay?: boolean;
}

// Export the ref type so VideoModal can use it
export interface HLSVideoPlayerRef {
  video: HTMLVideoElement | null;
  hls: Hls | null;
  play: () => Promise<void>;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getBufferedPercentage: () => number;
}

const HLSVideoPlayer = forwardRef<HLSVideoPlayerRef, HLSVideoPlayerProps>(({
  src,
  poster,
  onPlay,
  onPause,
  onTimeUpdate,
  onDurationChange,
  onError,
  className,
  autoPlay = false
}, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    video: videoRef.current,
    hls: hlsRef.current,
    play: async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.play();
        } catch (err) {
          console.error('Play failed:', err);
          throw err;
        }
      }
    },
    pause: () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    },
    seek: (time: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = time;
      }
    },
    setVolume: (volume: number) => {
      if (videoRef.current) {
        videoRef.current.volume = Math.max(0, Math.min(1, volume));
      }
    },
    setPlaybackRate: (rate: number) => {
      if (videoRef.current) {
        videoRef.current.playbackRate = rate;
      }
    },
    getCurrentTime: () => {
      return videoRef.current?.currentTime || 0;
    },
    getDuration: () => {
      return videoRef.current?.duration || 0;
    },
    getBufferedPercentage: () => {
      const video = videoRef.current;
      if (!video || !video.buffered.length) return 0;
      
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      return (bufferedEnd / video.duration) * 100;
    }
  }));

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Reset error and retry count when src changes
    setError(null);
    setRetryCount(0);

    // Check if HLS is supported
    if (Hls.isSupported()) {
      console.log('🎥 HLS.js is supported, initializing...');
      
      // Create HLS instance with optimized settings
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        maxBufferSize: 60 * 1000 * 1000,
        maxBufferHole: 0.5,
        highBufferWatchdogPeriod: 2,
        nudgeOffset: 0.1,
        nudgeMaxRetry: 3,
        maxFragLookUpTolerance: 0.25,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: Infinity,
        liveDurationInfinity: false,
        preferManagedMediaSource: true,
        // Retry configuration
        manifestLoadingTimeOut: 10000,
        manifestLoadingMaxRetry: 4,
        manifestLoadingRetryDelay: 1000,
        levelLoadingTimeOut: 10000,
        levelLoadingMaxRetry: 4,
        fragLoadingTimeOut: 20000,
        fragLoadingMaxRetry: 6,
      });

      hlsRef.current = hls;

      // Load HLS manifest
      hls.loadSource(src);
      hls.attachMedia(video);

      // HLS Events
      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        console.log('✅ HLS manifest parsed successfully');
        console.log('📊 Available qualities:', data.levels.map(l => `${l.height}p`));
        setIsLoading(false);
        setError(null);
        
        if (autoPlay) {
          video.play().catch(err => {
            console.error('Autoplay failed:', err);
            // Autoplay blocked - this is expected behavior
          });
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('❌ HLS Error:', data);
        
        if (data.fatal) {
          const errorMessage = getErrorMessage(data);
          setError(errorMessage);
          onError?.(data);
          
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('Fatal network error encountered');
              
              // Retry mechanism for network errors
              if (retryCount < MAX_RETRIES) {
                console.log(`🔄 Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
                setRetryCount(prev => prev + 1);
                
                setTimeout(() => {
                  hls.startLoad();
                }, 1000 * (retryCount + 1)); // Exponential backoff
              } else {
                console.error('Max retries reached');
                setError('Network error: Unable to load video after multiple attempts');
              }
              break;
              
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('Fatal media error encountered');
              
              // Try to recover from media errors
              if (retryCount < MAX_RETRIES) {
                console.log('🔧 Attempting to recover from media error...');
                setRetryCount(prev => prev + 1);
                hls.recoverMediaError();
              } else {
                console.error('Cannot recover from media error');
                setError('Media error: Unable to play this video');
              }
              break;
              
            default:
              console.error('Fatal error, cannot recover');
              setError('Playback error: ' + errorMessage);
              hls.destroy();
              break;
          }
        } else {
          // Non-fatal errors
          console.warn('⚠️ Non-fatal HLS error:', data);
        }
      });

      hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
        console.log('📊 Quality level loaded:', data.level, `(${data.details.totalduration}s)`);
      });

      hls.on(Hls.Events.FRAG_LOADED, (event, data) => {
        console.log('📦 Fragment loaded:', data.frag.sn, `(${data.frag.duration.toFixed(2)}s)`);
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        console.log('🔄 Quality switched to level:', data.level);
      });

      hls.on(Hls.Events.BUFFER_APPENDED, (event, data) => {
        console.log('💾 Buffer appended');
      });

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      console.log('🍎 Native HLS support detected (Safari)');
      video.src = src;
      setIsLoading(false);
      
      if (autoPlay) {
        video.play().catch(err => {
          console.error('Autoplay failed:', err);
        });
      }
    } else {
      console.error('❌ HLS not supported in this browser');
      setError('HLS playback not supported in this browser');
      onError?.({ 
        type: 'browser_support',
        message: 'HLS not supported' 
      });
    }

    return () => {
      // Cleanup
      if (hlsRef.current) {
        console.log('🧹 Cleaning up HLS instance');
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, autoPlay, onError]); // Removed retryCount from dependencies to prevent recreation

  // Helper function to get user-friendly error messages
  const getErrorMessage = (data: any): string => {
    if (data.details === Hls.ErrorDetails.MANIFEST_LOAD_ERROR) {
      return 'Failed to load video manifest';
    } else if (data.details === Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT) {
      return 'Video loading timed out';
    } else if (data.details === Hls.ErrorDetails.FRAG_LOAD_ERROR) {
      return 'Failed to load video segment';
    } else if (data.details === Hls.ErrorDetails.FRAG_LOAD_TIMEOUT) {
      return 'Video segment loading timed out';
    } else if (data.details === Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
      return 'Video playback stalled';
    } else if (data.details === Hls.ErrorDetails.MANIFEST_PARSING_ERROR) {
      return 'Invalid video format';
    } else {
      return data.details || 'Unknown error';
    }
  };

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      console.log('▶️ Video playing');
      onPlay?.();
    };

    const handlePause = () => {
      console.log('⏸️ Video paused');
      onPause?.();
    };

    const handleTimeUpdate = () => {
      onTimeUpdate?.(video.currentTime);
    };

    const handleDurationChange = () => {
      console.log('⏱️ Duration:', video.duration);
      onDurationChange?.(video.duration);
    };

    const handleLoadStart = () => {
      console.log('⏳ Video loading started');
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      console.log('✅ Video can play');
      setIsLoading(false);
    };

    const handleWaiting = () => {
      console.log('⏳ Video buffering');
      setIsLoading(true);
    };

    const handlePlaying = () => {
      console.log('▶️ Video playing after buffering');
      setIsLoading(false);
    };

    const handleError = (e: Event) => {
      console.error('❌ Video element error:', e);
      const videoError = video.error;
      
      if (videoError) {
        let errorMsg = 'Video playback error';
        
        switch (videoError.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMsg = 'Video loading was aborted';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMsg = 'Network error while loading video';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMsg = 'Video decoding error';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMsg = 'Video format not supported';
            break;
        }
        
        setError(errorMsg);
        onError?.({
          type: 'video_element',
          code: videoError.code,
          message: errorMsg
        });
      }
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('error', handleError);
    };
  }, [onPlay, onPause, onTimeUpdate, onDurationChange, onError]);

  return (
    <div className="relative w-full h-full bg-black">
      <video
        ref={videoRef}
        className={className || "w-full h-full object-cover"}
        poster={poster}
        playsInline
        preload="metadata"
        controls={false} // We'll use custom controls
        crossOrigin="anonymous" // Important for secure video streaming
      />
      
      {/* Loading Indicator */}
      {isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90">
          <div className="text-center text-white p-6 max-w-md">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-lg font-semibold mb-2">Playback Error</p>
            <p className="text-sm text-white/70">{error}</p>
            {retryCount >= MAX_RETRIES && (
              <p className="text-xs text-white/50 mt-2">
                Please refresh the page or try again later
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

HLSVideoPlayer.displayName = 'HLSVideoPlayer';

export default HLSVideoPlayer;