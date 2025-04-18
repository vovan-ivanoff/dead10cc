from models.users import Users
from repositories.alchemy import SqlAlchemyRepo
from schemas.users import UserSchema


class UsersRepo(SqlAlchemyRepo):
    model = Users

    async def find_one(self, **filter_by) -> None | UserSchema:
        user = await super().find_one(**filter_by)
        if user:
            user = UserSchema(**user.dict())
        return user
