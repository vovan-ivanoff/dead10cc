import random
import time
import secrets

from fastapi import APIRouter, Depends, HTTPException, Response

from schemas.auth import (UserInfoSchema, PhoneAuthResponse, PhoneAuthRequest, PhoneVerifyRequest)
from services.auth.dependencies import get_current_user_phone
from usecases.dependencies import UserCase
from variables.gl import phone_verification_codes

router = APIRouter(prefix="/phone_auth", tags=["Phone_Auth"])


@router.get("/phone/info")
async def get_phone_user_info(
        user_case: UserCase,
        phone: str = Depends(get_current_user_phone)
) -> UserInfoSchema:
    return await user_case.get_info_by_phone(phone)


@router.post("/phone/send_code", response_model=PhoneAuthResponse)
async def send_phone_code(request: PhoneAuthRequest, user_case: UserCase):
    # Генерируем криптографически стойкий код
    code = ''.join([str(secrets.randbelow(10)) for _ in range(6)])
    
    # Добавляем временную метку и ограничение попыток
    phone_verification_codes[request.phone] = {
        "code": code,
        "timestamp": time.time(),
        "attempts": 0,
        "used": False  # Флаг использования кода
    }

    print(f"Sending code {code} to phone {request.country_code}{request.phone}")

    return {
        "success": True,
        "message": "Verification code sent",
        "data": {"code": code}
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

    if stored_code["used"]:
        raise HTTPException(status_code=400, detail="This code has already been used")

    if stored_code["attempts"] >= 3:
        raise HTTPException(status_code=400, detail="Too many attempts, please request a new code")

    if request.code != stored_code["code"]:
        phone_verification_codes[request.phone]["attempts"] += 1
        raise HTTPException(status_code=400, detail="Invalid verification code")

    if time.time() - stored_code["timestamp"] > 300:  # 5 минут
        raise HTTPException(status_code=400, detail="Verification code expired")

    try:
        await user_case.auth_by_phone(request.phone, response)
        phone_verification_codes[request.phone]["used"] = True  # Отмечаем код как использованный
        del phone_verification_codes[request.phone]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {
        "success": True,
        "message": "Verification successful",
    }