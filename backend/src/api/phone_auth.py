import random
import time
import re
import os

from fastapi import APIRouter, Depends, HTTPException, Response
from schemas.auth import (
    UserInfoSchema, PhoneAuthResponse, PhoneAuthRequest, PhoneVerifyRequest
)
from services.auth.dependencies import get_current_user_phone
from usecases.dependencies import UserCase
from variables.gl import phone_verification_codes

router = APIRouter(prefix="/phone", tags=["Phone_Auth"])

IS_DEV = os.getenv("ENV", "development") == "development"

def is_valid_phone(phone: str) -> bool:
    return bool(re.match(r'^\+?\d{10,15}$', phone))

def normalize_phone(phone: str, country_code: str = '') -> str:
    digits = re.sub(r'[^\d]', '', phone)
    country_digits = re.sub(r'[^\d]', '', country_code)

    if country_digits and digits.startswith(country_digits):
        return f"+{digits}"

    return f"+{country_digits}{digits}" if country_digits else f"+{digits}"

@router.get("/info")
async def get_phone_user_info(
    user_case: UserCase,
    phone: str = Depends(get_current_user_phone)
) -> UserInfoSchema:
    return await user_case.get_info_by_phone(phone)

@router.post("/send_code", response_model=PhoneAuthResponse)
async def send_phone_code(request: PhoneAuthRequest, user_case: UserCase):
    normalized_phone = normalize_phone(request.phone, request.country_code)

    if not is_valid_phone(normalized_phone):
        raise HTTPException(status_code=400, detail="Invalid phone number format")

    code = "".join([str(random.randint(0, 9)) for _ in range(6)])

    print(f"[send_code] Normalized phone: {normalized_phone}")
    print(f"[send_code] Generated code: {code}")

    phone_verification_codes[normalized_phone] = {
        "code": code,
        "timestamp": time.time(),
        "attempts": 0
    }

    print(f"[send_code] Verification codes DB: {phone_verification_codes}")

    return {
        "success": True,
        "message": "Verification code sent",
        **({"data": {"code": code}} if IS_DEV else {})
    }

@router.post("/verify_code", response_model=PhoneAuthResponse)
async def verify_phone_code(
    request: PhoneVerifyRequest,
    response: Response,
    user_case: UserCase
):
    normalized_phone = normalize_phone(request.phone, request.country_code)
    stored_code = phone_verification_codes.get(normalized_phone)

    print(f"[verify_code] Normalized phone: {normalized_phone}")
    print(f"[verify_code] Provided code: {request.code}")
    print(f"[verify_code] Stored: {stored_code}")

    if not stored_code:
        raise HTTPException(status_code=400, detail="No verification code requested for this phone")

    if stored_code["attempts"] >= 3:
        raise HTTPException(status_code=400, detail="Too many attempts, please request a new code")

    if request.code != stored_code["code"]:
        stored_code["attempts"] += 1
        raise HTTPException(status_code=400, detail="Invalid verification code")

    if time.time() - stored_code["timestamp"] > 300:
        raise HTTPException(status_code=400, detail="Verification code expired")

    try:
        await user_case.auth_by_phone(normalized_phone, response)

        profile = await user_case.get_info_by_phone(normalized_phone)

        token = await user_case.generate_token(normalized_phone)

        del phone_verification_codes[normalized_phone]
    except Exception as e:
        print(f"[verify_code] Error during auth_by_phone: {e}")
        raise HTTPException(status_code=400, detail=str(e))

    retry_delay = max(0, 60 - int(time.time() - stored_code["timestamp"]))

    return {
        "success": True,
        "message": "Verification successful",
        "retry_delay": retry_delay,
        "token": token,
        "profile": profile.dict()
    }
