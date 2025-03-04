import datetime
from typing import List

from pydantic import BaseModel

from domain.usecases.cart import AbstractCartUseCase
from domain.utils.unit_of_work import AbstractUOW
from schemas.carts import CartInfoSchema
from schemas.exceptions import (AccessForbiddenException,
                                CheckIsNotPayedException,
                                RefundDeclinedException)
from services.carts import CartsService
from services.products import ProductsService
from services.users import UsersService
from utils.date_manager import DateManager as Dm
from utils.dependencies import UOWDep


class CartUseCase(AbstractCartUseCase):

    def __init__(self, uow: UOWDep):
        self.uow = uow

    async def get_by_current_user(self, user_id: int) -> List[BaseModel]:
        pass

    async def get_by_user(
        self, target_user_id: int, user_id: int
    ) -> List[BaseModel]:
        async with self.uow:
            if not await UsersService.user_is_moderator(self.uow, user_id):
                raise AccessForbiddenException
            pass

    async def get_list(self, user_id: int) -> List[BaseModel]:
        async with self.uow:
            if not await UsersService.user_is_moderator(self.uow, user_id):
                raise AccessForbiddenException
            carts_list = await CartsService.get_carts_list(self.uow)
            await self.uow.commit()

        return carts_list

    async def add_product_to_cart(
            self, user_id: int
    ):
        pass