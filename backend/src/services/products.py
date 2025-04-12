from typing import List, Iterator

from pydantic import BaseModel

from schemas.products import ProductAddSchema, ProductInfoSchema
from utils.unit_of_work import AbstractUOW


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
    async def get_iterator(
            uow: AbstractUOW,
            size: int,
            **filter_by
    ) -> Iterator:
        return await uow.products.get_iter(size)

    @staticmethod
    async def get_next_page(
            iterator: Iterator
    ) -> List[BaseModel]:
        try:
            page = next(iterator)
        except StopIteration:
            return []
        return [row[0].to_read_model() for row in page]

    @staticmethod
    async def get_product_info(
            uow: AbstractUOW,
            **field
    ) -> ProductInfoSchema:
        return ProductInfoSchema(**(await uow.products.find_one(**field)).dict())

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
        await uow.products.update_by_id(product_id, **data)
