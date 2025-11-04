// ============================================
// FILE: src/services/content.service.ts - WITH SIMPLE FALLBACK
// ============================================
import axios from 'axios';
import { Video, normalizeVideo } from '@/types/video.types';

interface ContentItem {
  id: string;
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

  async getVideosForFrontend(category?: string): Promise<Video[]> {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      params.append('limit', '20');

      const response = await this.api.get(`/content/browse?${params.toString()}`);
      const videos = response.data.content.map((item: any) => normalizeVideo(item));

      return videos;
    } catch (error) {
      console.error('Failed to get videos for frontend:', error);
      return [];
    }
  }

  /**
   * Get audio content from backend
   * @param category Optional category filter
   * @param limit Maximum number of items to return
   */
  async getAudioContent(category?: string, limit: number = 50): Promise<ContentItem[]> {
    try {
      const params = new URLSearchParams();
      params.append('content_type', 'audio');
      if (category) params.append('category', category);
      params.append('limit', limit.toString());

      console.log('🎵 Fetching audio content from backend:', params.toString());

      const response = await this.api.get(`/content/browse?${params.toString()}`);
      console.log(`✅ Loaded ${response.data.content?.length || 0} audio items from backend`);

      return response.data.content || [];
    } catch (error) {
      console.error('❌ Failed to get audio content:', error);
      return [];
    }
  }

  /**
   * Get audio content by UUID
   */
  async getAudioByUUID(uuid: string): Promise<ContentItem> {
    try {
      console.log('🎵 Fetching audio with UUID:', uuid);

      const response = await this.api.get(`/content/detail/${uuid}`);
      console.log('✅ Audio loaded from backend:', response.data);

      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to fetch audio by UUID:', error);

      if (error.response?.status === 404) {
        throw new Error('Audio content not found');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Please upgrade your subscription.');
      } else {
        throw new Error(`Failed to load audio: ${error.message}`);
      }
    }
  }

  async getVideoByUUID(uuid: string): Promise<Video> {
    try {
      console.log('🔍 Fetching video with UUID:', uuid);
      
      const response = await this.api.get(`/content/detail/${uuid}`);
      console.log('✅ Video loaded from backend:', response.data);
      
      return normalizeVideo(response.data);
    } catch (error: any) {
      console.error('❌ Failed to fetch video by UUID:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Video not found');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Please upgrade your subscription.');
      } else if (error.response?.status === 500) {
        console.warn('⚠️ Backend detail endpoint failed, trying browse endpoint...');
        return this.getVideoFromBrowse(uuid);
      } else {
        throw new Error(`Failed to load video: ${error.message}`);
      }
    }
  }

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
   * ✅ UPDATED: Get video streaming URLs with fallback
   * Tries multiple endpoints, then falls back to using video_url directly
   */
  async getVideoStreamData(uuid: string): Promise<{
    streamUrl: string;
    qualities: string[];
    thumbnailUrl?: string;
  }> {
    console.log('🎬 Fetching stream data for UUID:', uuid);
    
    // Step 1: Try dedicated streaming endpoints
    const streamingEndpoints = [
      `/api/streaming/content/${uuid}/stream`,
      `/content/${uuid}/stream`,
      `/api/videos/${uuid}/stream`,
    ];

    for (const endpoint of streamingEndpoints) {
      try {
        console.log(`🔄 Trying streaming endpoint: ${endpoint}`);
        const response = await this.api.get(endpoint);
        
        const streamUrl = 
          response.data.streaming_urls?.['720p'] || 
          response.data.streaming_urls?.['1080p'] || 
          response.data.hls_playlist_url ||
          response.data.stream_url ||
          response.data.video_url;

        if (streamUrl) {
          console.log('✅ Stream URL found from streaming endpoint');
          return {
            streamUrl,
            qualities: response.data.available_qualities || ['auto'],
            thumbnailUrl: response.data.thumbnail_url,
          };
        }
      } catch (error: any) {
        console.log(`❌ Endpoint ${endpoint} failed:`, error.message);
        
        // Don't try other endpoints on auth errors
        if (error.response?.status === 401 || error.response?.status === 403) {
          throw error;
        }
      }
    }

    // Step 2: Fallback - Get video_url directly from video metadata
    console.log('⚠️ No streaming endpoints available, using video_url fallback');
    
    try {
      const video = await this.getVideoByUUID(uuid);
      
      // Check if video has a video_url
      if (video.videoUrl || video.video_url) {
        const fallbackUrl = video.videoUrl || video.video_url;
        console.log('✅ Using video_url from metadata:', fallbackUrl);
        
        return {
          streamUrl: fallbackUrl,
          qualities: ['auto'],
          thumbnailUrl: video.thumbnail,
        };
      }
      
      // No video URL available at all
      console.error('❌ No video_url found in metadata');
      throw new Error('Video source not available');
      
    } catch (error: any) {
      console.error('❌ Fallback failed:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Please sign in to watch this video');
      } else if (error.response?.status === 403) {
        throw new Error('Upgrade required to access this content');
      } else {
        throw new Error('Failed to load video stream. Please try again.');
      }
    }
  }

  async getCategories(): Promise<{ categories: Category[]; total: number }> {
    try {
      const response = await this.api.get('/content/categories');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  }

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

  async checkVideoAccess(uuid: string): Promise<{
    hasAccess: boolean;
    requiresUpgrade: boolean;
    tier: 'free' | 'basic' | 'premium';
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

  async debugBackendHealth(): Promise<void> {
    try {
      console.log('🔍 Testing backend connectivity...');
      console.log('📍 API Base URL:', this.api.defaults.baseURL);
      
      const response = await this.api.get('/content/categories');
      console.log('✅ Backend is reachable');
      console.log('📊 Categories endpoint working:', response.status === 200);
      
      const browseResponse = await this.api.get('/content/browse?limit=1');
      console.log('📊 Browse endpoint working:', browseResponse.status === 200);
      console.log('📦 Sample content:', browseResponse.data.content[0]);
      
      // Check if video has video_url field
      if (browseResponse.data.content[0]) {
        const sampleVideo = browseResponse.data.content[0];
        console.log('📹 Sample video fields:', {
          id: sampleVideo.id,
          video_url: sampleVideo.video_url ? '✅ Present' : '❌ Missing',
          thumbnail_url: sampleVideo.thumbnail_url ? '✅ Present' : '❌ Missing',
        });
      }
      
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

if (import.meta.env.DEV) {
  (window as any).contentService = contentService;
  console.log('🔧 Development mode: contentService available in console');
  console.log('💡 Try: contentService.debugBackendHealth()');
}