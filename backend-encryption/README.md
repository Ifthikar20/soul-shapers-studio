# Backend Encryption for Better & Bliss

Complete Python/FastAPI implementation to match the frontend AES-256-GCM encryption.

---

## 🚀 Quick Start (5 Minutes)

### 1. Copy Files to Your Backend

```bash
# Navigate to your backend repository
cd /path/to/betterbliss-auth

# Copy encryption files
cp soul-shapers-studio/backend-encryption/app/utils/encryption.py app/utils/
cp soul-shapers-studio/backend-encryption/app/middleware/encryption_middleware.py app/middleware/
```

### 2. Install Dependencies

```bash
pip install cryptography>=41.0.0
```

### 3. Generate & Set Keys

```bash
# Generate keys
python -c "import secrets; print('Encryption:', secrets.token_urlsafe(32))"
python -c "import secrets; print('HMAC:', secrets.token_urlsafe(32))"

# Add to .env (MUST match frontend keys!)
echo "API_ENCRYPTION_KEY=paste-your-key-here" >> .env
echo "API_HMAC_KEY=paste-your-hmac-key-here" >> .env
echo "API_ENCRYPTION_ENABLED=true" >> .env
```

### 4. Update main.py

```python
# app/main.py

from app.middleware.encryption_middleware import EncryptionMiddleware

app = FastAPI(...)

# Add this line (BEFORE other middleware!)
app.add_middleware(EncryptionMiddleware)
```

### 5. Test It!

```bash
uvicorn app.main:app --reload
```

**Done!** Your backend now supports encryption. No changes to routes needed!

---

## 📁 What's Included

```
backend-encryption/
├── app/
│   ├── utils/
│   │   └── encryption.py              # Core encryption (AES-256-GCM)
│   └── middleware/
│       └── encryption_middleware.py   # FastAPI middleware (auto encrypt/decrypt)
│
├── BACKEND_INTEGRATION_GUIDE.md       # Complete integration guide
├── example_main_integration.py        # Full integration example
├── requirements_encryption.txt         # Python dependencies
├── .env.example                       # Environment variables template
└── README.md                          # This file
```

---

## ✨ Features

### Security

- ✅ **AES-256-GCM** encryption (same as frontend)
- ✅ **HMAC-SHA256** request signing
- ✅ **Replay attack prevention** (5-minute window)
- ✅ **Automatic encryption/decryption** via middleware
- ✅ **Sensitive data masking** in logs
- ✅ **Security headers** on all responses

### Integration

- ✅ **Zero code changes** to existing routes
- ✅ **Backward compatible** (works with encrypted and non-encrypted clients)
- ✅ **Configurable** sensitive endpoints
- ✅ **Production ready** with proper error handling

---

## 🔑 Key Synchronization (CRITICAL!)

Frontend and backend **must use identical keys**:

```bash
# Frontend (.env.production)
VITE_API_ENCRYPTION_KEY=kJ8fQ3mN9pR2sT5vW8yZ1aB4cD7eF0gH3iJ6kL9mN2oP
VITE_API_HMAC_KEY=pQ3rS6tU9vW2xY5zA8bC1dE4fG7hI0jK3lM6nO9pR2sT

# Backend (.env)
API_ENCRYPTION_KEY=kJ8fQ3mN9pR2sT5vW8yZ1aB4cD7eF0gH3iJ6kL9mN2oP  # ← Same!
API_HMAC_KEY=pQ3rS6tU9vW2xY5zA8bC1dE4fG7hI0jK3lM6nO9pR2sT      # ← Same!
```

---

## 📖 Documentation

- **Integration Guide**: [BACKEND_INTEGRATION_GUIDE.md](BACKEND_INTEGRATION_GUIDE.md)
- **Frontend Docs**: `docs/API_SECURITY.md` (in your frontend project)
- **Example Integration**: [example_main_integration.py](example_main_integration.py)

---

## 🧪 Testing

### Test Encryption Utilities

```python
from app.utils.encryption import encrypt_data, decrypt_data

data = {"email": "test@example.com", "password": "secret"}
encrypted = encrypt_data(data)
decrypted = decrypt_data(encrypted)

assert data == decrypted  # ✅ Success!
```

### Test with Frontend

1. Start backend: `uvicorn app.main:app --reload`
2. Start frontend: `npm run dev`
3. Try logging in - should work with encryption!
4. Check Network tab - should see encrypted payloads

---

## 🔧 How It Works

### Without Changes (Traditional)

