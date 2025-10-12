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

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    video: videoRef.current,
    hls: hlsRef.current,
    play: async () => {
      if (videoRef.current) {
        await videoRef.current.play();
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
        videoRef.current.volume = volume;
      }
    },
    setPlaybackRate: (rate: number) => {
      if (videoRef.current) {
        videoRef.current.playbackRate = rate;
      }
    }
  }));

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Check if HLS is supported
    if (Hls.isSupported()) {
      console.log('🎥 HLS.js is supported, initializing...');
      
      // Create HLS instance
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
      });

      hlsRef.current = hls;

      // Load HLS manifest
      hls.loadSource(src);
      hls.attachMedia(video);

      // HLS Events
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('✅ HLS manifest parsed successfully');
        setIsLoading(false);
        setError(null);
        
        if (autoPlay) {
          video.play().catch(err => {
            console.error('Autoplay failed:', err);
          });
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('❌ HLS Error:', data);
        
        if (data.fatal) {
          setError(data.type);
          onError?.(data);
          
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('Fatal network error, trying to recover...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('Fatal media error, trying to recover...');
              hls.recoverMediaError();
              break;
            default:
              console.error('Fatal error, cannot recover');
              hls.destroy();
              break;
          }
        }
      });

      hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
        console.log('📊 Quality level loaded:', data.level);
      });

      hls.on(Hls.Events.FRAG_LOADED, (event, data) => {
        console.log('📦 Fragment loaded:', data.frag.sn);
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
      onError?.({ message: 'HLS not supported' });
    }

    return () => {
      // Cleanup
      if (hlsRef.current) {
        console.log('🧹 Cleaning up HLS instance');
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, autoPlay, onError]);

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

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
    };
  }, [onPlay, onPause, onTimeUpdate, onDurationChange]);

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        className={className || "w-full h-full object-cover"}
        poster={poster}
        playsInline
        preload="metadata"
        controls={false} // We'll use custom controls
      />
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center text-white p-6">
            <p className="text-lg font-semibold mb-2">Playback Error</p>
            <p className="text-sm text-white/70">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
});

HLSVideoPlayer.displayName = 'HLSVideoPlayer';

export default HLSVideoPlayer;