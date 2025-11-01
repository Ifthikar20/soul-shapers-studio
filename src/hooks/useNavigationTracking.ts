// src/hooks/useNavigationTracking.ts - COMPLETE FIXED VERSION
import { useLocation, useNavigate } from 'react-router-dom';
import { useVideoAccess } from './useVideoAccess';

// ✅ FIXED: Complete NavigationContext with all possible tracking fields
export interface NavigationContext {
  source?: string;
  from?: string;
  to?: string;
  feature?: string;
  section?: string;
  category?: string;
  videoId?: string; // ✅ UUID string
  videoShortId?: string; // Deprecated, use videoId
  videoTitle?: string;
  seriesId?: string;
  episode?: string;
  episodeNumber?: number;
  plan?: string;
  trackingId?: string;
  timestamp?: string;
  query?: string;
  currentPage?: string;
  resultCount?: number; // ✅ Added for search results
  filterType?: string; // ✅ Added for filters
  sortBy?: string; // ✅ Added for sorting
  page?: number; // ✅ Added for pagination
  limit?: number; // ✅ Added for pagination
}

export interface UpgradeContext {
  source: string;
  videoId?: string; // ✅ UUID string
  videoShortId?: string; // Deprecated, use videoId
  videoTitle?: string;
  seriesId?: string;
  episodeNumber?: number;
  episode?: string;
  plan?: string;
}

export interface TrackingNavigationContext {
  source: string;
  videoId?: string; // ✅ UUID string
  videoShortId?: string; // Deprecated, use videoId
  videoTitle?: string;
  seriesId?: string;
  feature?: string;
  query?: string;
  category?: string;
  currentPage?: string;
}

export const useNavigationTracking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { generateTrackingUrl } = useVideoAccess();

  /**
   * Track navigation events
   * This is where you integrate your analytics service
   */
  const trackNavigationEvent = (event: string, context: NavigationContext) => {
    console.log('🧭 Navigation Analytics:', event, context);
    
    // Add your analytics service here
    // Examples:
    // - Google Analytics: gtag('event', event, context)
    // - Mixpanel: mixpanel.track(event, context)
    // - Custom API: fetch('/api/analytics', { method: 'POST', body: JSON.stringify({event, context}) })
    
    // Add timestamp if not present
    const enrichedContext = {
      ...context,
      timestamp: context.timestamp || new Date().toISOString(),
    };

    // You can also store in localStorage for debugging
    if (import.meta.env.DEV) {
      console.log('📊 Analytics Event:', {
        event,
        ...enrichedContext,
      });
    }
  };

  /**
   * Get tracking context from current URL
   * Extracts tracking parameters from URL search params
   */
  const getNavigationContextFromUrl = (): NavigationContext => {
    const urlParams = new URLSearchParams(window.location.search);
    const pathname = window.location.pathname;
    const trackingId = pathname.split('/').pop()?.match(/^[a-f0-9-]{36}$/)?.[0]; // UUID pattern
    
    return {
      trackingId,
      source: urlParams.get('source') || undefined,
      videoId: urlParams.get('video_id') || undefined,
      videoShortId: urlParams.get('video_short_id') || undefined,
      feature: urlParams.get('feature') || undefined,
      from: urlParams.get('from_page') || undefined,
      query: urlParams.get('q') || undefined,
      category: urlParams.get('category') || undefined,
      episode: urlParams.get('episode') || undefined,
    };
  };

  /**
   * Navigate with tracking context
   * Adds tracking parameters to the URL and logs the event
   */
  const navigateWithTracking = (
    path: string,
    context: TrackingNavigationContext
  ) => {
    const trackingUrl = generateTrackingUrl(path, {
      source: context.source,
      videoId: context.videoId,
      videoTitle: context.videoTitle,
      seriesId: context.seriesId,
      feature: context.feature,
      query: context.query,
      currentPage: location.pathname,
    });

    // Track the navigation event with full context
    trackNavigationEvent('Page Navigation', {
      from: location.pathname,
      to: path,
      source: context.source,
      videoId: context.videoId,
      videoShortId: context.videoShortId,
      feature: context.feature,
      query: context.query,
      category: context.category,
    });

    navigate(trackingUrl);
  };

  /**
   * Navigate to video with access control + tracking
   * Used for clicking on video cards
   */
  const navigateToVideo = (
    videoId: string, // ✅ UUID string
    videoShortId: string, 
    source: string = 'browse_click'
  ) => {
    const trackingUrl = generateTrackingUrl('/browse', {
      source,
      videoId,
      currentPage: location.pathname,
    });

    trackNavigationEvent('Video Click', {
      videoId: videoId,
      videoShortId: videoShortId,
      source,
      from: location.pathname,
    });

    navigate(trackingUrl);
  };

  /**
   * Navigate to profile/settings with tracking
   */
  const navigateToProfile = (section?: string) => {
    const trackingUrl = generateTrackingUrl('/profile', {
      source: 'navigation',
      feature: section,
      currentPage: location.pathname,
    });

    trackNavigationEvent('Profile Navigation', {
      section,
      from: location.pathname,
      feature: section,
    });

    navigate(trackingUrl);
  };

  /**
   * Navigate to upgrade page with context
   * Used when user clicks upgrade button or tries to access locked content
   */
  const navigateToUpgrade = (context: UpgradeContext) => {
    const upgradeUrl = generateTrackingUrl('/upgrade', {
      source: context.source,
      videoId: context.videoId,
      videoTitle: context.videoTitle,
      seriesId: context.seriesId,
      currentPage: location.pathname,
    });

    // Track with full context including short_id
    trackNavigationEvent('Upgrade Navigation', {
      from: location.pathname,
      source: context.source,
      videoId: context.videoId,
      videoShortId: context.videoShortId,
      videoTitle: context.videoTitle,
      seriesId: context.seriesId,
      episodeNumber: context.episodeNumber,
      episode: context.episode,
      plan: context.plan,
    });

    navigate(upgradeUrl);
  };

  /**
   * Navigate to search with tracking
   */
  const navigateToSearch = (query: string, category?: string) => {
    const searchUrl = generateTrackingUrl('/search', {
      source: 'search_action',
      feature: query,
      query: query,
      currentPage: location.pathname,
    });

    trackNavigationEvent('Search Navigation', {
      from: location.pathname,
      feature: query,
      query: query,
      category: category,
    });

    navigate(searchUrl);
  };

  /**
   * Navigate back with tracking
   */
  const navigateBack = (source: string = 'back_button') => {
    trackNavigationEvent('Navigate Back', {
      from: location.pathname,
      source: source,
    });

    navigate(-1);
  };

  return {
    // Core tracking
    trackNavigationEvent,
    getNavigationContextFromUrl,

    // Navigation with tracking
    navigateWithTracking,
    navigateToVideo,
    navigateToProfile,
    navigateToUpgrade,
    navigateToSearch,
    navigateBack,
  };
};