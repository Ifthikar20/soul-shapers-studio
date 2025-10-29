"""
FastAPI Middleware for Automatic Request/Response Encryption
Handles encryption/decryption transparently for configured endpoints
"""

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
import json
from typing import Callable, List, Optional
import logging

from app.utils.encryption import (
    decrypt_request,
    encrypt_response,
    is_request_encrypted,
    DecryptionError,
    SignatureVerificationError,
    mask_sensitive_data,
    EncryptionConfig
)

logger = logging.getLogger(__name__)


class EncryptionMiddleware(BaseHTTPMiddleware):
    """
    Middleware to handle encryption/decryption of API requests and responses

    Features:
    - Automatic decryption of encrypted requests
    - Automatic encryption of responses (for sensitive endpoints)
    - Security event logging
    - Error handling for encryption failures
    """

    # Endpoints that should always be encrypted
    SENSITIVE_ENDPOINTS = [
        "/auth/login",
        "/auth/register",
        "/auth/reset-password",
        "/auth/change-password",
        "/payment",
        "/subscription",
        "/profile",
        "/user/settings",
    ]

    # Endpoints that should never be encrypted (public)
    PUBLIC_ENDPOINTS = [
        "/health",
        "/",
        "/docs",
        "/redoc",
        "/openapi.json",
        "/api/newsletter/subscribe",
    ]

    def __init__(self, app, sensitive_endpoints: Optional[List[str]] = None, public_endpoints: Optional[List[str]] = None):
        """
        Initialize encryption middleware

        Args:
            app: FastAPI application
            sensitive_endpoints: List of endpoints that should always be encrypted
            public_endpoints: List of endpoints that should never be encrypted
        """
        super().__init__(app)

        if sensitive_endpoints:
            self.SENSITIVE_ENDPOINTS = sensitive_endpoints

        if public_endpoints:
            self.PUBLIC_ENDPOINTS = public_endpoints

        logger.info(f"Encryption middleware initialized (enabled: {EncryptionConfig.ENCRYPTION_ENABLED})")

    def is_sensitive_endpoint(self, path: str) -> bool:
        """Check if endpoint is sensitive and should be encrypted"""
        return any(path.startswith(endpoint) for endpoint in self.SENSITIVE_ENDPOINTS)

    def is_public_endpoint(self, path: str) -> bool:
        """Check if endpoint is public and should not be encrypted"""
        return any(path.startswith(endpoint) for endpoint in self.PUBLIC_ENDPOINTS)

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Process request and response with encryption/decryption

        Args:
            request: Incoming request
            call_next: Next middleware/route handler

        Returns:
            Response (potentially encrypted)
        """
        path = request.url.path

        # Skip encryption for public endpoints
        if self.is_public_endpoint(path):
            return await call_next(request)

        # Process request decryption
        try:
            request = await self._decrypt_request(request)
        except (DecryptionError, SignatureVerificationError) as e:
            logger.warning(f"Request decryption failed for {path}: {e}")
            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "error": {
                        "message": "Invalid or tampered request",
                        "code": "DECRYPTION_FAILED"
                    }
                }
            )
        except Exception as e:
            logger.error(f"Unexpected error during request decryption: {e}")
            return JSONResponse(
                status_code=500,
                content={
                    "success": False,
                    "error": {
                        "message": "Internal server error",
                        "code": "SERVER_ERROR"
                    }
                }
            )

        # Call next middleware/route handler
        response = await call_next(request)

        # Process response encryption for sensitive endpoints
        if self.is_sensitive_endpoint(path) and isinstance(response, JSONResponse):
            response = await self._encrypt_response(response, path)

        return response

    async def _decrypt_request(self, request: Request) -> Request:
        """
        Decrypt request body if encrypted

        Args:
            request: Incoming request

        Returns:
            Request with decrypted body

        Raises:
            DecryptionError: If decryption fails
            SignatureVerificationError: If signature is invalid
        """
        # Only process POST/PUT/PATCH requests with body
        if request.method not in ["POST", "PUT", "PATCH"]:
            return request

        # Read request body
        body = await request.body()
        if not body:
            return request

        try:
            # Parse JSON
            data = json.loads(body)

            # Check if request is encrypted
            if is_request_encrypted(data):
                logger.info(f"Decrypting request to {request.url.path}")

                # Decrypt
                decrypted_data = decrypt_request(data)

                # Log (with masking)
                logger.debug(f"Decrypted request: {mask_sensitive_data(decrypted_data)}")

                # Replace request body with decrypted data
                request._body = json.dumps(decrypted_data).encode()

                # Add header to indicate encryption was used
                request.headers.__dict__["_list"].append(
                    (b"x-encrypted", b"true")
                )

        except json.JSONDecodeError:
            # Not JSON, skip
            pass
        except (DecryptionError, SignatureVerificationError):
            # Re-raise encryption errors
            raise
        except Exception as e:
            logger.error(f"Error processing request encryption: {e}")
            # Don't fail on unexpected errors, pass through
            pass

        return request

    async def _encrypt_response(self, response: JSONResponse, path: str) -> JSONResponse:
        """
        Encrypt response if needed

        Args:
            response: Response to encrypt
            path: Request path

        Returns:
            Encrypted response or original response
        """
        if not EncryptionConfig.ENCRYPTION_ENABLED:
            return response

        try:
            # Get response body
            body = response.body

            if body:
                # Parse JSON
                data = json.loads(body)

                # Encrypt response
                logger.info(f"Encrypting response for {path}")
                encrypted_data = encrypt_response(data)

                # Log (with masking)
                logger.debug(f"Encrypted response: {mask_sensitive_data(encrypted_data)}")

                # Create new response with encrypted data
                return JSONResponse(
                    content=encrypted_data,
                    status_code=response.status_code,
                    headers=dict(response.headers)
                )

        except Exception as e:
            logger.error(f"Error encrypting response: {e}")
            # Return original response on encryption failure (fail open)

        return response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware to add security headers to all responses
    """

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        response = await call_next(request)

        # Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"

        # Add CSP header (adjust for your needs)
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' https://www.googletagmanager.com; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self' data:; "
            "connect-src 'self' https://api.betterandbliss.com https://www.google-analytics.com; "
            "frame-ancestors 'none'; "
            "base-uri 'self'; "
            "form-action 'self'"
        )

        return response


# Utility function to check if request has encryption header
def is_encrypted_request(request: Request) -> bool:
    """
    Check if request was encrypted (based on header)

    Args:
        request: FastAPI Request object

    Returns:
        True if request was encrypted
    """
    return request.headers.get("x-encrypted") == "true"
