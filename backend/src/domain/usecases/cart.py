from abc import ABC, abstractmethod


class AbstractCartUseCase(ABC):
    """Class for interaction with cart"""
    @abstractmethod
    async def get(self, user_id: int, target_user_id: int): ...

    @abstractmethod
    async def get_my(self, user_id: int): ...

    @abstractmethod
    async def add_product(self, user_id: int, target_user_id: int, product_id: int, count: int): ...

    @abstractmethod
    async def delete_product(self, user_id: int, target_user_id: int, product_id: int, count: int): ...

    @abstractmethod
    async def add_product_my(self, user_id: int, product_id: int, count: int): ...

    @abstractmethod
    async def delete_product_my(self, user_id: int, product_id: int, count: int): ...

    @abstractmethod
    async def clear(self, user_id: int, target_user_id): ...

    @abstractmethod
    async def clear_my(self, user_id: int): ...



