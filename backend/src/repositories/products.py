from typing import List, Iterator, Sequence

from pydantic import BaseModel
from sqlalchemy import update, select, Row

from models.products import Products
from repositories.alchemy import SqlAlchemyRepo


class ProductsRepo(SqlAlchemyRepo):
    model = Products

    async def get_iter(self, size: int, **filter_by) -> Iterator[Sequence[Row]]:
        stmt = select(self.model).filter_by(**filter_by)
        result = await self.session.execute(stmt)
        self.session.expunge_all()

        iterator = result.partitions(size)

        return iterator
