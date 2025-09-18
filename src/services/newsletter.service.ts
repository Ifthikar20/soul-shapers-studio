// src/services/newsletter.service.ts
import { ApiResponse } from '@/types/api.types';
import { 
  SubscribeRequest, 
  NewsletterResponse, 
  UnsubscribeRequest, 
  NewsletterStatusResponse,
  NewsletterSubscriber 
} from '@/types/newsletter.types';

class NewsletterService {
  private readonly baseUrl: string;

  constructor() {
    // Use environment variable or default to relative path
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
  }

  /**
   * Subscribe to newsletter - all sensitive logic handled on server
   */
  async subscribe(data: SubscribeRequest): Promise<ApiResponse<NewsletterResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // No API keys or sensitive headers - handled by server
        },
        credentials: 'same-origin', // Include cookies for CSRF protection
        body: JSON.stringify({
          email: data.email.toLowerCase().trim(),
          name: data.name?.trim(),
          source: data.source,
          // Server will add: timestamp, IP, user agent, validation, etc.
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };

    } catch (error) {
      console.error('Newsletter subscription failed:', error);
      
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Subscription failed',
          code: 'SUBSCRIPTION_ERROR',
        },
      };
    }
  }

  /**
   * Unsubscribe from newsletter
   */
  async unsubscribe(data: UnsubscribeRequest): Promise<ApiResponse<NewsletterResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/newsletter/unsubscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          email: data.email.toLowerCase().trim(),
          token: data.token, // Unsubscribe token from email link
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };

    } catch (error) {
      console.error('Newsletter unsubscribe failed:', error);
      
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unsubscribe failed',
          code: 'UNSUBSCRIBE_ERROR',
        },
      };
    }
  }

  /**
   * Update subscription status
   */
  async updateStatus(
    email: string, 
    status: NewsletterSubscriber['status'],
    token?: string
  ): Promise<ApiResponse<NewsletterResponse>> {
    try {
      const response = await fetch(`${this.baseUrl}/newsletter/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          status,
          token,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network error' }));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        data: result,
      };

    } catch (error) {
      console.error('Newsletter status update failed:', error);
      
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Status update failed',
          code: 'STATUS_UPDATE_ERROR',
        },
      };
    }
  }

  /**
   * Check subscription status (optional - for user feedback)
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
}

// Export singleton instance
export const newsletterService = new NewsletterService();