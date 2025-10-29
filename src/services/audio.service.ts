// src/services/audio.service.ts - NEW FILE
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface SecureAudioResponse {
  content_id: number;
  content_type: 'audio';
  title: string;
  duration_seconds: number;
  audio_url: string;
  audio_format: string;
  expires_at: string;
  is_secure: boolean;
  cdn_enabled: boolean;
  thumbnail_url?: string;
  expert_name?: string;
  expert_credentials?: string;
  category?: string;
  description?: string;
  full_description?: string;
  access_tier?: 'free' | 'premium';
  security_info: {
    token_required: boolean;
    url_expires: string;
  };
}

class AudioStreamingService {
  async getSecureAudioStream(contentSlug: string): Promise<SecureAudioResponse> {
    try {
      const response = await axios.get(
        `${API_URL}/api/streaming/content/${contentSlug}/stream`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          withCredentials: true,
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Failed to get audio stream:', error);
      throw error;
    }
  }
}

export const audioStreamingService = new AudioStreamingService();