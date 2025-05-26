from abc import ABC, abstractmethod

from schemas.products import ProductAddSchema

from fastapi import Response


class AbstractProductUseCase(ABC):
    """Class for interaction with products"""

    @abstractmethod
    async def add(self, product: ProductAddSchema, user_id: int): ...

    @abstractmethod
    async def get_info(self, user_id: int, product_id: int): ...

    @abstractmethod
    async def get_info_by_article(self, user_id: int | None, article: int): ...

    @abstractmethod
    async def get_page(self, page_index: int, page_size: int, offset: int, **filter_by): ...

    @abstractmethod
    async def get_list(self, **filter_by): ...

    @abstractmethod
    async def edit_info(self, user_id: int, product_id: int, **changes): ...

    @abstractmethod
    async def delete(self, user_id: int, product_id: int): ...
