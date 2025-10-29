// src/utils/search.security.ts - Secure Search Utilities
// Provides comprehensive security measures for search functionality

/**
 * Security Configuration for Search
 */
export const SEARCH_SECURITY_CONFIG = {
  // Maximum search query length
  MAX_QUERY_LENGTH: 200,

  // Minimum search query length
  MIN_QUERY_LENGTH: 1,

  // Rate limiting: max searches per minute
  MAX_SEARCHES_PER_MINUTE: 20,

  // Allowed characters pattern (alphanumeric, spaces, common punctuation)
  ALLOWED_CHARACTERS: /^[a-zA-Z0-9\s\-_.,!?'"()&]+$/,

  // Dangerous patterns to block
  BLOCKED_PATTERNS: [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // Script tags
    /javascript:/gi, // JavaScript protocol
    /on\w+\s*=/gi, // Event handlers (onclick, onerror, etc.)
    /<iframe/gi, // Iframes
    /<embed/gi, // Embed tags
    /<object/gi, // Object tags
    /data:text\/html/gi, // Data URLs
    /vbscript:/gi, // VBScript protocol
    /<meta/gi, // Meta tags
    /<!--[\s\S]*?-->/g, // HTML comments
  ],

  // SQL injection patterns (for future backend protection)
  SQL_INJECTION_PATTERNS: [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE)\b)/gi,
    /(\bOR\b\s+\d+\s*=\s*\d+)/gi, // OR 1=1
    /(\bAND\b\s+\d+\s*=\s*\d+)/gi, // AND 1=1
    /(--|\/\*|\*\/|;)/g, // SQL comment and terminator characters
    /(\b(xp_|sp_)\w+)/gi, // SQL Server stored procedures
  ],
};

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  sanitized: string;
  errors: string[];
  warnings: string[];
}

/**
 * Sanitizes HTML entities to prevent XSS attacks
 */
export function sanitizeHTML(input: string): string {
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  return input.replace(/[&<>"'\/]/g, (char) => htmlEntities[char] || char);
}

/**
 * Removes potentially dangerous characters and patterns
 */
export function removeDangerousPatterns(input: string): string {
  let sanitized = input;

  // Remove blocked patterns
  SEARCH_SECURITY_CONFIG.BLOCKED_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });

  // Remove SQL injection patterns
  SEARCH_SECURITY_CONFIG.SQL_INJECTION_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });

  return sanitized;
}

/**
 * Validates and sanitizes search query
 */
