// src/services/auth.service.ts
// src/services/auth.service.ts
import axios from 'axios';
import type { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { applySecurityInterceptors } from '../utils/api.security';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.betterandbliss.com';
// Rest of your code remains the same

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

class AuthService {
  private api: AxiosInstance;
  private refreshPromise: Promise<void> | null = null;
  
  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
      withCredentials: true, // Important for cookies
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });

    // Apply security interceptors for encryption and security headers
    applySecurityInterceptors(this.api);

    // Request interceptor for CSRF token
    this.api.interceptors.request.use(
      (config) => {
        // Add CSRF token if available
        const csrfToken = this.getCSRFToken();
        if (csrfToken) {
          config.headers['X-CSRF-Token'] = csrfToken;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    
// Replace the existing response interceptor with this:

this.api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // Only retry token refresh for specific routes and if we haven't tried already
    if (
      error.response?.status === 401 && 
      !originalRequest._retry &&
      // DON'T retry for these auth endpoints:
      originalRequest.url !== '/auth/me' &&
      originalRequest.url !== '/auth/refresh' &&
      originalRequest.url !== '/auth/login' &&
      originalRequest.url !== '/auth/register' &&
      originalRequest.url !== '/auth/google' &&
      originalRequest.url !== '/auth/logout'
    ) {
      originalRequest._retry = true;
      
      // Prevent multiple refresh calls
      if (!this.refreshPromise) {
        this.refreshPromise = this.refreshToken();
      }
      
      try {
        await this.refreshPromise;
        this.refreshPromise = null;
        return this.api.request(originalRequest);
      } catch (refreshError) {
        this.refreshPromise = null;
        // Only redirect if not already on login page
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
    // Get CSRF token from cookie
    const match = document.cookie.match(/csrf_token=([^;]+)/);
    return match ? match[1] : null;
  }
  
  private handleError(error: AxiosError<ApiError>): string {
    if (error.response?.data) {
      const data = error.response.data;
      return data.detail || data.message || 'An error occurred';
    }
    if (error.request) {
      return 'No response from server. Please check your connection.';
    }
    return error.message || 'An unexpected error occurred';
  }
  
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw new Error(this.handleError(error as AxiosError<ApiError>));
    }
  }
  
  
  async register(email: string, password: string, full_name: string) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, full_name }),
      });
  
      const data = await response.json();
      
      // Handle confirmation requirement (even if status is 200)
      if (data.requires_confirmation || data.detail?.requires_confirmation) {
        return {
          success: true,
          needsConfirmation: true,
          message: data.message || data.detail?.message || 'Please confirm your email'
        };
      }
      
      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  }
  
  async getCurrentUser(): Promise<User> {
    const response = await this.api.get('/auth/me');
    return response.data;
  }
  
  async refreshToken(): Promise<void> {
    await this.api.post('/auth/refresh');
  }
  
  async loginWithGoogle(): Promise<void> {
    // For Google login, redirect to your backend OAuth endpoint
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  }
  
  // Additional methods for your app
  async forgotPassword(email: string): Promise<void> {
    await this.api.post('/auth/forgot-password', { email });
  }
  
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await this.api.post('/auth/reset-password', { token, password: newPassword });
  }
  
  async verifyEmail(token: string): Promise<void> {
    await this.api.post(`/auth/verify-email/${token}`);
  }
  
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await this.api.patch('/auth/profile', data);
    return response.data;
  }
  
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await this.api.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword
    });
  }
  
  // Check if user can access specific content
  async checkContentAccess(contentId: string): Promise<boolean> {
    try {
      const response = await this.api.get(`/content/${contentId}/access`);
      return response.data.hasAccess;
    } catch {
      return false;
    }
  }
}

export const authService = new AuthService();