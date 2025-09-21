// src/services/newsletter.service.ts - Right-sized security implementation
import { ApiResponse } from '@/types/api.types';
import { 
  SubscribeRequest, 
  NewsletterResponse, 
  UnsubscribeRequest, 
  NewsletterStatusResponse 
} from '@/types/newsletter.types';

// src/services/newsletter.service.ts - Simplified version
class NewsletterService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  }

  async subscribe(data: SubscribeRequest): Promise<{success: boolean; error?: {message: string}}> {
    try {
      const response = await fetch(`${this.baseUrl}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: data.email.toLowerCase().trim(),
          name: data.name?.trim(),
          source: data.source,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        return {
          success: false,
          error: {
            message: errorData.detail || errorData.message || `Server error (${response.status})`
          }
        };
      }

      const result = await response.json();
      return { success: true };

    } catch (error) {
      console.error('Newsletter subscription failed:', error);
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Connection failed'
        }
      };
    }
  }

  /**
   * Unsubscribe from newsletter
   */
  async unsubscribe(data: UnsubscribeRequest): Promise<ApiResponse<NewsletterResponse>> {
    try {
      const csrfToken = this.getCSRFToken();
      
      const response = await fetch(`${this.baseUrl}/newsletter/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          email: data.email.toLowerCase().trim(),
          token: data.token, // Unsubscribe token from email link
        }),
      });

      if (!response.ok) {
        return this.handleErrorResponse(response);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };

    } catch (error) {
      return {
        success: false,
        error: {
          message: this.getErrorMessage(error),
          code: 'UNSUBSCRIBE_ERROR',
        },
      };
    }
  }

  /**
   * Check subscription status
   */
  async checkStatus(email: string): Promise<ApiResponse<NewsletterStatusResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/newsletter/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };

    } catch (error) {
      return {
        success: false,
        error: {
          message: 'Could not check subscription status',
          code: 'STATUS_CHECK_ERROR',
        },
      };
    }
  }

  // HELPER METHODS

  /**
   * Get CSRF token from meta tag or cookie
   */
  private getCSRFToken(): string | null {
    // Try meta tag first (common in Django/Rails)
    const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (metaToken) return metaToken;

    // Try cookie (common in many frameworks)
    const cookieMatch = document.cookie.match(/csrftoken=([^;]+)/);
    return cookieMatch ? cookieMatch[1] : null;
  }

  /**
   * Handle HTTP error responses with appropriate user messages
   */
  private async handleErrorResponse(response: Response): Promise<ApiResponse<NewsletterResponse>> {
    let errorData: any = {};
    
    try {
      errorData = await response.json();
    } catch {
      // If JSON parsing fails, use default messages
    }

    switch (response.status) {
      case 400:
        return {
          success: false,
          error: {
            message: errorData.message || 'Invalid email address',
            code: 'INVALID_INPUT',
          },
        };
      
      case 409:
        return {
          success: false,
          error: {
            message: 'Email already subscribed',
            code: 'ALREADY_SUBSCRIBED',
          },
        };
      
      case 429:
        return {
          success: false,
          error: {
            message: 'Too many requests. Please wait a moment and try again.',
            code: 'RATE_LIMITED',
          },
        };
      
      case 403:
        return {
          success: false,
          error: {
            message: 'Security validation failed. Please refresh the page and try again.',
            code: 'CSRF_ERROR',
          },
        };
      
      default:
        return {
          success: false,
          error: {
            message: errorData.message || 'Unable to process subscription. Please try again.',
            code: 'SERVER_ERROR',
          },
        };
    }
  }

  /**
   * Extract user-friendly error message
   */
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unexpected error occurred';
  }
}

// Export singleton instance
export const newsletterService = new NewsletterService();