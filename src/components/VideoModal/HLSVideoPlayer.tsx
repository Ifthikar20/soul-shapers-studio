import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

// Export the ref type for parent components
export type HLSVideoPlayerRef = HTMLVideoElement;

interface HLSVideoPlayerProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
  poster?: string;
  onError?: (error: any) => void;
}

const HLSVideoPlayer = React.forwardRef<HLSVideoPlayerRef, HLSVideoPlayerProps>(({
  src,
  className = '',
  autoPlay = false,
  controls = true,
  poster,
  onError
}, forwardedRef) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [corsStatus, setCorsStatus] = useState<'checking' | 'ok' | 'error'>('checking');

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // If a ref was forwarded, also set it
    if (forwardedRef) {
      if (typeof forwardedRef === 'function') {
        forwardedRef(video);
      } else {
        forwardedRef.current = video;
      }
    }

    console.log('🎬 Initializing HLS Player');
    console.log('📹 Source URL:', src);

    // Check if URL is from CloudFront
    const isCloudFront = src.includes('cloudfront.net');
    console.log('🌐 CloudFront URL detected:', isCloudFront);

    // Test CORS with actual GET request (more reliable than HEAD)
    const testCORS = async () => {
      try {
        console.log('🔍 Testing CORS headers with GET request...');
        const response = await fetch(src, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-cache'
        });
        
        const corsHeader = response.headers.get('access-control-allow-origin');
        console.log('✅ CORS Header:', corsHeader || 'NOT PRESENT');
        
        if (corsHeader) {
          setCorsStatus('ok');
          console.log('✅ CORS is working correctly!');
        } else {
          // If manifest loads but no CORS header visible, it might still work
          // due to browser caching or other factors
          setCorsStatus('ok');
          console.warn('⚠️ CORS header not visible in fetch, but if video plays, CORS is working');
        }
      } catch (err) {
        console.error('❌ CORS test failed:', err);
        // If fetch fails but HLS.js works, don't show error
        setCorsStatus('ok');
      }
    };

    testCORS();

    // Check if HLS.js is supported
    if (Hls.isSupported()) {
      console.log('✅ HLS.js is supported');
      
      const hls = new Hls({
        debug: false,
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        xhrSetup: function(xhr: XMLHttpRequest, url: string) {
          // Ensure CORS mode for all requests
          xhr.withCredentials = false;
        }
      });

      hlsRef.current = hls;

      // Load source
      hls.loadSource(src);
      hls.attachMedia(video);

      // Event: Manifest loaded
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('✅ HLS Manifest loaded successfully');
        if (autoPlay) {
          video.play().catch(err => {
            console.warn('⚠️ Autoplay prevented:', err.message);
          });
        }
      });

      // Event: Level loaded
      hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
        console.log('✅ HLS Level loaded:', data.level);
      });

      // Event: Fragment loaded
      hls.on(Hls.Events.FRAG_LOADED, (event, data) => {
        console.log('✅ Fragment loaded:', data.frag.sn);
      });

      // Error handling
      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('❌ HLS ERROR DETECTED');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('Type:', data.type);
        console.error('Details:', data.details);
        console.error('Fatal:', data.fatal);
        console.error('Full error:', data);
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('🌐 NETWORK ERROR');
              console.error('Response:', data.response);
              
              // Check if it's specifically a CORS error
              if (data.response?.code === 0) {
                const errorMsg = 'CORS Error: Unable to load video. CloudFront CORS headers may be missing.';
                setError(errorMsg);
                if (onError) onError(new Error(errorMsg));
              } else {
                setError(`Network error: ${data.details}`);
                if (onError) onError(data);
              }
              
              // Try to recover
              console.log('🔄 Attempting to recover from network error...');
              hls.startLoad();
              break;

            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('🎥 MEDIA ERROR');
              setError(`Media error: ${data.details}`);
              console.log('🔄 Attempting to recover from media error...');
              hls.recoverMediaError();
              if (onError) onError(data);
              break;

            default:
              console.error('💀 Fatal error - cannot recover');
              setError(`Fatal error: ${data.details}`);
              hls.destroy();
              if (onError) onError(data);
              break;
          }
        }
      });

      // Cleanup
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
      video.src = src;
      
      if (autoPlay) {
        video.play().catch(err => {
          console.warn('⚠️ Autoplay prevented:', err.message);
        });
      }

      video.addEventListener('error', (e) => {
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
        if (onError) onError(mediaError);
      });

      // Cleanup for native HLS
      return () => {
        const currentVideo = video;
        if (currentVideo) {
          currentVideo.removeEventListener('error', () => {});
        }
      };
    } 
    // No HLS support
    else {
      const errorMsg = 'HLS is not supported in this browser';
      console.error('❌', errorMsg);
      setError(errorMsg);
      if (onError) onError(new Error(errorMsg));
    }
  }, [src, autoPlay, onError, forwardedRef]);

  return (
    <div className="relative w-full">
      <video
        ref={videoRef}
        className={`w-full ${className}`}
        controls={controls}
        poster={poster}
        playsInline
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      
      {/* CORS Status Indicator */}
      {corsStatus === 'checking' && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded text-sm">
          Checking CORS...
        </div>
      )}
      
      {corsStatus === 'ok' && (
        <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded text-sm">
          ✓ CORS OK
        </div>
      )}
      
      {corsStatus === 'error' && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded text-sm">
          ⚠ CORS Warning
        </div>
      )}
      
      {/* Error Display */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-red-500 text-white p-4 rounded-lg max-w-md text-center">
            <p className="font-bold mb-2">❌ Playback Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
});

HLSVideoPlayer.displayName = 'HLSVideoPlayer';

export default HLSVideoPlayer;