```python
@app.post("/auth/login")
async def login(request: LoginRequest):
    # Request: {"email": "user@example.com", "password": "secret"}
    # ❌ Visible in Network tab!

    return {"success": True, "user": {...}}
```

### With Encryption (Automatic!)

```python
@app.post("/auth/login")
async def login(request: LoginRequest):
    # Middleware automatically decrypts request
    # You receive: {"email": "user@example.com", "password": "secret"}
    # Your code stays the same!

    # Middleware automatically encrypts response
    return {"success": True, "user": {...}}
    # Client receives encrypted payload ✅
```

---

## 🎯 Sensitive Endpoints

These endpoints are automatically encrypted:

- `/auth/login` ✅
- `/auth/register` ✅
- `/auth/reset-password` ✅
- `/auth/change-password` ✅
- `/payment/*` ✅
- `/subscription/*` ✅
- `/profile/*` ✅

To customize, edit `encryption_middleware.py`:

```python
SENSITIVE_ENDPOINTS = [
    "/auth/login",
    "/your-endpoint",  # Add your endpoints
]
```

---

## 🚨 Common Issues

### "Decryption failed"

**Cause**: Keys don't match

**Fix**:
```bash
# Verify keys are identical
echo "Frontend: $VITE_API_ENCRYPTION_KEY"
echo "Backend: $API_ENCRYPTION_KEY"
```

### "Module not found"

**Cause**: Files not copied

**Fix**:
```bash
ls app/utils/encryption.py
ls app/middleware/encryption_middleware.py
# If missing, copy from backend-encryption/ folder
```

### "Not encrypting"

**Fix**:
```bash
# 1. Check enabled
echo $API_ENCRYPTION_ENABLED  # Should be "true"

# 2. Check middleware registered
# main.py should have:
app.add_middleware(EncryptionMiddleware)

# 3. Restart server
uvicorn app.main:app --reload
```

---

## 🔐 Security Best Practices

### DO ✅

- Generate strong, unique keys (32 bytes)
- Use different keys per environment (dev/staging/prod)
- Store keys in secrets manager (AWS Secrets Manager, etc.)
- Rotate keys periodically (every 90 days)
- Use HTTPS in production (required!)
- Monitor security logs

### DON'T ❌

- Commit keys to Git
- Use default keys in production
- Share keys between environments
- Log keys or sensitive data
- Disable encryption in production

---

## 📊 Architecture

```
Request Flow:

Frontend → Encrypt Payload → HTTPS
                                ↓
Backend → Encryption Middleware → Decrypt
                                ↓
Your Route Handler (decrypted data)
                                ↓
Encryption Middleware → Encrypt Response
                                ↓
HTTPS → Frontend → Decrypt → Display
```

---

## 🎓 Example: Complete Integration

```python
# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.middleware.encryption_middleware import (
    EncryptionMiddleware,
    SecurityHeadersMiddleware
)

app = FastAPI(title="Better & Bliss API")

# 1. Add encryption middleware (FIRST!)
app.add_middleware(EncryptionMiddleware)
app.add_middleware(SecurityHeadersMiddleware)

# 2. Add CORS (AFTER encryption)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://betterandbliss.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Your routes (NO CHANGES NEEDED!)
@app.post("/auth/login")
async def login(request: LoginRequest):
    # Middleware handles encryption automatically
    user = authenticate(request.email, request.password)
    return {"success": True, "user": user}
```

---

## 🌟 Benefits

### For Users
- ✅ Passwords hidden in Network tab
- ✅ Payment info encrypted in transit
- ✅ Personal data protected

### For Developers
- ✅ No route code changes needed
- ✅ Automatic encryption/decryption
- ✅ Easy to enable/disable
- ✅ Production ready

### For Security
- ✅ End-to-end encryption
- ✅ Request integrity (HMAC)
- ✅ Replay attack prevention
- ✅ Sensitive data masking

---

## 📞 Support

- **Documentation**: [BACKEND_INTEGRATION_GUIDE.md](BACKEND_INTEGRATION_GUIDE.md)
- **Security Issues**: security@betterandbliss.com
- **Questions**: Create a GitHub issue

---

## 📜 License

© 2024 Better & Bliss. All rights reserved.

---

## ⚡ TL;DR

1. Copy 2 files to your backend
2. `pip install cryptography`
3. Set 3 environment variables
4. Add 1 line to main.py
5. Done! 🎉

Full guide: [BACKEND_INTEGRATION_GUIDE.md](BACKEND_INTEGRATION_GUIDE.md)
