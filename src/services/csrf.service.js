// src/services/csrf.service.js
class EnhancedCSRFService {
    constructor() {
      this.sessionToken = null;
      this.fingerprint = null;
    }
  
    async generateFingerprint() {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Browser fingerprint', 2, 2);
      
      const fingerprint = {
        canvas: canvas.toDataURL(),
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screen: `${screen.width}x${screen.height}`,
        colorDepth: screen.colorDepth
      };
  
      const encoder = new TextEncoder();
      const data = encoder.encode(JSON.stringify(fingerprint));
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      
      this.fingerprint = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return this.fingerprint;
    }
  
    async getSecureToken() {
      if (!this.fingerprint) {
        await this.generateFingerprint();
      }
  
      const response = await fetch('/api/secure-token', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fingerprint: this.fingerprint,
          timestamp: Date.now()
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to get secure token');
      }
  
      const { token, challenge } = await response.json();
      this.sessionToken = token;
  
      // Solve proof-of-work challenge
      const solution = await this.solveChallenge(challenge);
      
      return {
        token: this.sessionToken,
        solution,
        fingerprint: this.fingerprint
      };
    }
  
    async solveChallenge(challenge) {
      // Simple proof-of-work to prevent automated attacks
      let nonce = 0;
      const target = challenge.target;
      
      while (nonce < 1000000) { // Reasonable limit
        const attempt = `${challenge.data}${nonce}`;
        const hash = await this.sha256(attempt);
        
        if (hash.startsWith(target)) {
          return nonce;
        }
        nonce++;
      }
      
      throw new Error('Challenge timeout');
    }
  
    async sha256(message) {
      const msgUint8 = new TextEncoder().encode(message);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
  }
  
  export const csrfService = new EnhancedCSRFService();