export function validateSearchQuery(query: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  let sanitized = query.trim();

  // Check if empty
  if (!sanitized) {
    return {
      isValid: false,
      sanitized: '',
      errors: ['Search query cannot be empty'],
      warnings: [],
    };
  }

  // Check length constraints
  if (sanitized.length < SEARCH_SECURITY_CONFIG.MIN_QUERY_LENGTH) {
    errors.push(`Search query must be at least ${SEARCH_SECURITY_CONFIG.MIN_QUERY_LENGTH} character(s)`);
  }

  if (sanitized.length > SEARCH_SECURITY_CONFIG.MAX_QUERY_LENGTH) {
    errors.push(`Search query cannot exceed ${SEARCH_SECURITY_CONFIG.MAX_QUERY_LENGTH} characters`);
    sanitized = sanitized.substring(0, SEARCH_SECURITY_CONFIG.MAX_QUERY_LENGTH);
    warnings.push('Search query was truncated to maximum length');
  }

  // Check for dangerous patterns before sanitization
  const hasDangerousPatterns = SEARCH_SECURITY_CONFIG.BLOCKED_PATTERNS.some(
    pattern => pattern.test(sanitized)
  );

  const hasSQLPatterns = SEARCH_SECURITY_CONFIG.SQL_INJECTION_PATTERNS.some(
    pattern => pattern.test(sanitized)
  );

  if (hasDangerousPatterns) {
    errors.push('Search query contains potentially dangerous content');
    warnings.push('Dangerous patterns were removed from your search');
  }

  if (hasSQLPatterns) {
    errors.push('Search query contains invalid SQL-like patterns');
    warnings.push('SQL-like patterns were removed from your search');
  }

  // Remove dangerous patterns
  sanitized = removeDangerousPatterns(sanitized);

  // Sanitize HTML entities
  sanitized = sanitizeHTML(sanitized);

  // Check allowed characters (after sanitization)
  if (!SEARCH_SECURITY_CONFIG.ALLOWED_CHARACTERS.test(sanitized)) {
    warnings.push('Some special characters were removed from your search');
    // Remove non-allowed characters
    sanitized = sanitized.replace(/[^a-zA-Z0-9\s\-_.,!?'"()&]/g, '');
  }

  // Final empty check after sanitization
  if (!sanitized.trim()) {
    errors.push('Search query is invalid after sanitization');
  }

  return {
    isValid: errors.length === 0,
    sanitized: sanitized.trim(),
    errors,
    warnings,
  };
}

/**
 * Rate limiter for search requests
 */
class SearchRateLimiter {
  private searchTimestamps: number[] = [];

  /**
   * Check if rate limit is exceeded
   */
  isRateLimited(): boolean {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    // Remove timestamps older than 1 minute
    this.searchTimestamps = this.searchTimestamps.filter(
      timestamp => timestamp > oneMinuteAgo
    );

    // Check if limit exceeded
    return this.searchTimestamps.length >= SEARCH_SECURITY_CONFIG.MAX_SEARCHES_PER_MINUTE;
  }

  /**
   * Record a search attempt
   */
  recordSearch(): void {
    this.searchTimestamps.push(Date.now());
  }

  /**
   * Get remaining searches in current window
   */
  getRemainingSearches(): number {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;

    this.searchTimestamps = this.searchTimestamps.filter(
      timestamp => timestamp > oneMinuteAgo
    );

    return Math.max(
      0,
      SEARCH_SECURITY_CONFIG.MAX_SEARCHES_PER_MINUTE - this.searchTimestamps.length
    );
  }

  /**
   * Reset rate limiter
   */
  reset(): void {
    this.searchTimestamps = [];
  }
}

// Singleton instance
export const searchRateLimiter = new SearchRateLimiter();

/**
 * Safely encode search query for URL
 */
export function encodeSearchQuery(query: string): string {
  const validation = validateSearchQuery(query);

  if (!validation.isValid) {
    throw new Error(validation.errors.join(', '));
  }

  return encodeURIComponent(validation.sanitized);
}

/**
 * Safely decode search query from URL
 */
export function decodeSearchQuery(encodedQuery: string): ValidationResult {
  try {
    const decoded = decodeURIComponent(encodedQuery);
    return validateSearchQuery(decoded);
  } catch (error) {
    return {
      isValid: false,
      sanitized: '',
      errors: ['Failed to decode search query'],
      warnings: [],
    };
  }
}

/**
 * Log security events (for monitoring)
 */
export function logSecurityEvent(
  eventType: 'DANGEROUS_PATTERN' | 'SQL_INJECTION' | 'RATE_LIMIT' | 'INVALID_INPUT',
  details: {
    query?: string;
    userId?: string;
    ip?: string;
    timestamp?: Date;
  }
): void {
  // In production, send to security monitoring service
  console.warn('[SECURITY]', {
    eventType,
    ...details,
    timestamp: details.timestamp || new Date(),
  });
}

/**
 * Complete secure search validation with rate limiting
 */
export function secureSearchValidation(
  query: string,
  userId?: string
): ValidationResult & { rateLimited: boolean } {
  // Check rate limit
  if (searchRateLimiter.isRateLimited()) {
    logSecurityEvent('RATE_LIMIT', { query, userId });
    return {
      isValid: false,
      sanitized: '',
      errors: ['Too many search requests. Please wait a moment.'],
      warnings: [],
      rateLimited: true,
    };
  }

  // Validate query
  const validation = validateSearchQuery(query);

  // Log security events
  if (!validation.isValid) {
    if (validation.errors.some(e => e.includes('dangerous'))) {
      logSecurityEvent('DANGEROUS_PATTERN', { query, userId });
    }
    if (validation.errors.some(e => e.includes('SQL'))) {
      logSecurityEvent('SQL_INJECTION', { query, userId });
    }
    if (validation.errors.length > 0) {
      logSecurityEvent('INVALID_INPUT', { query, userId });
    }
  }

  // Record search if valid
  if (validation.isValid) {
    searchRateLimiter.recordSearch();
  }

  return {
    ...validation,
    rateLimited: false,
  };
}

export default {
  validateSearchQuery,
  sanitizeHTML,
  removeDangerousPatterns,
  encodeSearchQuery,
  decodeSearchQuery,
  secureSearchValidation,
  searchRateLimiter,
  logSecurityEvent,
  SEARCH_SECURITY_CONFIG,
};
