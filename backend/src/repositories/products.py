from sqlalchemy import update

from models.products import Products
from repositories.alchemy import SqlAlchemyRepo


class ProductsRepo(SqlAlchemyRepo):
    model = Products
