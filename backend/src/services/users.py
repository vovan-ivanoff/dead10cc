from typing import List

from fastapi import Response
from pydantic import BaseModel, EmailStr

from schemas.auth import UserInfoSchema, UserLoginSchema, UserRegisterSchema
from schemas.exceptions import (IncorrectEmailOrPasswordException,
                                UnauthorizedException,
                                UserAlreadyExistException)
from schemas.phone_auth import ACCESS_TOKEN_EXPIRE_MINUTES
from schemas.users import UserSchema
from services.auth.auth import (create_access_token, get_password_hash,
                                verify_password)
from utils.unit_of_work import AbstractUOW


class UsersService:
    @classmethod
    async def register_user(
            cls, uow: AbstractUOW, user: UserRegisterSchema, response: Response
    ) -> int:
        existing_user = await uow.users.find_one(email=user.email)
        if existing_user:
            raise UserAlreadyExistException
        hashed_password = get_password_hash(user.password)
        user_id = await uow.users.add_one(
            phone=user.phone, email=user.email, name=user.name, hashed_password=hashed_password
        )

        cls.setup_access_token(user_id=user_id, phone=user.phone, response=response)
        return user_id

    @staticmethod
    async def get_user_info(uow: AbstractUOW, **field) -> UserInfoSchema:
        user = await uow.users.find_one(**field)
        if not user:
            raise UnauthorizedException
        return UserInfoSchema(**user.dict())

    @staticmethod
    async def get_users_list(uow: AbstractUOW, **filter_by) -> List[BaseModel]:
        users = await uow.users.find_all(**filter_by)
        return users

    @staticmethod
    def setup_access_token(user_id: int, phone: str, response: Response):
        access_token = create_access_token(
            {"id": str(user_id), "ph": phone}
        )
        response.set_cookie(
            key="SnaplyAuthToken",
            value=access_token,
            httponly=True,
            max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            secure=True,
            samesite=None
        )

    @staticmethod
    async def authenticate_user(
            uow: AbstractUOW, email: EmailStr, password: str
    ) -> UserSchema:
        user = await uow.users.find_one(email=email)
        if not user or not verify_password(password, user.hashed_password):
            raise IncorrectEmailOrPasswordException
        return user

    @classmethod
    async def login_user(
            cls, uow: AbstractUOW, user_data: UserLoginSchema, response: Response
    ):
        user = await cls.authenticate_user(
            uow=uow, email=user_data.email, password=user_data.password
        )
        cls.setup_access_token(user_id=user.id, phone=user.phone, response=response)
        return user.id

    @staticmethod
    def logout_user(response: Response):
        response.delete_cookie("SnaplyAuthToken")

    @staticmethod
    async def user_is_moderator(uow: AbstractUOW, user_id: int) -> bool:
        user = await uow.users.find_one(id=user_id)
        return user.is_moderator

    @staticmethod
    async def change_user_info(uow: AbstractUOW, user_id: int, **data):
        if data.get("password", False):
            data["hashed_password"] = get_password_hash(data["password"])
        await uow.users.update_by_id(user_id, **data)

    @classmethod
    async def auth_user_by_phone(cls, uow: AbstractUOW, phone: str, response: Response):
        existing_user = await uow.users.find_one(phone=phone)
        if existing_user:
            cls.setup_access_token(user_id=existing_user.id, phone=phone, response=response)
            return existing_user

        user_id = await uow.users.add_one(
            phone=phone
        )
        await uow.carts.add_one(id=user_id, user_id=user_id, products=dict())
        cls.setup_access_token(user_id=user_id, phone=phone, response=response)
        return await uow.users.find_one(id=user_id)