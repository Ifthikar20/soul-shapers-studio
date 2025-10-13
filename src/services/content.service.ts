// ============================================
// FILE 2: src/services/content.service.ts
// ============================================
import axios from 'axios';
import { Video } from '@/types/video.types';

interface ContentItem {
  id: string; // UUID from backend
  title: string;
  slug: string;
  description: string;
  content_type: string;
  duration_seconds: number;
  access_tier: 'free' | 'premium';
  featured: boolean;
  expert_name: string;
  expert_title: string;
  category_name: string;
  category_color: string;
}

class ContentService {
  private api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    withCredentials: true,
    timeout: 10000,
  });

  // ✅ Format duration from seconds to MM:SS
  private formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // ✅ SIMPLIFIED: Convert backend content to frontend video format using UUID
  private convertToVideoContent(item: ContentItem): Video {
    return {
      id: item.id, // ✅ Use UUID directly
      slug: item.slug,
      title: item.title,
      expert: item.expert_name,
      expertCredentials: item.expert_title,
      expertAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${item.expert_name}`,
      duration: this.formatDuration(item.duration_seconds),
      category: item.category_name,
      rating: 4.8,
      views: '0',
      thumbnail: "Sample image",
      isNew: false,
      isTrending: item.featured,
      description: item.description,
      fullDescription: item.description,
      videoUrl: '', // Will be fetched separately via streaming endpoint
      relatedTopics: [],
      learningObjectives: [],
      accessTier: item.access_tier,
      isFirstEpisode: item.access_tier === 'free',
    };
  }

  /**
   * ✅ Get all videos for frontend display
   */
  async getVideosForFrontend(category?: string): Promise<Video[]> {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      params.append('limit', '20');

      const response = await this.api.get(`/content/browse?${params.toString()}`);
      
      console.log('📦 Raw backend data (first item):', response.data.content[0]);
      
      const videos = response.data.content.map((item: ContentItem) => 
        this.convertToVideoContent(item)
      );
      
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
   * ✅ NEW: Get single video by UUID
   * This makes a direct backend call instead of fetching all videos
   */
  async getVideoByUUID(uuid: string): Promise<Video> {
    try {
      console.log('🔍 Fetching video with UUID:', uuid);
      
      // Direct backend call using detail endpoint
      const response = await this.api.get(`/content/detail/${uuid}`);
      
      console.log('✅ Video loaded from backend:', response.data);
      
      return this.convertToVideoContent(response.data);
    } catch (error: any) {
      console.error('❌ Failed to fetch video by UUID:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Video not found');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Please upgrade your subscription.');
      } else {
        throw new Error('Failed to load video');
      }
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
        throw new Error('Video not found');
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

export const contentService = new ContentService();
