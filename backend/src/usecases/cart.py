from domain.usecases.cart import AbstractCartUseCase
from schemas.actions import ADDED_TO_CART
from schemas.carts import CartInfoSchema
from schemas.exceptions import (AccessForbiddenException)
from services.carts import CartsService
from services.stats import NotesService
from services.users import UsersService
from utils.dependencies import UOWDep


class CartUseCase(AbstractCartUseCase):

    def __init__(self, uow: UOWDep):
        self.uow = uow

    async def get(
            self, user_id: int, target_user_id: int,
    ) -> CartInfoSchema:
        async with self.uow:
            if not await UsersService.user_is_moderator(self.uow, user_id):
                raise AccessForbiddenException
            return await CartsService.get_cart(self.uow, user_id=target_user_id)

    async def get_my(self, user_id: int) -> CartInfoSchema:
        async with self.uow:
            return await CartsService.get_cart(self.uow, user_id=user_id)

    async def add_product(
            self, user_id: int, target_user_id: int, product_id: int, count: int
    ):
        async with self.uow:
            if not await UsersService.user_is_moderator(self.uow, user_id):
                raise AccessForbiddenException
            await CartsService.add_product(self.uow, target_user_id, product_id, count)

            await self.uow.commit()

    async def add_product_my(
            self, user_id: int, product_id: int, count: int
    ):
        async with self.uow:
            updated = await CartsService.add_product(self.uow, user_id, product_id, count)
            await NotesService.add_note(self.uow, user_id, product_id, ADDED_TO_CART)

            await self.uow.commit()
            return updated

    async def delete_product(
            self, user_id: int, target_user_id: int, product_id: int, count: int
    ):
        async with self.uow:
            if not await UsersService.user_is_moderator(self.uow, user_id):
                raise AccessForbiddenException
            await CartsService.delete_product(self.uow, target_user_id, product_id, count)

            await self.uow.commit()

    async def delete_product_my(
            self, user_id: int, product_id: int, count: int
    ):
        async with self.uow:
            updated = await CartsService.delete_product(self.uow, user_id, product_id, count)

            await self.uow.commit()
            return updated

    async def clear(
            self, user_id: int, target_user_id: int
    ):
        async with self.uow:
            if not await UsersService.user_is_moderator(self.uow, user_id):
                raise AccessForbiddenException
            await CartsService.clear_cart(self.uow, target_user_id)

            await self.uow.commit()

    async def clear_my(
            self, user_id: int
    ):
        async with self.uow:
            await CartsService.clear_cart(self.uow, user_id)

            await self.uow.commit()