// src/services/newsletter.service.js
import { csrfService } from './csrf.service';
import { encryptionUtil } from '../utils/encryption';

class SecureNewsletterService {
  async subscribe(newsletterData) {
    try {
      // Get secure token with proof-of-work
      const securityData = await csrfService.getSecureToken();
      
      // Add anti-replay protection
      const requestId = this.generateRequestId();
      const timestamp = Date.now();
      
      // Prepare payload with security metadata
      const payload = {
        ...newsletterData,
        metadata: {
          requestId,
          timestamp,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          // Honeypot fields
          website: '',
          phone: '',
          company: ''
        }
      };

      // Encrypt payload
      const encryptedData = await encryptionUtil.encryptData(payload);
      
      // Create request signature
      const signature = await this.signRequest(encryptedData, securityData.token);

      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Security-Token': securityData.token,
          'X-Fingerprint': securityData.fingerprint,
          'X-Challenge-Solution': securityData.solution.toString(),
          'X-Request-Signature': signature,
          'X-Request-ID': requestId,
          'X-API-Version': '2.0'
        },
        body: JSON.stringify({
          encryptedPayload: encryptedData,
          timestamp
        })
      });

      if (!response.ok) {
        await this.handleErrorResponse(response);
        return;
      }

      const result = await response.json();
      return this.validateResponse(result);

    } catch (error) {
      console.error('Secure newsletter subscription failed:', error);
      throw error;
    }
  }

  generateRequestId() {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  async signRequest(data, token) {
    const message = `${JSON.stringify(data)}${token}${Date.now()}`;
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async handleErrorResponse(response) {
    const errorData = await response.json().catch(() => ({}));
    
    switch (response.status) {
      case 403:
        csrfService.sessionToken = null;
        throw new Error('Security validation failed. Please refresh and try again.');
      case 429:
        throw new Error('Too many requests. Please wait a moment and try again.');
      case 422:
        throw new Error(errorData.message || 'Invalid data provided.');
      default:
        throw new Error(`Request failed: ${response.status}`);
    }
  }

  async validateResponse(result) {
    // Verify response integrity if needed
    if (result.signature) {
      const expectedSig = await this.signRequest(result.data, 'response');
      if (expectedSig !== result.signature) {
        throw new Error('Response integrity check failed');
      }
    }
    
    return result;
  }
}

export const newsletterService = new SecureNewsletterService();