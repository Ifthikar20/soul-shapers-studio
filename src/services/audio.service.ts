// src/services/audio.service.ts - HLS Audio Streaming Service with Backend Integration

import axios, { AxiosInstance } from 'axios';
import { getAccessToken } from '../utils/cookies';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface AudioStreamingUrlResponse {
  hls_url: string;
  content_id: string;
  expert_name?: string;
  category?: string;
  duration?: number;
  title?: string;
  description?: string;
  thumbnail_url?: string;
}

export interface AudioMetadata {
  id: string;
  title: string;
  description?: string;
  expert_name?: string;
  expert_credentials?: string;
  category?: string;
  duration?: number;
  thumbnail_url?: string;
  access_tier?: 'free' | 'premium';
}

class AudioStreamingService {
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
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get HLS streaming URL for audio content
   * @param contentId - UUID of the content (must be in UUID format)
   */
  async getAudioStreamingUrl(contentId: string): Promise<AudioStreamingUrlResponse> {
    try {
      console.log(`🎵 Requesting audio streaming URL for content: ${contentId}`);

      // Use the correct endpoint: /api/streaming/content/{UUID}/stream
      const response = await this.api.get<any>(
        `/api/streaming/content/${contentId}/stream`
      );

      console.log('✅ Raw backend response:', response.data);

      // Backend might return different field names, try all possibilities
      const hlsUrl =
        response.data.hls_url ||
        response.data.hls_playlist_url ||
        response.data.streaming_urls?.['audio'] ||
        response.data.streaming_urls?.['720p'] ||
        response.data.stream_url ||
        response.data.audio_url;

      if (!hlsUrl) {
        console.error('❌ No HLS URL found in response:', response.data);
        throw new Error('No streaming URL provided by backend');
      }

      console.log('✅ Audio streaming URL extracted:', {
        contentId: response.data.content_id || contentId,
        hlsUrl: hlsUrl,
      });

      // Normalize response to expected format
      return {
        hls_url: hlsUrl,
        content_id: response.data.content_id || contentId,
        title: response.data.title,
        expert_name: response.data.expert_name,
        category: response.data.category,
        duration: response.data.duration,
        description: response.data.description,
        thumbnail_url: response.data.thumbnail_url,
      };
    } catch (error: any) {
      console.error('❌ Failed to get audio streaming URL:', error);

      if (error.response?.status === 401) {
        throw new Error('Please sign in to listen to this audio');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have access to this audio content');
      } else if (error.response?.status === 404) {
        throw new Error('Audio content not found. Ensure you are using a valid UUID.');
      } else {
        throw new Error(
          error.response?.data?.detail || error.message || 'Failed to load audio streaming URL'
        );
      }
    }
  }

  /**
   * Get audio content metadata by ID
   */
  async getAudioMetadata(contentId: string): Promise<AudioMetadata> {
    try {
      console.log(`📄 Fetching audio metadata for: ${contentId}`);

      const response = await this.api.get<AudioMetadata>(
        `/api/audio/content/${contentId}`
      );

      console.log('✅ Audio metadata retrieved:', response.data.title);

      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to get audio metadata:', error);

      if (error.response?.status === 404) {
        throw new Error('Audio content not found');
      } else {
        throw new Error(
          error.response?.data?.detail || 'Failed to load audio metadata'
        );
      }
    }
  }

  /**
   * Test audio streaming endpoint
   */
  async testAudioStreaming(contentId: string): Promise<{
    success: boolean;
    url?: string;
    error?: string;
  }> {
    try {
      const result = await this.getAudioStreamingUrl(contentId);
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
export const audioStreamingService = new AudioStreamingService();
export default audioStreamingService;