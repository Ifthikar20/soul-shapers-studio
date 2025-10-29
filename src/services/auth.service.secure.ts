// src/services/auth.service.secure.ts
// Example of how to integrate security into existing auth service
// This file demonstrates the integration pattern - you can apply this to your auth.service.ts

import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import { applySecurityInterceptors } from '@/utils/api.security';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.betterandbliss.com';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'free_user' | 'premium_user' | 'admin';
  subscription_tier: 'free' | 'basic' | 'premium';
  permissions: string[];
}

interface LoginResponse {
  success: boolean;
  user: User;
  token_type: string;
  expires_in: number;
}

interface ApiError {
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

/**
 * INTEGRATION GUIDE:
 *
 * To add security to your existing auth.service.ts:
 *
 * 1. Import the security utilities:
 *    import { applySecurityInterceptors } from '@/utils/api.security';
 *
 * 2. After creating your axios instance, apply security interceptors:
 *    this.api = axios.create({ ... });
 *    applySecurityInterceptors(this.api);
 *
 * That's it! All requests will now be:
 * - Automatically encrypted (for sensitive endpoints)
 * - Signed with HMAC
 * - Protected with security headers
 * - Logged for security monitoring
 * - Validated for HTTPS in production
 */

class SecureAuthService {
  private api: AxiosInstance;
  private refreshPromise: Promise<void> | null = null;

  constructor() {
    // Create axios instance with standard configuration
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    // ============================================
    // SECURITY INTEGRATION: Apply security interceptors
    // This adds encryption, HTTPS enforcement, and security headers
    // ============================================
    applySecurityInterceptors(this.api);

    // Your existing interceptors can still be added
    // They will work alongside security interceptors
    this.setupAuthInterceptors();
  }

  private setupAuthInterceptors() {
    // CSRF token interceptor (your existing code)
    this.api.interceptors.request.use(
      (config) => {
        const csrfToken = this.getCSRFToken();
        if (csrfToken) {
          config.headers['X-CSRF-Token'] = csrfToken;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Token refresh interceptor (your existing code)
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          originalRequest.url !== '/auth/me' &&
          originalRequest.url !== '/auth/refresh' &&
          originalRequest.url !== '/auth/login' &&
          originalRequest.url !== '/auth/register'
        ) {
          originalRequest._retry = true;

          if (!this.refreshPromise) {
            this.refreshPromise = this.refreshToken();
          }

          try {
            await this.refreshPromise;
            this.refreshPromise = null;
            return this.api.request(originalRequest);
          } catch (refreshError) {
            this.refreshPromise = null;
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private getCSRFToken(): string | null {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'csrf_token') {
        return decodeURIComponent(value);
      }
    }
    return null;
  }

  /**
   * Login - This request will be automatically encrypted because /auth/login
   * is marked as a sensitive endpoint in api.security.ts
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      // Your payload will be automatically encrypted before sending
      const response = await this.api.post('/auth/login', {
        email,
        password,
      });

      // Response will be automatically decrypted if it was encrypted
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Register - Also automatically encrypted
   */
  async register(
    email: string,
    password: string,
    name: string
  ): Promise<LoginResponse> {
    try {
      const response = await this.api.post('/auth/register', {
        email,
        password,
        name,
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Get current user - Standard request with security headers
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.api.get('/auth/me');
      return response.data.user;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Refresh token
   */
  async refreshToken(): Promise<void> {
    try {
      await this.api.post('/auth/refresh');
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  }

  /**
   * Reset password - Automatically encrypted
   */
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.api.post('/auth/reset-password', {
        token,
        new_password: newPassword,
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: AxiosError<ApiError>): Error {
    if (error.response) {
      const apiError = error.response.data;

      if (apiError?.detail) {
        return new Error(apiError.detail);
      }

      if (apiError?.message) {
        return new Error(apiError.message);
      }

      if (apiError?.errors) {
        const firstError = Object.values(apiError.errors)[0];
        return new Error(firstError?.[0] || 'Validation error');
      }

      if (error.response.status === 401) {
        return new Error('Invalid credentials');
      }

      if (error.response.status === 403) {
        return new Error('Access denied');
      }

      if (error.response.status >= 500) {
        return new Error('Server error. Please try again later.');
      }
    }

    if (error.request) {
      return new Error('Network error. Please check your connection.');
    }

    return new Error('An unexpected error occurred');
  }
}

// Export singleton instance
export const secureAuthService = new SecureAuthService();

/**
 * MIGRATION CHECKLIST:
 *
 * To migrate your existing auth.service.ts to use security:
 *
 * ✅ 1. Import applySecurityInterceptors from '@/utils/api.security'
 * ✅ 2. Call applySecurityInterceptors(this.api) after creating axios instance
 * ✅ 3. That's it! No other changes needed.
 *
 * What you get automatically:
 * - Request encryption for /auth/login, /auth/register, /auth/reset-password
 * - Response decryption for encrypted responses
 * - HMAC request signing for integrity
 * - Security headers (X-Request-ID, X-Timestamp, etc.)
 * - HTTPS enforcement in production
 * - Security event logging
 * - Request/response validation
 *
 * Optional: Configure in .env
 * - VITE_API_ENCRYPTION_ENABLED=true (default)
 * - VITE_ENFORCE_HTTPS=true (default in production)
 * - VITE_ENABLE_REQUEST_LOGGING=true (for debugging)
 * - VITE_API_ENCRYPTION_KEY=your-secret-key (IMPORTANT: Change in production!)
 * - VITE_API_HMAC_KEY=your-hmac-key (IMPORTANT: Change in production!)
 */
