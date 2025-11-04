// src/utils/cookies.ts - Cookie utility functions for authentication

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue || null;
  }

  return null;
}

/**
 * Set a cookie with optional parameters
 */
export function setCookie(
  name: string,
  value: string,
  options: {
    days?: number;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
  } = {}
): void {
  let cookieString = `${name}=${value}`;

  if (options.days) {
    const date = new Date();
    date.setTime(date.getTime() + options.days * 24 * 60 * 60 * 1000);
    cookieString += `; expires=${date.toUTCString()}`;
  }

  cookieString += `; path=${options.path || '/'}`;

  if (options.domain) {
    cookieString += `; domain=${options.domain}`;
  }

  if (options.secure) {
    cookieString += '; secure';
  }

  if (options.sameSite) {
    cookieString += `; SameSite=${options.sameSite}`;
  }

  document.cookie = cookieString;
}

/**
 * Delete a cookie by name
 */
export function deleteCookie(name: string, path: string = '/'): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
}

/**
 * Get access token from cookies
 */
export function getAccessToken(): string | null {
  return getCookie('access_token');
}

/**
 * Get refresh token from cookies
 */
export function getRefreshToken(): string | null {
  return getCookie('refresh_token');
}

/**
 * Check if user is authenticated (has access token)
 */
export function isAuthenticated(): boolean {
  const token = getAccessToken();
  return token !== null && token !== '';
}

/**
 * Clear all authentication cookies
 */
export function clearAuthCookies(): void {
  deleteCookie('access_token');
  deleteCookie('refresh_token');
  deleteCookie('csrf_token');
}

/**
 * Parse all cookies into an object
 */
export function getAllCookies(): Record<string, string> {
  const cookies: Record<string, string> = {};

  document.cookie.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = value;
    }
  });

  return cookies;
}
