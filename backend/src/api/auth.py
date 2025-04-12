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
from services.auth.dependencies import get_current_user_id, create_phone_access_token, get_current_user_phone
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
