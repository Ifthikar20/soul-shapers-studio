// src/components/VideoModal/VideoModal.tsx - FIXED FOR SHORT_ID
import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import HLSVideoPlayer, { HLSVideoPlayerRef } from './HLSVideoPlayer';
import { videoService } from '@/services/video.service';
import { toVideoId } from '@/utils/video.utils';
import { Video } from '@/types/video.types'; // ✅ Import Video type
import { 
  X, Plus, ThumbsUp, Share2, User, Users, Clock,
  ExternalLink, AlertCircle, Loader2
} from "lucide-react";

interface VideoModalProps {
  video: Video; // ✅ Changed from 'any' to 'Video'
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VideoModal = ({ 
  video, 
  open, 
  onOpenChange
}: VideoModalProps) => {
  const navigate = useNavigate();
  const videoRef = useRef<HLSVideoPlayerRef>(null);
  
  // Secure streaming states
  const [secureStreamUrl, setSecureStreamUrl] = useState<string | null>(null);
  const [isLoadingStream, setIsLoadingStream] = useState(true);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [upgradeRequired, setUpgradeRequired] = useState(false);
  const [tokenExpiresAt, setTokenExpiresAt] = useState<string | null>(null);
  
  // Track video progress for analytics
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTrackedPositionRef = useRef<number>(0);

  // ✅ Use video.id (numeric) for backend calls
  const videoId = toVideoId(video.id);

  // 🔒 Verify access and load secure stream URL
  useEffect(() => {
    if (!open || !video.id) return;

    const initializeStream = async () => {
      try {
        setIsLoadingStream(true);
        setStreamError(null);

        console.log('🔍 Verifying video access for:', {
          id: video.id,
          short_id: video.short_id,
          title: video.title
        });

        // Step 1: Verify access
        const accessCheck = await videoService.verifyVideoAccess(videoId);

        if (!accessCheck.hasAccess) {
          setHasAccess(false);
          setUpgradeRequired(accessCheck.upgradeRequired || false);
          setStreamError(accessCheck.reason || 'Access denied');
          setIsLoadingStream(false);
          return;
        }

        setHasAccess(true);

        // Step 2: Get secure stream URL
        console.log('🔒 Requesting secure stream URL...');
        const streamData = await videoService.getSecureStreamUrl({
          videoId: videoId,
          quality: 'auto',
        });

        setSecureStreamUrl(streamData.streamUrl);
        setTokenExpiresAt(streamData.expiresAt);
        setIsLoadingStream(false);

        // Step 3: Track initial view
        await videoService.trackVideoEvent({
          videoId: videoId,
          event: 'view',
          position: 0,
        });

        console.log('✅ Stream initialized successfully');

      } catch (error: any) {
        console.error('❌ Failed to initialize stream:', error);
        setStreamError(error.message || 'Failed to load video');
        setIsLoadingStream(false);
      }
    };

    initializeStream();

    // Cleanup on modal close
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [open, videoId, video.id, video.short_id, video.title]);

  // 🔄 Auto-refresh token before expiration
  useEffect(() => {
    if (!tokenExpiresAt || !hasAccess || !open) return;

    const expiresAt = new Date(tokenExpiresAt);
    const now = new Date();
    const timeUntilExpiry = expiresAt.getTime() - now.getTime();
    
    // Refresh token 2 minutes before expiration
    const refreshTime = Math.max(timeUntilExpiry - 120000, 30000);

    const refreshTimeout = setTimeout(async () => {
      try {
        console.log('🔄 Refreshing stream token...');
        const streamData = await videoService.refreshStreamToken(videoId);
        setSecureStreamUrl(streamData.streamUrl);
        setTokenExpiresAt(streamData.expiresAt);
        console.log('✅ Token refreshed successfully');
      } catch (error) {
        console.error('❌ Failed to refresh token:', error);
        setStreamError('Session expired. Please reload the video.');
      }
    }, refreshTime);

    return () => clearTimeout(refreshTimeout);
  }, [tokenExpiresAt, hasAccess, open, videoId]);

  // 📊 Track video progress
  const handleTimeUpdate = useCallback((currentTime: number) => {
    // Track progress every 10 seconds
    const timeDiff = Math.abs(currentTime - lastTrackedPositionRef.current);
    
    if (timeDiff >= 10) {
      videoService.trackVideoEvent({
        videoId: videoId,
        event: 'progress',
        position: currentTime,
      });
      lastTrackedPositionRef.current = currentTime;
    }
  }, [videoId]);

  // 📊 Track video completion
  const handleDurationChange = useCallback((duration: number) => {
    const videoElement = videoRef.current?.video;
    if (!videoElement) return;

    const checkCompletion = () => {
      const progress = (videoElement.currentTime / duration) * 100;
      
      // Track completion at 90%
      if (progress >= 90 && lastTrackedPositionRef.current < duration * 0.9) {
        videoService.trackVideoEvent({
          videoId: videoId,
          event: 'complete',
          position: videoElement.currentTime,
        });
      }
    };

    videoElement.addEventListener('timeupdate', checkCompletion);
    
    return () => {
      videoElement.removeEventListener('timeupdate', checkCompletion);
    };
  }, [videoId]);

  // 📊 Track video pause
  const handlePause = useCallback(() => {
    const currentTime = videoRef.current?.video?.currentTime || 0;
    
    videoService.trackVideoEvent({
      videoId: videoId,
      event: 'pause',
      position: currentTime,
    });
  }, [videoId]);

  // 📊 Track video errors
  const handleVideoError = useCallback((error: any) => {
    videoService.trackVideoEvent({
      videoId: videoId,
      event: 'error',
      position: videoRef.current?.video?.currentTime || 0,
      errorCode: error.code?.toString(),
      errorMessage: error.message || 'Unknown error',
    });
  }, [videoId]);

  // ✅ FIXED: Navigate using short_id instead of numeric id
  const handleWatchFullScreen = useCallback(() => {
    console.log('🎬 Opening full screen for:', {
      short_id: video.short_id,
      title: video.title
    });
    onOpenChange(false);
    navigate(`/watch/${video.short_id}`); // ✅ Use short_id
  }, [video.short_id, video.title, onOpenChange, navigate]);

  const handleUpgrade = useCallback(() => {
    navigate('/pricing');
    onOpenChange(false);
  }, [navigate, onOpenChange]);

  const handleRetry = useCallback(() => {
    setStreamError(null);
    setIsLoadingStream(true);
    
    // Re-trigger stream initialization
    videoService.getSecureStreamUrl({
      videoId: videoId,
      quality: 'auto',
    })
      .then(streamData => {
        setSecureStreamUrl(streamData.streamUrl);
        setTokenExpiresAt(streamData.expiresAt);
        setHasAccess(true);
        setIsLoadingStream(false);
      })
      .catch(error => {
        setStreamError(error.message);
        setIsLoadingStream(false);
      });
  }, [videoId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[100vw] w-full h-[100vh] m-0 p-0 bg-black border-0 rounded-none overflow-hidden">
        <div className="relative w-full h-full overflow-y-auto overflow-x-hidden bg-gradient-to-b from-zinc-900 to-black">
          
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="fixed top-4 right-4 z-50 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white w-10 h-10"
          >
            <X className="h-5 w-5" />
          </Button>
          
          {/* Video Player Section */}
          <div className="relative w-full bg-black">
            <div className="relative mx-auto max-w-[1400px]">
              <div className="relative aspect-video w-full">
                
                {/* Loading State */}
                {isLoadingStream && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
                    <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
                    <p className="text-white text-sm">Loading secure stream...</p>
                  </div>
                )}

                {/* Error State */}
                {streamError && !isLoadingStream && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black p-8">
                    <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                    <h3 className="text-white text-xl font-semibold mb-2">
                      {upgradeRequired ? 'Upgrade Required' : 'Playback Error'}
                    </h3>
                    <p className="text-zinc-400 text-center mb-6 max-w-md">
                      {streamError}
                    </p>
                    
                    {upgradeRequired ? (
                      <Button 
                        onClick={handleUpgrade}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Upgrade Now
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleRetry}
                        variant="outline"
                        className="bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700"
                      >
                        Try Again
                      </Button>
                    )}
                  </div>
                )}

                {/* HLS Video Player - Only render when we have secure URL */}
                {secureStreamUrl && hasAccess && !streamError && (
                  <HLSVideoPlayer
                    ref={videoRef}
                    src={secureStreamUrl}
                    poster={video.thumbnail}
                    className="w-full h-full object-cover"
                    autoPlay={false}
                    onTimeUpdate={handleTimeUpdate}
                    onDurationChange={handleDurationChange}
                    onPause={handlePause}
                    onError={handleVideoError}
                  />
                )}
              </div>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="relative px-8 lg:px-12 pb-20">
            <div className="max-w-[1400px] mx-auto">
              
              {/* Access Warning */}
              {upgradeRequired && (
                <Alert className="mb-6 bg-purple-900/20 border-purple-500/50">
                  <AlertCircle className="h-4 w-4 text-purple-400" />
                  <AlertDescription className="text-purple-200">
                    This is premium content. Upgrade your plan to watch this video.
                  </AlertDescription>
                </Alert>
              )}

              {/* Title and Actions */}
              <div className="mb-8">
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  {video.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-400 mb-6">
                  <span className="text-green-500 font-semibold">{video.rating} ⭐</span>
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
                
                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <Button 
                    size="lg"
                    onClick={handleWatchFullScreen}
                    disabled={!hasAccess || !!streamError}
                    className="bg-white hover:bg-white/90 text-black font-bold rounded px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Watch Full Screen
                  </Button>

                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-zinc-800/80 hover:bg-zinc-700 text-white border-zinc-700 rounded px-8"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    My List
                  </Button>
                  
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white border-zinc-700 w-12 h-12"
                  >
                    <ThumbsUp className="w-5 h-5" />
                  </Button>
                  
                  <Button 
                    size="icon" 
                    variant="outline" 
                    className="rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-white border-zinc-700 w-12 h-12"
                  >
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
                  <p className="text-zinc-400 text-sm">{video.expertCredentials || 'Wellness Expert'}</p>
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-8">
                <h3 className="text-white text-lg font-semibold mb-3">About this video</h3>
                <p className="text-zinc-300 leading-relaxed">
                  {video.fullDescription || video.description}
                </p>
              </div>

              {/* Category Badge */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm">
                  {video.category}
                </span>
              </div>

              {/* Video ID for debugging */}
              {import.meta.env.DEV && (
                <div className="mt-4 p-3 bg-zinc-900/50 rounded text-xs text-zinc-500 font-mono">
                  <div>ID: {video.id}</div>
                  <div>Short ID: {video.short_id}</div>
                  <div>Slug: {video.slug}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;