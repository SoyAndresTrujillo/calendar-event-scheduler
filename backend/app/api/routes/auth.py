"""
Authentication routes implementing OAuth 2.1 with Google.
Follows security best practices: PKCE, token rotation, httpOnly cookies.
"""

from fastapi import APIRouter, HTTPException, Response, Request, Depends
from fastapi.responses import JSONResponse
from typing import Dict, Any
from ...core.security import token_manager, get_authorization_url
from ...core.config import settings
from ...schemas.auth import (
    TokenResponse, 
    AuthorizeRequest, 
    CallbackRequest,
    RefreshTokenRequest,
    UserProfile
)
from ...services.oauth import google_oauth

router = APIRouter(prefix="/auth", tags=["authentication"])

# In-memory store for PKCE challenges (use Redis in production)
pkce_store: Dict[str, str] = {}


@router.post("/google/authorize")
async def initiate_google_oauth(request: AuthorizeRequest = None) -> Dict[str, Any]:
    """
    Initiate Google OAuth 2.0 flow with PKCE.
    Returns authorization URL for frontend to open in popup.
    """
    try:
        # Generate PKCE challenge and state for security
        code_verifier, code_challenge = token_manager.generate_pkce_challenge()
        state = token_manager.generate_state_parameter()
        
        # Store code_verifier temporarily (use Redis in production)
        pkce_store[state] = code_verifier
        
        # Generate authorization URL
        auth_url = get_authorization_url(state, code_challenge)
        
        return {
            "authorization_url": auth_url,
            "state": state,
            "code_challenge": code_challenge
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to initiate OAuth flow: {str(e)}"
        )


@router.post("/google/callback", response_model=TokenResponse)
async def handle_google_callback(
    callback_data: CallbackRequest,
    response: Response
) -> TokenResponse:
    """
    Handle Google OAuth callback with authorization code.
    Implements secure token exchange and storage.
    """
    try:
        # Verify state parameter to prevent CSRF
        if callback_data.state not in pkce_store:
            raise HTTPException(status_code=400, detail="Invalid state parameter")
        
        # Get stored code_verifier
        code_verifier = pkce_store.pop(callback_data.state)
        
        # Exchange authorization code for tokens
        token_data = await google_oauth.exchange_code_for_tokens(
            code=callback_data.code,
            code_verifier=code_verifier
        )
        
        # Get user information
        user_info = await google_oauth.get_user_info(token_data["access_token"])
        
        # Create our own JWT tokens
        access_token = token_manager.create_access_token({
            "sub": user_info.id,
            "email": user_info.email,
            "name": user_info.name
        })
        
        # Create encrypted refresh token for httpOnly cookie
        refresh_token = token_manager.create_refresh_token(user_info.id)
        
        # Set refresh token in httpOnly cookie
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            max_age=settings.cookie_max_age,
            httponly=settings.cookie_httponly,
            secure=settings.cookie_secure,
            samesite=settings.cookie_samesite,
            path="/api/auth"  # Restrict cookie to auth endpoints
        )
        
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=settings.access_token_expire_minutes * 60,
            user_info=user_info
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"OAuth callback failed: {str(e)}"
        )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_access_token(
    request: Request,
    response: Response
) -> TokenResponse:
    """
    Refresh access token using httpOnly cookie.
    Implements token rotation for enhanced security.
    """
    try:
        # Validate CSRF protection header
        if request.headers.get('X-Requested-With') != 'XMLHttpRequest':
            raise HTTPException(status_code=401, detail="Invalid request source")
        
        # Get refresh token from httpOnly cookie
        refresh_token = request.cookies.get("refresh_token")
        if not refresh_token:
            raise HTTPException(status_code=401, detail="No refresh token found")
        
        # Verify refresh token
        payload = token_manager.verify_refresh_token(refresh_token)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        
        # Create new access token
        access_token = token_manager.create_access_token({
            "sub": payload["sub"],
            "email": payload.get("email"),
            "name": payload.get("name")
        })
        
        # Create new refresh token (token rotation)
        new_refresh_token = token_manager.create_refresh_token(payload["sub"])
        
        # Update refresh token cookie
        response.set_cookie(
            key="refresh_token",
            value=new_refresh_token,
            max_age=settings.cookie_max_age,
            httponly=settings.cookie_httponly,
            secure=settings.cookie_secure,
            samesite=settings.cookie_samesite,
            path="/api/auth"
        )
        
        # Note: We return minimal user info since this is just a token refresh
        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            expires_in=settings.access_token_expire_minutes * 60,
            user_info=UserProfile(
                id=payload["sub"],
                email=payload.get("email", ""),
                name=payload.get("name", ""),
                email_verified=True
            )
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Token refresh failed: {str(e)}"
        )


@router.post("/logout")
async def logout(response: Response) -> Dict[str, str]:
    """
    Logout user by clearing refresh token cookie.
    """
    response.delete_cookie(
        key="refresh_token",
        path="/api/auth",
        secure=settings.cookie_secure,
        samesite=settings.cookie_samesite
    )
    
    return {"message": "Successfully logged out"}

