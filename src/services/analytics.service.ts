// src/services/analytics.service.ts - SECURE VERSION
import ReactGA from 'react-ga4';
import { GA_CONFIG, GA_DEBUG } from '@/config/analytics.config';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

interface VideoMetadata {
  content_id: string;
  title: string;
  content_type: string;
  duration_seconds: number;
  access_tier: string;
  category: string | null;
  expert: string | null;
  series: string | null;
  episode_number: number | null;
}

class AnalyticsService {
  private isInitialized: boolean = false;
  private isEnabled: boolean = false;

  /**
   * Initialize Google Analytics
   * Call this once when app starts
   */
  initialize() {
    // Don't initialize if already done or disabled
    if (this.isInitialized || !GA_CONFIG.enabled) {
      console.log('ℹ️ Google Analytics disabled or already initialized');
      return;
    }

    // Don't initialize without measurement ID
    if (!GA_CONFIG.measurementId) {
      console.warn('⚠️ GA_MEASUREMENT_ID not configured');
      return;
    }

    try {
      ReactGA.initialize(GA_CONFIG.measurementId, {
        gaOptions: GA_CONFIG.options,
        gtagOptions: {
          debug_mode: GA_DEBUG,
        },
      });

      this.isInitialized = true;
      this.isEnabled = true;

      console.log('✅ Google Analytics initialized:', GA_CONFIG.measurementId);
      
      if (GA_DEBUG) {
        console.log('🐛 GA Debug mode enabled');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Google Analytics:', error);
    }
  }

  /**
   * Check if analytics is ready to use
   */
  private checkReady(): boolean {
    if (!this.isEnabled || !this.isInitialized) {
      if (GA_DEBUG) {
        console.log('⚠️ Analytics not enabled');
      }
      return false;
    }
    return true;
  }

  /**
   * Fetch content metadata from backend
   */
  private async getContentMetadata(contentId: string): Promise<VideoMetadata | null> {
    try {
      const response = await fetch(`${BACKEND_URL}/api/analytics/content/${contentId}/metadata`);
      
      if (!response.ok) {
        console.warn(`Failed to fetch metadata for ${contentId}`);
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching content metadata:', error);
      return null;
    }
  }

  /**
   * Track page view
   * Automatically called by Router integration
   */
  trackPageView(path: string, title?: string) {
    if (!this.checkReady()) return;

    ReactGA.send({
      hitType: 'pageview',
      page: path,
      title: title,
    });

    if (GA_DEBUG) {
      console.log('📄 Page view tracked:', path);
    }
  }

  /**
   * Track video view event
   */
  async trackVideoView(video: {
    id: string | number;
    short_id?: string;
    title: string;
    category?: string;
    expert?: string;
    duration?: number;
  }) {
    if (!this.checkReady()) return;

    try {
      const contentId = video.short_id || String(video.id);
      
      // Get enriched metadata from backend
      const metadata = await this.getContentMetadata(contentId);
      
      // Send to Google Analytics
      ReactGA.event('video_view', {
        content_id: contentId,
        video_title: metadata?.title || video.title,
        category: metadata?.category || video.category || 'Unknown',
        expert: metadata?.expert || video.expert || 'Unknown',
        duration_seconds: metadata?.duration_seconds || video.duration || 0,
        access_tier: metadata?.access_tier || 'free',
        content_type: metadata?.content_type || 'video',
        series: metadata?.series || undefined,
        episode_number: metadata?.episode_number || undefined,
      });

      if (GA_DEBUG) {
        console.log('📊 Video view tracked:', contentId);
      }
    } catch (error) {
      console.error('Failed to track video view:', error);
    }
  }

  /**
   * Track video play
   */
  trackVideoPlay(videoId: string, videoTitle: string) {
    if (!this.checkReady()) return;

    ReactGA.event('video_play', {
      content_id: videoId,
      video_title: videoTitle,
      event_category: 'video_engagement',
    });

    if (GA_DEBUG) {
      console.log('▶️ Video play tracked:', videoId);
    }
  }

  /**
   * Track video pause
   */
  trackVideoPause(videoId: string, currentTime: number, duration: number) {
    if (!this.checkReady()) return;

    const progressPercent = Math.round((currentTime / duration) * 100);

    ReactGA.event('video_pause', {
      content_id: videoId,
      current_time: Math.round(currentTime),
      duration: Math.round(duration),
      progress_percent: progressPercent,
      event_category: 'video_engagement',
    });

    if (GA_DEBUG) {
      console.log('⏸️ Video pause tracked:', videoId, `${progressPercent}%`);
    }
  }

  /**
   * Track video completion
   */
  trackVideoComplete(videoId: string, videoTitle: string, watchTime: number) {
    if (!this.checkReady()) return;

    ReactGA.event('video_complete', {
      content_id: videoId,
      video_title: videoTitle,
      watch_time_seconds: Math.round(watchTime),
      event_category: 'video_engagement',
    });

    if (GA_DEBUG) {
      console.log('✅ Video complete tracked:', videoId);
    }
  }

  /**
   * Track video progress milestones
   */
  trackVideoProgress(videoId: string, percent: number, currentTime: number) {
    if (!this.checkReady()) return;

    const milestones = [25, 50, 75, 90];
    if (!milestones.includes(percent)) return;

    ReactGA.event('video_progress', {
      content_id: videoId,
      progress_percent: percent,
      current_time: Math.round(currentTime),
      event_category: 'video_engagement',
    });

    if (GA_DEBUG) {
      console.log(`📈 Video progress tracked: ${percent}%`);
    }
  }

  /**
   * Track content favorite
   */
  trackContentFavorite(contentId: string, contentTitle: string, action: 'add' | 'remove') {
    if (!this.checkReady()) return;

    ReactGA.event(action === 'add' ? 'add_to_favorites' : 'remove_from_favorites', {
      content_id: contentId,
      content_title: contentTitle,
      event_category: 'content_interaction',
    });

    if (GA_DEBUG) {
      console.log(`❤️ Favorite ${action} tracked:`, contentId);
    }
  }

  /**
   * Track content share
   */
  trackContentShare(contentId: string, contentTitle: string, method: string) {
    if (!this.checkReady()) return;

    ReactGA.event('share', {
      content_id: contentId,
      content_title: contentTitle,
      method: method,
      event_category: 'content_interaction',
    });

    if (GA_DEBUG) {
      console.log('🔗 Share tracked:', contentId, method);
    }
  }

  /**
   * Track user registration
   */
  trackSignUp(method: string = 'email') {
    if (!this.checkReady()) return;

    ReactGA.event('sign_up', {
      method: method,
      event_category: 'user_lifecycle',
    });

    if (GA_DEBUG) {
      console.log('👤 Sign up tracked:', method);
    }
  }

  /**
   * Track user login
   */
  trackLogin(method: string = 'email') {
    if (!this.checkReady()) return;

    ReactGA.event('login', {
      method: method,
      event_category: 'user_lifecycle',
    });

    if (GA_DEBUG) {
      console.log('🔐 Login tracked:', method);
    }
  }

  /**
   * Track subscription purchase
   */
  trackSubscription(tier: string, price: number, transactionId?: string) {
    if (!this.checkReady()) return;

    ReactGA.event('purchase', {
      transaction_id: transactionId || `sub_${Date.now()}`,
      value: price,
      currency: 'USD',
      items: [{
        item_name: `${tier} Subscription`,
        item_category: 'subscription',
        price: price,
        quantity: 1,
      }],
      event_category: 'monetization',
    });

    if (GA_DEBUG) {
      console.log('💳 Subscription tracked:', tier, price);
    }
  }

  /**
   * Track search
   */
  trackSearch(searchTerm: string, resultCount: number) {
    if (!this.checkReady()) return;

    ReactGA.event('search', {
      search_term: searchTerm,
      result_count: resultCount,
      event_category: 'discovery',
    });

    if (GA_DEBUG) {
      console.log('🔍 Search tracked:', searchTerm);
    }
  }

  /**
   * Track category view
   */
  trackCategoryView(categoryName: string, categorySlug: string) {
    if (!this.checkReady()) return;

    ReactGA.event('view_category', {
      category_name: categoryName,
      category_slug: categorySlug,
      event_category: 'discovery',
    });

    if (GA_DEBUG) {
      console.log('📂 Category view tracked:', categoryName);
    }
  }

  /**
   * Track expert view
   */
  trackExpertView(expertName: string, expertSlug: string) {
    if (!this.checkReady()) return;

    ReactGA.event('view_expert', {
      expert_name: expertName,
      expert_slug: expertSlug,
      event_category: 'discovery',
    });

    if (GA_DEBUG) {
      console.log('👨‍⚕️ Expert view tracked:', expertName);
    }
  }

  /**
   * Set user properties for logged-in users
   */
  setUserProperties(userId: string, properties: {
    subscription_tier?: string;
    user_role?: string;
  }) {
    if (!this.checkReady()) return;

    ReactGA.set({
      user_id: userId,
      ...properties,
    });

    if (GA_DEBUG) {
      console.log('👤 User properties set:', userId);
    }
  }

  /**
   * Track custom event
   */
  trackEvent(eventName: string, parameters?: Record<string, any>) {
    if (!this.checkReady()) return;

    ReactGA.event(eventName, parameters);

    if (GA_DEBUG) {
      console.log('📊 Custom event tracked:', eventName, parameters);
    }
  }

  /**
   * Disable tracking (for user privacy settings)
   */
  disable() {
    this.isEnabled = false;
    console.log('🔒 Analytics tracking disabled');
  }

  /**
   * Enable tracking
   */
  enable() {
    if (this.isInitialized) {
      this.isEnabled = true;
      console.log('✅ Analytics tracking enabled');
    }
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();