from typing import List

from pydantic import BaseModel

from schemas.products import ProductAddSchema, ProductInfoSchema
from utils.unit_of_work import AbstractUOW


class ProductsService:
    @staticmethod
    async def add_product(
        uow: AbstractUOW,
        product: ProductAddSchema,
    ) -> int:
        product_id = await uow.events.add_one(
            title=product.title,
            price=product.price,
            tags=product.tags,
            seller=product.seller,
        )
        return product_id
