import logging
import requests
import base64
from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import RedirectResponse
from ..core.config import settings
from ..database import supabase

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/login")
def login():
    scope = "user-read-private user-read-email user-library-read streaming user-read-playback-state user-modify-playback-state"
    auth_url = (
        f"https://accounts.spotify.com/authorize?response_type=code"
        f"&client_id={settings.SPOTIFY_CLIENT_ID}"
        f"&scope={scope}"
        f"&redirect_uri={settings.SPOTIFY_REDIRECT_URI}"
    )
    return RedirectResponse(auth_url)

@router.get("/callback")
def callback(code: str):
    # Exchange code for token
    token_url = "https://accounts.spotify.com/api/token"
    auth_header = base64.b64encode(
        f"{settings.SPOTIFY_CLIENT_ID}:{settings.SPOTIFY_CLIENT_SECRET}".encode()
    ).decode()
    
    headers = {
        "Authorization": f"Basic {auth_header}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": settings.SPOTIFY_REDIRECT_URI
    }
    
    response = requests.post(token_url, headers=headers, data=data)
    if response.status_code != 200:
        logger.error(f"Token exchange failed: {response.text}")
        raise HTTPException(status_code=400, detail="Failed to retrieve token")
    
    token_data = response.json()
    access_token = token_data.get("access_token")
    
    # Get User Profile
    user_url = "https://api.spotify.com/v1/me"
    user_headers = {"Authorization": f"Bearer {access_token}"}
    user_response = requests.get(user_url, headers=user_headers)
    
    if user_response.status_code != 200:
        logger.error(f"User profile fetch failed: {user_response.text}")
        raise HTTPException(status_code=400, detail="Failed to retrieve user profile")
        
    user_data = user_response.json()
    spotify_id = user_data.get("id")
    display_name = user_data.get("display_name")
    images = user_data.get("images", [])
    profile_image = images[0].get("url") if images else None
    
    # Create or Update User in Supabase
    try:
        # Check if user exists
        existing_user = supabase.table("users").select("*").eq("spotify_id", spotify_id).execute()
        
        if not existing_user.data:
            # Create new user
            new_user = {
                "spotify_id": spotify_id,
                "display_name": display_name,
                "profile_image": profile_image
            }
            result = supabase.table("users").insert(new_user).execute()
            user_db_id = result.data[0]['id']
            logger.info(f"Created new user: {spotify_id}")
        else:
            # Update existing user
            user_db_id = existing_user.data[0]['id']
            # Optionally update profile info here if needed
            logger.info(f"User logged in: {spotify_id}")
            
    except Exception as e:
        logger.error(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Database Error")
    
    # Redirect to Frontend
    frontend_redirect = f"{settings.FRONTEND_URL}?access_token={access_token}&user_id={user_db_id}"
    return RedirectResponse(frontend_redirect)
