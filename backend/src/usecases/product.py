from typing import List, Dict

from pydantic import BaseModel
from fastapi import Response

from domain.usecases.product import AbstractProductUseCase
from schemas.actions import VIEWED
from schemas.exceptions import AccessForbiddenException, InvalidData
from schemas.products import ProductAddSchema, ProductInfoSchema, ProductSchema
from services.products import ProductsService
from services.stats import NotesService
from services.users import UsersService
from utils.dependencies import UOWDep
from services.dependencies import validate


class ProductUseCase(AbstractProductUseCase):

    def __init__(self, uow: UOWDep):
        self.uow = uow

    async def get_list(self, **filter_by) -> List[BaseModel]:
        async with self.uow:
            products_list = await ProductsService.get_products_list(self.uow, **filter_by)

        return products_list

    async def get_page(self, page_index: int, page_size: int, **filter_by) -> List[BaseModel]:
        async with self.uow:
            products_page = await ProductsService.get_page(self.uow, page_index, page_size, **filter_by)

        return products_page

    async def get_info(self, user_id: int | None, product_id: int) -> ProductInfoSchema:
        async with self.uow:
            product = await ProductsService.get_product_info(self.uow, id=product_id)

            if not user_id is None:
                await NotesService.add_note(self.uow, user_id, product_id, VIEWED)
            await self.uow.commit()

        return product

    async def find_list(self, page_index: int, page_size: int, **field) -> List[BaseModel] | Dict[str, str]:
        result_list = []
        skip = page_index * page_size

        if len(field) > 1:
            raise InvalidData

        async with self.uow:
            key, value_list = list(field.items())[0]
            if not isinstance(value_list, list):
                raise InvalidData

            if (length := len(value_list)) <= skip:
                return {"paging": "reached end"}

            value_list = value_list[skip : min(skip + page_size, length)]

            for value in value_list:
                d = dict()
                d[key] = value
                product = await ProductsService.get_product_info(self.uow, **d)
                result_list.append(product)

        return result_list

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

    async def delete(self, user_id: int, product_id: int):
        async with self.uow:
            if not await UsersService.user_is_moderator(self.uow, user_id):
                raise AccessForbiddenException
            await ProductsService.delete_product(self.uow, product_id)

            await self.uow.commit()

    async def edit_info(self, user_id: int, product_id: int, **changes):
        async with self.uow:
            if not await UsersService.user_is_moderator(self.uow, user_id):
                raise AccessForbiddenException

            validate(changes, ProductSchema)
            result = await ProductsService.edit_product_info(self.uow, product_id, **changes)

            await self.uow.commit()
            return result

    async def add_review(self, user_id: int, product_id: int, mark: float):
        mark = min(mark, 10.0)
        mark = max(mark, 0.0)
        new_rating = mark

        async with self.uow:
            product = await ProductsService.get_product_info(self.uow, id=product_id)
            if product.reviews > 0:
                new_rating += product.reviews * product.rating
                new_rating /= product.reviews + 1
                new_rating = new_rating.__round__(2)

            await ProductsService.edit_product_info(self.uow, product_id,
                                                    reviews=product.reviews + 1,
                                                    rating=new_rating)
            await self.uow.commit()