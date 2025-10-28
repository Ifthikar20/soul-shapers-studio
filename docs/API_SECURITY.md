## API Security & Encryption

Comprehensive security implementation for frontend-backend communication with end-to-end encryption, request signing, and protection mechanisms.

---

## Table of Contents

1. [Overview](#overview)
2. [Security Features](#security-features)
3. [Architecture](#architecture)
4. [Quick Start](#quick-start)
5. [Integration Guide](#integration-guide)
6. [Configuration](#configuration)
7. [Encryption Details](#encryption-details)
8. [Security Headers](#security-headers)
9. [Monitoring & Logging](#monitoring--logging)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)
12. [FAQ](#faq)

---

## Overview

This implementation provides **enterprise-grade security** for API communication between the frontend and backend, including:

- **End-to-end encryption** using AES-256-GCM
- **Request signing** with HMAC-SHA256
- **HTTPS enforcement** in production
- **Security headers** on all requests
- **Replay attack prevention** with timestamp validation
- **Sensitive data masking** in logs
- **Automatic encryption/decryption** with zero code changes

### Goals

✅ **Reduce information exposure** - Encrypted payloads hide sensitive data
✅ **Maintain data integrity** - HMAC signing prevents tampering
✅ **Prevent replay attacks** - Timestamp validation ensures freshness
✅ **Zero-disruption integration** - Works with existing code
✅ **Production-ready** - Configurable for all environments

---

## Security Features

### 1. **Payload Encryption (AES-256-GCM)**

**What**: Encrypts request/response data using AES-256-GCM (Galois/Counter Mode)

**Why**:
- Prevents eavesdropping on sensitive data
- Hides user credentials, payment info, personal data
- Provides authenticated encryption (confidentiality + integrity)

**How it works**:
```
Plain Data → JSON → AES-256-GCM Encryption → Base64 → Network
Network → Base64 → AES-256-GCM Decryption → JSON → Plain Data
```

**Automatically encrypted endpoints**:
- `/auth/login`
- `/auth/register`
- `/auth/reset-password`
- `/payment/*`
- `/subscription/*`
- `/profile/*`
- `/user/settings/*`

### 2. **Request Signing (HMAC-SHA256)**

**What**: Signs every request with HMAC-SHA256

**Why**:
- Verifies request integrity
- Prevents man-in-the-middle tampering
- Ensures requests come from legitimate client

**Signature includes**:
- Encrypted payload
- Initialization vector (IV)
- Timestamp
- Authentication tag

### 3. **HTTPS Enforcement**

**What**: Blocks non-HTTPS requests in production

**Why**:
- Prevents network-level attacks
- Required for secure cookie transmission
- Industry standard for web security

**Behavior**:
- Development: Allows HTTP for localhost
- Production: Requires HTTPS, blocks HTTP

### 4. **Security Headers**

**What**: Adds security headers to every request

**Headers included**:
```javascript
X-Client-Version: 1.0.0
X-Request-ID: <unique-id>
X-Timestamp: <timestamp>
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
X-Encrypted: true (when encrypted)
X-CSRF-Token: <csrf-token>
```

### 5. **Replay Attack Prevention**

**What**: Validates request timestamp

**Why**: Prevents attackers from reusing captured requests

**How**:
- Each request includes timestamp
- Server checks if timestamp is within 5 minutes
- Old requests are rejected

### 6. **Sensitive Data Masking**

**What**: Masks sensitive data in logs

**Why**: Prevents credential leakage in logs

**Masked fields**:
- `password`
- `token`, `accessToken`, `refreshToken`
- `creditCard`, `cvv`, `ssn`
- `apiKey`, `secret`

**Example**:
```javascript
// Before masking
{ email: "user@example.com", password: "MyPassword123" }

// After masking (in logs)
{ email: "user@example.com", password: "My********23" }
```

### 7. **Security Event Logging**

**What**: Logs all security-relevant events

**Events tracked**:
- `REQUEST` - Outgoing API requests
- `RESPONSE` - Incoming API responses
- `ENCRYPTION` - Request encryption
- `DECRYPTION` - Response decryption
- `UNAUTHORIZED` - 401 errors
- `FORBIDDEN` - 403 errors
- `RATE_LIMIT` - 429 errors
- `HTTPS_VIOLATION` - Non-HTTPS attempts

---

## Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interface                          │
│                   (React Components)                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Service Layer                         │
│            (auth.service, content.service, etc.)             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Security Request Interceptor                    │
│  ├─ Add security headers                                     │
│  ├─ Enforce HTTPS                                            │
│  ├─ Check if endpoint is sensitive                           │
│  ├─ Encrypt payload (if needed)                              │
│  ├─ Sign request with HMAC                                   │
│  └─ Log security event                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                        HTTPS Network                         │
│              (Encrypted payload transmitted)                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend API                             │
│          (Receives encrypted payload + signature)            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Security Response Interceptor                   │
│  ├─ Validate response integrity                              │
│  ├─ Verify signature                                         │
│  ├─ Check timestamp (replay protection)                      │
│  ├─ Decrypt payload (if encrypted)                           │
│  └─ Log security event                                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Service Layer                         │
│             (Returns decrypted data to app)                  │
└─────────────────────────────────────────────────────────────┘
```

### Component Structure

```
src/
├── utils/
│   ├── api.encryption.ts      # Core encryption utilities
│   │   ├── encryptData()      # AES-256-GCM encryption
│   │   ├── decryptData()      # AES-256-GCM decryption
│   │   ├── hashData()         # SHA-256 hashing
│   │   └── generateSecureToken() # Secure random tokens
│   │
│   └── api.security.ts        # Security interceptors
│       ├── securityRequestInterceptor()
│       ├── securityResponseInterceptor()
│       ├── SecurityEventLogger
│       └── applySecurityInterceptors()
│
├── services/
│   ├── auth.service.ts        # Your existing service
│   └── auth.service.secure.ts # Example secured service
│
└── docs/
    └── API_SECURITY.md        # This file
```

---

## Quick Start

### 1. Add Security to Existing Service

**Before** (your existing code):
```typescript
// src/services/auth.service.ts
import axios from 'axios';

class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'https://api.betterandbliss.com',
      withCredentials: true,
    });
  }

  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  }
}
```

**After** (with security):
```typescript
// src/services/auth.service.ts
import axios from 'axios';
import { applySecurityInterceptors } from '@/utils/api.security';

class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'https://api.betterandbliss.com',
      withCredentials: true,
    });

    // ✅ Add this one line!
    applySecurityInterceptors(this.api);
  }

  async login(email: string, password: string) {
    // Payload automatically encrypted!
    const response = await this.api.post('/auth/login', {
      email,
      password,
    });
    // Response automatically decrypted!
    return response.data;
  }
}
```

### 2. Configure Environment Variables

Create `.env.local`:
```bash
# Encryption Configuration
VITE_API_ENCRYPTION_ENABLED=true
VITE_ENFORCE_HTTPS=true

# IMPORTANT: Change these in production!
VITE_API_ENCRYPTION_KEY=your-256-bit-secret-key-here
VITE_API_HMAC_KEY=your-hmac-secret-key-here

# Optional: Enable request logging
VITE_ENABLE_REQUEST_LOGGING=false
```

### 3. Test It

```typescript
import { secureAuthService } from '@/services/auth.service.secure';

// Login - automatically encrypted
const result = await secureAuthService.login('user@example.com', 'password');

// Check security metrics
import { getSecurityMetrics } from '@/utils/api.security';
console.log(getSecurityMetrics());
```

**That's it!** Your API calls are now encrypted and secured.

---

## Integration Guide

### For New Services

```typescript
import axios from 'axios';
import { applySecurityInterceptors } from '@/utils/api.security';

const api = axios.create({
  baseURL: 'https://api.betterandbliss.com',
});

applySecurityInterceptors(api);

export default api;
```

### For Existing Services

**Step 1**: Import the security utilities
```typescript
import { applySecurityInterceptors } from '@/utils/api.security';
```

**Step 2**: Apply after creating axios instance
```typescript
constructor() {
  this.api = axios.create({ /* your config */ });
  applySecurityInterceptors(this.api); // Add this line
}
```

**Step 3**: No other changes needed!

All your existing API calls will now be:
- ✅ Encrypted (for sensitive endpoints)
- ✅ Signed with HMAC
- ✅ Protected with security headers
- ✅ Validated for HTTPS
- ✅ Logged for security monitoring

### Selective Encryption

If you only want to encrypt specific requests:

```typescript
import { encryptRequest, decryptResponse } from '@/utils/api.encryption';

// Manually encrypt a specific request
async function sensitiveRequest() {
  const encrypted = await encryptRequest({ sensitiveData: '...' });

  const response = await api.post('/sensitive-endpoint', encrypted);

  const decrypted = await decryptResponse(response.data);
  return decrypted;
}
```

---

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_ENCRYPTION_ENABLED` | `true` | Enable/disable encryption |
| `VITE_ENFORCE_HTTPS` | `true` (prod) | Enforce HTTPS in production |
| `VITE_ENABLE_REQUEST_LOGGING` | `false` | Enable detailed request logging |
| `VITE_API_ENCRYPTION_KEY` | `default-dev-key` | Encryption key (CHANGE IN PRODUCTION!) |
| `VITE_API_HMAC_KEY` | `default-hmac-key` | HMAC signing key (CHANGE IN PRODUCTION!) |

### Security Config (api.security.ts)

```typescript
export const API_SECURITY_CONFIG = {
  ENFORCE_HTTPS: true,
  ENABLE_REQUEST_LOGGING: false,
  ENABLE_RESPONSE_VALIDATION: true,

  // Sensitive endpoints (always encrypted)
  SENSITIVE_ENDPOINTS: [
    '/auth/login',
    '/auth/register',
    '/payment',
    // Add your sensitive endpoints
  ],

  // Public endpoints (never encrypted)
  PUBLIC_ENDPOINTS: [
    '/health',
    '/public',
    // Add your public endpoints
  ],
};
```

### Encryption Config (api.encryption.ts)

```typescript
export const API_ENCRYPTION_CONFIG = {
  ALGORITHM: 'AES-GCM',
  KEY_SIZE: 256,
  IV_SIZE: 12,
  TAG_SIZE: 128,
  MAX_REQUEST_AGE: 5 * 60 * 1000, // 5 minutes
};
```

---

## Encryption Details

### Algorithm: AES-256-GCM

**Why AES-256-GCM?**
- Industry standard for symmetric encryption
- Provides both confidentiality and authenticity
- Fast and secure
- Supported by Web Crypto API

**Key Features**:
- **256-bit key**: Maximum security
- **GCM mode**: Authenticated encryption (prevents tampering)
- **96-bit IV**: Unique per request
- **128-bit tag**: Authentication tag

### Encryption Process

```typescript
// 1. Original data
const data = { email: 'user@example.com', password: 'secret' };

// 2. Convert to JSON
const json = JSON.stringify(data);
// "{"email":"user@example.com","password":"secret"}"

// 3. Derive key from passphrase
const salt = generateSalt();
const key = await deriveKey(ENCRYPTION_KEY, salt);

// 4. Generate random IV
const iv = generateIV();

// 5. Encrypt with AES-256-GCM
const encrypted = await crypto.subtle.encrypt(
  { name: 'AES-GCM', iv, tagLength: 128 },
  key,
  textToBuffer(json)
);

// 6. Sign with HMAC
const signature = await sign(encrypted, iv, timestamp);

// 7. Send over network
{
  encrypted: base64(encrypted),
  iv: base64(iv),
  tag: base64(tag),
  timestamp: 1234567890,
  signature: base64(signature)
}
```

### Decryption Process

```typescript
// 1. Receive encrypted payload
const payload = {
  encrypted: '...',
  iv: '...',
  tag: '...',
  timestamp: 1234567890,
  signature: '...'
};

// 2. Verify signature
const isValid = await verifySignature(payload);
if (!isValid) throw new Error('Invalid signature');

// 3. Check timestamp (prevent replay)
if (Date.now() - payload.timestamp > 5 * 60 * 1000) {
  throw new Error('Payload expired');
}

// 4. Derive key
const key = await deriveKey(ENCRYPTION_KEY, salt);

// 5. Decrypt
const decrypted = await crypto.subtle.decrypt(
  { name: 'AES-GCM', iv: decode(payload.iv), tagLength: 128 },
  key,
  combine(decode(payload.encrypted), decode(payload.tag))
);

// 6. Parse JSON
const data = JSON.parse(bufferToText(decrypted));
```

---

## Security Headers

### Request Headers

Every request includes:

```http
Content-Type: application/json
X-Client-Version: 1.0.0
X-Request-ID: <unique-id>
X-Timestamp: <timestamp>
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
X-CSRF-Token: <csrf-token>
X-Encrypted: true
```

### Response Headers (Recommended for Backend)

```http
Content-Security-Policy: default-src 'self'; script-src 'self'
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

---

## Monitoring & Logging

### View Security Metrics

```typescript
import { getSecurityMetrics } from '@/utils/api.security';

const metrics = getSecurityMetrics();
console.log(metrics);
```

**Output**:
```json
{
  "totalRequests": 45,
  "encryptedRequests": 12,
  "decryptedResponses": 11,
  "errors": 2,
  "securityEvents": 1,
  "encryptionEnabled": true,
  "httpsEnforced": true,
  "isSecureEnvironment": true
}
```

### View Security Logs

```typescript
import { SecurityEventLogger } from '@/utils/api.security';

const logs = SecurityEventLogger.getLogs();
console.table(logs);
```

**Output**:
```
┌─────────┬─────────────────┬─────────────────────────────────┬─────────────────────┐
│ (index) │      type       │            message              │     timestamp       │
├─────────┼─────────────────┼─────────────────────────────────┼─────────────────────┤
│    0    │   'REQUEST'     │ 'Outgoing API request'          │ 2024-01-15 10:30:00 │
│    1    │  'ENCRYPTION'   │ 'Request payload encrypted'     │ 2024-01-15 10:30:01 │
│    2    │   'RESPONSE'    │ 'Received API response'         │ 2024-01-15 10:30:03 │
│    3    │  'DECRYPTION'   │ 'Response payload decrypted'    │ 2024-01-15 10:30:04 │
└─────────┴─────────────────┴─────────────────────────────────┴─────────────────────┘
```

### Clear Logs

```typescript
SecurityEventLogger.clear();
```

---

## Best Practices

### 1. **Key Management**

❌ **Don't**:
```bash
# Never commit keys to version control
VITE_API_ENCRYPTION_KEY=my-secret-key
```

✅ **Do**:
```bash
# Use environment-specific keys
# Development: .env.local (not committed)
VITE_API_ENCRYPTION_KEY=dev-key-12345

# Production: Environment variables (secrets manager)
# Set via CI/CD or cloud provider
```

### 2. **HTTPS in Production**

❌ **Don't**: Disable HTTPS enforcement in production

✅ **Do**: Always use HTTPS in production
```typescript
// This is enforced by default
API_SECURITY_CONFIG.ENFORCE_HTTPS = true;
```

### 3. **Sensitive Data**

❌ **Don't**: Log sensitive data
```typescript
console.log('User credentials:', { email, password });
```

✅ **Do**: Use masking utility
```typescript
import { maskSensitiveData } from '@/utils/api.encryption';
console.log('User credentials:', maskSensitiveData({ email, password }));
// Output: { email: 'user@example.com', password: 'pa******rd' }
```

### 4. **Error Handling**

❌ **Don't**: Expose encryption errors to users

✅ **Do**: Handle gracefully
```typescript
try {
  const data = await encryptRequest(payload);
} catch (error) {
  console.error('Encryption failed:', error);
  // Show generic error to user
  showError('Unable to process request. Please try again.');
}
```

### 5. **Testing**

✅ **Do**: Test with encryption disabled in development
```bash
# .env.development.local
VITE_API_ENCRYPTION_ENABLED=false
```

✅ **Do**: Test with encryption enabled before production
```bash
# .env.staging
VITE_API_ENCRYPTION_ENABLED=true
```

---

## Troubleshooting

### Issue: "Failed to encrypt data"

**Cause**: Browser doesn't support Web Crypto API

**Solution**: Check browser compatibility
```typescript
if (!window.crypto || !window.crypto.subtle) {
  console.error('Web Crypto API not supported');
  // Fallback or show browser upgrade message
}
```

### Issue: "Failed to decrypt response"

**Possible causes**:
1. Backend encryption key doesn't match frontend
2. Payload was tampered with
3. Timestamp expired (> 5 minutes old)

**Solution**:
1. Verify `VITE_API_ENCRYPTION_KEY` matches backend
2. Check network logs for payload tampering
3. Ensure clocks are synchronized

### Issue: "HTTPS is required for API requests"

**Cause**: Non-HTTPS request in production

**Solution**:
- Use HTTPS URLs for API endpoints
- Or disable HTTPS enforcement in development:
  ```bash
  VITE_ENFORCE_HTTPS=false
  ```

### Issue: "Signature verification failed"

**Cause**: HMAC key mismatch or payload tampering

**Solution**:
- Verify `VITE_API_HMAC_KEY` matches backend
- Check for middleware modifying requests

---

## FAQ

### Q: Does this work with my existing code?

**A**: Yes! Just add one line:
```typescript
applySecurityInterceptors(this.api);
```

### Q: What if backend doesn't support encryption?

**A**: The system is backward compatible:
- Encrypted requests include `X-Encrypted: true` header
- Backend can detect and decrypt
- Non-encrypted backends can ignore encrypted payload
- Responses don't need to be encrypted

### Q: Does this impact performance?

**A**: Minimal impact:
- Encryption: ~5-10ms per request
- Decryption: ~5-10ms per response
- Negligible for typical API calls

### Q: Can I disable encryption for specific endpoints?

**A**: Yes, add to PUBLIC_ENDPOINTS:
```typescript
PUBLIC_ENDPOINTS: [
  '/health',
  '/your-endpoint',
]
```

### Q: How do I rotate encryption keys?

**A**:
1. Generate new keys
2. Update environment variables
3. Deploy frontend and backend simultaneously
4. Or support multiple keys during transition

### Q: Is this production-ready?

**A**: Yes, with proper configuration:
- ✅ Use strong, unique keys
- ✅ Enable HTTPS enforcement
- ✅ Monitor security logs
- ✅ Test thoroughly in staging

### Q: What about mobile apps?

**A**: Same implementation works for:
- React Native (using `react-native-crypto`)
- Expo (using `expo-crypto`)
- Adjust imports for platform-specific crypto APIs

---

## Security Checklist

Before going to production:

- [ ] Change `VITE_API_ENCRYPTION_KEY` to strong, random key
- [ ] Change `VITE_API_HMAC_KEY` to strong, random key
- [ ] Enable HTTPS enforcement (`VITE_ENFORCE_HTTPS=true`)
- [ ] Test encryption/decryption end-to-end
- [ ] Review and update sensitive endpoints list
- [ ] Configure security headers on backend
- [ ] Set up security event monitoring
- [ ] Test with real production data
- [ ] Document key rotation process
- [ ] Train team on security practices

---

## Support

For security issues:
- **Critical**: Report to security@betterandbliss.com
- **General**: Open GitHub issue
- **Questions**: Check this documentation

---

## License

© 2024 Better & Bliss. All rights reserved.

This security implementation is proprietary to Better & Bliss.
