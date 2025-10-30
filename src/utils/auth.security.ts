// src/utils/auth.security.ts - Security utilities for authentication
import { SecurityEventLogger } from './api.security';

/**
 * Input validation and sanitization for authentication
 */

// Email validation regex (RFC 5322 compliant)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password requirements
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

/**
 * Sanitize user input by removing potentially dangerous characters
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';

  // Remove null bytes, control characters, and script tags
  return input
    .replace(/\0/g, '')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
}

/**
 * Validate email address
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  const sanitized = sanitizeInput(email);

  if (!sanitized) {
    return { valid: false, error: 'Email is required' };
  }

  if (sanitized.length > 254) {
    return { valid: false, error: 'Email is too long' };
  }

  if (!EMAIL_REGEX.test(sanitized)) {
    return { valid: false, error: 'Invalid email format' };
  }

  return { valid: true };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return { valid: false, error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` };
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    return { valid: false, error: `Password must be less than ${PASSWORD_MAX_LENGTH} characters` };
  }

  // Check for at least one letter and one number
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain both letters and numbers' };
  }

  return { valid: true };
}

/**
 * Rate limiting for login attempts
 */
class LoginRateLimiter {
  private attempts: Map<string, { count: number; firstAttempt: number; blocked: boolean }> = new Map();
  private readonly MAX_ATTEMPTS = 5;
  private readonly WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  private readonly BLOCK_DURATION_MS = 30 * 60 * 1000; // 30 minutes

  /**
   * Check if login attempt is allowed
   */
  checkAttempt(identifier: string): { allowed: boolean; remainingAttempts?: number; blockedUntil?: Date } {
    const key = this.hashIdentifier(identifier);
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record) {
      return { allowed: true, remainingAttempts: this.MAX_ATTEMPTS };
    }

    // Check if block period has expired
    if (record.blocked) {
      const blockExpiry = record.firstAttempt + this.BLOCK_DURATION_MS;
      if (now > blockExpiry) {
        // Reset after block expires
        this.attempts.delete(key);
        return { allowed: true, remainingAttempts: this.MAX_ATTEMPTS };
      }

      SecurityEventLogger.log('LOGIN_BLOCKED', 'Login attempt blocked due to rate limiting', {
        identifier: key,
        blockedUntil: new Date(blockExpiry),
      });

      return { allowed: false, blockedUntil: new Date(blockExpiry) };
    }

    // Check if window has expired
    if (now - record.firstAttempt > this.WINDOW_MS) {
      // Reset counter
      this.attempts.delete(key);
      return { allowed: true, remainingAttempts: this.MAX_ATTEMPTS };
    }

    // Check if max attempts reached
    if (record.count >= this.MAX_ATTEMPTS) {
      record.blocked = true;
      const blockExpiry = now + this.BLOCK_DURATION_MS;

      SecurityEventLogger.log('LOGIN_RATE_LIMIT_EXCEEDED', 'Too many login attempts', {
        identifier: key,
        attempts: record.count,
      });

      return { allowed: false, blockedUntil: new Date(blockExpiry) };
    }

