import { useAuth } from '@/contexts/AuthContext';
import { VideoContent } from '@/types/video.types';

// Interface for tracking context
interface TrackingContext {
  source: string;
  videoId?: number;
  videoTitle?: string;
  seriesId?: string;
  episodeNumber?: number;
  currentPage?: string;
  feature?: string;
  section?: string;
  query?: string;
}

export const useVideoAccess = () => {
  const { user, canAccessContent } = useAuth();

  // SECURITY: Always validate against user's actual subscription (server-verified)
  const canWatchVideo = (video: VideoContent, allVideosInSeries?: VideoContent[]): boolean => {
    // 🔒 SECURITY: Never trust URL parameters for access control
    // Always check user's actual subscription tier from authenticated session
    
    if (!user || user.subscription_tier === 'free') {
      // Allow free content
      if (video.accessTier === 'free') return true;
      
      // Allow first episodes only
      if (video.isFirstEpisode || video.episodeNumber === 1) return true;
      
      // Check if it's first in series
      if (allVideosInSeries && video.seriesId) {
        const sortedVideos = allVideosInSeries
          .filter(v => v.seriesId === video.seriesId)
          .sort((a, b) => (a.episodeNumber || 0) - (b.episodeNumber || 0));
        return sortedVideos[0]?.id === video.id;
      }
      
      return false;
    }

    // 🔒 SECURITY: Use server-verified subscription tier
    return canAccessContent(video.accessTier);
  };

  const getAccessMessage = (video: VideoContent): string => {
    if (!user) return "Sign in to watch this content";
    if (user.subscription_tier === 'free') {
      if (video.episodeNumber && video.episodeNumber > 1) {
        return "Upgrade to Premium to watch full series";
      }
      return "Upgrade to Premium to access this content";
    }
    if (!canAccessContent(video.accessTier)) {
      return `Upgrade to ${video.accessTier} to watch this content`;
    }
    return "";
  };

  // 🎯 TRACKING: Generate tracking URL (NO security implications)
  const generateTrackingUrl = (
    basePath: string,
    context: TrackingContext
  ): string => {
    const trackingId = crypto.randomUUID();
    const params = new URLSearchParams({
      source: context.source,
      tracking_id: trackingId, // Make it clear this is for tracking
      ...(context.videoId && { video_id: context.videoId.toString() }),
      ...(context.videoTitle && { video_title: context.videoTitle }),
      ...(context.seriesId && { series_id: context.seriesId }),
      ...(context.episodeNumber && { episode: context.episodeNumber.toString() }),
      ...(context.currentPage && { from_page: context.currentPage }),
      ...(context.feature && { feature: context.feature }),
      ...(context.section && { section: context.section }),
      ...(context.query && { query: context.query }),
    });
    
    return `${basePath}/${trackingId}?${params.toString()}`;
  };

  return {
    canWatchVideo,
    getAccessMessage,
    generateTrackingUrl
  };
};