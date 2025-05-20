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
    async def get_page(self, response: Response): ...

    @abstractmethod
    async def reset_paging(self, response: Response): ...

    @abstractmethod
    async def get_list(self, **filter_by): ...

    @abstractmethod
    async def edit_info(self, user_id: int, product_id: int, **changes): ...

    @abstractmethod
    async def delete(self, user_id: int, product_id: int): ...
