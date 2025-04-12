from typing import Annotated, Optional

from pydantic import BaseModel, EmailStr, Field, StringConstraints


class UserSchema(BaseModel):
    id: int
    phone: str
    email: Optional[EmailStr] = Field(max_length=30)
    name: Optional[str] = Field(max_length=30)
    hashed_password: Optional[str]
    is_moderator: bool
