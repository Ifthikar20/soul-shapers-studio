# Backend Encryption Integration Guide

Complete guide to integrating AES-256-GCM encryption into your Better & Bliss FastAPI backend to match the frontend implementation.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [What's Included](#whats-included)
3. [Quick Start](#quick-start)
4. [Detailed Integration](#detailed-integration)
5. [Configuration](#configuration)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## Overview

This integration adds **end-to-end encryption** to your FastAPI backend that matches your frontend implementation:

- **AES-256-GCM** encryption for request/response payloads
- **HMAC-SHA256** request signing for integrity
- **Automatic** encryption/decryption via middleware
- **Zero code changes** to existing routes (middleware handles everything!)
- **Backward compatible** (works with both encrypted and non-encrypted clients)

### Security Features

✅ Request payload encryption/decryption
✅ Response payload encryption
✅ HMAC signature verification
✅ Replay attack prevention (5-minute timestamp window)
✅ Sensitive data masking in logs
✅ Security headers on all responses

---

## What's Included

### Files Created

```
backend-encryption/
├── app/
│   ├── utils/
│   │   └── encryption.py              # Core encryption utilities
│   └── middleware/
│       └── encryption_middleware.py   # FastAPI middleware
├── requirements_encryption.txt         # Python dependencies
├── example_main_integration.py        # Integration example
├── .env.example                       # Environment variables template
└── BACKEND_INTEGRATION_GUIDE.md      # This file
```

### Components

**1. `app/utils/encryption.py`** - Core encryption utilities
- `encrypt_data()` - AES-256-GCM encryption
- `decrypt_data()` - AES-256-GCM decryption
- `sign_payload()` - HMAC-SHA256 signing
- `verify_signature()` - Signature verification
- Helper functions for masking, validation, etc.

**2. `app/middleware/encryption_middleware.py`** - FastAPI middleware
- `EncryptionMiddleware` - Automatic request/response encryption
- `SecurityHeadersMiddleware` - Security headers
- Configurable sensitive/public endpoints

**3. `requirements_encryption.txt`** - Dependencies
- `cryptography>=41.0.0` - Encryption library

---

## Quick Start

### Step 1: Install Dependencies

```bash
# Navigate to your backend directory
cd /path/to/betterbliss-auth

# Install encryption dependencies
pip install -r requirements_encryption.txt

# Or install directly
pip install cryptography>=41.0.0
```

### Step 2: Copy Files to Your Backend

```bash
# Copy encryption utilities
cp backend-encryption/app/utils/encryption.py app/utils/

# Copy encryption middleware
cp backend-encryption/app/middleware/encryption_middleware.py app/middleware/

# Copy environment example
cp backend-encryption/.env.example .env.encryption.example
```

### Step 3: Set Environment Variables

```bash
# Generate encryption keys (MUST match frontend!)
python -c "import secrets; print('Encryption Key:', secrets.token_urlsafe(32))"
python -c "import secrets; print('HMAC Key:', secrets.token_urlsafe(32))"

# Add to your .env file:
echo "API_ENCRYPTION_KEY=your-encryption-key-here" >> .env
echo "API_HMAC_KEY=your-hmac-key-here" >> .env
echo "API_ENCRYPTION_ENABLED=true" >> .env
```

**⚠️ CRITICAL**: Keys MUST match your frontend keys!

```bash
# Frontend (.env.production)
VITE_API_ENCRYPTION_KEY=abc123...

# Backend (.env)
API_ENCRYPTION_KEY=abc123...  # Must be identical!
```

### Step 4: Update main.py

```python
# app/main.py

from fastapi import FastAPI
from app.middleware.encryption_middleware import (
    EncryptionMiddleware,
    SecurityHeadersMiddleware
)

app = FastAPI(...)

# Add encryption middleware (BEFORE other middleware!)
app.add_middleware(EncryptionMiddleware)
app.add_middleware(SecurityHeadersMiddleware)

# Your existing middleware (CORS, etc.)
# ...
```

### Step 5: Test It!

```bash
# Start your backend
uvicorn app.main:app --reload

# Test with curl (encrypted request)
# Or use your frontend - it will automatically encrypt!
```

---

## Detailed Integration

### Integration Steps

#### 1. Add Encryption Utilities

Create `app/utils/encryption.py` (already provided in files above).

This module provides:
- `encrypt_data(data: dict) -> dict` - Encrypt data
- `decrypt_data(payload: dict) -> dict` - Decrypt data
- `sign_payload(payload: dict) -> str` - Sign with HMAC
- `verify_signature(payload: dict) -> bool` - Verify signature

#### 2. Add Encryption Middleware

Create `app/middleware/encryption_middleware.py` (already provided).

The middleware automatically:
- Decrypts incoming encrypted requests
- Validates HMAC signatures
- Checks timestamps (replay protection)
- Encrypts outgoing responses (for sensitive endpoints)
- Adds security headers

#### 3. Configure Sensitive Endpoints

Edit `encryption_middleware.py` to customize which endpoints are encrypted:

```python
class EncryptionMiddleware(BaseHTTPMiddleware):
    # Endpoints that should always be encrypted
    SENSITIVE_ENDPOINTS = [
        "/auth/login",         # ✅ Login credentials
        "/auth/register",      # ✅ Registration data
        "/auth/reset-password", # ✅ Password reset
        "/payment",            # ✅ Payment info
        # Add your sensitive endpoints
    ]

    # Endpoints that should NEVER be encrypted
    PUBLIC_ENDPOINTS = [
        "/health",
        "/docs",
        "/openapi.json",
        # Add your public endpoints
    ]
```

#### 4. Update main.py

Your existing `app/main.py` should be updated to add the middleware:

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.middleware.encryption_middleware import (
    EncryptionMiddleware,
    SecurityHeadersMiddleware
)

app = FastAPI(...)

# ⚠️ IMPORTANT: Middleware order matters!
# Add encryption middleware FIRST (before CORS)
app.add_middleware(EncryptionMiddleware)
app.add_middleware(SecurityHeadersMiddleware)

# Then add your existing middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://betterandbliss.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register your routes
# app.include_router(auth_router, prefix="/auth")
# ...
```

#### 5. No Changes to Routes!

**Important**: Your existing route handlers don't need any changes!

```python
# Your existing route stays exactly the same
@app.post("/auth/login")
async def login(request: LoginRequest):
    # Middleware automatically decrypts the request
    # You receive decrypted data normally

    # Your existing login logic
    user = authenticate_user(request.email, request.password)

    # Middleware automatically encrypts the response
    return {"success": True, "user": user}
```

The middleware handles encryption transparently!

---

## Configuration

### Environment Variables

Required environment variables (add to `.env`):

```bash
# Encryption Keys (MUST match frontend)
API_ENCRYPTION_KEY=your-32-byte-base64-key
API_HMAC_KEY=your-32-byte-base64-key

# Enable/disable encryption
API_ENCRYPTION_ENABLED=true
```

### Key Generation

**Method 1: Python (Recommended)**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Method 2: OpenSSL**
```bash
openssl rand -base64 32
```

**Method 3: Node.js (same as frontend)**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Key Synchronization

**CRITICAL**: Frontend and backend MUST use identical keys!

```bash
# Frontend (.env.production)
VITE_API_ENCRYPTION_KEY=kJ8fQ3mN9pR2sT5vW8yZ1aB4cD7eF0gH3iJ6kL9mN2oP
VITE_API_HMAC_KEY=pQ3rS6tU9vW2xY5zA8bC1dE4fG7hI0jK3lM6nO9pR2sT

# Backend (.env)
API_ENCRYPTION_KEY=kJ8fQ3mN9pR2sT5vW8yZ1aB4cD7eF0gH3iJ6kL9mN2oP  # ✅ Same!
API_HMAC_KEY=pQ3rS6tU9vW2xY5zA8bC1dE4fG7hI0jK3lM6nO9pR2sT      # ✅ Same!
```

### Configuration Options

Edit `app/utils/encryption.py` to customize:

```python
class EncryptionConfig:
    # Key size (don't change - must be 256-bit)
    KEY_SIZE = 32

    # Request age limit (5 minutes)
    MAX_REQUEST_AGE = 5 * 60 * 1000

    # PBKDF2 iterations
    PBKDF2_ITERATIONS = 100000
```

---

## Testing

### 1. Test Encryption Utilities

```python
# test_encryption.py
from app.utils.encryption import encrypt_data, decrypt_data

# Test data
data = {"email": "test@example.com", "password": "secret"}

# Encrypt
encrypted = encrypt_data(data)
print("Encrypted:", encrypted)

# Decrypt
decrypted = decrypt_data(encrypted)
print("Decrypted:", decrypted)

assert data == decrypted
print("✅ Encryption test passed!")
```

Run test:
```bash
python test_encryption.py
```

### 2. Test with Frontend

1. **Start backend with encryption**:
   ```bash
   API_ENCRYPTION_ENABLED=true uvicorn app.main:app --reload
   ```

2. **Start frontend with encryption**:
   ```bash
   VITE_API_ENCRYPTION_ENABLED=true npm run dev
   ```

3. **Test login** - Check Network tab:
   - Request should show encrypted payload
   - Response should show encrypted payload
   - Login should work normally!

### 3. Test Backward Compatibility

The system works with both encrypted and non-encrypted clients:

```python
# Test with non-encrypted request
import requests

response = requests.post(
    "http://localhost:8000/auth/login",
    json={"email": "test@example.com", "password": "secret"}
)
# ✅ Should work! Middleware passes through non-encrypted requests
```

### 4. Verify Encryption in Logs

```bash
# Start backend with debug logging
LOG_LEVEL=DEBUG uvicorn app.main:app --reload

# Make a request - you should see:
# INFO: Decrypting request to /auth/login
# DEBUG: Decrypted request: {'email': 'te********om', 'password': '****'}
# INFO: Encrypting response for /auth/login
```

---

## Deployment

### Production Checklist

- [ ] Generate strong, unique encryption keys
- [ ] Sync keys between frontend and backend
- [ ] Set `API_ENCRYPTION_ENABLED=true`
- [ ] Use environment variables (not hardcoded keys)
- [ ] Test encryption end-to-end
- [ ] Enable HTTPS (required!)
- [ ] Monitor security logs
- [ ] Set up key rotation schedule

### AWS Deployment

**Using AWS Secrets Manager:**

```bash
# Store keys in Secrets Manager
aws secretsmanager create-secret \
  --name betterbliss/api-encryption-key \
  --secret-string "your-encryption-key"

aws secretsmanager create-secret \
  --name betterbliss/api-hmac-key \
  --secret-string "your-hmac-key"

# Retrieve in your app startup
import boto3

client = boto3.client('secretsmanager')
encryption_key = client.get_secret_value(
    SecretId='betterbliss/api-encryption-key'
)['SecretString']
```

**Using ECS Task Definition:**

```json
{
  "containerDefinitions": [{
    "environment": [
      {
        "name": "API_ENCRYPTION_KEY",
        "value": "from-secrets-manager"
      },
      {
        "name": "API_HMAC_KEY",
        "value": "from-secrets-manager"
      },
      {
        "name": "API_ENCRYPTION_ENABLED",
        "value": "true"
      }
    ]
  }]
}
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt requirements_encryption.txt ./
RUN pip install -r requirements.txt -r requirements_encryption.txt

# Copy app
COPY ./app ./app

# Environment variables (set via docker-compose or k8s)
ENV API_ENCRYPTION_ENABLED=true

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```yaml
# docker-compose.yml
services:
  api:
    build: .
    environment:
      - API_ENCRYPTION_KEY=${API_ENCRYPTION_KEY}
      - API_HMAC_KEY=${API_HMAC_KEY}
      - API_ENCRYPTION_ENABLED=true
    ports:
      - "8000:8000"
```

---

## Troubleshooting

### Issue: "Decryption failed"

**Symptom**: 400 error with "Invalid or tampered request"

**Causes**:
1. Keys don't match between frontend and backend
2. Timestamp too old (>5 minutes)
3. Signature verification failed

**Solutions**:
```bash
# 1. Verify keys match
echo "Frontend: $VITE_API_ENCRYPTION_KEY"
echo "Backend: $API_ENCRYPTION_KEY"
# They should be identical!

# 2. Check server time sync
date  # Should be accurate

# 3. Check logs for detailed error
tail -f app.log
```

### Issue: "Module not found: app.utils.encryption"

**Cause**: Files not copied to correct location

**Solution**:
```bash
# Ensure files are in correct locations:
ls app/utils/encryption.py
ls app/middleware/encryption_middleware.py

# If missing, copy from backend-encryption/ folder
```

### Issue: "Encryption not working"

**Symptom**: Requests/responses not encrypted

**Check**:
```bash
# 1. Verify encryption is enabled
echo $API_ENCRYPTION_ENABLED  # Should be "true"

# 2. Check middleware is registered
# In main.py, should have:
app.add_middleware(EncryptionMiddleware)

# 3. Check endpoint is sensitive
# Verify endpoint is in SENSITIVE_ENDPOINTS list

# 4. Restart server
# Middleware is loaded at startup
uvicorn app.main:app --reload
```

### Issue: "ImportError: cannot import name 'AESGCM'"

**Cause**: `cryptography` package not installed

**Solution**:
```bash
pip install cryptography>=41.0.0
```

### Issue: "Keys visible in logs"

**Cause**: Debug logging exposing sensitive data

**Solution**:
```python
# Don't log the keys directly!
# Use mask_sensitive_data() function:

from app.utils.encryption import mask_sensitive_data

logger.debug(f"Data: {mask_sensitive_data(data)}")
# Output: {'password': '****', 'email': 'user@example.com'}
```

---

## Architecture

### Request Flow

```
1. Frontend Encrypts Request
   ↓
2. HTTPS Transport (encrypted)
   ↓
3. Backend Receives Encrypted Payload
   ↓
4. EncryptionMiddleware.dispatch()
   ├─ Verify HMAC signature
   ├─ Check timestamp (replay protection)
   ├─ Decrypt AES-256-GCM payload
   └─ Replace request body with decrypted data
   ↓
5. Your Route Handler (receives decrypted data)
   ↓
6. EncryptionMiddleware.dispatch() (response)
   ├─ Encrypt response with AES-256-GCM
   ├─ Sign with HMAC
   └─ Add timestamp
   ↓
7. HTTPS Transport (encrypted)
   ↓
8. Frontend Decrypts Response
```

### Security Layers

```
┌─────────────────────────────────────────┐
│  HTTPS/TLS (Transport Encryption)       │
│  ✓ Protects against network sniffing    │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  AES-256-GCM (Payload Encryption)       │
│  ✓ Hides sensitive data in payload      │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  HMAC-SHA256 (Integrity)                │
│  ✓ Prevents tampering                   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Timestamp (Replay Protection)          │
│  ✓ Prevents request reuse               │
└─────────────────────────────────────────┘
```

---

## Summary

### What You Need to Do

1. ✅ Copy `encryption.py` to `app/utils/`
2. ✅ Copy `encryption_middleware.py` to `app/middleware/`
3. ✅ Install `cryptography` package
4. ✅ Generate encryption keys (Python command)
5. ✅ Add keys to `.env` (MUST match frontend!)
6. ✅ Update `main.py` to add middleware
7. ✅ Test with frontend
8. ✅ Deploy to production

### Files to Add to Your Backend

```
app/
├── utils/
│   └── encryption.py              # ✅ Copy this
└── middleware/
    └── encryption_middleware.py   # ✅ Copy this

.env                                # ✅ Add encryption keys
requirements.txt                    # ✅ Add cryptography>=41.0.0
```

### Environment Variables

```bash
# Add these to your .env
API_ENCRYPTION_KEY=your-key-here-must-match-frontend
API_HMAC_KEY=your-hmac-key-must-match-frontend
API_ENCRYPTION_ENABLED=true
```

### Integration Code

```python
# app/main.py - Add this
from app.middleware.encryption_middleware import EncryptionMiddleware

app.add_middleware(EncryptionMiddleware)
```

**That's it!** Your backend now supports end-to-end encryption matching your frontend!

---

## Support

- **Documentation**: This file + inline code comments
- **Frontend Docs**: `docs/API_SECURITY.md`
- **Issues**: Create a GitHub issue
- **Security**: Email security@betterandbliss.com

---

## License

© 2024 Better & Bliss. All rights reserved.
