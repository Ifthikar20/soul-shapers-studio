// src/utils/api.security.ts - Secure API Client & Interceptors
// Provides automatic encryption, security headers, and protection mechanisms

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import {
  encryptRequest,
  decryptResponse,
  createSecurityHeaders,
  validateResponse,
  maskSensitiveData,
  isEncryptionEnabled,
  generateSecureToken,
} from './api.encryption';

/**
 * Security configuration for API requests
 */
export const API_SECURITY_CONFIG = {
  // HTTPS enforcement
  ENFORCE_HTTPS: import.meta.env.VITE_ENFORCE_HTTPS !== 'false',

  // Allowed origins for CORS
  ALLOWED_ORIGINS: [
    'https://betterandbliss.com',
    'https://www.betterandbliss.com',
    'https://api.betterandbliss.com',
  ],

  // Development mode
  IS_DEV: import.meta.env.DEV,

  // Enable request logging
  ENABLE_REQUEST_LOGGING: import.meta.env.VITE_ENABLE_REQUEST_LOGGING === 'true',

  // Enable response validation
  ENABLE_RESPONSE_VALIDATION: true,

  // Sensitive endpoints that should always be encrypted
  // Note: Auth endpoints excluded due to CORS preflight issues
  // They use HTTPS + httpOnly cookies for security instead
  SENSITIVE_ENDPOINTS: [
    '/payment',
    '/subscription',
    '/profile',
    '/user/settings',
    '/wallet',
    '/billing',
  ],

  // Public endpoints that don't need encryption or extra security headers
  PUBLIC_ENDPOINTS: [
    '/health',
    '/public',
    '/newsletter/subscribe',
    '/categories',
    '/auth/login',
    '/auth/register',
    '/auth/reset-password',
    '/auth/verify-email',
    '/auth/forgot-password',
    '/auth/me',
    '/auth/refresh',
    '/auth/logout',
    '/auth/google',
  ],
};

/**
 * Check if URL is HTTPS
 */
function isHTTPS(url: string): boolean {
  return url.startsWith('https://');
}

/**
 * Check if endpoint is sensitive
 */
function isSensitiveEndpoint(url: string): boolean {
  return API_SECURITY_CONFIG.SENSITIVE_ENDPOINTS.some(endpoint =>
    url.includes(endpoint)
  );
}

/**
 * Check if endpoint is public
 */
function isPublicEndpoint(url: string): boolean {
  return API_SECURITY_CONFIG.PUBLIC_ENDPOINTS.some(endpoint =>
    url.includes(endpoint)
  );
}

/**
 * Security event logger
 */
export class SecurityEventLogger {
  private static logs: Array<{
    type: string;
    message: string;
    timestamp: Date;
    details?: any;
  }> = [];

  static log(type: string, message: string, details?: any) {
    const log = {
      type,
      message,
      timestamp: new Date(),
      details: details ? maskSensitiveData(details) : undefined,
    };

    this.logs.push(log);

    // Keep only last 100 logs
    if (this.logs.length > 100) {
      this.logs.shift();
    }

    // Log to console in development
    if (API_SECURITY_CONFIG.ENABLE_REQUEST_LOGGING || API_SECURITY_CONFIG.IS_DEV) {
      console.log(`[SECURITY] [${type}]`, message, details ? maskSensitiveData(details) : '');
    }
  }

  static getLogs() {
    return [...this.logs];
  }

  static clear() {
    this.logs = [];
  }
}

/**
 * Request security interceptor
 * Adds security headers, enforces HTTPS, and optionally encrypts payload
 */
