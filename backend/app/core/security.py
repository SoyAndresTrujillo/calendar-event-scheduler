"""
Security utilities for token management and OAuth flow.
Implements hybrid storage pattern: access tokens in memory, refresh tokens in httpOnly cookies.
"""

import secrets
import hashlib
import base64
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from cryptography.fernet import Fernet
from .config import settings


class SecureTokenManager:
    """
    Manages JWT tokens following OAuth 2.1 security best practices.
    Implements token rotation and secure refresh token handling.
    """
    
    def __init__(self):
        # Generate a key for refresh token encryption
        self.fernet_key = Fernet.generate_key()
        self.fernet = Fernet(self.fernet_key)
    
    def create_access_token(self, data: Dict[str, Any]) -> str:
        """
        Create a short-lived access token (15 minutes).
        Stored in memory on frontend for security.
        """
        to_encode = data.copy()
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
        to_encode.update({"exp": expire, "type": "access"})
        
        return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    
    def create_refresh_token(self, user_id: str) -> str:
        """
        Create a long-lived refresh token (7 days).
        Will be stored in httpOnly cookies and encrypted.
        """
        to_encode = {
            "sub": user_id,
            "type": "refresh",
            "exp": datetime.utcnow() + timedelta(days=settings.refresh_token_expire_days),
            "jti": secrets.token_urlsafe(32)  # Unique token ID for rotation detection
        }
        
        token = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
        # Encrypt the refresh token before storing in cookie
        encrypted_token = self.fernet.encrypt(token.encode()).decode()
        return encrypted_token
    
    def verify_access_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify and decode access token."""
        try:
            payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
            if payload.get("type") != "access":
                return None
            return payload
        except JWTError:
            return None
    
    def verify_refresh_token(self, encrypted_token: str) -> Optional[Dict[str, Any]]:
        """Verify and decode encrypted refresh token."""
        try:
            # Decrypt the token first
            decrypted_token = self.fernet.decrypt(encrypted_token.encode()).decode()
            payload = jwt.decode(decrypted_token, settings.secret_key, algorithms=[settings.algorithm])
            if payload.get("type") != "refresh":
                return None
            return payload
        except (JWTError, Exception):
            return None
    
    def generate_pkce_challenge(self) -> tuple[str, str]:
        """
        Generate PKCE code verifier and challenge for OAuth 2.1 flow.
        Implements S256 method for enhanced security.
        """
        code_verifier = base64.urlsafe_b64encode(secrets.token_bytes(32)).decode('utf-8').rstrip('=')
        code_challenge = base64.urlsafe_b64encode(
            hashlib.sha256(code_verifier.encode('utf-8')).digest()
        ).decode('utf-8').rstrip('=')
        
        return code_verifier, code_challenge
    
    def generate_state_parameter(self) -> str:
        """Generate cryptographically secure state parameter for CSRF protection."""
        return secrets.token_urlsafe(32)


# Global token manager instance
token_manager = SecureTokenManager()


def get_authorization_url(state: str, code_challenge: str) -> str:
    """
    Construct Google OAuth 2.0 authorization URL with PKCE and security parameters.
    """
    base_url = "https://accounts.google.com/o/oauth2/v2/auth"
    params = {
        "client_id": settings.google_client_id,
        "redirect_uri": settings.google_redirect_uri,
        "scope": "openid email profile",
        "response_type": "code",
        "state": state,
        "code_challenge": code_challenge,
        "code_challenge_method": "S256",
        "access_type": "offline",
        "prompt": "consent"
    }
    
    param_string = "&".join([f"{k}={v}" for k, v in params.items()])
    return f"{base_url}?{param_string}"

