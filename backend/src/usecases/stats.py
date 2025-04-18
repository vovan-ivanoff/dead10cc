from typing import List

from pydantic import BaseModel

from domain.usecases.stats import AbstractNoteUseCase
from schemas.exceptions import AccessForbiddenException
from schemas.stats import NoteInfoSchema
from services.products import ProductsService
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
            note = await NotesService.get_note_info(self.uow, id=note_id)

        return note

    async def get_products_by_user(self, user_id: int) -> List[int]:
        product_ids = set()
        async with self.uow:
            notes = await NotesService.get_notes_list(self.uow, user_id=user_id)
            for note in notes:
                product_ids.add(note.product_id)
            articles = [(await ProductsService.get_product_info(self.uow, id=product_id)).article for product_id in
                        product_ids]

        return list(articles)
