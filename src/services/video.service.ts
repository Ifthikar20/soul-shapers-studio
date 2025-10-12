// src/services/video.service.ts - Secure video streaming service
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface VideoStreamResponse {
  streamUrl: string;
  token: string;
  expiresAt: string;
  videoId: string;
  quality: string[];
  cdnEnabled: boolean;
}

interface VideoAccessRequest {
  videoId: number;
  quality?: 'auto' | '1080p' | '720p' | '480p' | '360p';
}

class VideoService {
  private accessToken: string | null = null;

  /**
   * 🔒 Get secure streaming URL with authentication token
   */
  async getSecureStreamUrl(request: VideoAccessRequest): Promise<VideoStreamResponse> {
    try {
      // Get auth token from localStorage
      const authToken = localStorage.getItem('auth_token');
      
      if (!authToken) {
        throw new Error('Authentication required');
      }

      const response = await axios.post<VideoStreamResponse>(
        `${API_BASE_URL}/videos/${request.videoId}/stream`,
        {
          quality: request.quality || 'auto',
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      // Store the video access token
      this.accessToken = response.data.token;

      console.log('✅ Secure stream URL obtained:', {
        videoId: response.data.videoId,
        expiresAt: response.data.expiresAt,
        cdnEnabled: response.data.cdnEnabled,
      });

      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to get secure stream URL:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Please sign in to watch this video');
      } else if (error.response?.status === 403) {
        throw new Error('Upgrade required to access this content');
      } else if (error.response?.status === 404) {
        throw new Error('Video not found');
      } else {
        throw new Error('Failed to load video stream. Please try again.');
      }
    }
  }

  /**
   * 🔒 Refresh expired stream token
   */
  async refreshStreamToken(videoId: number): Promise<VideoStreamResponse> {
    try {
      const authToken = localStorage.getItem('auth_token');
      
      if (!authToken) {
        throw new Error('Authentication required');
      }

      const response = await axios.post<VideoStreamResponse>(
        `${API_BASE_URL}/videos/${videoId}/stream/refresh`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'X-Video-Token': this.accessToken || '',
          },
          withCredentials: true,
        }
      );

      this.accessToken = response.data.token;

      console.log('✅ Stream token refreshed');

      return response.data;
    } catch (error) {
      console.error('❌ Failed to refresh stream token:', error);
      throw new Error('Session expired. Please reload the video.');
    }
  }

  /**
   * 📊 Track video analytics (view, progress, completion)
   */
  async trackVideoEvent(data: {
    videoId: number;
    event: 'view' | 'progress' | 'complete' | 'pause' | 'seek' | 'error';
    position?: number;
    fromPosition?: number;
    toPosition?: number;
    errorCode?: string;
    errorMessage?: string;
  }): Promise<void> {
    try {
      const authToken = localStorage.getItem('auth_token');
      
      if (!authToken) {
        // Anonymous tracking allowed for some events
        console.log('📊 Anonymous video event:', data.event);
        return;
      }

      await axios.post(
        `${API_BASE_URL}/videos/${data.videoId}/analytics`,
        {
          event: data.event,
          position: data.position,
          fromPosition: data.fromPosition,
          toPosition: data.toPosition,
          errorCode: data.errorCode,
          errorMessage: data.errorMessage,
          timestamp: new Date().toISOString(),
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'X-Video-Token': this.accessToken || '',
          },
          withCredentials: true,
        }
      );

      console.log('📊 Video event tracked:', data.event);
    } catch (error) {
      // Don't throw errors for analytics - fail silently
      console.warn('⚠️ Failed to track video event:', error);
    }
  }

  /**
   * 🔒 Verify video access (client-side check before requesting stream)
   */
  async verifyVideoAccess(videoId: number): Promise<{
    hasAccess: boolean;
    reason?: string;
    upgradeRequired?: boolean;
  }> {
    try {
      const authToken = localStorage.getItem('auth_token');
      
      if (!authToken) {
        return {
          hasAccess: false,
          reason: 'Authentication required',
          upgradeRequired: false,
        };
      }

      const response = await axios.get(
        `${API_BASE_URL}/videos/${videoId}/access`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to verify video access:', error);
      
      if (error.response?.status === 403) {
        return {
          hasAccess: false,
          reason: error.response.data?.message || 'Upgrade required',
          upgradeRequired: true,
        };
      }

      return {
        hasAccess: false,
        reason: 'Unable to verify access',
        upgradeRequired: false,
      };
    }
  }

  /**
   * 📥 Get available video qualities
   */
  async getAvailableQualities(videoId: number): Promise<string[]> {
    try {
      const authToken = localStorage.getItem('auth_token');
      
      const response = await axios.get(
        `${API_BASE_URL}/videos/${videoId}/qualities`,
        {
          headers: authToken ? {
            'Authorization': `Bearer ${authToken}`,
          } : undefined,
        }
      );

      return response.data.qualities || ['auto', '1080p', '720p', '480p', '360p'];
    } catch (error) {
      console.error('❌ Failed to get available qualities:', error);
      return ['auto', '720p', '480p', '360p'];
    }
  }

  /**
   * 🧹 Clear access token on logout
   */
  clearAccessToken(): void {
    this.accessToken = null;
  }
}

// Export singleton instance
export const videoService = new VideoService();