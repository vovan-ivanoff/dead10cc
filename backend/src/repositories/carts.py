from sqlalchemy import update

from models.carts import Carts
from repositories.alchemy import SqlAlchemyRepo
from utils.date_manager import DateManager as Dm


class CartsRepo(SqlAlchemyRepo):
    model = Carts
