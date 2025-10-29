// src/pages/SingleAudioPage.tsx - PRODUCTION VERSION with HLS Streaming
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HLSAudioPlayer from '@/components/HLSAudioPlayer';
import { AudioDetails } from '@/components/AudioDetails';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { audioStreamingService, SecureAudioResponse } from '@/services/audio.service';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface DisplayAudio {
  id: number;
  title: string;
  expert: string;
  expertCredentials: string;
  duration: string;
  durationSeconds: number;
  category: string;
  thumbnail: string;
  description: string;
  fullDescription: string;
  accessTier: 'free' | 'premium';
  audioUrl: string;
  sessionId: string;
  expiresAt: string;
  isSecure: boolean;
  cdnEnabled: boolean;
}

interface ErrorState {
  type: 'AUTH_ERROR' | 'ACCESS_DENIED' | 'NOT_FOUND' | 'NETWORK_ERROR' | 'TOKEN_EXPIRED' | 'SERVER_ERROR';
  message: string;
  canRetry: boolean;
}

// ============================================
// CONTENT SLUG MAPPING
// ============================================

const SLUG_MAP: Record<string, string> = {
  '1': 'guided-meditation-anxiety-relief',
  '2': 'self-compassion-practice',
};

// ============================================
// MAIN COMPONENT
// ============================================

const SingleAudioPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // UI State
  const [showTranscript, setShowTranscript] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Data State
  const [audioData, setAudioData] = useState<SecureAudioResponse | null>(null);
  const [displayAudio, setDisplayAudio] = useState<DisplayAudio | null>(null);

  // Loading & Error State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);
  const [retrying, setRetrying] = useState(false);

  // Playback tracking refs
  const playbackStartTime = useRef<number>(0);
  const lastPosition = useRef<number>(0);
  const hasLoggedPlay = useRef<boolean>(false);

  // Get content slug from page ID
  const contentSlug = SLUG_MAP[id || '1'] || 'guided-meditation-anxiety-relief';

  // ============================================
  // FETCH AUDIO STREAM
  // ============================================

  const fetchAudioStream = async (isRetry = false) => {
    try {
      if (isRetry) {
        setRetrying(true);
      } else {
        setLoading(true);
      }

      setError(null);

      console.log(`🎵 Fetching secure audio stream: ${contentSlug}`);

      const streamData = await audioStreamingService.getSecureAudioStream(contentSlug);

      console.log('✅ Stream received:', {
        title: streamData.title,
        duration: streamData.duration_seconds,
        secure: streamData.is_secure,
        cdn: streamData.cdn_enabled
      });

      setAudioData(streamData);

      const transformedAudio = transformToDisplay(streamData);
      setDisplayAudio(transformedAudio);

      checkUrlExpiration(streamData.expires_at);

    } catch (err: any) {
      console.error('❌ Stream fetch failed:', err);

      const errorState = parseError(err);
      setError(errorState);

    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  // ============================================
  // DATA TRANSFORMATION
  // ============================================

  const transformToDisplay = (apiData: SecureAudioResponse): DisplayAudio => {
    const minutes = Math.floor(apiData.duration_seconds / 60);
    const seconds = apiData.duration_seconds % 60;

    return {
      id: parseInt(id || '1'),
      title: apiData.title,
      expert: apiData.expert_name || "Expert",
      expertCredentials: apiData.expert_credentials || "",
      duration: `${minutes}:${seconds.toString().padStart(2, '0')}`,
      durationSeconds: apiData.duration_seconds,
      category: apiData.category || "Wellness",
      thumbnail: apiData.thumbnail_url || '',
      description: apiData.description || "Professional wellness content",
      fullDescription: apiData.full_description || apiData.description || "Professional wellness content designed to support your journey.",
      accessTier: apiData.access_tier || 'free',
      audioUrl: apiData.audio_url,
      sessionId: apiData.content_id.toString(),
      expiresAt: apiData.expires_at,
      isSecure: apiData.is_secure,
      cdnEnabled: apiData.cdn_enabled,
    };
  };

  // ============================================
  // ERROR HANDLING
  // ============================================

  const parseError = (err: any): ErrorState => {
    if (err.response) {
      const status = err.response.status;
      const detail = err.response.data?.detail || err.message;

      switch (status) {
        case 401:
          return {
            type: 'AUTH_ERROR',
            message: 'Please log in to access this content',
            canRetry: false
          };

        case 403:
          return {
            type: 'ACCESS_DENIED',
            message: detail || 'Premium subscription required',
            canRetry: false
          };

        case 404:
          return {
            type: 'NOT_FOUND',
            message: 'Audio content not found',
            canRetry: false
          };

        case 410:
          return {
            type: 'TOKEN_EXPIRED',
            message: 'Stream URL expired',
            canRetry: true
          };

        case 500:
        case 502:
        case 503:
          return {
            type: 'SERVER_ERROR',
            message: 'Server error. Please try again.',
            canRetry: true
          };

        default:
          return {
            type: 'NETWORK_ERROR',
            message: 'Connection error. Check your internet.',
            canRetry: true
          };
      }
    }

    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      return {
        type: 'NETWORK_ERROR',
        message: 'Request timeout. Please try again.',
        canRetry: true
      };
    }

    return {
      type: 'NETWORK_ERROR',
      message: err.message || 'An unexpected error occurred',
      canRetry: true
    };
  };

  const checkUrlExpiration = (expiresAt: string) => {
    const expirationTime = new Date(expiresAt).getTime();
    const currentTime = Date.now();
    const timeRemaining = expirationTime - currentTime;
    const fiveMinutes = 5 * 60 * 1000;

    if (timeRemaining < fiveMinutes && timeRemaining > 0) {
      console.warn('⚠️ URL expires soon (< 5 min)');
    } else if (timeRemaining <= 0) {
      console.error('❌ URL already expired');
    }
  };

  // ============================================
  // PLAYBACK HANDLERS
  // ============================================

  const handlePlay = () => {
    setShowTranscript(true);

    if (!hasLoggedPlay.current) {
      playbackStartTime.current = Date.now();
      hasLoggedPlay.current = true;
      console.log('📊 Play event at position 0');
    }
  };

  const handlePause = (currentTime: number) => {
    lastPosition.current = currentTime;
    console.log('📊 Pause event at position:', currentTime);
  };

  const handleSeek = (fromPosition: number, toPosition: number) => {
    console.log('📊 Seek event from', fromPosition, 'to', toPosition);
  };

  const handleComplete = () => {
    const durationWatched = Math.floor((Date.now() - playbackStartTime.current) / 1000);
    console.log('📊 Complete event, duration watched:', durationWatched);
  };

  const handleError = (errorCode: string, errorMessage: string) => {
    console.error('📊 Playback error:', errorCode, errorMessage);
  };

  // ============================================
  // LIFECYCLE
  // ============================================

  useEffect(() => {
    fetchAudioStream();

    return () => {
      if (hasLoggedPlay.current && audioData) {
        const durationWatched = Math.floor((Date.now() - playbackStartTime.current) / 1000);
        console.log('📊 Session end, total duration:', durationWatched);
      }
    };
  }, [contentSlug]);

  // ============================================
  // UI HELPERS
  // ============================================

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleRetry = () => fetchAudioStream(true);

  const handleLogin = () => navigate('/login');

  const handleSubscribe = () => navigate('/subscribe');

  const themeClasses = {
    background: isDarkMode ? '' : 'bg-gray-50',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    mutedText: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    buttonBg: isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
  };

  // ============================================
  // RENDER: LOADING STATE
  // ============================================

  if (loading) {
    return (
      <div
        className={`min-h-screen ${themeClasses.background} transition-colors duration-300 flex items-center justify-center`}
        style={isDarkMode ? { backgroundColor: '#0F0D0E' } : {}}
      >
        <div className="text-center space-y-4">
          <Loader2 className={`w-12 h-12 ${themeClasses.text} animate-spin mx-auto`} />
          <p className={themeClasses.text}>Loading secure audio stream...</p>
          <p className="text-xs text-gray-500">Establishing encrypted connection...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: ERROR STATES
  // ============================================

  // Authentication Required
  if (error?.type === 'AUTH_ERROR') {
    return (
      <div
        className={`min-h-screen ${themeClasses.background} flex items-center justify-center`}
        style={isDarkMode ? { backgroundColor: '#0F0D0E' } : {}}
      >
        <div className="max-w-md w-full mx-4">
          <Alert variant="destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold mb-2">Authentication Required</AlertTitle>
            <AlertDescription>
              <p className="mb-4">{error.message}</p>
              <div className="flex gap-3">
                <Button onClick={handleLogin} className="flex-1">
                  Log In
                </Button>
                <Button onClick={() => navigate('/audio')} variant="outline" className="flex-1">
                  Go Back
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Access Denied
  if (error?.type === 'ACCESS_DENIED') {
    return (
      <div
        className={`min-h-screen ${themeClasses.background} flex items-center justify-center`}
        style={isDarkMode ? { backgroundColor: '#0F0D0E' } : {}}
      >
        <div className="max-w-md w-full mx-4">
          <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-900/20">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <AlertTitle className="text-lg font-semibold mb-2 text-amber-900 dark:text-amber-100">
              Premium Content
            </AlertTitle>
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              <p className="mb-4">{error.message}</p>
              <div className="flex gap-3">
                <Button onClick={handleSubscribe} className="flex-1 bg-amber-600 hover:bg-amber-700">
                  Upgrade to Premium
                </Button>
                <Button onClick={() => navigate('/audio')} variant="outline" className="flex-1">
                  Browse Free Content
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // Not Found
  if (error?.type === 'NOT_FOUND') {
    return (
      <div
        className={`min-h-screen ${themeClasses.background} flex items-center justify-center`}
        style={isDarkMode ? { backgroundColor: '#0F0D0E' } : {}}
      >
        <div className="text-center">
          <AlertCircle className={`w-16 h-16 ${themeClasses.mutedText} mx-auto mb-4`} />
          <h1 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>Audio Not Found</h1>
          <p className={`${themeClasses.mutedText} mb-6`}>{error.message}</p>
          <Button onClick={() => navigate('/audio')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Audio Library
          </Button>
        </div>
      </div>
    );
  }

  // Network/Retry Errors
  if (error?.canRetry) {
    return (
      <div
        className={`min-h-screen ${themeClasses.background} flex items-center justify-center`}
        style={isDarkMode ? { backgroundColor: '#0F0D0E' } : {}}
      >
        <div className="max-w-md w-full mx-4">
          <Alert>
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg font-semibold mb-2">Connection Error</AlertTitle>
            <AlertDescription>
              <p className="mb-4">{error.message}</p>
              <div className="flex gap-3">
                <Button
                  onClick={handleRetry}
                  disabled={retrying}
                  className="flex-1"
                >
                  {retrying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Retrying...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retry
                    </>
                  )}
                </Button>
                <Button onClick={() => navigate('/audio')} variant="outline" className="flex-1">
                  Go Back
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  // No audio data loaded
  if (!displayAudio) {
    return (
      <div
        className={`min-h-screen ${themeClasses.background} flex items-center justify-center`}
        style={isDarkMode ? { backgroundColor: '#0F0D0E' } : {}}
      >
        <div className="text-center">
          <AlertCircle className={`w-16 h-16 ${themeClasses.mutedText} mx-auto mb-4`} />
          <h1 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>Unable to Load Audio</h1>
          <p className={`${themeClasses.mutedText} mb-6`}>Something went wrong loading the audio content.</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={handleRetry} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={() => navigate('/audio')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER: MAIN CONTENT (SUCCESS STATE)
  // ============================================

  return (
    <div
      className={`min-h-screen ${themeClasses.background} transition-colors duration-300`}
      style={isDarkMode ? { backgroundColor: '#0F0D0E' } : {}}
    >
      {/* Dark Mode Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleDarkMode}
          className={`${themeClasses.buttonBg} ${themeClasses.text} rounded-full shadow-lg`}
          title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </div>

      {/* Back Button */}
      <div className="container mx-auto px-6 pt-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/audio')}
          className={`mb-6 ${themeClasses.buttonBg} ${themeClasses.text}`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Audio Library
        </Button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-12">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Security Info Badge (Optional) */}
          {displayAudio.isSecure && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Secure encrypted stream</span>
              {displayAudio.cdnEnabled && <span>• CDN enabled</span>}
            </div>
          )}

          {/* HLS Audio Player Component */}
          <div className={isDarkMode ? 'dark' : ''}>
            <HLSAudioPlayer
              src={displayAudio.audioUrl}
              audioTitle={displayAudio.title}
              expertName={displayAudio.expert}
              onPlay={handlePlay}
              onPause={handlePause}
              onSeek={handleSeek}
              onComplete={handleComplete}
              onError={(error) => {
                const errorMsg = error?.message || 'Playback error';
                handleError('PLAYBACK_ERROR', errorMsg);
              }}
            />

            {/* Audio Content/Transcript Component */}
            <AudioDetails
              audio={displayAudio}
              showTranscript={showTranscript}
            />
          </div>

          {/* Expiration Warning (if < 5 minutes remaining) */}
          {(() => {
            const expiresAt = new Date(displayAudio.expiresAt).getTime();
            const now = Date.now();
            const remaining = expiresAt - now;
            const fiveMinutes = 5 * 60 * 1000;

            if (remaining < fiveMinutes && remaining > 0) {
              return (
                <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-900/20">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800 dark:text-amber-200">
                    Stream URL expires soon. Refresh if playback stops.
                  </AlertDescription>
                </Alert>
              );
            }
            return null;
          })()}

        </div>
      </div>
    </div>
  );
};

export default SingleAudioPage;