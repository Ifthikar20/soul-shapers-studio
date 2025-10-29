"""
Example: How to integrate encryption middleware into your FastAPI app

This shows how to modify your existing app/main.py to add encryption support
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

# Import your existing components
# from app.routes import auth, content, streaming, newsletter
# from app.database.connection import DatabaseConnection
# from app.middleware.cors import setup_cors

# Import encryption middleware
from app.middleware.encryption_middleware import (
    EncryptionMiddleware,
    SecurityHeadersMiddleware
)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown"""
    # Startup
    logger.info("🚀 Starting Better & Bliss API with encryption support")

    # Initialize database (your existing code)
    # db_connection = DatabaseConnection()
    # await db_connection.connect()

    yield

    # Shutdown
    logger.info("🛑 Shutting down Better & Bliss API")
    # await db_connection.close()


# Create FastAPI app
app = FastAPI(
    title="Better & Bliss API",
    description="Mental health and wellness platform API with encryption",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan
)


# ==============================================
# 1. ADD ENCRYPTION MIDDLEWARE (First!)
# ==============================================
# IMPORTANT: Add encryption middleware BEFORE CORS and other middleware
# This ensures requests are decrypted before processing

app.add_middleware(
    EncryptionMiddleware,
    # Optional: Customize sensitive endpoints
    sensitive_endpoints=[
        "/auth/login",
        "/auth/register",
        "/auth/reset-password",
        "/auth/change-password",
        "/payment",
        "/subscription",
    ],
    # Optional: Customize public endpoints
    public_endpoints=[
        "/health",
        "/",
        "/docs",
        "/redoc",
        "/openapi.json",
    ]
)

# Add security headers middleware
app.add_middleware(SecurityHeadersMiddleware)


# ==============================================
# 2. CORS MIDDLEWARE (Your existing CORS setup)
# ==============================================
# This should come AFTER encryption middleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://betterandbliss.com",
        "https://www.betterandbliss.com",
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # React dev server
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


# ==============================================
# 3. REGISTER ROUTES (Your existing routes)
# ==============================================

# Example route registration (adapt to your actual routes)
# app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
# app.include_router(content.router, prefix="/content", tags=["Content"])
# app.include_router(streaming.router, prefix="/api/streaming", tags=["Streaming"])
# app.include_router(newsletter.router, prefix="/api/newsletter", tags=["Newsletter"])


# ==============================================
# 4. HEALTH CHECK ENDPOINT
# ==============================================

@app.get("/health")
async def health_check():
    """
    Health check endpoint
    This endpoint is public and not encrypted
    """
    from app.utils.encryption import EncryptionConfig

    return {
        "status": "healthy",
        "service": "Better & Bliss API",
        "encryption_enabled": EncryptionConfig.ENCRYPTION_ENABLED,
        "version": "2.0.0"
    }


@app.get("/")
async def root():
    """
    Root endpoint
    Lists available services
    """
    return {
        "message": "Better & Bliss API",
        "version": "2.0.0",
        "docs": "/api/docs",
        "health": "/health",
        "encryption": "enabled"
    }


# ==============================================
# 5. EXAMPLE: PROTECTED ROUTE WITH ENCRYPTION
# ==============================================

from pydantic import BaseModel


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    success: bool
    user: dict
    token_type: str
    expires_in: int


@app.post("/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """
    Login endpoint - automatically handles encryption

    When frontend sends encrypted request:
    1. EncryptionMiddleware automatically decrypts it
    2. Your route receives decrypted data normally
    3. EncryptionMiddleware automatically encrypts response
    4. Frontend receives encrypted response

    No changes needed to your existing route code!
    """
    # Your existing login logic here
    # The request data is already decrypted by middleware

    # Example response
    return {
        "success": True,
        "user": {
            "id": "user123",
            "email": request.email,
            "name": "John Doe",
            "role": "premium_user",
            "subscription_tier": "premium",
            "permissions": ["read", "write"]
        },
        "token_type": "Bearer",
        "expires_in": 3600
    }


# ==============================================
# 6. ERROR HANDLERS
# ==============================================

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}")
    return {
        "success": False,
        "error": {
            "message": "Internal server error",
            "code": "SERVER_ERROR"
        }
    }


# ==============================================
# RUNNING THE APP
# ==============================================
"""
To run with encryption:

1. Set environment variables:
   export API_ENCRYPTION_KEY="your-encryption-key"
   export API_HMAC_KEY="your-hmac-key"
   export API_ENCRYPTION_ENABLED="true"

2. Run the app:
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

3. Test with encrypted requests:
   - Frontend will automatically encrypt requests
   - Middleware will automatically decrypt/encrypt
   - Your route code stays the same!
"""

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
