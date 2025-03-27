from fastapi import APIRouter, Depends, HTTPException, Response, Request
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import Optional
import random
import time
from datetime import datetime, timedelta
import jwt
from jwt.exceptions import InvalidTokenError

from schemas.auth import (UserInfoSchema, UserLoginSchema, UserRegisterSchema,
                          PhoneAuthResponse, PhoneAuthRequest, PhoneVerifyRequest)
from services.auth.dependencies import get_current_user_id, create_phone_access_token, get_current_phone_user
from services.users import UsersService
from usecases.dependencies import UserCase
from usecases.user import UserUseCase
from schemas.phone_auth import *

router = APIRouter(prefix="/auth", tags=["Auth"])


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


'''Далее идёт не работающий бред фронтендера мистера фастикса tg.me/mrfast1x'''

phone_verification_codes = {}


@router.get("/phone/info")
async def get_phone_user_info(
        user_case: UserCase,
        phone: str = Depends(get_current_phone_user)
) -> UserInfoSchema:
    return await user_case.get_info_by_phone(phone)


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
