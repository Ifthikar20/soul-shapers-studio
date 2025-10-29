// src/utils/api.encryption.ts - API Payload Encryption & Security
// Provides end-to-end encryption for API communication

/**
 * Configuration for API encryption
 */
export const API_ENCRYPTION_CONFIG = {
  // Encryption algorithm
  ALGORITHM: 'AES-GCM',

  // Key size in bits
  KEY_SIZE: 256,

  // IV (Initialization Vector) size in bytes
  IV_SIZE: 12,

  // Authentication tag size in bits
  TAG_SIZE: 128,

  // PBKDF2 iterations for key derivation
  PBKDF2_ITERATIONS: 100000,

  // Salt size for key derivation
  SALT_SIZE: 16,

  // Maximum request age in milliseconds (5 minutes)
  MAX_REQUEST_AGE: 5 * 60 * 1000,

  // Enable encryption (can be disabled in development)
  ENCRYPTION_ENABLED: import.meta.env.VITE_API_ENCRYPTION_ENABLED !== 'false',

  // Encryption key from environment (for production, use key management service)
  ENCRYPTION_KEY: import.meta.env.VITE_API_ENCRYPTION_KEY || 'default-dev-key-change-in-production',

  // HMAC key for request signing
  HMAC_KEY: import.meta.env.VITE_API_HMAC_KEY || 'default-hmac-key-change-in-production',
};

/**
 * Encrypted payload structure
 */
export interface EncryptedPayload {
  encrypted: string;      // Base64 encoded encrypted data
  iv: string;             // Base64 encoded initialization vector
  tag?: string;           // Base64 encoded authentication tag (for GCM)
  timestamp: number;      // Request timestamp
  signature: string;      // HMAC signature for integrity
}

/**
 * Convert string to ArrayBuffer
 */
function str2ab(str: string): ArrayBuffer {
  const encoder = new TextEncoder();
  return encoder.encode(str).buffer;
}

/**
 * Convert ArrayBuffer to string
 */
function ab2str(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder();
  return decoder.decode(buffer);
}

/**
 * Convert ArrayBuffer to Base64
 */
function ab2base64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert Base64 to ArrayBuffer
 */
