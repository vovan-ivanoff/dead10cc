from sqlalchemy import select

from models.stats import Notes

from repositories.alchemy import SqlAlchemyRepo


class StatsRepo(SqlAlchemyRepo):
    model = Notes
