import random
import time
from datetime import datetime, timedelta
from typing import Dict, Any

from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from pydantic import BaseModel

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
security = HTTPBearer()

def generate_token(phone: str) -> str:
    return f"mock_token_{phone}_{datetime.now().timestamp()}"

@router.get("/info", response_model=UserInfoSchema)
async def get_phone_user_info(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    phone = token.replace("mock_token_", "").split("_")[0]
    
    if phone not in users_db:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    return UserInfoSchema(
        id=users_db[phone]["id"],
        phone=phone,
        name=users_db[phone]["name"],
        token=token
    )

@router.post("/send-code", response_model=PhoneAuthResponse)
async def send_phone_code(request: PhoneAuthRequest):
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
            "phone": phone
        }
    
    token = generate_token(phone)
    users_db[phone]["token"] = token
    
    del phone_verification_codes[phone]

    return UserInfoSchema(
        id=users_db[phone]["id"],
        phone=phone,
        name=users_db[phone]["name"],
        token=token
    )

@router.post("/logout")
async def logout(response: Response):
    return {"success": True, "message": "Logged out successfully"}

@router.post("/refresh")
async def refresh_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    old_token = credentials.credentials
    phone = old_token.replace("mock_token_", "").split("_")[0]
    
    if phone not in users_db:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    new_token = generate_token(phone)
    users_db[phone]["token"] = new_token
    
    return {"token": new_token}