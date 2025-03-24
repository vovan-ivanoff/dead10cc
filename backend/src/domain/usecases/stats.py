from abc import ABC, abstractmethod


class AbstractNoteUseCase(ABC):
    """Class for interaction with notes"""

    @abstractmethod
    async def get_info(self, user_id: int, note_id: int): ...

    @abstractmethod
    async def get_list(self, user_id: int, **filter_by): ...

    @abstractmethod
    async def get_products_by_user(self, user_id: int): ...