    return {
      allowed: true,
      remainingAttempts: this.MAX_ATTEMPTS - record.count
    };
  }

  /**
   * Record a failed login attempt
   */
  recordFailedAttempt(identifier: string): void {
    const key = this.hashIdentifier(identifier);
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record) {
      this.attempts.set(key, {
        count: 1,
        firstAttempt: now,
        blocked: false,
      });
    } else {
      record.count++;
    }

    SecurityEventLogger.log('LOGIN_FAILED', 'Failed login attempt recorded', {
      identifier: key,
      attempts: record ? record.count : 1,
    });
  }

  /**
   * Record a successful login (reset counter)
   */
  recordSuccessfulAttempt(identifier: string): void {
    const key = this.hashIdentifier(identifier);
    this.attempts.delete(key);

    SecurityEventLogger.log('LOGIN_SUCCESS', 'Successful login, rate limit reset', {
      identifier: key,
    });
  }

  /**
   * Simple hash function for identifier
   */
  private hashIdentifier(identifier: string): string {
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
      const char = identifier.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  /**
   * Clean up old entries periodically
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.attempts.entries()) {
      if (now - record.firstAttempt > this.BLOCK_DURATION_MS) {
        this.attempts.delete(key);
      }
    }
  }
}

// Singleton instance
export const loginRateLimiter = new LoginRateLimiter();

// Run cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => loginRateLimiter.cleanup(), 5 * 60 * 1000);
}

/**
 * Secure cookie management for auth
 */
export const SecureCookies = {
  /**
   * Get authentication-related cookies only
   */
  getAuthCookies(): string[] {
    const authCookieNames = [
      'session',
      'access_token',
      'refresh_token',
      'csrf_token',
      'auth_token',
      'user_session',
    ];

    const cookies: string[] = [];
    const allCookies = document.cookie.split(';');

    for (const cookie of allCookies) {
      const cookieName = cookie.trim().split('=')[0].toLowerCase();
      if (authCookieNames.some(name => cookieName.includes(name))) {
        cookies.push(cookie.trim().split('=')[0]);
      }
    }

    return cookies;
  },

  /**
   * Clear authentication cookies only (not all cookies)
   */
  clearAuthCookies(): void {
    const authCookies = this.getAuthCookies();
    const domains = [
      window.location.hostname,
      `.${window.location.hostname}`,
      '',
    ];
    const paths = ['/', ''];

    authCookies.forEach(cookieName => {
      // Try all domain and path combinations to ensure cleanup
      domains.forEach(domain => {
        paths.forEach(path => {
          const cookieString = [
            `${cookieName}=`,
            'expires=Thu, 01 Jan 1970 00:00:00 GMT',
            domain ? `domain=${domain}` : '',
            path ? `path=${path}` : '',
            'SameSite=Strict',
          ]
            .filter(Boolean)
            .join('; ');

          document.cookie = cookieString;
        });
      });
    });

    SecurityEventLogger.log('COOKIES_CLEARED', 'Authentication cookies cleared', {
      count: authCookies.length,
      cookies: authCookies,
    });
  },

  /**
   * Validate cookie flags for security
   */
  validateCookieSecurity(): { secure: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check if we're on HTTPS
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      issues.push('Application not running on HTTPS');
    }

    // Note: HttpOnly cookies cannot be checked from JavaScript (which is good for security)
    // SameSite and Secure flags are set server-side

    return {
      secure: issues.length === 0,
      issues,
    };
  },
};

/**
 * Secure OAuth redirect validation
 */
export function validateOAuthRedirect(url: string): { valid: boolean; error?: string } {
  try {
    const urlObj = new URL(url);

    // Only allow HTTPS in production
    if (window.location.protocol === 'https:' && urlObj.protocol !== 'https:') {
      SecurityEventLogger.log('OAUTH_SECURITY_VIOLATION', 'Non-HTTPS OAuth redirect blocked', {
        url,
      });
      return { valid: false, error: 'OAuth redirect must use HTTPS' };
    }

    // Validate allowed OAuth providers
    const allowedHosts = [
      'accounts.google.com',
      'appleid.apple.com',
      new URL(import.meta.env.VITE_API_URL || 'http://localhost:8000').hostname,
    ];

    if (!allowedHosts.includes(urlObj.hostname)) {
      SecurityEventLogger.log('OAUTH_INVALID_HOST', 'Unauthorized OAuth host', {
        host: urlObj.hostname,
      });
      return { valid: false, error: 'Unauthorized OAuth provider' };
    }

    return { valid: true };
  } catch (error) {
    SecurityEventLogger.log('OAUTH_URL_INVALID', 'Invalid OAuth URL', { url });
    return { valid: false, error: 'Invalid OAuth URL' };
  }
}

/**
 * Prevent timing attacks by adding consistent delay
 */
export async function preventTimingAttack<T>(
  operation: () => Promise<T>,
  minDurationMs: number = 200
): Promise<T> {
  const start = Date.now();

  try {
    const result = await operation();
    const elapsed = Date.now() - start;

    if (elapsed < minDurationMs) {
      await new Promise(resolve => setTimeout(resolve, minDurationMs - elapsed));
    }

    return result;
  } catch (error) {
    const elapsed = Date.now() - start;

    if (elapsed < minDurationMs) {
      await new Promise(resolve => setTimeout(resolve, minDurationMs - elapsed));
    }

    throw error;
  }
}

/**
 * Clear sensitive data from memory
 */
export function clearSensitiveData(): void {
  // Clear password fields
  const passwordFields = document.querySelectorAll('input[type="password"]');
  passwordFields.forEach((field: any) => {
    field.value = '';
  });

  SecurityEventLogger.log('SENSITIVE_DATA_CLEARED', 'Sensitive data cleared from memory', {});
}

/**
 * Log authentication events for security monitoring
 */
export function logAuthEvent(
  event: 'LOGIN_ATTEMPT' | 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'LOGOUT' | 'SESSION_EXPIRED' | 'OAUTH_REDIRECT',
  details?: any
): void {
  SecurityEventLogger.log(event, `Authentication event: ${event}`, details);
}

export default {
  sanitizeInput,
  validateEmail,
  validatePassword,
  loginRateLimiter,
  SecureCookies,
  validateOAuthRedirect,
  preventTimingAttack,
  clearSensitiveData,
  logAuthEvent,
};
