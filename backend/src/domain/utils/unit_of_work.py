from abc import ABC, abstractmethod

from repositories.products import ProductsRepo
from repositories.carts import CartsRepo
from repositories.users import UsersRepo


class AbstractUOW(ABC):
    users: UsersRepo
    products: ProductsRepo
    carts: CartsRepo

    @abstractmethod
    async def __aenter__(self): ...

    @abstractmethod
    async def __aexit__(self, *args): ...

    @abstractmethod
    async def commit(self): ...

    @abstractmethod
    async def rollback(self): ...