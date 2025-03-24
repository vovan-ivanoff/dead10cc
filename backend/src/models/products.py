from sqlalchemy import JSON, String
from sqlalchemy.orm import Mapped, mapped_column

from db.database import Base
from schemas.products import ProductSchema


class Products(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    article: Mapped[int] = mapped_column(nullable=False)
    title: Mapped[str] = mapped_column(String(30), nullable=False)
    price: Mapped[int] = mapped_column(nullable=False)
    tags: Mapped[dict | list | None] = mapped_column(JSON, nullable=True)
    seller: Mapped[str] = mapped_column(nullable=False)
    rating: Mapped[float] = mapped_column(nullable=False)
    reviews: Mapped[int] = mapped_column(nullable=False, default=0)
    description: Mapped[str] = mapped_column(String(1024), nullable=True)

    def to_read_model(self) -> ProductSchema:
        return ProductSchema(
            id=self.id,
            article=self.article,
            title=self.title,
            price=self.price,
            tags=self.tags,
            seller=self.seller,
            rating=self.rating,
            reviews=self.reviews,
            description=self.description
        )
