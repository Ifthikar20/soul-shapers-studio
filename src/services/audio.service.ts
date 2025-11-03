// src/services/audio.service.ts
//
// ⚠️ IMPORTANT INTEGRATION NOTES:
// 1. The backend streaming endpoint requires UUID format IDs (e.g., '0b8df95c-4a61-4446-b3a9-431091477455')
//    NOT integer IDs (e.g., 1, 2, 3)
// 2. Authentication token is now correctly read from cookies (not localStorage)
// 3. Backend endpoint: /api/streaming/content/{UUID}/stream
// 4. Currently, audio content uses mock data with simple IDs - integration pending
//
import axios from 'axios';
import { SecureCookies } from '@/utils/auth.security';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface SecureAudioResponse {
  content_id: string; // ✅ CHANGED: Should be UUID string, not number
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
      // Get access token from cookies instead of localStorage
      const accessToken = SecureCookies.getCookie('access_token');

      const headers: Record<string, string> = {};
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      const response = await axios.get(
        `${API_URL}/api/streaming/content/${contentSlug}/stream`,
        {
          headers,
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