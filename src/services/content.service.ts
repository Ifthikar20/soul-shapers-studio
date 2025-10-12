// src/services/content.service.ts
import axios from 'axios';
import { Video } from '@/types/video.types';

interface ContentItem {
  id: string; // UUID from backend
  // short_id doesn't exist in backend response yet
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

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
}

interface Expert {
  id: string;
  name: string;
  slug: string;
  title: string;
  bio: string;
  avatar_url: string | null;
  specialties: string[];
  verified: boolean;
}

interface BrowseResponse {
  content: ContentItem[];
  categories: Category[];
  total: number;
  user_authenticated: boolean;
  premium_available: boolean;
  filters: {
    category: string | null;
    limit: number;
  };
}

class ContentService {
  private api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    withCredentials: true,
    timeout: 10000,
  });

  private API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

  // ✅ Generate a consistent 11-character short_id from UUID
  private generateShortIdFromUUID(uuid: string): string {
    // Remove hyphens from UUID
    const cleaned = uuid.replace(/-/g, '');
    
    // Base62 character set (alphanumeric only)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let shortId = '';
    
    // Take characters from specific positions for consistency
    // This ensures the same UUID always generates the same short_id
    const positions = [0, 4, 8, 12, 16, 20, 24, 28, 2, 6, 10];
    
    for (let i = 0; i < 11; i++) {
      const pos = positions[i] % cleaned.length;
      const charCode = cleaned.charCodeAt(pos);
      shortId += chars[charCode % chars.length];
    }
    
    console.log('🔑 Generated short_id:', { uuid, shortId });
    return shortId;
  }

  // ✅ Hash UUID string to number for id field
  private hashStringToNumber(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  // ✅ Format duration from seconds to MM:SS
  private formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // ✅ UPDATED: Convert backend content to frontend video format with generated short_id
  private convertToVideoContent(item: ContentItem): Video {
    // Generate short_id from UUID since backend doesn't provide it yet
    const shortId = this.generateShortIdFromUUID(item.id);
    
    return {
      id: this.hashStringToNumber(item.id), // Convert UUID to number
      short_id: shortId, // ✅ Generated short_id
      slug: item.slug, // Keep for SEO
      title: item.title,
      expert: item.expert_name,
      expertCredentials: item.expert_title,
      expertAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${item.expert_name}`,
      duration: this.formatDuration(item.duration_seconds),
      category: item.category_name,
      rating: 4.8, // Default rating
      views: '0', // Backend doesn't provide view count yet
      thumbnail: "Sample image", // Backend doesn't provide thumbnail yet
      isNew: false,
      isTrending: item.featured,
      description: item.description,
      fullDescription: item.description,
      videoUrl: `${this.API_BASE}/content/${item.id}/stream`, // Use UUID for backend
      relatedTopics: [],
      learningObjectives: [],
      accessTier: item.access_tier,
      isFirstEpisode: item.access_tier === 'free',
    };
  }

  private formatViews(count: number): string {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // ============================================
  // BROWSE & CATEGORY METHODS
  // ============================================

  async getBrowseContent(category?: string, limit: number = 20): Promise<BrowseResponse> {
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

  async getCategories(): Promise<{ categories: Category[]; total: number }> {
    try {
      const response = await this.api.get('/content/categories');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      throw error;
    }
  }

  async getFeaturedExperts(limit: number = 6): Promise<{ experts: Expert[]; total: number }> {
    try {
      const response = await this.api.get(`/content/experts?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch experts:', error);
      throw error;
    }
  }

  async getHeroContent(): Promise<{ hero_content: any[]; total: number }> {
    try {
      const response = await this.api.get('/content/hero');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch hero content:', error);
      throw error;
    }
  }

  // ============================================
  // VIDEO METHODS (UPDATED FOR SHORT_ID)
  // ============================================

  /**
   * ✅ Get all videos for frontend display
   * Converts backend format to frontend Video type with generated short_id
   */
  async getVideosForFrontend(category?: string): Promise<Video[]> {
    try {
      const response = await this.getBrowseContent(category);
      
      console.log('📦 Raw backend data (first item):', response.content[0]);
      
      const videos = response.content.map(item => this.convertToVideoContent(item));
      
      console.log('📦 Converted video (first item):', {
        id: videos[0]?.id,
        short_id: videos[0]?.short_id,
        title: videos[0]?.title
      });
      
      return videos;
    } catch (error) {
      console.error('Failed to get videos for frontend:', error);
      return [];
    }
  }

  /**
   * ✅ NEW: Get single video by short_id
   * This is the primary method for fetching video details on watch page
   */
  async getVideoByShortId(shortId: string): Promise<Video> {
    try {
      console.log('🔍 Searching for video with short_id:', shortId);
      
      // Since backend doesn't support short_id lookup yet,
      // fetch all videos and find the matching one
      const allVideos = await this.getVideosForFrontend();
      
      console.log('📦 Available short_ids:', allVideos.map(v => ({
        short_id: v.short_id,
        title: v.title
      })));
      
      const matchingVideo = allVideos.find(v => v.short_id === shortId);
      
      if (!matchingVideo) {
        console.error('❌ No video found with short_id:', shortId);
        throw new Error('Video not found');
      }
      
      console.log('✅ Found matching video:', {
        short_id: matchingVideo.short_id,
        title: matchingVideo.title
      });
      
      return matchingVideo;
    } catch (error) {
      console.error('❌ Failed to fetch video by short_id:', error);
      throw error;
    }
  }

  /**
   * ✅ Get content detail by slug (legacy support)
   * Used for SEO and backward compatibility
   */
  async getContentDetail(slug: string): Promise<ContentItem> {
    try {
      const response = await this.api.get(`/content/detail/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch content detail:', error);
      throw error;
    }
  }

  /**
   * ✅ NEW: Get video stream URL by short_id
   * Returns the actual streaming URL for video playback
   */
  async getVideoStreamUrl(shortId: string): Promise<string> {
    try {
      // First find the video by short_id to get the UUID
      const video = await this.getVideoByShortId(shortId);
      
      // Then get the stream URL using the backend's UUID-based endpoint
      const response = await this.api.get(
        `/content/${video.id}/stream`,
        {
          headers: this.getAuthHeaders(),
          responseType: 'json'
        }
      );
      return response.data.streamUrl || response.data.video_url;
    } catch (error) {
      console.error('Failed to get video stream URL:', error);
      throw error;
    }
  }

  /**
   * ✅ NEW: Get slug by short_id
   * Used for SEO metadata and canonical URLs
   */
  async getSlugByShortId(shortId: string): Promise<string> {
    try {
      const video = await this.getVideoByShortId(shortId);
      return video.slug || '';
    } catch (error) {
      console.error('Failed to get slug:', error);
      throw error;
    }
  }

  /**
   * ✅ NEW: Get short_id by slug
   * Used for redirecting legacy slug-based URLs to new short_id URLs
   */
  async getShortIdBySlug(slug: string): Promise<string> {
    try {
      const allVideos = await this.getVideosForFrontend();
      const matchingVideo = allVideos.find(v => v.slug === slug);
      
      if (!matchingVideo) {
        throw new Error('Video not found');
      }
      
      return matchingVideo.short_id;
    } catch (error) {
      console.error('Failed to get short_id by slug:', error);
      throw error;
    }
  }

  // ============================================
  // SEARCH METHOD
  // ============================================

  async searchContent(query: string, category?: string): Promise<{
    content: ContentItem[];
    query: string;
    total_results: number;
    user_authenticated: boolean;
    categories: Category[];
  }> {
    try {
      const params = new URLSearchParams({ q: query });
      if (category) params.append('category', category);

      const response = await this.api.get(`/content/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to search content:', error);
      throw error;
    }
  }
}

export const contentService = new ContentService();