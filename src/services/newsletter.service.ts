// src/services/newsletter.service.ts - Clean version without duplicates
import { ApiResponse } from '@/types/api.types';
import { 
  SubscribeRequest, 
  NewsletterResponse, 
  UnsubscribeRequest, 
  NewsletterStatusResponse 
} from '@/types/newsletter.types';

class NewsletterService {
  private readonly baseUrl: string;
  private readonly isDebug: boolean;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    this.isDebug = import.meta.env.DEV || false;
    
    if (this.isDebug) {
      console.log('📧 Newsletter Service initialized with baseUrl:', this.baseUrl);
    }
  }

  async subscribe(data: SubscribeRequest): Promise<{success: boolean; error?: {message: string}}> {
    const endpoint = `${this.baseUrl}/api/newsletter/subscribe`;
    
    if (this.isDebug) {
      console.log('📧 Newsletter subscription request:', {
        endpoint,
        data: { ...data, email: data.email.replace(/(.{2}).*(@.*)/, '$1***$2') } // Mask email for logging
      });
    }

    try {
      // Match the backend's expected format exactly
      const requestBody = {
        email: data.email.toLowerCase().trim(),
        name: data.name?.trim() || null,
        source: data.source || 'unknown'
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include', // Important for CORS
        body: JSON.stringify(requestBody),
      });

      if (this.isDebug) {
        console.log('📧 Newsletter API response status:', response.status);
        console.log('📧 Newsletter API response headers:', Object.fromEntries(response.headers.entries()));
      }

      // Parse response
      let responseData: any = {};
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error('❌ Failed to parse response JSON');
        if (this.isDebug) {
          const responseText = await response.text();
          console.error('Raw response:', responseText);
        }
        return {
          success: false,
          error: { message: 'Invalid server response' }
        };
      }

      if (this.isDebug) {
        console.log('📧 Newsletter API response data:', responseData);
      }

      if (!response.ok) {
        const errorMessage = responseData?.detail || responseData?.message || this.getErrorMessageFromResponse(response.status, responseData);
        
        if (this.isDebug) {
          console.error('❌ Newsletter subscription failed:', {
            status: response.status,
            statusText: response.statusText,
            responseData,
            errorMessage
          });
        }

        return {
          success: false,
          error: { message: errorMessage }
        };
      }

      // Backend returns { success: true, message: "..." }
      if (responseData.success) {
        if (this.isDebug) {
          console.log('✅ Newsletter subscription successful:', responseData.message);
        }
        return { success: true };
      } else {
        return {
          success: false,
          error: { message: responseData.message || 'Subscription failed' }
        };
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection failed';
      
      if (this.isDebug) {
        console.error('❌ Newsletter subscription network error:', {
          error,
          message: errorMessage,
          endpoint
        });
      }

      return {
        success: false,
        error: { message: errorMessage }
      };
    }
  }

  /**
   * Get user-friendly error message based on response
   */
  private getErrorMessageFromResponse(status: number, responseData: any): string {
    // Check if response has a specific error message
    if (responseData?.detail) return responseData.detail;
    if (responseData?.message) return responseData.message;
    if (responseData?.error) return responseData.error;

    // Fallback to status-based messages
    switch (status) {
      case 400:
        return 'Invalid email address or request data';
      case 409:
        return 'This email is already subscribed to our newsletter';
      case 429:
        return 'Too many requests. Please wait a moment and try again';
      case 500:
        return 'Server error. Please try again later';
      case 502:
      case 503:
      case 504:
        return 'Service temporarily unavailable. Please try again later';
      default:
        return `Subscription failed (Error ${status}). Please try again`;
    }
  }

  /**
   * Test connection to newsletter API
   */
  async testConnection(): Promise<{connected: boolean; error?: string}> {
    try {
      const testEndpoint = `${this.baseUrl}/health`;
      const response = await fetch(testEndpoint, {
        method: 'GET',
        credentials: 'include',
      });

      if (this.isDebug) {
        console.log('📧 Newsletter API connection test:', {
          endpoint: testEndpoint,
          status: response.status,
          ok: response.ok
        });
      }

      return {
        connected: response.ok,
        error: response.ok ? undefined : `Server returned ${response.status}`
      };
    } catch (error) {
      if (this.isDebug) {
        console.error('📧 Newsletter API connection test failed:', error);
      }
      return {
        connected: false,
        error: error instanceof Error ? error.message : 'Connection failed'
      };
    }
  }

  // Keep existing methods for completeness
  async unsubscribe(data: UnsubscribeRequest): Promise<ApiResponse<NewsletterResponse>> {
    // Implementation remains the same
    throw new Error('Unsubscribe not implemented yet');
  }

  async checkStatus(email: string): Promise<ApiResponse<NewsletterStatusResponse>> {
    // Implementation remains the same  
    throw new Error('Status check not implemented yet');
  }
}

// Export singleton instance
export const newsletterService = new NewsletterService();