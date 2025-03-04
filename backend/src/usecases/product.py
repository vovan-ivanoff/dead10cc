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
            await self.uow.commit()

        return products_list

    async def get_info(self, product_id: int) -> ProductInfoSchema:
        async with self.uow:
            product = await ProductsService.get_product_info(self.uow, product_id)
            await self.uow.commit()

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

    async def edit_info(self, product_id: int, user_id: int, **data):
        async with self.uow:
            if not await UsersService.user_is_moderator(self.uow, user_id):
                raise AccessForbiddenException
            await ProductsService.change_product_info(self.uow, product_id, **data)

            await self.uow.commit()

    async def find_product(self, query: str):
        parts = query.lower().split()
        found: List[BaseModel] = []
        async with self.uow:
            products = await ProductsService.get_products_list(self.uow)
            for product in products:
                representation = await ProductsService.repr(product)
                for part in parts:
                    if part in representation:
                        found.append(product)
                        break
        return found
