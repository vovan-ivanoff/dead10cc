from typing import List

from pydantic import BaseModel

from domain.usecases.stats import AbstractNoteUseCase
from schemas.exceptions import AccessForbiddenException
from schemas.stats import NoteInfoSchema
from services.stats import NotesService
from services.users import UsersService
from utils.dependencies import UOWDep


class NoteUseCase(AbstractNoteUseCase):

    def __init__(self, uow: UOWDep):
        self.uow = uow

    async def get_list(self, user_id: int, **filter_by) -> List[BaseModel]:
        async with self.uow:
            if not await UsersService.user_is_moderator(self.uow, user_id):
                raise AccessForbiddenException
            notes = await NotesService.get_notes_list(self.uow, **filter_by)

        return notes

    async def get_info(self, user_id: int, note_id: int) -> NoteInfoSchema:
        async with self.uow:
            if not await UsersService.user_is_moderator(self.uow, user_id):
                raise AccessForbiddenException
            note = await NotesService.get_note_info(self.uow, note_id)

        return note
