from typing import List

from fastapi import Depends, Response
from pydantic import BaseModel

from schemas.auth import UserInfoSchema, UserLoginSchema, UserRegisterSchema
from schemas.exceptions import (IncorrectEmailOrPasswordException,
                                UnauthorizedException,
                                UserAlreadyExistException)
from schemas.users import UserSchema
from services.auth.auth import (create_access_token, get_password_hash,
                                verify_password)
from services.auth.dependencies import get_current_user_id
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
            email=user.email, name=user.name, hashed_password=hashed_password
        )

        cls.setup_access_token(user_id=user_id, response=response)
        return user_id

    @staticmethod
    async def get_user_info(uow: AbstractUOW, user_id: int) -> UserInfoSchema:
        user = await uow.users.find_one(id=user_id)
        if not user:
            raise UnauthorizedException
        return UserInfoSchema(**user.dict())

    @staticmethod
    async def get_users_list(uow: AbstractUOW) -> List[BaseModel]:
        users = await uow.users.find_all()
        return users

    @staticmethod
    def setup_access_token(user_id: int, response: Response):
        access_token = create_access_token({"sub": str(user_id)})
        response.set_cookie("TootEventToken", access_token, httponly=True)

    @staticmethod
    async def authenticate_user(
        uow: AbstractUOW, email: str, password: str
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
        cls.setup_access_token(user_id=user.id, response=response)
        return user.id

    @staticmethod
    def logout_user(response: Response):
        response.delete_cookie("TootEventToken")

    @staticmethod
    async def user_is_moderator(uow: AbstractUOW, user_id: int) -> bool:
        user = await uow.users.find_one(id=user_id)
        return user.is_moderator

    @staticmethod
    async def change_user_info(uow: AbstractUOW, user_id: int, **data):
        await uow.users.update_by_id(user_id, **data)
