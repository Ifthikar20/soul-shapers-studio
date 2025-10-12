// src/hooks/useNavigationTracking.ts - Fixed with query property
import { useLocation, useNavigate } from 'react-router-dom';
import { useVideoAccess } from './useVideoAccess';

interface NavigationContext {
  from?: string;
  to?: string;
  source?: string;
  videoId?: string;
  feature?: string;
  section?: string;
  trackingId?: string;
  query?: string; // ADD THIS LINE
  resultCount?: number; // ADD THIS LINE (optional but useful)
}

export const useNavigationTracking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { generateTrackingUrl } = useVideoAccess();

  // Track navigation events
  const trackNavigationEvent = (event: string, context: NavigationContext) => {
    console.log('🧭 Navigation Analytics:', event, context);
    
    // Add your analytics service here
    // Examples:
    // - Google Analytics: gtag('event', event, context)
    // - Mixpanel: mixpanel.track(event, context)
    // - Custom API: fetch('/api/analytics', { method: 'POST', body: JSON.stringify({event, context}) })
  };

  // Get tracking context from current URL
  const getNavigationContextFromUrl = (): NavigationContext => {
    const urlParams = new URLSearchParams(window.location.search);
    const pathname = window.location.pathname;
    const trackingId = pathname.split('/').pop()?.match(/^[a-f0-9-]{36}$/)?.[0]; // UUID pattern
    
    return {
      trackingId,
      source: urlParams.get('source') || undefined,
      videoId: urlParams.get('video_id') || undefined,
      feature: urlParams.get('feature') || undefined,
      from: urlParams.get('from_page') || undefined,
      query: urlParams.get('q') || undefined, // ADD THIS LINE
    };
  };

  // 🎯 SECURE: Track navigation without affecting access control
  const navigateWithTracking = (
    path: string,
    context: {
      source: string;
      videoId?: number;
      videoTitle?: string;
      seriesId?: string;
      feature?: string;
      query?: string; // ADD THIS LINE
    }
  ) => {
    const trackingUrl = generateTrackingUrl(path, {
      ...context,
      currentPage: location.pathname,
    });

    // Track the navigation event
    trackNavigationEvent('Page Navigation', {
      from: location.pathname,
      to: path,
      source: context.source,
      videoId: context.videoId?.toString(),
      feature: context.feature,
      query: context.query, // ADD THIS LINE
    });

    navigate(trackingUrl);
  };

  // 🔒 SECURE: Navigate to video with access control + tracking
  const navigateToVideo = (videoId: number, source: string = 'browse_click') => {
    const trackingUrl = generateTrackingUrl('/browse', {
      source,
      videoId,
      currentPage: location.pathname,
    });

    trackNavigationEvent('Video Click', {
      videoId: videoId.toString(),
      source,
      from: location.pathname,
    });

    navigate(trackingUrl);
  };

  // 🎯 SECURE: Navigate to profile/settings with tracking
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

  // 🎯 Navigate to upgrade with tracking
  const navigateToUpgrade = (context: {
    source: string;
    videoId?: number;
    videoTitle?: string;
    seriesId?: string;
    episodeNumber?: number;
  }) => {
    const upgradeUrl = generateTrackingUrl('/upgrade', {
      ...context,
      currentPage: location.pathname,
    });

    trackNavigationEvent('Upgrade Navigation', {
      from: location.pathname,
      source: context.source,
      videoId: context.videoId?.toString(),
    });

    navigate(upgradeUrl);
  };

  // 🎯 Navigate to search with tracking
  const navigateToSearch = (query: string) => {
    const searchUrl = generateTrackingUrl('/search', {
      source: 'search_action',
      feature: query,
      currentPage: location.pathname,
      query: query, // ADD THIS LINE
    });

    trackNavigationEvent('Search Navigation', {
      from: location.pathname,
      feature: query,
      query: query, // ADD THIS LINE
    });

    navigate(searchUrl);
  };

  return {
    trackNavigationEvent,
    getNavigationContextFromUrl,
    navigateWithTracking,
    navigateToVideo,
    navigateToProfile,
    navigateToUpgrade,
    navigateToSearch,
  };
};