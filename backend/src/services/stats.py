from typing import List

from utils.unit_of_work import AbstractUOW

from pydantic import BaseModel
from schemas.stats import NoteSchema, NoteInfoSchema
from schemas.actions import show


class NotesService:
    @staticmethod
    async def add_note(
            uow: AbstractUOW,
            user_id: int,
            product_id: int,
            action: int
    ) -> int:
        note_id = await uow.stats.add_one(user_id=user_id, product_id=product_id, action=action)
        return note_id

    @staticmethod
    async def get_notes_list(
            uow: AbstractUOW,
            **filter_by
    ) -> List[BaseModel]:
        notes = await uow.stats.find_all(**filter_by)
        return notes

    @staticmethod
    async def get_note_info(
            uow: AbstractUOW,
            **field
    ) -> NoteInfoSchema:
        note = await uow.stats.find_one(**field)
        return NoteInfoSchema(
            user_id=note.user_id,
            product_id=note.product_id,
            action=show(note.action)
        )
