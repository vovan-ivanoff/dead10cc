from typing import List

from pydantic import BaseModel

from domain.usecases.product import AbstractProductUseCase
from schemas.products import ProductAddSchema, ProductInfoSchema
from schemas.exceptions import AccessForbiddenException
from services.products import ProductsService
from services.users import UsersService
from utils.dependencies import UOWDep


class ProductUseCase(AbstractProductUseCase):

    def __init__(self, uow: UOWDep):
        self.uow = uow

    async def get_list(self) -> List[BaseModel]:
        async with self.uow:
            products_list = await ProductsService.get_products_list(self.uow)

        return products_list

    async def get_info(self, product_id: int) -> ProductInfoSchema:
        async with self.uow:
            product = await ProductsService.get_product_info(self.uow, product_id)

        return product

    async def add(
        self,
        product: ProductAddSchema,
        user_id: int,
    ) -> int:
        async with self.uow:
            if not await UsersService.user_is_moderator(self.uow, user_id):
                raise AccessForbiddenException
            product_id = await ProductsService.add_product(self.uow, product)

            await self.uow.commit()
        return product_id

    async def delete(self, product_id: int, user_id: int):
        async with self.uow:
            if not await UsersService.user_is_moderator(self.uow, user_id):
                raise AccessForbiddenException
            await ProductsService.delete_product(self.uow, product_id)

            await self.uow.commit()

    async def edit_info(self, user_id: int, product_id: int, **changes):
        async with self.uow:
            if not await UsersService.user_is_moderator(self.uow, user_id):
                raise AccessForbiddenException
            await ProductsService.edit_product_info(self.uow, product_id, **changes)

            await self.uow.commit()
