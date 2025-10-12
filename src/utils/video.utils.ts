// src/utils/video.utils.ts - Video utility functions

/**
 * Safely convert video ID to number
 * Handles both string and number inputs
 */
export function toVideoId(id: string | number): number {
    if (typeof id === 'number') {
      return id;
    }
    
    const numId = parseInt(id, 10);
    
    if (isNaN(numId)) {
      throw new Error(`Invalid video ID: ${id}`);
    }
    
    return numId;
  }
  
  /**
   * Format video duration from seconds to human-readable string
   */
  export function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
  
  /**
   * Format video views count
   */
  export function formatViews(views: number): string {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  }
  
  /**
   * Calculate video progress percentage
   */
  export function calculateProgress(currentTime: number, duration: number): number {
    if (!duration || duration === 0) return 0;
    return Math.min((currentTime / duration) * 100, 100);
  }
  
  /**
   * Check if video is considered "watched" (>90% completion)
   */
  export function isVideoWatched(currentTime: number, duration: number): boolean {
    return calculateProgress(currentTime, duration) >= 90;
  }
  
  /**
   * Get quality label from resolution
   */
  export function getQualityLabel(quality: string): string {
    const labels: Record<string, string> = {
      'auto': 'Auto',
      '2160p': '4K',
      '1440p': '2K',
      '1080p': 'Full HD',
      '720p': 'HD',
      '480p': 'SD',
      '360p': 'Low',
    };
    
    return labels[quality] || quality;
  }
  
  /**
   * Validate video URL format
   */
  export function isValidVideoUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }
  
  /**
   * Parse HLS manifest URL to get base URL
   */
  export function getBaseUrl(manifestUrl: string): string {
    try {
      const url = new URL(manifestUrl);
      return `${url.protocol}//${url.host}${url.pathname.substring(0, url.pathname.lastIndexOf('/'))}`;
    } catch {
      return '';
    }
  }
  
  /**
   * Debounce function for analytics tracking
   */
  export function debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
    
    return function executedFunction(...args: Parameters<T>) {
      const later = () => {
        timeout = null;
        func(...args);
      };
      
      if (timeout) {
        clearTimeout(timeout);
      }
      
      timeout = setTimeout(later, wait);
    };
  }
  
  /**
   * Throttle function for frequent events
   */
  export function throttle<T extends (...args: any[]) => void>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false;
    
    return function executedFunction(...args: Parameters<T>) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }