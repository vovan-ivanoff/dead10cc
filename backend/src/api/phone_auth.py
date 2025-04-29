import random
import time
from datetime import timedelta
from typing import Dict, Any

from fastapi import APIRouter, HTTPException, Response, status, Request
from pydantic import BaseModel

from services.auth.dependencies import (
    create_phone_access_token,
    get_current_user_phone
)
from schemas.exceptions import (
    IncorrectTokenFormatExcepetion,
    TokenAbsentException,
    TokenExpiredException
)

router = APIRouter(prefix="/phone", tags=["Phone_Auth"])

class PhoneAuthRequest(BaseModel):
    phone: str
    country_code: str

class PhoneVerifyRequest(BaseModel):
    phone: str
    code: str

class PhoneAuthResponse(BaseModel):
    success: bool
    message: str | None = None
    retry_delay: int | None = None
    code: str | None = None

class UserInfoSchema(BaseModel):
    id: str
    phone: str
    name: str
    email: str | None = None
    avatar_url: str | None = None
    token: str

phone_verification_codes: Dict[str, Dict[str, Any]] = {}
users_db: Dict[str, Dict[str, Any]] = {}

@router.get("/info", response_model=UserInfoSchema)
async def get_phone_user_info(request: Request):
    try:
        phone = await get_current_user_phone(request)
    except (IncorrectTokenFormatExcepetion, TokenAbsentException, TokenExpiredException) as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    
    user_data = users_db.get(phone)
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserInfoSchema(
        id=user_data["id"],
        phone=phone,
        name=user_data["name"],
        email=user_data.get("email"),
        avatar_url=user_data.get("avatar_url"),
        token=user_data["token"]
    )

@router.post("/send-code", response_model=PhoneAuthResponse)
async def send_phone_code(request: PhoneAuthRequest):
    if request.phone in phone_verification_codes:
        last_request = phone_verification_codes[request.phone]["timestamp"]
        time_diff = time.time() - last_request
        if time_diff < 60:
            retry_delay = 60 - int(time_diff)
            return {
                "success": False,
                "message": "Please wait before requesting a new code",
                "retry_delay": retry_delay
            }


    code = "".join([str(random.randint(0, 9)) for _ in range(6)])
    phone = request.phone

    print(f"Sending code {code} to phone {request.country_code}{phone}")

    phone_verification_codes[phone] = {
        "code": code,
        "timestamp": time.time(),
        "attempts": 0
    }

    response_data = {
        "success": True,
        "message": "Verification code sent"
    }

    if __debug__:
        response_data["code"] = code

    return response_data

@router.post("/verify-code", response_model=UserInfoSchema)
async def verify_phone_code(
    request: PhoneVerifyRequest,
    response: Response
):
    stored_code = phone_verification_codes.get(request.phone)

    if not stored_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No verification code requested for this phone"
        )

    if stored_code["attempts"] >= 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Too many attempts, please request a new code"
        )

    if request.code != stored_code["code"]:
        phone_verification_codes[request.phone]["attempts"] += 1
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification code"
        )

    if time.time() - stored_code["timestamp"] > 300:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification code expired"
        )

    phone = request.phone
    if phone not in users_db:
        users_db[phone] = {
            "id": f"user_{phone}",
            "name": f"User {phone}",
            "phone": phone,
            "email": None,
            "avatar_url": None
        }
    
    token = create_phone_access_token(
        data={"ph": phone},
        expires_delta=timedelta(days=30)
    )
    users_db[phone]["token"] = token
    
    del phone_verification_codes[phone]

    response.set_cookie(
        key="TootEventToken",
        value=token,
        httponly=True,
        max_age=30*24*60*60,
        secure=not __debug__,
        samesite="lax"
    )

    return UserInfoSchema(
        id=users_db[phone]["id"],
        phone=phone,
        name=users_db[phone]["name"],
        email=users_db[phone].get("email"),
        avatar_url=users_db[phone].get("avatar_url"),
        token=token
    )

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("TootEventToken")
    return {"success": True, "message": "Logged out successfully"}

@router.post("/refresh")
async def refresh_token(request: Request, response: Response):
    try:
        phone = await get_current_user_phone(request)
    except (IncorrectTokenFormatExcepetion, TokenAbsentException, TokenExpiredException) as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
    
    new_token = create_phone_access_token(
        data={"ph": phone},
        expires_delta=timedelta(days=30)
    )
    
    users_db[phone]["token"] = new_token
    
    response.set_cookie(
        key="TootEventToken",
        value=new_token,
        httponly=True,
        max_age=30*24*60*60,
        secure=not __debug__,
        samesite="Lax"
    )
    
    return {"token": new_token}

