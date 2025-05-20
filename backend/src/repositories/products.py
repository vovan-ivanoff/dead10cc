from typing import List

from pydantic import BaseModel
from sqlalchemy import select, Row

from models.products import Products
from repositories.alchemy import SqlAlchemyRepo


class ProductsRepo(SqlAlchemyRepo):
    model = Products

    async def get_page(self, page: int, **filter_by) -> List[BaseModel]:
        stmt = select(self.model).filter_by(**filter_by).offset(page * 20).limit(20)
        result = await self.session.execute(stmt)
        result = [row[0].to_read_model() for row in result.all()]
        return result
