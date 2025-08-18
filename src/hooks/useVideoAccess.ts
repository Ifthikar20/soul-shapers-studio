// src/hooks/useVideoAccess.ts
import { useAuth } from '@/contexts/AuthContext';

interface VideoContent {
  id: number;
  accessTier: 'free' | 'basic' | 'premium';
  isFirstEpisode?: boolean;
  episodeNumber?: number;
  seriesId?: string;
}

export const useVideoAccess = () => {
  const { user, canAccessContent } = useAuth();

  const canWatchVideo = (video: VideoContent, allVideosInSeries?: VideoContent[]): boolean => {
    // Free tier access rules
    if (!user || user.subscription_tier === 'free') {
      // Always allow access to free content
      if (video.accessTier === 'free') return true;
      
      // Allow first episode of any series for free users
      if (video.isFirstEpisode || video.episodeNumber === 1) return true;
      
      // If it's part of a series, check if it's the first video
      if (allVideosInSeries && video.seriesId) {
        const sortedVideos = allVideosInSeries
          .filter(v => v.seriesId === video.seriesId)
          .sort((a, b) => (a.episodeNumber || 0) - (b.episodeNumber || 0));
        
        return sortedVideos[0]?.id === video.id;
      }
      
      return false;
    }

    // Premium/Basic users can access content based on their tier
    return canAccessContent(video.accessTier);
  };

  const getAccessMessage = (video: VideoContent): string => {
    if (!user) {
      return "Sign in to watch this content";
    }

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

  return {
    canWatchVideo,
    getAccessMessage
  };
};