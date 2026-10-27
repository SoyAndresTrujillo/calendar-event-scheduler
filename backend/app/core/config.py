"""
Configuration settings for the FastAPI application.
Implements secure environment variable management following OAuth 2.1 best practices.
"""

from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """Application settings with environment variable support."""
    
    # Application settings
    app_name: str = "Calendar Event Scheduler API"
    app_version: str = "1.0.0"
    debug: bool = False
    
    # Security settings
    secret_key: str = Field(..., description="Secret key for JWT token signing")
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 15  # Short-lived access tokens per OAuth 2.1
    refresh_token_expire_days: int = 7     # Refresh token rotation
    
    # Google OAuth 2.0 settings
    google_client_id: str = Field(..., description="Google OAuth 2.0 Client ID")
    google_client_secret: str = Field(..., description="Google OAuth 2.0 Client Secret")
    google_redirect_uri: str = Field(default="http://localhost:8000/api/auth/google/callback")
    
    # CORS settings
    frontend_url: str = Field(default="http://localhost:3000")
    allowed_origins: list[str] = Field(default=["http://localhost:3000"])
    
    # Cookie settings for secure refresh token storage
    cookie_secure: bool = False  # Set to True in production with HTTPS
    cookie_samesite: str = "strict"
    cookie_httponly: bool = True
    cookie_max_age: int = 7 * 24 * 60 * 60  # 7 days in seconds
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()