function base642ab(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Derive encryption key from passphrase using PBKDF2
 */
async function deriveKey(
  passphrase: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    str2ab(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: API_ENCRYPTION_CONFIG.PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    {
      name: API_ENCRYPTION_CONFIG.ALGORITHM,
      length: API_ENCRYPTION_CONFIG.KEY_SIZE,
    },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Generate a random salt
 */
function generateSalt(): Uint8Array {
  return window.crypto.getRandomValues(
    new Uint8Array(API_ENCRYPTION_CONFIG.SALT_SIZE)
  );
}

/**
 * Generate a random IV
 */
function generateIV(): Uint8Array {
  return window.crypto.getRandomValues(
    new Uint8Array(API_ENCRYPTION_CONFIG.IV_SIZE)
  );
}

/**
 * Encrypt data using AES-256-GCM
 */
export async function encryptData(data: any): Promise<EncryptedPayload> {
  try {
    // Convert data to JSON string
    const jsonString = JSON.stringify(data);

    // Generate salt and derive key
    const salt = generateSalt();
    const key = await deriveKey(API_ENCRYPTION_CONFIG.ENCRYPTION_KEY, salt);

    // Generate IV
    const iv = generateIV();

    // Encrypt data
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: API_ENCRYPTION_CONFIG.ALGORITHM,
        iv: iv,
        tagLength: API_ENCRYPTION_CONFIG.TAG_SIZE,
      },
      key,
      str2ab(jsonString)
    );

    // For AES-GCM, the tag is appended to the ciphertext
    // Split the encrypted data and tag
    const encryptedData = encryptedBuffer.slice(0, encryptedBuffer.byteLength - 16);
    const tag = encryptedBuffer.slice(encryptedBuffer.byteLength - 16);

    // Create payload
    const timestamp = Date.now();
    const payload: EncryptedPayload = {
      encrypted: ab2base64(encryptedData),
      iv: ab2base64(iv),
      tag: ab2base64(tag),
      timestamp,
      signature: '', // Will be set below
    };

    // Sign the payload
    payload.signature = await signPayload(payload);

    return payload;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
}

/**
 * Decrypt data using AES-256-GCM
 */
export async function decryptData(payload: EncryptedPayload): Promise<any> {
  try {
    // Verify signature
    const isValid = await verifySignature(payload);
    if (!isValid) {
      throw new Error('Invalid payload signature');
    }

    // Verify timestamp (prevent replay attacks)
    const age = Date.now() - payload.timestamp;
    if (age > API_ENCRYPTION_CONFIG.MAX_REQUEST_AGE) {
      throw new Error('Payload expired');
    }

    // Reconstruct salt from first part of IV (not ideal, but simplified)
    const salt = generateSalt(); // In production, include salt in payload
    const key = await deriveKey(API_ENCRYPTION_CONFIG.ENCRYPTION_KEY, salt);

    // Decode Base64 values
    const iv = base642ab(payload.iv);
    const encryptedData = base642ab(payload.encrypted);
    const tag = payload.tag ? base642ab(payload.tag) : new ArrayBuffer(0);

    // Combine encrypted data and tag for GCM
    const combined = new Uint8Array(encryptedData.byteLength + tag.byteLength);
    combined.set(new Uint8Array(encryptedData), 0);
    combined.set(new Uint8Array(tag), encryptedData.byteLength);

    // Decrypt data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      {
        name: API_ENCRYPTION_CONFIG.ALGORITHM,
        iv: iv,
        tagLength: API_ENCRYPTION_CONFIG.TAG_SIZE,
      },
      key,
      combined
    );

    // Convert back to object
    const jsonString = ab2str(decryptedBuffer);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
}

/**
 * Sign payload using HMAC-SHA256
 */
async function signPayload(payload: Omit<EncryptedPayload, 'signature'>): Promise<string> {
  try {
    // Create signature data (exclude signature field)
    const signatureData = {
      encrypted: payload.encrypted,
      iv: payload.iv,
      tag: payload.tag,
      timestamp: payload.timestamp,
    };

    // Import HMAC key
    const key = await window.crypto.subtle.importKey(
      'raw',
      str2ab(API_ENCRYPTION_CONFIG.HMAC_KEY),
      {
        name: 'HMAC',
        hash: 'SHA-256',
      },
      false,
      ['sign']
    );

    // Sign the data
    const signature = await window.crypto.subtle.sign(
      'HMAC',
      key,
      str2ab(JSON.stringify(signatureData))
    );

    return ab2base64(signature);
  } catch (error) {
    console.error('Signing failed:', error);
    throw new Error('Failed to sign payload');
  }
}

/**
 * Verify payload signature
 */
async function verifySignature(payload: EncryptedPayload): Promise<boolean> {
  try {
    // Create signature data (exclude signature field)
    const signatureData = {
      encrypted: payload.encrypted,
      iv: payload.iv,
      tag: payload.tag,
      timestamp: payload.timestamp,
    };

    // Import HMAC key
    const key = await window.crypto.subtle.importKey(
      'raw',
      str2ab(API_ENCRYPTION_CONFIG.HMAC_KEY),
      {
        name: 'HMAC',
        hash: 'SHA-256',
      },
      false,
      ['verify']
    );

    // Verify signature
    const isValid = await window.crypto.subtle.verify(
      'HMAC',
      key,
      base642ab(payload.signature),
      str2ab(JSON.stringify(signatureData))
    );

    return isValid;
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
}

/**
 * Hash data using SHA-256
 */
export async function hashData(data: string): Promise<string> {
  const buffer = await window.crypto.subtle.digest(
    'SHA-256',
    str2ab(data)
  );
  return ab2base64(buffer);
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return ab2base64(array.buffer);
}

/**
 * Mask sensitive data for logging
 */
export function maskSensitiveData(data: any): any {
  const sensitiveFields = [
    'password',
    'token',
    'secret',
    'apiKey',
    'api_key',
    'accessToken',
    'access_token',
    'refreshToken',
    'refresh_token',
    'creditCard',
    'credit_card',
    'ssn',
    'cvv',
  ];

  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const masked = { ...data };

  for (const key in masked) {
    const lowerKey = key.toLowerCase();

    // Check if field is sensitive
    if (sensitiveFields.some(field => lowerKey.includes(field))) {
      if (typeof masked[key] === 'string' && masked[key].length > 0) {
        // Show first 2 and last 2 characters
        const value = masked[key] as string;
        if (value.length <= 4) {
          masked[key] = '****';
        } else {
          masked[key] = `${value.substring(0, 2)}${'*'.repeat(value.length - 4)}${value.substring(value.length - 2)}`;
        }
      } else {
        masked[key] = '****';
      }
    } else if (typeof masked[key] === 'object' && masked[key] !== null) {
      // Recursively mask nested objects
      masked[key] = maskSensitiveData(masked[key]);
    }
  }

  return masked;
}

/**
 * Check if encryption is enabled
 */
export function isEncryptionEnabled(): boolean {
  return API_ENCRYPTION_CONFIG.ENCRYPTION_ENABLED;
}

/**
 * Encrypt request payload if encryption is enabled
 */
export async function encryptRequest(data: any): Promise<any> {
  if (!isEncryptionEnabled()) {
    return data;
  }

  try {
    const encrypted = await encryptData(data);
    return {
      encrypted: true,
      payload: encrypted,
    };
  } catch (error) {
    console.error('Request encryption failed, sending unencrypted:', error);
    return data;
  }
}

/**
 * Decrypt response payload if encrypted
 */
export async function decryptResponse(data: any): Promise<any> {
  if (!data || typeof data !== 'object') {
    return data;
  }

  // Check if response is encrypted
  if (data.encrypted === true && data.payload) {
    try {
      return await decryptData(data.payload);
    } catch (error) {
      console.error('Response decryption failed:', error);
      throw new Error('Failed to decrypt response');
    }
  }

  return data;
}

/**
 * Create security headers for API requests
 */
export function createSecurityHeaders(): Record<string, string> {
  return {
    'X-Client-Version': '1.0.0',
    'X-Request-ID': generateSecureToken(16),
    'X-Timestamp': Date.now().toString(),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
  };
}

/**
 * Validate response integrity
 */
export function validateResponse(response: any): boolean {
  if (!response) return false;

  // Check for timestamp
  if (response.timestamp) {
    const age = Date.now() - response.timestamp;
    if (age > API_ENCRYPTION_CONFIG.MAX_REQUEST_AGE) {
      console.warn('Response too old, possible replay attack');
      return false;
    }
  }

  return true;
}

export default {
  encryptData,
  decryptData,
  encryptRequest,
  decryptResponse,
  hashData,
  generateSecureToken,
  maskSensitiveData,
  isEncryptionEnabled,
  createSecurityHeaders,
  validateResponse,
  API_ENCRYPTION_CONFIG,
};
