from sqlalchemy import JSON, String
from sqlalchemy.orm import Mapped, mapped_column

from db.database import Base
from schemas.users import UserSchema


class Users(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, nullable=False)
    phone: Mapped[str] = mapped_column(String(15), nullable=False)
    email: Mapped[str] = mapped_column(String(30), nullable=True)
    name: Mapped[str] = mapped_column(String(30), nullable=True)
    hashed_password: Mapped[str] = mapped_column(nullable=True)
    is_moderator: Mapped[bool] = mapped_column(nullable=False, default=False)

    def to_read_model(self) -> UserSchema:
        return UserSchema(
            id=self.id,
            phone=self.phone,
            email=self.email,
            name=self.name,
            hashed_password=self.hashed_password,
            is_moderator=self.is_moderator,
        )
