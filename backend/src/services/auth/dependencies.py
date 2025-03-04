from datetime import UTC, datetime
from typing import Annotated

from fastapi import Depends, Request
from jose import JWTError, jwt

from config import settings
from schemas.exceptions import (IncorrectTokenFormatExcepetion,
                                TokenAbsentException, TokenExpiredException,
                                UserIsNotPresentException)


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
