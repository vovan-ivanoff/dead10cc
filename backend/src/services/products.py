from typing import List, Iterator

from pydantic import BaseModel

from schemas.exceptions import InvalidData, ProductDoesNotExistException
from schemas.products import ProductAddSchema, ProductInfoSchema, ProductSchema
from utils.unit_of_work import AbstractUOW
from fastapi import Response


class ProductsService:
    @staticmethod
    async def add_product(
            uow: AbstractUOW,
            product: ProductAddSchema,
    ) -> int:
        product_id = await uow.products.add_one(
            article=product.article,
            title=product.title,
            price=product.price,
            tags=product.tags,
            seller=product.seller,
            rating=product.rating,
            reviews=product.reviews
        )
        return product_id

    @staticmethod
    async def get_products_list(
            uow: AbstractUOW,
            **filter_by
    ) -> List[BaseModel]:
        return await uow.products.find_all(**filter_by)


    @staticmethod
    async def get_page(
            uow: AbstractUOW,
            page_index: int,
            page_size: int,
            offset: int,
            **filter_by
    ) -> List[BaseModel]:

        return await uow.products.get_page(page_index, page_size, offset, **filter_by)


    @staticmethod
    async def get_product_info(
            uow: AbstractUOW,
            **field
    ) -> ProductSchema:
        product = await uow.products.find_one(**field)
        if not product:
            raise ProductDoesNotExistException
        return ProductSchema(**product.dict())


    @staticmethod
    async def delete_product(
            uow: AbstractUOW,
            product_id: int
    ):
        await uow.products.delete_by_id(product_id)

    @staticmethod
    async def edit_product_info(
            uow: AbstractUOW,
            product_id: int,
            **data
    ):

        return await uow.products.update_by_id(product_id, **data)

