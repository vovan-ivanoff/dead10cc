from datetime import UTC, datetime, timedelta
from typing import Annotated, Optional

from fastapi import Depends, Request, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from jwt import InvalidTokenError

from config import settings
from schemas.exceptions import (IncorrectTokenFormatExcepetion,
                                TokenAbsentException, TokenExpiredException,
                                UserIsNotPresentException)
from schemas.phone_auth import PHONE_AUTH_SECRET_KEY, PHONE_AUTH_ALGORITHM


def get_token(request: Request):
    token = request.cookies.get("TootEventToken")
    if not token:
        raise TokenAbsentException
    return token


def get_current_user_id(token: str = Depends(get_token)) -> int:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, settings.ALGORITHM)
    except JWTError:
        raise IncorrectTokenFormatExcepetion
    expire: str = payload.get("exp")
    if (not expire) or (int(expire) < datetime.now(UTC).timestamp()):
        raise TokenExpiredException
    user_id = payload.get("sub")
    if not user_id:
        raise UserIsNotPresentException
    return int(user_id)


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