export async function securityRequestInterceptor(
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> {
  try {
    const url = config.url || '';
    const fullURL = config.baseURL ? `${config.baseURL}${url}` : url;

    // Enforce HTTPS in production
    if (
      API_SECURITY_CONFIG.ENFORCE_HTTPS &&
      !API_SECURITY_CONFIG.IS_DEV &&
      fullURL &&
      !isHTTPS(fullURL)
    ) {
      SecurityEventLogger.log(
        'HTTPS_VIOLATION',
        'Blocked non-HTTPS request in production',
        { url: fullURL }
      );
      throw new Error('HTTPS is required for API requests in production');
    }

    // Skip extra security headers for public endpoints to avoid CORS preflight
    // Public endpoints (like auth) rely on HTTPS + httpOnly cookies instead
    let requestId = '';
    if (!isPublicEndpoint(url)) {
      // Add security headers
      const securityHeaders = createSecurityHeaders();
      config.headers = {
        ...config.headers,
        ...securityHeaders,
      } as any;

      // Add request ID for tracking
      requestId = generateSecureToken(16);
      config.headers['X-Request-ID'] = requestId;
    }

    // Log request (masked)
    SecurityEventLogger.log('REQUEST', 'Outgoing API request', {
      method: config.method,
      url: fullURL,
      requestId: requestId || 'none',
    });

    // Encrypt request body for sensitive endpoints
    if (
      config.data &&
      (isEncryptionEnabled() || isSensitiveEndpoint(url)) &&
      !isPublicEndpoint(url)
    ) {
      try {
        config.data = await encryptRequest(config.data);
        config.headers['X-Encrypted'] = 'true';

        SecurityEventLogger.log('ENCRYPTION', 'Request payload encrypted', {
          url: fullURL,
          requestId,
        });
      } catch (error) {
        SecurityEventLogger.log('ENCRYPTION_ERROR', 'Failed to encrypt request', {
          url: fullURL,
          error: error instanceof Error ? error.message : 'Unknown error',
        });

        // For sensitive endpoints, fail the request if encryption fails
        if (isSensitiveEndpoint(url)) {
          throw new Error('Failed to encrypt sensitive request');
        }
      }
    }

    return config;
  } catch (error) {
    SecurityEventLogger.log('REQUEST_ERROR', 'Request interceptor error', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

/**
 * Response security interceptor
 * Validates response, decrypts if needed, and checks for security issues
 */
export async function securityResponseInterceptor(
  response: AxiosResponse
): Promise<AxiosResponse> {
  try {
    const requestId = response.config.headers?.['X-Request-ID'] as string;

    // Log response
    SecurityEventLogger.log('RESPONSE', 'Received API response', {
      status: response.status,
      url: response.config.url,
      requestId,
    });

    // Validate response integrity
    if (API_SECURITY_CONFIG.ENABLE_RESPONSE_VALIDATION) {
      if (!validateResponse(response.data)) {
        SecurityEventLogger.log(
          'VALIDATION_FAILED',
          'Response validation failed',
          {
            url: response.config.url,
            requestId,
          }
        );
        // Don't throw, just log warning
        console.warn('Response validation failed, possible security issue');
      }
    }

    // Decrypt response if encrypted
    if (response.data) {
      try {
        response.data = await decryptResponse(response.data);

        if (response.headers['x-encrypted'] === 'true') {
          SecurityEventLogger.log('DECRYPTION', 'Response payload decrypted', {
            url: response.config.url,
            requestId,
          });
        }
      } catch (error) {
        SecurityEventLogger.log('DECRYPTION_ERROR', 'Failed to decrypt response', {
          url: response.config.url,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        throw new Error('Failed to decrypt response data');
      }
    }

    return response;
  } catch (error) {
    SecurityEventLogger.log('RESPONSE_ERROR', 'Response interceptor error', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

/**
 * Error interceptor for security logging
 */
export function securityErrorInterceptor(error: any): Promise<any> {
  const requestId = error.config?.headers?.['X-Request-ID'];

  // Log security-relevant errors
  if (error.response) {
    const status = error.response.status;

    // Log security events
    if (status === 401) {
      SecurityEventLogger.log('UNAUTHORIZED', 'Unauthorized request', {
        url: error.config?.url,
        requestId,
      });
    } else if (status === 403) {
      SecurityEventLogger.log('FORBIDDEN', 'Forbidden request', {
        url: error.config?.url,
        requestId,
      });
    } else if (status === 429) {
      SecurityEventLogger.log('RATE_LIMIT', 'Rate limit exceeded', {
        url: error.config?.url,
        requestId,
      });
    } else if (status >= 500) {
      SecurityEventLogger.log('SERVER_ERROR', 'Server error', {
        url: error.config?.url,
        status,
        requestId,
      });
    }
  } else if (error.request) {
    SecurityEventLogger.log('NETWORK_ERROR', 'Network error', {
      url: error.config?.url,
      requestId,
    });
  }

  return Promise.reject(error);
}

/**
 * Apply security interceptors to an Axios instance
 */
export function applySecurityInterceptors(axiosInstance: AxiosInstance): void {
  // Request interceptor
  axiosInstance.interceptors.request.use(
    securityRequestInterceptor,
    (error) => {
      SecurityEventLogger.log('REQUEST_INTERCEPTOR_ERROR', 'Request interceptor error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    securityResponseInterceptor,
    securityErrorInterceptor
  );
}

/**
 * Create secure request config with security headers
 */
export function createSecureConfig(config?: AxiosRequestConfig): AxiosRequestConfig {
  const securityHeaders = createSecurityHeaders();

  return {
    ...config,
    headers: {
      ...config?.headers,
      ...securityHeaders,
    },
    // Ensure HTTPS in production
    ...(API_SECURITY_CONFIG.ENFORCE_HTTPS &&
      !API_SECURITY_CONFIG.IS_DEV && {
        validateStatus: (status) => {
          // Custom validation can be added here
          return status >= 200 && status < 300;
        },
      }),
  };
}

/**
 * Sanitize URL by removing sensitive query parameters
 */
export function sanitizeURL(url: string): string {
  try {
    const urlObj = new URL(url);
    const sensitiveParams = [
      'token',
      'access_token',
      'api_key',
      'apiKey',
      'password',
      'secret',
    ];

    sensitiveParams.forEach(param => {
      if (urlObj.searchParams.has(param)) {
        urlObj.searchParams.set(param, '****');
      }
    });

    return urlObj.toString();
  } catch {
    return url;
  }
}

/**
 * Check if request should be encrypted based on content
 */
export function shouldEncryptRequest(
  url: string,
  data: any
): boolean {
  // Always encrypt sensitive endpoints
  if (isSensitiveEndpoint(url)) {
    return true;
  }

  // Don't encrypt public endpoints
  if (isPublicEndpoint(url)) {
    return false;
  }

  // Encrypt if data contains sensitive fields
  if (data && typeof data === 'object') {
    const sensitiveFields = ['password', 'token', 'creditCard', 'ssn'];
    const jsonString = JSON.stringify(data).toLowerCase();
    return sensitiveFields.some(field => jsonString.includes(field));
  }

  // Default to global encryption setting
  return isEncryptionEnabled();
}

/**
 * Content Security Policy (CSP) headers helper
 */
export function getCSPHeaders(): Record<string, string> {
  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.betterandbliss.com https://www.google-analytics.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  };
}

/**
 * Check if environment is secure
 */
export function isSecureEnvironment(): boolean {
  return (
    window.location.protocol === 'https:' ||
    window.location.hostname === 'localhost' ||
    API_SECURITY_CONFIG.IS_DEV
  );
}

/**
 * Get security metrics
 */
export function getSecurityMetrics() {
  const logs = SecurityEventLogger.getLogs();

  return {
    totalRequests: logs.filter(l => l.type === 'REQUEST').length,
    encryptedRequests: logs.filter(l => l.type === 'ENCRYPTION').length,
    decryptedResponses: logs.filter(l => l.type === 'DECRYPTION').length,
    errors: logs.filter(l => l.type.includes('ERROR')).length,
    securityEvents: logs.filter(l =>
      ['UNAUTHORIZED', 'FORBIDDEN', 'RATE_LIMIT', 'HTTPS_VIOLATION'].includes(l.type)
    ).length,
    encryptionEnabled: isEncryptionEnabled(),
    httpsEnforced: API_SECURITY_CONFIG.ENFORCE_HTTPS,
    isSecureEnvironment: isSecureEnvironment(),
  };
}

export default {
  applySecurityInterceptors,
  createSecureConfig,
  sanitizeURL,
  shouldEncryptRequest,
  getCSPHeaders,
  isSecureEnvironment,
  getSecurityMetrics,
  SecurityEventLogger,
  API_SECURITY_CONFIG,
};
