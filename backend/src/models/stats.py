from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from db.database import Base
from schemas.actions import show
from schemas.stats import NoteSchema


class Notes(Base):
    __tablename__ = "statistics"

    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), nullable=False)
    action: Mapped[int] = mapped_column(nullable=False)

    def to_read_model(self) -> NoteSchema:
        return NoteSchema(
            id=self.id,
            user_id=self.user_id,
            product_id=self.product_id,
            action=show(self.action)
        )
