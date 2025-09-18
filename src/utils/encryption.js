// src/utils/encryption.js
class ChaCha20Encryption {
    constructor() {
      this.serverPublicKey = null;
      this.ephemeralKeyPair = null;
    }
  
    async initializeKeys() {
      // Generate ephemeral X25519 key pair for this session
      this.ephemeralKeyPair = await window.crypto.subtle.generateKey(
        {
          name: 'X25519'
        },
        false, // not extractable
        ['deriveKey', 'deriveBits']
      );
  
      // Get server's public key
      const response = await fetch('/api/public-key');
      const { publicKey } = await response.json();
      
      this.serverPublicKey = await window.crypto.subtle.importKey(
        'raw',
        this._base64ToArrayBuffer(publicKey),
        {
          name: 'X25519'
        },
        false,
        []
      );
    }
  
    async encryptData(data) {
      if (!this.ephemeralKeyPair || !this.serverPublicKey) {
        await this.initializeKeys();
      }
  
      // Derive shared secret using ECDH
      const sharedSecret = await window.crypto.subtle.deriveBits(
        {
          name: 'X25519',
          public: this.serverPublicKey
        },
        this.ephemeralKeyPair.privateKey,
        256
      );
  
      // Derive encryption key using HKDF
      const encryptionKey = await window.crypto.subtle.deriveKey(
        {
          name: 'HKDF',
          hash: 'SHA-256',
          salt: new Uint8Array(32), // Use random salt in production
          info: new TextEncoder().encode('newsletter-encryption')
        },
        await window.crypto.subtle.importKey(
          'raw',
          sharedSecret,
          { name: 'HKDF' },
          false,
          ['deriveKey']
        ),
        {
          name: 'ChaCha20-Poly1305',
          length: 256
        },
        false,
        ['encrypt']
      );
  
      // Generate random nonce
      const nonce = window.crypto.getRandomValues(new Uint8Array(12));
      
      // Encrypt data
      const encoder = new TextEncoder();
      const plaintext = encoder.encode(JSON.stringify(data));
      
      const ciphertext = await window.crypto.subtle.encrypt(
        {
          name: 'ChaCha20-Poly1305',
          iv: nonce
        },
        encryptionKey,
        plaintext
      );
  
      // Export client public key for server
      const clientPublicKey = await window.crypto.subtle.exportKey(
        'raw',
        this.ephemeralKeyPair.publicKey
      );
  
      return {
        ciphertext: this._arrayBufferToBase64(ciphertext),
        nonce: this._arrayBufferToBase64(nonce),
        clientPublicKey: this._arrayBufferToBase64(clientPublicKey)
      };
    }
  
    _base64ToArrayBuffer(base64) {
      const binaryString = window.atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    }
  
    _arrayBufferToBase64(buffer) {
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    }
  }
  
  export const encryptionUtil = new ChaCha20Encryption();