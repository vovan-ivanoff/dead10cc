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
        product_id = await uow.products.add_one(article=product.article,
                                                title=product.title,
                                                price=product.price,
                                                tags=product.tags,
                                                seller=product.seller,
                                                rating=product.rating,
                                                reviews=product.reviews)
        return product_id

    @staticmethod
    async def get_products_list(
            uow: AbstractUOW,
    ) -> List[BaseModel]:
        return await uow.products.find_all()

    @staticmethod
    async def get_iterator(
            uow: AbstractUOW,
            size: int,
    ) -> Iterator:
        return await uow.products.get_iter(size)

    @staticmethod
    async def get_next_page(
            iterator: Iterator
    ) -> List[BaseModel]:
        return [row[0].to_read_model() for row in next(iterator)]

    @staticmethod
    async def get_product_info(
            uow: AbstractUOW,
            product_id: int
    ) -> ProductInfoSchema:
        return ProductInfoSchema(**(await uow.products.find_one(id=product_id)).dict())

    @staticmethod
    async def get_product_by_article(
            uow: AbstractUOW,
            article: int
    ) -> ProductInfoSchema:
        return ProductInfoSchema(**(await uow.products.find_one(article=article)).dict())

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
