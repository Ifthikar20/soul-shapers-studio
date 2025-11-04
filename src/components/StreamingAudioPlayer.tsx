// src/components/StreamingAudioPlayer.tsx - HLS Audio Player with Backend Integration

import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  SkipBack,
  SkipForward,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { audioStreamingService, AudioStreamingUrlResponse } from '../services/audio.service';

export interface StreamingAudioPlayerProps {
  contentId: string;
  autoplay?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: Error) => void;
  onTimeUpdate?: (time: number) => void;
  className?: string;
  showMetadata?: boolean;
}

export const StreamingAudioPlayer: React.FC<StreamingAudioPlayerProps> = ({
  contentId,
  autoplay = false,
  onPlay,
  onPause,
  onEnded,
  onError,
  onTimeUpdate,
  className = '',
  showMetadata = true,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streamData, setStreamData] = useState<AudioStreamingUrlResponse | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Fetch streaming URL on mount or when contentId changes
  useEffect(() => {
    let isMounted = true;

    const loadStreamingUrl = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(`🎵 Loading audio streaming URL for content: ${contentId}`);

        const data = await audioStreamingService.getAudioStreamingUrl(contentId);

        if (isMounted) {
          setStreamData(data);
          console.log('✅ Audio streaming data loaded:', data);
        }
      } catch (err: any) {
        console.error('❌ Failed to load audio streaming URL:', err);

        if (isMounted) {
          const errorMessage = err.message || 'Failed to load audio';
          setError(errorMessage);

          if (onError) {
            onError(err);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadStreamingUrl();

    return () => {
      isMounted = false;
    };
  }, [contentId, onError]);

  // Initialize HLS player when streamData is available
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !streamData?.hls_url) return;

    console.log('🎵 Initializing HLS audio player with URL:', streamData.hls_url);

    // HLS.js is supported
    if (Hls.isSupported()) {
      console.log('✅ HLS.js is supported for audio');

      const hls = new Hls({
        debug: false,
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        xhrSetup: (xhr) => {
          xhr.withCredentials = false;
        },
      });

      hlsRef.current = hls;

      hls.loadSource(streamData.hls_url);
      hls.attachMedia(audio);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('✅ HLS audio manifest loaded successfully');
        setLoading(false);

        if (autoplay) {
          audio.play().catch((err) => {
            console.warn('⚠️ Autoplay prevented:', err.message);
          });
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('❌ HLS Audio Error:', data.type, data.details, data);

        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('🌐 Fatal network error');
              setError('Network error loading audio. Please check your connection.');
              hls.startLoad();
              break;

            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('🎵 Fatal media error');
              setError('Media error. Attempting to recover...');
              hls.recoverMediaError();
              break;

            default:
              console.error('💀 Fatal error, cannot recover');
              setError('Fatal error loading audio. Please try again.');
              hls.destroy();
              break;
          }
        }
      });

      return () => {
        console.log('🧹 Cleaning up HLS.js audio');
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
      };
    }
    // Native HLS support (Safari)
    else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
      console.log('✅ Using native HLS support for audio (Safari)');
      audio.src = streamData.hls_url;

      audio.addEventListener('loadedmetadata', () => {
        setLoading(false);
      });

      if (autoplay) {
        audio.play().catch((err) => {
          console.warn('⚠️ Autoplay prevented:', err.message);
        });
      }

      audio.addEventListener('error', () => {
        const mediaError = audio.error;
        console.error('❌ Audio element error:', mediaError);
        setError('Error loading audio. Please try again.');
      });

      return () => {
        audio.removeEventListener('loadedmetadata', () => {});
        audio.removeEventListener('error', () => {});
      };
    }
    // No HLS support
    else {
      console.error('❌ HLS is not supported in this browser for audio');
      setError('HLS is not supported in this browser');
      setLoading(false);
    }
  }, [streamData, autoplay]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      setIsPlaying(true);
      if (onPlay) onPlay();
    };

    const handlePause = () => {
      setIsPlaying(false);
      if (onPause) onPause();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (onTimeUpdate) {
        onTimeUpdate(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleVolumeChange = () => {
      setVolume(audio.volume);
      setIsMuted(audio.muted);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('volumechange', handleVolumeChange);

    // Set initial volume
    audio.volume = volume;

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [onPlay, onPause, onEnded, volume]);

  // Handlers
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

  const handleVolumeChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Hidden Audio Element */}
      <audio ref={audioRef} preload="metadata" />

      {/* Audio Player UI */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
        {/* Metadata Section */}
        {showMetadata && streamData && (
          <div className="mb-6 text-center">
            {streamData.title && (
              <h3 className="text-white text-xl font-semibold mb-1">{streamData.title}</h3>
            )}
            {streamData.expert_name && (
              <p className="text-purple-200 text-sm">{streamData.expert_name}</p>
            )}
            {streamData.category && (
              <span className="inline-block mt-2 px-3 py-1 bg-white/10 text-purple-200 text-xs rounded-full">
                {streamData.category}
              </span>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-8 h-8 text-gray-400 dark:text-gray-500 animate-spin" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading audio...</span>
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
        {!loading && !error && (
          <>
            {/* Progress Bar */}
            <div className="mb-6">
              <div
                ref={progressBarRef}
                onClick={handleProgressClick}
                className="relative h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full cursor-pointer group hover:h-2 transition-all"
              >
                <div
                  className="absolute h-full bg-gray-900 dark:bg-gray-100 rounded-full transition-all"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-900 dark:bg-gray-100 rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform" />
                </div>
              </div>

              {/* Time Display */}
              <div className="flex justify-between mt-2">
                <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">{formatTime(currentTime)}</span>
                <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main Controls */}
            <div className="flex items-center justify-center gap-4 mb-4">
              {/* Skip Back */}
              <button
                onClick={() => handleSkip(-10)}
                className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all"
                disabled={!!error}
              >
                <SkipBack className="w-5 h-5" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={togglePlayPause}
                className="p-4 rounded-full bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 transition-all shadow-md"
                disabled={!!error}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>

              {/* Skip Forward */}
              <button
                onClick={() => handleSkip(10)}
                className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-all"
                disabled={!!error}
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-800">
              {/* Volume Control */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-all"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {showVolumeSlider && (
                  <div className="w-20" onMouseLeave={() => setShowVolumeSlider(false)}>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChangeInput}
                      className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-900 dark:[&::-webkit-slider-thumb]:bg-gray-100"
                    />
                  </div>
                )}
              </div>

              {/* Settings */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-all"
                >
                  <Settings className="w-4 h-4" />
                </button>

                {showSettings && (
                  <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 min-w-[150px] shadow-lg">
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">Playback Speed</p>
                    <div className="grid grid-cols-2 gap-1">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => handleSpeedChange(speed)}
                          className={`px-2 py-1 rounded text-sm transition-colors ${
                            playbackSpeed === speed
                              ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
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

        {/* Description */}
        {showMetadata && streamData?.description && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-purple-100 text-sm">{streamData.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StreamingAudioPlayer;
