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
   */
  async getAudioStreamingUrl(contentId: string): Promise<AudioStreamingUrlResponse> {
    try {
      console.log(`🎵 Requesting audio streaming URL for content: ${contentId}`);

      const response = await this.api.get<AudioStreamingUrlResponse>(
        `/api/audio/streaming/${contentId}`
      );

      console.log('✅ Audio streaming URL obtained:', {
        contentId: response.data.content_id,
        hlsUrl: response.data.hls_url,
      });

      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to get audio streaming URL:', error);

      if (error.response?.status === 401) {
        throw new Error('Please sign in to listen to this audio');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have access to this audio content');
      } else if (error.response?.status === 404) {
        throw new Error('Audio content not found');
      } else {
        throw new Error(
          error.response?.data?.detail || 'Failed to load audio streaming URL'
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