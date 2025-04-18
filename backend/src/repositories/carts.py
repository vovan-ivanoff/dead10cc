from models.carts import Carts
from repositories.alchemy import SqlAlchemyRepo


class CartsRepo(SqlAlchemyRepo):
    model = Carts
