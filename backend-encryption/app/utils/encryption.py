"""
API Encryption & Security Utilities for Backend
Matches the frontend encryption implementation (AES-256-GCM + HMAC-SHA256)
"""

import base64
import json
import hmac
import hashlib
import time
from typing import Dict, Any, Optional, Tuple
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2
from cryptography.hazmat.backends import default_backend
import os


class EncryptionConfig:
    """Configuration for API encryption"""

    # Algorithm settings
    ALGORITHM = "AES-GCM"
    KEY_SIZE = 32  # 256 bits
    IV_SIZE = 12  # 96 bits for GCM
    TAG_SIZE = 16  # 128 bits

    # PBKDF2 settings
    PBKDF2_ITERATIONS = 100000
    SALT_SIZE = 16

    # Security settings
    MAX_REQUEST_AGE = 5 * 60 * 1000  # 5 minutes in milliseconds

    # Keys from environment variables
    ENCRYPTION_KEY = os.getenv("API_ENCRYPTION_KEY", "default-dev-key-change-in-production")
    HMAC_KEY = os.getenv("API_HMAC_KEY", "default-hmac-key-change-in-production")

    # Feature flags
    ENCRYPTION_ENABLED = os.getenv("API_ENCRYPTION_ENABLED", "true").lower() == "true"


class EncryptionError(Exception):
    """Base exception for encryption errors"""
    pass


class DecryptionError(Exception):
    """Exception raised when decryption fails"""
    pass


class SignatureVerificationError(Exception):
    """Exception raised when signature verification fails"""
    pass


def derive_key(passphrase: str, salt: bytes) -> bytes:
    """
    Derive encryption key from passphrase using PBKDF2

    Args:
        passphrase: Master key passphrase
        salt: Salt for key derivation

    Returns:
        Derived 256-bit key
    """
    kdf = PBKDF2(
        algorithm=hashes.SHA256(),
        length=EncryptionConfig.KEY_SIZE,
        salt=salt,
        iterations=EncryptionConfig.PBKDF2_ITERATIONS,
        backend=default_backend()
    )
    return kdf.derive(passphrase.encode())


def encrypt_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Encrypt data using AES-256-GCM

    Args:
        data: Dictionary to encrypt

    Returns:
        Encrypted payload with IV, tag, timestamp, and signature

    Raises:
        EncryptionError: If encryption fails
    """
    try:
        # Convert data to JSON
        json_string = json.dumps(data)
        plaintext = json_string.encode()

        # Generate salt and derive key
        salt = os.urandom(EncryptionConfig.SALT_SIZE)
        key = derive_key(EncryptionConfig.ENCRYPTION_KEY, salt)

        # Generate IV
        iv = os.urandom(EncryptionConfig.IV_SIZE)

        # Encrypt with AES-GCM
        aesgcm = AESGCM(key)
        ciphertext = aesgcm.encrypt(iv, plaintext, None)

        # For AES-GCM, ciphertext includes the tag at the end
        encrypted_data = ciphertext[:-EncryptionConfig.TAG_SIZE]
        tag = ciphertext[-EncryptionConfig.TAG_SIZE:]

        # Create payload
        timestamp = int(time.time() * 1000)
        payload = {
            "encrypted": base64.b64encode(encrypted_data).decode(),
            "iv": base64.b64encode(iv).decode(),
            "tag": base64.b64encode(tag).decode(),
            "timestamp": timestamp,
        }

        # Sign the payload
        payload["signature"] = sign_payload(payload)

        return payload

    except Exception as e:
        raise EncryptionError(f"Encryption failed: {str(e)}")


def decrypt_data(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Decrypt data using AES-256-GCM

    Args:
        payload: Encrypted payload with encrypted, iv, tag, timestamp, signature

    Returns:
        Decrypted data as dictionary

    Raises:
        DecryptionError: If decryption fails
        SignatureVerificationError: If signature is invalid
    """
    try:
        # Verify signature first
        if not verify_signature(payload):
            raise SignatureVerificationError("Invalid payload signature")

        # Verify timestamp (prevent replay attacks)
        timestamp = payload.get("timestamp", 0)
        age = int(time.time() * 1000) - timestamp
        if age > EncryptionConfig.MAX_REQUEST_AGE:
            raise DecryptionError(f"Payload expired (age: {age}ms)")

        # Decode Base64 values
        encrypted_data = base64.b64decode(payload["encrypted"])
        iv = base64.b64decode(payload["iv"])
        tag = base64.b64decode(payload["tag"])

        # Reconstruct salt (in production, include in payload or use fixed salt)
        salt = os.urandom(EncryptionConfig.SALT_SIZE)
        key = derive_key(EncryptionConfig.ENCRYPTION_KEY, salt)

        # Combine encrypted data and tag for GCM
        ciphertext = encrypted_data + tag

        # Decrypt with AES-GCM
        aesgcm = AESGCM(key)
        plaintext = aesgcm.decrypt(iv, ciphertext, None)

        # Parse JSON
        json_string = plaintext.decode()
        return json.loads(json_string)

    except SignatureVerificationError:
        raise
    except Exception as e:
        raise DecryptionError(f"Decryption failed: {str(e)}")


