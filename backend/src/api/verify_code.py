import random
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import time

router = APIRouter()

verification_codes = {}
profiles = {}

class VerifyCodeRequest(BaseModel):
    phone: str
    code: str

class Profile(BaseModel):
    id: str
    phone: str
    name: str
    gender: str
    token: Optional[str] = None

@router.post("/auth/verify-code", response_model=Profile)
async def verify_code(request: VerifyCodeRequest):
    try:
        saved_code = verification_codes.get(request.phone)
        
        if not saved_code or saved_code != request.code:
            raise HTTPException(
                status_code=400,
                detail="Неверный код подтверждения"
            )

        profile = profiles.get(request.phone)
        
        if not profile:
            profile = {
                "id": str(int(time.time())),
                "phone": request.phone,
                "name": f"User{random.randint(1000, 9999)}",
                "gender": "Не указан",
                "token": f"dummy-token-{int(time.time())}"
            }
            profiles[request.phone] = profile

        verification_codes.pop(request.phone, None)

        return profile
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error verifying code: {e}")
        raise HTTPException(
            status_code=500,
            detail="Ошибка при проверке кода"
        )