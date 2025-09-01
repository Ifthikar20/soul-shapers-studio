// src/services/content.service.ts
import axios from 'axios';

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  content_type: string;
  duration_seconds: number;
  duration_formatted: string;
  access_tier: 'free' | 'premium';
  featured: boolean;
  trending: boolean;
  is_new: boolean;
  view_count: number;
  like_count: number;
  thumbnail_url: string | null;
  video_url: string | null;
  created_at: string | null;
  expert: {
    name: string;
    slug: string;
    title: string;
    avatar_url: string | null;
    verified: boolean;
  };
  category: {
    name: string;
    slug: string;
    icon: string;
    color: string;
  };
  accessible: boolean;
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

  // Convert backend content to frontend video format
  private convertToVideoContent(item: ContentItem): any {
    return {
      id: parseInt(item.id),
      title: item.title,
      expert: item.expert.name,
      expertCredentials: item.expert.title,
      expertAvatar: item.expert.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${item.expert.name}`,
      duration: item.duration_formatted,
      category: item.category.name,
      contentType: item.content_type,
      rating: 4.8, // Default until you add ratings to backend
      views: this.formatViews(item.view_count),
      thumbnail: item.thumbnail_url || "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=250&fit=crop",
      isNew: item.is_new,
      isTrending: item.trending,
      description: item.description,
      fullDescription: item.description,
      videoUrl: item.video_url || "#",
      relatedTopics: [], // Add this to your backend if needed
      learningObjectives: [], // Add this to your backend if needed
      accessTier: item.access_tier,
      isFirstEpisode: item.access_tier === 'free', // Temporary logic
      accessible: item.accessible,
      hashtags: [`#${item.category.name.replace(/\s+/g, '')}`, `#${item.expert.name.split(' ')[0]}`]
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

  async getContentDetail(slug: string): Promise<ContentItem> {
    try {
      const response = await this.api.get(`/content/detail/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch content detail:', error);
      throw error;
    }
  }

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

  async getHeroContent(): Promise<{ hero_content: any[]; total: number }> {
    try {
      const response = await this.api.get('/content/hero');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch hero content:', error);
      throw error;
    }
  }

  // Convert backend data to match your existing frontend components
  async getVideosForFrontend(category?: string): Promise<any[]> {
    try {
      const response = await this.getBrowseContent(category);
      return response.content.map(item => this.convertToVideoContent(item));
    } catch (error) {
      console.error('Failed to get videos for frontend:', error);
      return [];
    }
  }
}

export const contentService = new ContentService();