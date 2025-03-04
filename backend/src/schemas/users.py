from typing import Annotated

from pydantic import BaseModel, EmailStr, Field, StringConstraints


class UserSchema(BaseModel):
    id: int
    email: EmailStr = Field(max_length=30)
    name: str = Field(max_length=30)
    hashed_password: str
    preferences: dict | list | None
    is_moderator: bool
