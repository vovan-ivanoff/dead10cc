from fastapi import APIRouter, HTTPException, Depends, Header
from typing import Optional

router = APIRouter()

profiles = {}

async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Не авторизован"
        )
    
    try:
        token = authorization.split(" ")[1]
        phone = token.replace("dummy-token-", "")
        
        profile = profiles.get(phone)
        if not profile:
            raise HTTPException(
                status_code=404,
                detail="Профиль не найден"
            )
            
        return profile
    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Неверный токен авторизации"
        )

@router.get("/auth/check")
async def check_auth(current_user: dict = Depends(get_current_user)):
    return current_user