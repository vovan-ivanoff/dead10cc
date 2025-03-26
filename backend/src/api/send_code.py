from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import random

router = APIRouter()

verification_codes = {}

class VerificationRequest(BaseModel):
    phone: str
    country_code: str

class VerificationResponse(BaseModel):
    success: bool
    message: Optional[str] = None
    retry_delay: Optional[int] = None

@router.post("/auth/send-code", response_model=VerificationResponse)
async def send_verification_code(request: VerificationRequest):
    try:
        code = str(random.randint(100000, 999999))
        full_phone = f"{request.country_code}{request.phone}"
        
        verification_codes[full_phone] = code

        print(f"Код подтверждения для {full_phone}: {code}")

        return {
            "success": True,
            "message": "Код отправлен",
            "retry_delay": 60
        }
    except Exception as e:
        print(f"Error sending verification code: {e}")
        raise HTTPException(
            status_code=500,
            detail="Ошибка при отправке кода"
        )