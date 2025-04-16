from abc import ABC, abstractmethod

from starlette.responses import Response

from schemas.auth import UserLoginSchema, UserRegisterSchema


class AbstractUserUseCase(ABC):
    """Class for interaction with users"""

    @abstractmethod
    async def registrate(self, user: UserRegisterSchema, response: Response): ...

    @abstractmethod
    async def login(self, user_data: UserLoginSchema, response: Response): ...

    @abstractmethod
    async def logout(self, response: Response): ...

    @abstractmethod
    async def get_list(self, user_id: int): ...

    @abstractmethod
    async def get_my_info(self, user_id: int): ...

    @abstractmethod
    async def is_moderator(self, user_id: int): ...

    @abstractmethod
    async def edit_info(self, user_id, target_user_id, **data): ...

    @abstractmethod
    async def edit_my_info(self, user_id, **data): ...

    @abstractmethod
    async def make_moderator(self, user_id, target_user_id): ...
