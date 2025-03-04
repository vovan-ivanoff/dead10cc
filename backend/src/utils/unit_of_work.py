from db.database import async_session_maker
from domain.utils.unit_of_work import AbstractUOW
from repositories.products import ProductsRepo
from repositories.carts import CartsRepo
from repositories.users import UsersRepo


class UOW(AbstractUOW):
    async def __aenter__(self):
        self.session = async_session_maker()
        self.users = UsersRepo(self.session)
        self.products = ProductsRepo(self.session)
        self.carts = CartsRepo(self.session)

    async def __aexit__(self, *args):
        await self.rollback()
        await self.session.close()

    async def commit(self):
        await self.session.commit()

    async def rollback(self):
        await self.session.rollback()
