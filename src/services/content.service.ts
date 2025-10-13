// ============================================
// FILE: src/services/content.service.ts - FIXED VERSION
// ============================================
import axios from 'axios';
import { Video, normalizeVideo } from '@/types/video.types'; // ✅ Import normalizeVideo

interface ContentItem {
  id: string; // UUID from backend
  title: string;
  slug: string;
  description: string;
  content_type: string;
  duration_seconds: number;
  access_tier: 'free' | 'premium';
  featured: boolean;
  is_new?: boolean;
  expert_name: string;
  expert_title: string;
  expert_avatar?: string;
  category_name: string;
  category_color: string;
  thumbnail_url?: string;
  video_url?: string;
  view_count?: number;
  series_id?: string;
  episode_number?: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
}

class ContentService {
  private api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    withCredentials: true,
    timeout: 10000,
  });

  /**
   * ✅ Get all videos for frontend display
   * Uses normalizeVideo helper for consistent data format
   */
  async getVideosForFrontend(category?: string): Promise<Video[]> {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      params.append('limit', '20');

      const response = await this.api.get(`/content/browse?${params.toString()}`);
      
      console.log('📦 Raw backend data (first item):', response.data.content[0]);
      
      // ✅ Use normalizeVideo helper instead of custom conversion
      const videos = response.data.content.map((item: any) => normalizeVideo(item));
      
      console.log('📦 Converted video (first item):', {
        id: videos[0]?.id,
        title: videos[0]?.title
      });
      
      return videos;
    } catch (error) {
      console.error('Failed to get videos for frontend:', error);
      return [];
    }
  }

  /**
   * ✅ FIXED: Get single video by UUID
   * Updated to handle backend response correctly
   */
  async getVideoByUUID(uuid: string): Promise<Video> {
    try {
      console.log('🔍 Fetching video with UUID:', uuid);
      
      // ✅ Try the detail endpoint first
      const response = await this.api.get(`/content/detail/${uuid}`);
      
      console.log('✅ Video loaded from backend:', response.data);
      
      // ✅ Use normalizeVideo to ensure consistent format
      return normalizeVideo(response.data);
    } catch (error: any) {
      console.error('❌ Failed to fetch video by UUID:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // ✅ Better error handling
      if (error.response?.status === 404) {
        throw new Error('Video not found');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Please upgrade your subscription.');
      } else if (error.response?.status === 500) {
        // Backend error - try to get from browse instead
        console.warn('⚠️ Backend detail endpoint failed, trying browse endpoint...');
        return this.getVideoFromBrowse(uuid);
      } else {
        throw new Error(`Failed to load video: ${error.message}`);
      }
    }
  }

  /**
   * ✅ FALLBACK: Get video from browse endpoint if detail fails
   * This is a workaround for backend issues
   */
  private async getVideoFromBrowse(uuid: string): Promise<Video> {
    try {
      console.log('🔄 Attempting to fetch video from browse endpoint...');
      
      const response = await this.api.get('/content/browse?limit=100');
      const video = response.data.content.find((item: any) => item.id === uuid);
      
      if (!video) {
        throw new Error('Video not found in browse results');
      }
      
      console.log('✅ Video found in browse results');
      return normalizeVideo(video);
    } catch (error) {
      console.error('❌ Fallback also failed:', error);
      throw new Error('Video not found');
    }
  }

  /**
   * ✅ NEW: Get video streaming URLs by UUID
   * Returns secure streaming data from backend
   */
  async getVideoStreamData(uuid: string): Promise<{
    streamUrl: string;
    qualities: string[];
    thumbnailUrl?: string;
  }> {
    try {
      console.log('🎬 Fetching stream data for UUID:', uuid);
      
      // ✅ Try streaming endpoint
      const response = await this.api.get(`/api/streaming/content/${uuid}/stream`);
      
      console.log('✅ Stream data received:', response.data);
      
      return {
        streamUrl: response.data.streaming_urls?.['720p'] || 
                   response.data.streaming_urls?.['1080p'] || 
                   response.data.hls_playlist_url || '',
        qualities: response.data.available_qualities || [],
        thumbnailUrl: response.data.thumbnail_url,
      };
    } catch (error: any) {
      console.error('❌ Failed to get stream data:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Please sign in to watch this video');
      } else if (error.response?.status === 403) {
        throw new Error('Upgrade required to access this content');
      } else if (error.response?.status === 404) {
        throw new Error('Video stream not found');
      } else {
        throw new Error('Failed to load video stream');
      }
    }
  }

  /**
   * ✅ Get all categories
   */
  async getCategories(): Promise<{ categories: Category[]; total: number }> {
    try {
      const response = await this.api.get('/content/categories');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  }

  /**
   * ✅ Get browse content
   */
  async getBrowseContent(category?: string, limit: number = 20): Promise<{
    content: ContentItem[];
    total: number;
  }> {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      params.append('limit', limit.toString());

      const response = await this.api.get(`/content/browse?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch browse content:', error);
      throw error;
    }
  }

  /**
   * ✅ NEW: Check if video exists and user has access
   */
  async checkVideoAccess(uuid: string): Promise<{
    hasAccess: boolean;
    requiresUpgrade: boolean;
    tier: 'free' | 'basic' | 'premium'; // ✅ Fixed to include 'basic'
  }> {
    try {
      const video = await this.getVideoByUUID(uuid);
      
      return {
        hasAccess: video.accessTier === 'free' || video.isFirstEpisode === true,
        requiresUpgrade: video.accessTier === 'premium' && !video.isFirstEpisode,
        tier: video.accessTier,
      };
    } catch (error) {
      return {
        hasAccess: false,
        requiresUpgrade: true,
        tier: 'premium',
      };
    }
  }

  /**
   * ✅ NEW: Debug helper to check backend connectivity
   */
  async debugBackendHealth(): Promise<void> {
    try {
      console.log('🔍 Testing backend connectivity...');
      console.log('📍 API Base URL:', this.api.defaults.baseURL);
      
      // Test basic connectivity
      const response = await this.api.get('/content/categories');
      console.log('✅ Backend is reachable');
      console.log('📊 Categories endpoint working:', response.status === 200);
      
      // Test browse endpoint
      const browseResponse = await this.api.get('/content/browse?limit=1');
      console.log('📊 Browse endpoint working:', browseResponse.status === 200);
      console.log('📦 Sample content ID:', browseResponse.data.content[0]?.id);
      
      return;
    } catch (error: any) {
      console.error('❌ Backend health check failed:', error.message);
      console.error('🔍 Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
    }
  }
}

export const contentService = new ContentService();

// ✅ Export for debugging in console
if (import.meta.env.DEV) {
  (window as any).contentService = contentService;
  console.log('🔧 Development mode: contentService available in console');
  console.log('💡 Try: contentService.debugBackendHealth()');
}