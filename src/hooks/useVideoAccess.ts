// ============================================
// FILE: src/hooks/useVideoAccess.ts - COMPLETE FIXED VERSION
// ============================================

import { useAuth } from '@/contexts/AuthContext';
import { Video } from '@/types/video.types'; // ✅ FIXED: Use Video instead of VideoContent

// ✅ FIXED: Interface for tracking context with proper types
interface TrackingContext {
  source: string;
  videoId?: string; // ✅ FIXED: Changed from number to string (UUID)
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

  /**
   * Check if user can watch a video
   * SECURITY: Always validate against user's actual subscription (server-verified)
   * 
   * @param video - The video to check access for
   * @param allVideosInSeries - Optional array of all videos in the same series
   * @returns boolean - true if user can watch, false otherwise
   */
  const canWatchVideo = (video: Video, allVideosInSeries?: Video[]): boolean => {
    // 🔒 SECURITY: Never trust URL parameters for access control
    // Always check user's actual subscription tier from authenticated session
    
    if (!user || user.subscription_tier === 'free') {
      // Allow free content
      if (video.accessTier === 'free') return true;
      
      // Allow first episodes only
      if (video.isFirstEpisode || video.is_first_episode || video.episodeNumber === 1) return true;
      
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

  /**
   * Get user-friendly access message for locked content
   * 
   * @param video - The video to get message for
   * @returns string - Message explaining why content is locked or empty string if accessible
   */
  const getAccessMessage = (video: Video): string => {
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

  /**
   * Generate tracking URL for analytics
   * 🎯 TRACKING: Generate tracking URL (NO security implications)
   * This is purely for analytics - access control is done server-side
   * 
   * @param basePath - Base path for the URL (e.g., '/browse', '/watch')
   * @param context - Tracking context with video and navigation info
   * @returns string - Full URL with tracking parameters
   */
  const generateTrackingUrl = (
    basePath: string,
    context: TrackingContext
  ): string => {
    const trackingId = crypto.randomUUID();
    const params = new URLSearchParams({
      source: context.source,
      tracking_id: trackingId, // Make it clear this is for tracking
      ...(context.videoId && { video_id: context.videoId }), // ✅ FIXED: No need to toString() for UUID
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

  /**
   * Check if a video is free to watch (no authentication required)
   * 
   * @param video - The video to check
   * @returns boolean - true if video is free content
   */
  const isVideoFree = (video: Video): boolean => {
    return video.accessTier === 'free' || 
           video.isFirstEpisode === true || 
           video.is_first_episode === true ||
           video.episodeNumber === 1;
  };

  /**
   * Get the required subscription tier to watch a video
   * 
   * @param video - The video to check
   * @returns 'free' | 'basic' | 'premium' - Required tier
   */
  const getRequiredTier = (video: Video): 'free' | 'basic' | 'premium' => {
    if (isVideoFree(video)) {
      return 'free';
    }
    return video.accessTier;
  };

  /**
   * Check if user needs to upgrade to watch a video
   * 
   * @param video - The video to check
   * @returns boolean - true if upgrade is needed
   */
  const needsUpgrade = (video: Video): boolean => {
    return !canWatchVideo(video);
  };

  return {
    canWatchVideo,
    getAccessMessage,
    generateTrackingUrl,
    isVideoFree,
    getRequiredTier,
    needsUpgrade,
  };
};