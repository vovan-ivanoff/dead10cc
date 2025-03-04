from abc import ABC, abstractmethod

from schemas.products import ProductAddSchema


class AbstractProductUseCase(ABC):
    """Class for interaction with products"""

    @abstractmethod
    async def add(self, product: ProductAddSchema, user_id: int): ...

    @abstractmethod
    async def get_info(self, product_id: int): ...

    @abstractmethod
    async def get_list(self): ...

    @abstractmethod
    async def edit_info(self, user_id: int, product_id: int, **changes): ...

    @abstractmethod
    async def delete(self, user_id: int, product_id: int): ...
