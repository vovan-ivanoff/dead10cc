from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserAddSchema(BaseModel):
    phone: str = Field(max_length=15)
    email: EmailStr = Field(max_length=30)
    name: str = Field(max_length=30)
    hashed_password: str
    is_moderator: bool


class UserRegisterSchema(BaseModel):
    phone: str = Field(max_length=15, examples=["+79998765432"])
    email: EmailStr = Field(max_length=30, examples=["stupid@mail.ru"])
    name: str = Field(max_length=30, examples=["Александр"])
    password: str = Field(max_length=30, examples=["MegaBoss2005"])


class UserInfoSchema(BaseModel):
    phone: str = Field(max_length=15)
    email: Optional[EmailStr] = Field(max_length=30)
    name: Optional[str] = Field(max_length=30)
    is_moderator: bool


class PhoneAuthRequest(BaseModel):
    phone: str
    country_code: str


class PhoneVerifyRequest(BaseModel):
    phone: str
    code: str


class PhoneAuthResponse(BaseModel):
    success: bool
    message: Optional[str] = None
    data: Optional[dict] = None


class UserLoginSchema(BaseModel):
    email: EmailStr = Field(max_length=30, examples=["stupid@mail.ru"])
    password: str = Field(max_length=30, examples=["MegaBoss2005"])
