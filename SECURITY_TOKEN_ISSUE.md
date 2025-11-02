# Security Issue: Access Tokens in Browser Cookies

## Issue
AWS Cognito access tokens are currently being stored in regular browser cookies that are accessible to JavaScript. This creates a security vulnerability:

```
access_token=eyJraWQiOiJGQWlQUElQUUxuZG5ONFZmQ3U4bm1lc3hOZ2piTENiWno3eGtlSlhNcHFnPSIsImFsZyI6IlJTMjU2In0...
```

## Security Risks
- **XSS Vulnerability**: Malicious scripts can steal access tokens
- **Token Exposure**: Tokens visible in browser dev tools
- **Session Hijacking**: Stolen tokens can be used to impersonate users

## Required Backend Changes

### Option 1: httpOnly Cookies (Recommended)

The backend needs to set tokens with httpOnly flag:

```python
# In your backend authentication endpoint
response.set_cookie(
    key='access_token',
    value=access_token,
    httponly=True,  # ← Makes cookie inaccessible to JavaScript
    secure=True,    # ← Only send over HTTPS
    samesite='Strict',  # ← CSRF protection
    max_age=3600,   # 1 hour
    path='/'
)

response.set_cookie(
    key='refresh_token',
    value=refresh_token,
    httponly=True,  # ← Critical security flag
    secure=True,
    samesite='Strict',
    max_age=2592000,  # 30 days
    path='/'
)
```

### Option 2: Remove Tokens from Cookies Entirely

Store tokens in memory only (more secure but requires re-authentication on page refresh):

**Backend:**
```python
# Return tokens in response body instead of cookies
return {
    "access_token": access_token,
    "refresh_token": refresh_token,
    "token_type": "Bearer",
    "expires_in": 3600
}
```

**Frontend:** (We would implement this)
```typescript
// Store in memory only - cleared on page refresh
class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  setTokens(access: string, refresh: string) {
    this.accessToken = access;
    this.refreshToken = refresh;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
  }
}
```

## AWS Cognito Specific Configuration

If using AWS Cognito Hosted UI, configure in AWS Console:

### Cognito User Pool Settings:
1. Go to AWS Cognito Console
2. Select your User Pool
3. App Integration → App Client Settings
4. **Token Configuration**:
   - Refresh token expiration: 30 days
   - Access token expiration: 1 hour
   - ID token expiration: 1 hour

### API Gateway / Lambda Backend:
```python
# In your Lambda authorizer or API endpoint

from aws_lambda_powertools import Logger
from jose import jwt
import boto3

logger = Logger()

def set_secure_auth_cookies(event, access_token, refresh_token, id_token):
    """
    Set authentication tokens as httpOnly cookies
    """

    # Decode to get expiration
    access_payload = jwt.get_unverified_claims(access_token)
    refresh_payload = jwt.get_unverified_claims(refresh_token)

    cookies = []

    # Access Token Cookie (httpOnly)
    cookies.append(
        f"access_token={access_token}; "
        f"HttpOnly; Secure; SameSite=Strict; "
        f"Path=/; Max-Age=3600"
    )

    # Refresh Token Cookie (httpOnly)
    cookies.append(
        f"refresh_token={refresh_token}; "
        f"HttpOnly; Secure; SameSite=Strict; "
        f"Path=/; Max-Age=2592000"
    )

    # ID Token Cookie (httpOnly)
    cookies.append(
        f"id_token={id_token}; "
        f"HttpOnly; Secure; SameSite=Strict; "
        f"Path=/; Max-Age=3600"
    )

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': 'https://your-frontend-domain.com',
        },
        'multiValueHeaders': {
            'Set-Cookie': cookies
        },
        'body': json.dumps({
            'success': True,
            'user': {
                'id': access_payload['sub'],
                'email': access_payload.get('email'),
                # ... other user data
            }
        })
    }
```

## Recommended Solution

**Implement httpOnly cookies on the backend** (Option 1). This provides:
- ✅ Secure token storage
- ✅ Automatic token sending with requests
- ✅ Protection against XSS
- ✅ No page refresh required
- ✅ CSRF protection with SameSite

## Frontend Changes Needed

Once backend implements httpOnly cookies, **NO frontend code changes needed!**

The existing code already uses:
```typescript
withCredentials: true  // Allows cookies to be sent/received
```

The tokens will be automatically included in requests but won't be accessible to JavaScript.

## Current Status

❌ **CRITICAL SECURITY ISSUE**: Tokens currently exposed in regular cookies
⚠️ **Action Required**: Backend team must implement httpOnly cookies
📋 **Timeline**: Should be fixed before production deployment

## Testing After Fix

```bash
# In browser DevTools Console - this should return null/undefined
document.cookie.match(/access_token/)

# Cookies should still work for API requests
# But should not be readable by JavaScript
```

## References

- [OWASP: HttpOnly Cookie Flag](https://owasp.org/www-community/HttpOnly)
- [AWS Cognito Security Best Practices](https://docs.aws.amazon.com/cognito/latest/developerguide/security-best-practices.html)
- [MDN: Using HTTP Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)

---
**Created**: 2025-11-01
**Severity**: HIGH
**Status**: PENDING BACKEND FIX
