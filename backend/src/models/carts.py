from sqlalchemy import DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column

from db.database import Base
from schemas.carts import CartSchema


class Carts(Base):
    __tablename__ = "carts"

    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    products: Mapped[dict | list | None] = mapped_column(JSON, nullable=True)

    def to_read_model(self) -> CartSchema:
        return CartSchema(
            id=self.id,
            user_id=self.user_id,
            products=self.products
        )
