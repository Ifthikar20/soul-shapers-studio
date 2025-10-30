// src/services/auth.service.ts
import axios from 'axios';
import type { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';
import { applySecurityInterceptors } from '../utils/api.security';
import {
  sanitizeInput,
  validateEmail,
  validatePassword,
  loginRateLimiter,
  SecureCookies,
  validateOAuthRedirect,
  preventTimingAttack,
  clearSensitiveData,
  logAuthEvent,
} from '../utils/auth.security';

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
    // Sanitize and validate inputs
    const sanitizedEmail = sanitizeInput(email);

    // Validate email format
    const emailValidation = validateEmail(sanitizedEmail);
    if (!emailValidation.valid) {
      logAuthEvent('LOGIN_FAILURE', { reason: 'Invalid email format' });
      throw new Error(emailValidation.error);
    }

    // Check rate limiting
    const rateLimitCheck = loginRateLimiter.checkAttempt(sanitizedEmail);
    if (!rateLimitCheck.allowed) {
      const blockedUntil = rateLimitCheck.blockedUntil;
      const message = blockedUntil
        ? `Too many login attempts. Please try again after ${blockedUntil.toLocaleTimeString()}`
        : 'Too many login attempts. Please try again later.';

      logAuthEvent('LOGIN_FAILURE', { reason: 'Rate limit exceeded', email: sanitizedEmail });
      throw new Error(message);
    }

    // Log login attempt
    logAuthEvent('LOGIN_ATTEMPT', { email: sanitizedEmail });

    // Prevent timing attacks by ensuring consistent response time
    return await preventTimingAttack(async () => {
      try {
        const response = await this.api.post('/auth/login', {
          email: sanitizedEmail,
          password
        });

        // Record successful login
        loginRateLimiter.recordSuccessfulAttempt(sanitizedEmail);
        logAuthEvent('LOGIN_SUCCESS', { email: sanitizedEmail });

        return response.data;
      } catch (error) {
        // Record failed attempt for rate limiting
        loginRateLimiter.recordFailedAttempt(sanitizedEmail);
        logAuthEvent('LOGIN_FAILURE', {
          email: sanitizedEmail,
          reason: this.handleError(error as AxiosError<ApiError>)
        });

        throw new Error(this.handleError(error as AxiosError<ApiError>));
      }
    }, 300); // Minimum 300ms to prevent timing attacks
  }
  
  
  async register(email: string, password: string, full_name: string) {
    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedName = sanitizeInput(full_name);

    // Validate email
    const emailValidation = validateEmail(sanitizedEmail);
    if (!emailValidation.valid) {
      logAuthEvent('LOGIN_FAILURE', { reason: 'Invalid email format' });
      throw new Error(emailValidation.error);
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      logAuthEvent('LOGIN_FAILURE', { reason: 'Weak password' });
      throw new Error(passwordValidation.error);
    }

    // Validate name
    if (!sanitizedName || sanitizedName.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }

    if (sanitizedName.length > 100) {
      throw new Error('Name is too long');
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: sanitizedEmail,
          password,
          full_name: sanitizedName
        }),
      });

      const data = await response.json();

      // Handle confirmation requirement (even if status is 200)
      if (data.requires_confirmation || data.detail?.requires_confirmation) {
        logAuthEvent('LOGIN_SUCCESS', { email: sanitizedEmail, requiresConfirmation: true });
        return {
          success: true,
          needsConfirmation: true,
          message: data.message || data.detail?.message || 'Please confirm your email'
        };
      }

      if (!response.ok) {
        logAuthEvent('LOGIN_FAILURE', { email: sanitizedEmail, reason: data.detail });
        throw new Error(data.detail || 'Registration failed');
      }

      logAuthEvent('LOGIN_SUCCESS', { email: sanitizedEmail });
      return data;
    } catch (error) {
      logAuthEvent('LOGIN_FAILURE', { email: sanitizedEmail, error: error instanceof Error ? error.message : 'Unknown' });
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
    const redirectUrl = `${import.meta.env.VITE_API_URL}/auth/google`;

    // Validate OAuth redirect for security
    const validation = validateOAuthRedirect(redirectUrl);
    if (!validation.valid) {
      logAuthEvent('OAUTH_REDIRECT', { provider: 'google', error: validation.error });
      throw new Error(validation.error || 'Invalid OAuth redirect');
    }

    logAuthEvent('OAUTH_REDIRECT', { provider: 'google', url: redirectUrl });

    // For Google login, redirect to your backend OAuth endpoint
    window.location.href = redirectUrl;
  }

  async loginWithApple(): Promise<void> {
    const redirectUrl = `${import.meta.env.VITE_API_URL}/auth/apple`;

    // Validate OAuth redirect for security
    const validation = validateOAuthRedirect(redirectUrl);
    if (!validation.valid) {
      logAuthEvent('OAUTH_REDIRECT', { provider: 'apple', error: validation.error });
      throw new Error(validation.error || 'Invalid OAuth redirect');
    }

    logAuthEvent('OAUTH_REDIRECT', { provider: 'apple', url: redirectUrl });

    // For Apple login, redirect to your backend OAuth endpoint
    window.location.href = redirectUrl;
  }

  async logout(): Promise<void> {
    logAuthEvent('LOGOUT', { timestamp: new Date().toISOString() });

    try {
      // Call backend logout endpoint to clear server-side session/cookies
      await this.api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
      logAuthEvent('LOGOUT', { error: 'Backend logout failed', continue: true });
      // Continue with logout even if backend call fails
    } finally {
      // Clear sensitive data from password fields
      clearSensitiveData();

      // Clear authentication cookies only (not all cookies)
      SecureCookies.clearAuthCookies();

      // Clear local and session storage
      localStorage.clear();
      sessionStorage.clear();

      logAuthEvent('LOGOUT', { status: 'completed', storage: 'cleared', cookies: 'cleared' });
    }
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