def sign_payload(payload: Dict[str, Any]) -> str:
    """
    Sign payload using HMAC-SHA256

    Args:
        payload: Payload to sign (excludes signature field)

    Returns:
        Base64-encoded signature
    """
    # Create signature data (exclude signature field if present)
    signature_data = {
        k: v for k, v in payload.items()
        if k != "signature"
    }

    # Create HMAC signature
    message = json.dumps(signature_data, sort_keys=True).encode()
    signature = hmac.new(
        EncryptionConfig.HMAC_KEY.encode(),
        message,
        hashlib.sha256
    ).digest()

    return base64.b64encode(signature).decode()


def verify_signature(payload: Dict[str, Any]) -> bool:
    """
    Verify payload signature

    Args:
        payload: Payload with signature field

    Returns:
        True if signature is valid, False otherwise
    """
    try:
        stored_signature = payload.get("signature", "")
        if not stored_signature:
            return False

        # Calculate expected signature
        expected_signature = sign_payload(payload)

        # Constant-time comparison
        return hmac.compare_digest(
            stored_signature.encode(),
            expected_signature.encode()
        )

    except Exception:
        return False


def hash_data(data: str) -> str:
    """
    Hash data using SHA-256

    Args:
        data: String to hash

    Returns:
        Base64-encoded hash
    """
    hash_bytes = hashlib.sha256(data.encode()).digest()
    return base64.b64encode(hash_bytes).decode()


def mask_sensitive_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Mask sensitive data for logging

    Args:
        data: Dictionary with potentially sensitive data

    Returns:
        Dictionary with masked sensitive fields
    """
    sensitive_fields = {
        "password", "token", "secret", "api_key", "apiKey",
        "access_token", "accessToken", "refresh_token", "refreshToken",
        "credit_card", "creditCard", "ssn", "cvv"
    }

    masked = data.copy()

    for key, value in masked.items():
        # Check if field is sensitive
        if any(field in key.lower() for field in sensitive_fields):
            if isinstance(value, str) and len(value) > 0:
                # Show first 2 and last 2 characters
                if len(value) <= 4:
                    masked[key] = "****"
                else:
                    masked[key] = f"{value[:2]}{'*' * (len(value) - 4)}{value[-2:]}"
            else:
                masked[key] = "****"
        elif isinstance(value, dict):
            # Recursively mask nested objects
            masked[key] = mask_sensitive_data(value)

    return masked


def is_request_encrypted(data: Any) -> bool:
    """
    Check if request data is encrypted

    Args:
        data: Request data (dict or other)

    Returns:
        True if data appears to be encrypted
    """
    if not isinstance(data, dict):
        return False

    return (
        data.get("encrypted") is True and
        "payload" in data and
        isinstance(data["payload"], dict) and
        all(k in data["payload"] for k in ["encrypted", "iv", "timestamp", "signature"])
    )


def decrypt_request(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Decrypt request data if encrypted, otherwise return as-is

    Args:
        data: Request data

    Returns:
        Decrypted data or original data

    Raises:
        DecryptionError: If decryption fails
    """
    if not EncryptionConfig.ENCRYPTION_ENABLED:
        return data

    if is_request_encrypted(data):
        return decrypt_data(data["payload"])

    return data


def encrypt_response(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Encrypt response data if encryption is enabled

    Args:
        data: Response data

    Returns:
        Encrypted response or original data
    """
    if not EncryptionConfig.ENCRYPTION_ENABLED:
        return data

    try:
        encrypted_payload = encrypt_data(data)
        return {
            "encrypted": True,
            "payload": encrypted_payload
        }
    except EncryptionError as e:
        # Log error but return unencrypted (fail open)
        print(f"Warning: Failed to encrypt response: {e}")
        return data


# Utility functions for backward compatibility
def encrypt_if_needed(data: Dict[str, Any], force: bool = False) -> Dict[str, Any]:
    """
    Encrypt data if encryption is enabled or forced

    Args:
        data: Data to encrypt
        force: Force encryption even if disabled globally

    Returns:
        Encrypted or original data
    """
    if force or EncryptionConfig.ENCRYPTION_ENABLED:
        return encrypt_response(data)
    return data


def decrypt_if_needed(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Decrypt data if it appears to be encrypted

    Args:
        data: Data to decrypt

    Returns:
        Decrypted or original data
    """
    if is_request_encrypted(data):
        return decrypt_request(data)
    return data
