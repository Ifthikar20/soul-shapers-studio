// src/components/VideoPlayer.tsx - HLS Video Player with Backend Integration

import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Loader2, AlertCircle, Settings } from 'lucide-react';
import { streamingService, StreamingUrlResponse } from '../services/streamingService';

export interface VideoPlayerProps {
  contentId: string;
  autoplay?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: Error) => void;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  contentId,
  autoplay = false,
  onPlay,
  onPause,
  onEnded,
  onError,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streamData, setStreamData] = useState<StreamingUrlResponse | null>(null);
  const [currentQuality, setCurrentQuality] = useState<string>('720p');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch streaming URL on mount or when contentId changes
  useEffect(() => {
    let isMounted = true;

    const loadStreamingUrl = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(`🎬 Loading streaming URL for content: ${contentId}`);

        const data = await streamingService.getStreamingUrl(contentId, currentQuality);

        if (isMounted) {
          setStreamData(data);
          console.log('✅ Streaming data loaded:', data);
        }
      } catch (err: any) {
        console.error('❌ Failed to load streaming URL:', err);

        if (isMounted) {
          const errorMessage = err.message || 'Failed to load video';
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
  }, [contentId, currentQuality, onError]);

  // Initialize HLS player when streamData is available
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamData?.hls_url) return;

    console.log('🎥 Initializing HLS player with URL:', streamData.hls_url);

    // HLS.js is supported
    if (Hls.isSupported()) {
      console.log('✅ HLS.js is supported');

      const hls = new Hls({
        debug: false,
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        xhrSetup: (xhr) => {
          // Credentials are included via CloudFront signed URLs
          xhr.withCredentials = false;
        },
      });

      hlsRef.current = hls;

      hls.loadSource(streamData.hls_url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('✅ HLS manifest loaded successfully');
        setLoading(false);

        if (autoplay) {
          video.play().catch((err) => {
            console.warn('⚠️ Autoplay prevented:', err.message);
          });
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('❌ HLS Error:', data.type, data.details, data);

        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('🌐 Fatal network error');
              setError('Network error loading video. Please check your connection.');
              hls.startLoad();
              break;

            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('🎥 Fatal media error');
              setError('Media error. Attempting to recover...');
              hls.recoverMediaError();
              break;

            default:
              console.error('💀 Fatal error, cannot recover');
              setError('Fatal error loading video. Please try again.');
              hls.destroy();
              break;
          }
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
    // Native HLS support (Safari)
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      console.log('✅ Using native HLS support (Safari)');
      video.src = streamData.hls_url;

      video.addEventListener('loadedmetadata', () => {
        setLoading(false);
      });

      if (autoplay) {
        video.play().catch((err) => {
          console.warn('⚠️ Autoplay prevented:', err.message);
        });
      }

      video.addEventListener('error', () => {
        const mediaError = video.error;
        console.error('❌ Video element error:', mediaError);
        setError('Error loading video. Please try again.');
      });

      return () => {
        video.removeEventListener('loadedmetadata', () => {});
        video.removeEventListener('error', () => {});
      };
    }
    // No HLS support
    else {
      console.error('❌ HLS is not supported in this browser');
      setError('HLS is not supported in this browser');
      setLoading(false);
    }
  }, [streamData, autoplay]);

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

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

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onPlay, onPause, onEnded]);

  // Handle quality change
  const handleQualityChange = (quality: string) => {
    console.log(`🎬 Changing quality to: ${quality}`);
    setCurrentQuality(quality);
    setShowQualityMenu(false);
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Video Container */}
      <div
        className="relative bg-black rounded-lg overflow-hidden"
        style={{ aspectRatio: '16/9' }}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          controls
          playsInline
        />

        {/* Loading Spinner */}
        {loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-3" />
              <p className="text-white text-sm">Loading video...</p>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-20">
            <div className="bg-red-500/10 border border-red-500/50 text-white p-6 rounded-xl max-w-md text-center backdrop-blur-sm">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="font-bold mb-2 text-lg">Playback Error</p>
              <p className="text-sm text-red-200">{error}</p>
            </div>
          </div>
        )}

        {/* Quality Selector */}
        {!loading && !error && streamData && streamData.qualities.length > 0 && (
          <div className="absolute top-4 right-4 z-10">
            <div className="relative">
              <button
                onClick={() => setShowQualityMenu(!showQualityMenu)}
                className="bg-black/50 hover:bg-black/70 text-white px-3 py-2 rounded-lg flex items-center gap-2 backdrop-blur-sm transition-all"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium">{currentQuality}</span>
              </button>

              {/* Quality Menu */}
              {showQualityMenu && (
                <div className="absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-lg rounded-lg overflow-hidden shadow-xl min-w-[120px]">
                  {streamData.qualities.map((quality) => (
                    <button
                      key={quality}
                      onClick={() => handleQualityChange(quality)}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                        quality === currentQuality
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {quality}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Video Metadata */}
      {streamData && (
        <div className="mt-4 space-y-2">
          {streamData.title && (
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {streamData.title}
            </h2>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            {streamData.expert_name && (
              <span className="flex items-center gap-1">
                <span className="font-medium">Expert:</span> {streamData.expert_name}
              </span>
            )}

            {streamData.category && (
              <span className="flex items-center gap-1">
                <span className="font-medium">Category:</span> {streamData.category}
              </span>
            )}

            {streamData.duration && (
              <span className="flex items-center gap-1">
                <span className="font-medium">Duration:</span>{' '}
                {Math.floor(streamData.duration / 60)}:{String(streamData.duration % 60).padStart(2, '0')}
              </span>
            )}
          </div>

          {streamData.description && (
            <p className="text-gray-700 dark:text-gray-300 mt-3">
              {streamData.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
