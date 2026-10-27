"""
Pydantic schemas for authentication and user data validation.
"""

from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserProfile(BaseModel):
    """User profile information from Google OAuth."""
    id: str = Field(..., description="Google user ID")
    email: EmailStr = Field(..., description="User email address")
    name: str = Field(..., description="User full name")
    picture: Optional[str] = Field(None, description="User profile picture URL")
    email_verified: bool = Field(False, description="Whether email is verified")


class TokenResponse(BaseModel):
    """Response model for successful authentication."""
    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    expires_in: int = Field(..., description="Token expiration time in seconds")
    user_info: UserProfile = Field(..., description="User profile information")


class AuthorizeRequest(BaseModel):
    """Request model for OAuth authorization initiation."""
    redirect_uri: Optional[str] = Field(None, description="Custom redirect URI")


class CallbackRequest(BaseModel):
    """Request model for OAuth callback handling."""
    code: str = Field(..., description="Authorization code from Google")
    state: str = Field(..., description="State parameter for CSRF protection")
    code_verifier: str = Field(..., description="PKCE code verifier")


class RefreshTokenRequest(BaseModel):
    """Request model for token refresh."""
    pass  # Refresh token comes from httpOnly cookie

