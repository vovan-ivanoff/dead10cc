from abc import ABC, abstractmethod


class AbstractRepo(ABC):
    @abstractmethod
    async def add_one(self, **data): ...

    @abstractmethod
    async def find_all(self, **data): ...
