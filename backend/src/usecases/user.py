from typing import List

from fastapi import Depends
from pydantic import BaseModel
from starlette.responses import Response

from domain.usecases.user import AbstractUserUseCase
from schemas.auth import UserInfoSchema, UserLoginSchema, UserRegisterSchema
from schemas.exceptions import (AccessForbiddenException,
                                UserIsAlreadyModeratorException)
from services.auth.dependencies import get_current_user_id
from services.users import UsersService
from utils.dependencies import UOWDep


class UserUseCase(AbstractUserUseCase):

    def __init__(self, uow: UOWDep):
        self.uow = uow

    async def registrate(self, user: UserRegisterSchema, response: Response) -> int:
        async with self.uow:
            user_id = await UsersService.register_user(self.uow, user, response)

            await self.uow.commit()
        return user_id

    async def login(self, user_data: UserLoginSchema, response: Response):
        async with self.uow:
            await UsersService.login_user(self.uow, user_data, response)

    def logout(self, response: Response):
        UsersService.logout_user(response)

    async def get_my_info(self, user_id: int) -> UserInfoSchema:
        async with self.uow:
            user = await UsersService.get_user_info(self.uow, user_id)

        return user

    async def get_list(self, user_id: int) -> List[BaseModel]:
        async with self.uow:
            if not await UsersService.user_is_moderator(self.uow, user_id):
                raise AccessForbiddenException
            users = await UsersService.get_users_list(self.uow)
        return users

    async def edit_info(self, user_id, target_user_id, **data):
        async with self.uow:
            if not await UsersService.user_is_moderator(self.uow, user_id):
                raise AccessForbiddenException
            await UsersService.change_user_info(self.uow, target_user_id, **data)

            await self.uow.commit()

    async def edit_my_info(self, user_id, **data):
        async with self.uow:
            await UsersService.change_user_info(self.uow, user_id, **data)

            await self.uow.commit()

    async def is_moderator(self, user_id: int):
        async with self.uow:
            return await UsersService.user_is_moderator(self.uow, user_id)

    async def make_moderator(self, user_id, target_user_id):
        async with self.uow:
            if not await UsersService.user_is_moderator(self.uow, user_id):
                raise AccessForbiddenException
            if await UsersService.user_is_moderator(self.uow, target_user_id):
                raise UserIsAlreadyModeratorException
            await UsersService.change_user_info(
                self.uow, target_user_id, is_moderator=True
            )

            await self.uow.commit()
