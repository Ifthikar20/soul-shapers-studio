import axios, { AxiosInstance } from 'axios';
import { getAccessToken } from '@/utils/cookies';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface MeditationSession {
  session_id: string;
  user_id: string;
  session_type: 'guided' | 'free_practice';
  target_breath_duration: number;
  started_at: string;
}

export interface SessionStats {
  session_id: string;
  live: boolean;
  breath_count?: number;
  current_phase?: string;
  avg_consistency?: number;
  is_calibrated?: boolean;
  completed?: boolean;
}

class MeditationService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    });

    this.api.interceptors.request.use((config) => {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async startSession(
    sessionType: 'guided' | 'free_practice' = 'free_practice',
    targetBreathDuration: number = 4,
    contentId?: string
  ): Promise<MeditationSession> {
    const response = await this.api.post('/api/meditation/sessions/start', {
      session_type: sessionType,
      target_breath_duration: targetBreathDuration,
      content_id: contentId,
    });
    return response.data;
  }

  async completeSession(
    sessionId: string,
    durationSeconds: number,
    totalBreaths: number
  ): Promise<any> {
    const response = await this.api.post(
      `/api/meditation/sessions/${sessionId}/complete`,
      { duration_seconds: durationSeconds, total_breaths: totalBreaths }
    );
    return response.data;
  }

  async getSessionStats(sessionId: string): Promise<SessionStats> {
    const response = await this.api.get(
      `/api/meditation/sessions/${sessionId}/stats`
    );
    return response.data;
  }

  getWebSocketUrl(): string {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const apiUrl = API_BASE_URL.replace(/^https?:\/\//, '');
    return `${wsProtocol}//${apiUrl}/api/meditation/ws/breath`;
  }
}

export const meditationService = new MeditationService();
