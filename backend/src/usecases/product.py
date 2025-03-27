from typing import List

from pydantic import BaseModel

from domain.usecases.product import AbstractProductUseCase
from schemas.products import ProductAddSchema, ProductInfoSchema
from schemas.exceptions import AccessForbiddenException
from schemas.actions import VIEWED
from services.products import ProductsService
from services.stats import NotesService
from services.users import UsersService
from utils.dependencies import UOWDep
from math import ceil


class ProductUseCase(AbstractProductUseCase):

    def __init__(self, uow: UOWDep):
        self.uow = uow

    async def get_list(self) -> List[BaseModel]:
        async with self.uow:
            products_list = await ProductsService.get_products_list(self.uow)

        return products_list

    async def get_page(self, user_id: int, iterators: dict | None) -> List[BaseModel]:
        async with self.uow:
            if iterators.get(user_id, None) is None:
                iterators[user_id] = await ProductsService.get_iterator(self.uow, 40)

            products_page = await ProductsService.get_next_page(iterators[user_id])

        return products_page

    async def get_info(self, user_id: int, product_id: int) -> ProductInfoSchema:
        async with self.uow:
            product = await ProductsService.get_product_info(self.uow, product_id)
            await NotesService.add_note(self.uow, user_id, product_id, VIEWED)

            await self.uow.commit()
        return product

    async def get_info_by_article(self, article: int) -> ProductInfoSchema:
        async with self.uow:
            product = await ProductsService.get_product_info(self.uow, article)
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

    async def edit_info(self, user_id: int, product_id: int, **changes):
        async with self.uow:
            if not await UsersService.user_is_moderator(self.uow, user_id):
                raise AccessForbiddenException
            await ProductsService.edit_product_info(self.uow, product_id, **changes)

            await self.uow.commit()

    async def add_review(self, user_id: int, product_id: int, mark: float):
        mark = min(mark, 10.0)
        mark = max(mark, 0.0)
        new_rating = mark

        async with self.uow:
            product = await ProductsService.get_product_info(self.uow, product_id)
            if product.reviews > 0:
                new_rating += product.reviews * product.rating
                new_rating /= product.reviews + 1
                new_rating = new_rating.__round__(2)

            await ProductsService.edit_product_info(self.uow, product_id,
                                                    reviews=product.reviews+1,
                                                    rating=new_rating)
            await self.uow.commit()

