from fastapi import APIRouter, Depends, HTTPException, Response, Request
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import Optional
import random
import time
from datetime import datetime, timedelta
import jwt
from jwt.exceptions import InvalidTokenError

from schemas.auth import UserInfoSchema, UserLoginSchema, UserRegisterSchema
from services.auth.dependencies import get_current_user_id
from services.users import UsersService
from usecases.dependencies import UserCase
from usecases.user import UserUseCase

router = APIRouter(prefix="/auth", tags=["Auth"])

PHONE_AUTH_SECRET_KEY = "your-phone-auth-secret-key"
PHONE_AUTH_ALGORITHM = "HS256"
PHONE_ACCESS_TOKEN_EXPIRE_MINUTES = 30

class PhoneAuthRequest(BaseModel):
    phone: str
    country_code: str

class PhoneVerifyRequest(BaseModel):
    phone: str
    code: str

class PhoneAuthResponse(BaseModel):
    success: bool
    message: Optional[str] = None
    data: Optional[dict] = None

phone_verification_codes = {}

def create_phone_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, PHONE_AUTH_SECRET_KEY, algorithm=PHONE_AUTH_ALGORITHM)
    return encoded_jwt

async def get_current_phone_user(token: str = Depends(OAuth2PasswordBearer(tokenUrl="auth/phone/token"))):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate phone credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, PHONE_AUTH_SECRET_KEY, algorithms=[PHONE_AUTH_ALGORITHM])
        phone: str = payload.get("sub")
        if phone is None:
            raise credentials_exception
        return phone
    except InvalidTokenError:
        raise credentials_exception

@router.post("/register")
async def register_user(
    user_data: UserRegisterSchema, response: Response, user_case: UserCase
):
    await user_case.registrate(user=user_data, response=response)
    return {"status": "ok"}

@router.post("/login")
async def login_user(
    user_data: UserLoginSchema, response: Response, user_case: UserCase
):
    await user_case.login(user_data, response=response)
    return {"status": "ok"}

@router.post("/logout")
async def logout_user(response: Response, user_case: UserCase):
    user_case.logout(response=response)
    return {"status": "ok"}

@router.get("/info")
async def get_current_user_info(
    user_case: UserCase, user_id: int = Depends(get_current_user_id)
) -> UserInfoSchema:
    return await user_case.get_my_info(user_id)

@router.post("/phone/send_code", response_model=PhoneAuthResponse)
async def send_phone_code(request: PhoneAuthRequest, user_case: UserCase):
    code = "".join([str(random.randint(0, 9)) for _ in range(6)])
    
    print(f"Sending code {code} to phone {request.country_code}{request.phone}")
    
    phone_verification_codes[request.phone] = {
        "code": code,
        "timestamp": time.time(),
        "attempts": 0
    }
    
    return {
        "success": True,
        "message": "Verification code sent"
    }

@router.post("/phone/verify_code", response_model=PhoneAuthResponse)
async def verify_phone_code(
    request: PhoneVerifyRequest, 
    response: Response,
    user_case: UserCase
):
    stored_code = phone_verification_codes.get(request.phone)
    
    if not stored_code:
        raise HTTPException(status_code=400, detail="No verification code requested for this phone")
    
    if stored_code["attempts"] >= 3:
        raise HTTPException(status_code=400, detail="Too many attempts, please request a new code")
    
    if request.code != stored_code["code"]:
        phone_verification_codes[request.phone]["attempts"] += 1
        raise HTTPException(status_code=400, detail="Invalid verification code")
    
    if time.time() - stored_code["timestamp"] > 300:
        raise HTTPException(status_code=400, detail="Verification code expired")
    
    try:
        user = await user_case.find_or_create_by_phone(request.phone)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    access_token_expires = timedelta(minutes=PHONE_ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_phone_access_token(
        data={"sub": request.phone}, expires_delta=access_token_expires
    )
    
    del phone_verification_codes[request.phone]
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=PHONE_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        secure=True,
        samesite="lax"
    )
    
    return {
        "success": True,
        "message": "Verification successful",
        "data": {
            "id": user.id,
            "phone": request.phone,
            "access_token": access_token,
            "token_type": "bearer"
        }
    }

@router.get("/phone/info")
async def get_phone_user_info(
    user_case: UserCase, 
    phone: str = Depends(get_current_phone_user)
) -> UserInfoSchema:

    return await user_case.get_info_by_phone(phone)