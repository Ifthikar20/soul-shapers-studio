import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import {
  Play, Pause, Volume2, VolumeX,
  Settings, SkipBack, SkipForward, Loader2, AlertCircle
} from 'lucide-react';

export type HLSAudioPlayerRef = HTMLAudioElement;

interface HLSAudioPlayerProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  onError?: (error: any) => void;
  onPlay?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onDurationChange?: (duration: number) => void;
  onPause?: (currentTime: number) => void;
  onSeek?: (fromPosition: number, toPosition: number) => void;
  onComplete?: () => void;
  audioTitle?: string;
  expertName?: string;
}

const HLSAudioPlayer = React.forwardRef<HLSAudioPlayerRef, HLSAudioPlayerProps>(({
  src,
  className = '',
  autoPlay = false,
  onError,
  onPlay,
  onTimeUpdate,
  onDurationChange,
  onPause,
  onSeek,
  onComplete,
  audioTitle = '',
  expertName = ''
}, forwardedRef) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const lastSeekPositionRef = useRef<number>(0);

  // Audio state
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Initialize HLS
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    // Forward ref
    if (forwardedRef) {
      if (typeof forwardedRef === 'function') {
        forwardedRef(audio);
      } else {
        forwardedRef.current = audio;
      }
    }

    console.log('🎵 Initializing HLS Audio Player');
    console.log('🔊 Source URL:', src);

    // Check if src is an HLS manifest (.m3u8) or regular audio file
    const isHlsManifest = src.includes('.m3u8') || src.includes('manifest');
    console.log('📋 HLS Manifest detected:', isHlsManifest);

    if (isHlsManifest) {
      // HLS.js support for chunked streaming
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
        hls.attachMedia(audio);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('✅ HLS Audio Manifest loaded successfully');
          setIsLoading(false);
          if (autoPlay) {
            audio.play().catch(err => {
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
                setError(`Network error: ${data.details}`);
                console.log('🔄 Attempting to recover...');
                hls.startLoad();
                if (onError) onError(data);
                break;

              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error('🎵 MEDIA ERROR');
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
      else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
        console.log('✅ Using native HLS support (Safari)');
        audio.src = src;

        audio.addEventListener('loadedmetadata', () => {
          setIsLoading(false);
        });

        if (autoPlay) {
          audio.play().catch(err => {
            console.warn('⚠️ Autoplay prevented:', err.message);
          });
        }

        audio.addEventListener('error', () => {
          const mediaError = audio.error;
          console.error('❌ Audio element error:', mediaError);

          let errorMsg = 'Audio playback error';
          if (mediaError) {
            switch (mediaError.code) {
              case MediaError.MEDIA_ERR_NETWORK:
                errorMsg = 'Network error while loading audio';
                break;
              case MediaError.MEDIA_ERR_DECODE:
                errorMsg = 'Error decoding audio';
                break;
              case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                errorMsg = 'Audio format not supported';
                break;
            }
          }

          setError(errorMsg);
          setIsLoading(false);
          if (onError) onError(mediaError);
        });

        return () => {
          audio.removeEventListener('error', () => {});
          audio.removeEventListener('loadedmetadata', () => {});
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
    } else {
      // Regular audio file (non-HLS) - direct playback
      console.log('🎵 Using direct audio playback (non-HLS)');
      audio.src = src;

      audio.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
      });

      if (autoPlay) {
        audio.play().catch(err => {
          console.warn('⚠️ Autoplay prevented:', err.message);
        });
      }

      audio.addEventListener('error', () => {
        const mediaError = audio.error;
        console.error('❌ Audio element error:', mediaError);

        let errorMsg = 'Audio playback error';
        if (mediaError) {
          switch (mediaError.code) {
            case MediaError.MEDIA_ERR_NETWORK:
              errorMsg = 'Network error while loading audio';
              break;
            case MediaError.MEDIA_ERR_DECODE:
              errorMsg = 'Error decoding audio';
              break;
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMsg = 'Audio format not supported';
              break;
          }
        }

        setError(errorMsg);
        setIsLoading(false);
        if (onError) onError(mediaError);
      });

      return () => {
        audio.removeEventListener('error', () => {});
        audio.removeEventListener('loadedmetadata', () => {});
      };
    }
  }, [src, autoPlay, onError, forwardedRef]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const time = audio.currentTime;
      setCurrentTime(time);
      if (onTimeUpdate) onTimeUpdate(time);
    };

    const handleDurationChange = () => {
      const dur = audio.duration;
      setDuration(dur);
      if (onDurationChange) onDurationChange(dur);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      if (onPlay) onPlay();
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (onPause) onPause(audio.currentTime);
    };

    const handleSeeking = () => {
      lastSeekPositionRef.current = audio.currentTime;
    };

    const handleSeeked = () => {
      if (onSeek) {
        onSeek(lastSeekPositionRef.current, audio.currentTime);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onComplete) onComplete();
    };

    const handleVolumeChange = () => {
      setVolume(audio.volume);
      setIsMuted(audio.muted);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('seeking', handleSeeking);
    audio.addEventListener('seeked', handleSeeked);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('volumechange', handleVolumeChange);

    // Set initial volume
    audio.volume = volume;

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('seeking', handleSeeking);
      audio.removeEventListener('seeked', handleSeeked);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [volume, onTimeUpdate, onDurationChange, onPause, onPlay, onSeek, onComplete]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const handleSkip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.currentTime + seconds, duration));
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressBarRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    if (newVolume > 0) audio.muted = false;
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
  };

  const handleSpeedChange = (speed: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = speed;
    setPlaybackSpeed(speed);
    setShowSettings(false);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Audio Element (hidden) */}
      <audio
        ref={audioRef}
        className="hidden"
        preload="metadata"
      />

      {/* Audio Player UI */}
      <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 rounded-2xl p-6 shadow-2xl">
        {/* Title Section */}
        {(audioTitle || expertName) && (
          <div className="mb-6 text-center">
            {audioTitle && <h3 className="text-white text-xl font-semibold mb-1">{audioTitle}</h3>}
            {expertName && <p className="text-purple-200 text-sm">{expertName}</p>}
          </div>
        )}

        {/* Loading State */}
        {isLoading && !error && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 text-purple-300 animate-spin" />
            <span className="ml-3 text-purple-200">Loading audio...</span>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="flex items-center justify-center py-8">
            <div className="bg-red-500/10 border border-red-500/50 text-white p-4 rounded-xl max-w-md text-center backdrop-blur-sm">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="font-bold mb-1">Playback Error</p>
              <p className="text-sm text-red-200">{error}</p>
            </div>
          </div>
        )}

        {/* Player Controls */}
        {!isLoading && !error && (
          <>
            {/* Progress Bar */}
            <div className="mb-6">
              <div
                ref={progressBarRef}
                onClick={handleProgressClick}
                className="relative h-2 bg-white/10 rounded-full cursor-pointer group hover:h-3 transition-all"
              >
                <div
                  className="absolute h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform" />
                </div>
              </div>

              {/* Time Display */}
              <div className="flex justify-between mt-2">
                <span className="text-purple-200 text-sm font-medium">{formatTime(currentTime)}</span>
                <span className="text-purple-200 text-sm font-medium">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main Controls */}
            <div className="flex items-center justify-between">
              {/* Left: Skip Back */}
              <button
                onClick={() => handleSkip(-10)}
                className="p-3 rounded-full hover:bg-white/10 text-white transition-all"
                disabled={!!error}
              >
                <SkipBack className="w-5 h-5" />
              </button>

              {/* Center: Play/Pause */}
              <button
                onClick={togglePlayPause}
                className="p-4 rounded-full bg-white hover:bg-purple-100 text-purple-900 transition-all shadow-lg hover:scale-105"
                disabled={!!error}
              >
                {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-0.5" />}
              </button>

              {/* Right: Skip Forward */}
              <button
                onClick={() => handleSkip(10)}
                className="p-3 rounded-full hover:bg-white/10 text-white transition-all"
                disabled={!!error}
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
              {/* Volume Control */}
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
                    className="w-24"
                    onMouseLeave={() => setShowVolumeSlider(false)}
                  >
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                    />
                  </div>
                )}
              </div>

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
                    <p className="text-gray-400 text-xs mb-2">Playback Speed</p>
                    <div className="grid grid-cols-2 gap-1">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                        <button
                          key={speed}
                          onClick={() => handleSpeedChange(speed)}
                          className={`px-2 py-1 rounded text-sm ${playbackSpeed === speed ? 'bg-purple-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

HLSAudioPlayer.displayName = 'HLSAudioPlayer';

export default HLSAudioPlayer;
