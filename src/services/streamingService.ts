// src/services/streamingService.ts - HLS streaming service for backend integration

import axios, { AxiosInstance } from 'axios';
import { getAccessToken } from '../utils/cookies';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface StreamingUrlResponse {
  hls_url: string;
  qualities: string[];
  content_id: string;
  expert_name?: string;
  category?: string;
  duration?: number;
  title?: string;
  description?: string;
}

export interface ContentMetadata {
  id: string;
  title: string;
  description?: string;
  expert_name?: string;
  category?: string;
  duration?: number;
  thumbnail_url?: string;
}

export interface BrowseContent {
  content: ContentMetadata[];
  total: number;
  page: number;
  page_size: number;
}

class StreamingService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.error('❌ Unauthorized - redirecting to login');
          // You might want to trigger a logout or redirect here
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get HLS streaming URL for a specific content ID
   */
  async getStreamingUrl(
    contentId: string,
    quality?: string
  ): Promise<StreamingUrlResponse> {
    try {
      console.log(`📹 Requesting streaming URL for content: ${contentId}`);

      const params: Record<string, string> = {};
      if (quality) {
        params.quality = quality;
      }

      const response = await this.api.get<StreamingUrlResponse>(
        `/api/streaming/${contentId}`,
        { params }
      );

      console.log('✅ Streaming URL obtained:', {
        contentId: response.data.content_id,
        qualities: response.data.qualities,
      });

      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to get streaming URL:', error);

      if (error.response?.status === 401) {
        throw new Error('Please sign in to watch this content');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have access to this content');
      } else if (error.response?.status === 404) {
        throw new Error('Content not found');
      } else {
        throw new Error(
          error.response?.data?.detail || 'Failed to load streaming URL'
        );
      }
    }
  }

  /**
   * Browse available content
   */
  async browseContent(
    page: number = 1,
    pageSize: number = 20,
    category?: string,
    expert?: string
  ): Promise<BrowseContent> {
    try {
      console.log('📚 Browsing content...');

      const params: Record<string, string | number> = {
        page,
        page_size: pageSize,
      };

      if (category) {
        params.category = category;
      }

      if (expert) {
        params.expert = expert;
      }

      const response = await this.api.get<BrowseContent>(
        '/api/browse',
        { params }
      );

      console.log('✅ Content retrieved:', {
        total: response.data.total,
        page: response.data.page,
        count: response.data.content.length,
      });

      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to browse content:', error);

      if (error.response?.status === 401) {
        throw new Error('Please sign in to browse content');
      } else {
        throw new Error(
          error.response?.data?.detail || 'Failed to load content'
        );
      }
    }
  }

  /**
   * Get content metadata by ID
   */
  async getContentMetadata(contentId: string): Promise<ContentMetadata> {
    try {
      console.log(`📄 Fetching metadata for content: ${contentId}`);

      const response = await this.api.get<ContentMetadata>(
        `/api/content/${contentId}`
      );

      console.log('✅ Metadata retrieved:', response.data.title);

      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to get content metadata:', error);

      if (error.response?.status === 404) {
        throw new Error('Content not found');
      } else {
        throw new Error(
          error.response?.data?.detail || 'Failed to load content metadata'
        );
      }
    }
  }

  /**
   * Health check for streaming service
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.api.get('/health');
      return response.status === 200;
    } catch (error) {
      console.error('❌ Streaming service health check failed:', error);
      return false;
    }
  }

  /**
   * Test streaming endpoint with a specific content ID
   */
  async testStreaming(contentId: string): Promise<{
    success: boolean;
    url?: string;
    error?: string;
  }> {
    try {
      const result = await this.getStreamingUrl(contentId);
      return {
        success: true,
        url: result.hls_url,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

// Export singleton instance
export const streamingService = new StreamingService();
export default streamingService;
