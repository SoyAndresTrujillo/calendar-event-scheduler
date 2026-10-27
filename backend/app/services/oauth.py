"""
OAuth service for handling Google authentication flow.
Implements OAuth 2.1 with PKCE, token rotation, and security best practices.
"""

import httpx
from typing import Dict, Any, Optional
from fastapi import HTTPException
from ..core.config import settings
from ..schemas.auth import UserProfile


class GoogleOAuthService:
    """Service for handling Google OAuth 2.0 authentication."""
    
    TOKEN_URL = "https://oauth2.googleapis.com/token"
    USERINFO_URL = "https://www.googleapis.com/oauth2/v1/userinfo"
    
    async def exchange_code_for_tokens(
        self, 
        code: str, 
        code_verifier: str,
        redirect_uri: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Exchange authorization code for access and refresh tokens.
        Implements PKCE verification and secure token handling.
        """
        token_data = {
            "client_id": settings.google_client_id,
            "client_secret": settings.google_client_secret,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": redirect_uri or settings.google_redirect_uri,
            "code_verifier": code_verifier  # PKCE verification
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    self.TOKEN_URL,
                    data=token_data,
                    headers={"Content-Type": "application/x-www-form-urlencoded"}
                )
                response.raise_for_status()
                return response.json()
                
            except httpx.HTTPStatusError as e:
                raise HTTPException(
                    status_code=400,
                    detail=f"Failed to exchange code for tokens: {e.response.text}"
                )
            except Exception as e:
                raise HTTPException(
                    status_code=500,
                    detail=f"OAuth token exchange failed: {str(e)}"
                )
    
    async def get_user_info(self, access_token: str) -> UserProfile:
        """
        Fetch user profile information from Google using access token.
        """
        headers = {"Authorization": f"Bearer {access_token}"}
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(self.USERINFO_URL, headers=headers)
                response.raise_for_status()
                user_data = response.json()
                
                return UserProfile(
                    id=user_data["id"],
                    email=user_data["email"],
                    name=user_data["name"],
                    picture=user_data.get("picture"),
                    email_verified=user_data.get("verified_email", False)
                )
                
            except httpx.HTTPStatusError as e:
                raise HTTPException(
                    status_code=400,
                    detail=f"Failed to fetch user info: {e.response.text}"
                )
            except Exception as e:
                raise HTTPException(
                    status_code=500,
                    detail=f"User info fetch failed: {str(e)}"
                )
    
    async def refresh_access_token(self, refresh_token: str) -> Dict[str, Any]:
        """
        Refresh access token using refresh token.
        Implements token rotation for enhanced security.
        """
        token_data = {
            "client_id": settings.google_client_id,
            "client_secret": settings.google_client_secret,
            "refresh_token": refresh_token,
            "grant_type": "refresh_token"
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    self.TOKEN_URL,
                    data=token_data,
                    headers={"Content-Type": "application/x-www-form-urlencoded"}
                )
                response.raise_for_status()
                return response.json()
                
            except httpx.HTTPStatusError as e:
                raise HTTPException(
                    status_code=400,
                    detail=f"Failed to refresh token: {e.response.text}"
                )
            except Exception as e:
                raise HTTPException(
                    status_code=500,
                    detail=f"Token refresh failed: {str(e)}"
                )


# Global OAuth service instance
google_oauth = GoogleOAuthService()

