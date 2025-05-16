from typing import List, Dict

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

    async def get_statistics(self, user_id: int) -> Dict:
        interesting_products_ids = set()  # товары, интересующие данного пользователя
        similar_users_ids = set()  # юзеры с похожим поведением
        relevant_products_ids = set()  # товары, которые интересуют юзеров с похожим поведением
        similar_users = {}  # {user: similarity}
        relevant_products = {}  # {product: relevance}

        async with self.uow:
            user_notes = await NotesService.get_notes_list(self.uow, user_id=user_id)
            for note in user_notes:
                interesting_products_ids.add(note.product_id)

            for product_id in interesting_products_ids:
                product_notes = await NotesService.get_notes_list(self.uow, product_id=product_id)
                for note in product_notes:
                    similar_users_ids.add(note.user_id)
                for user in similar_users_ids.difference({user_id}):
                    similar_users[user] = similar_users.get(user, 0) + 1
                similar_users_ids.clear()

            for (key, value) in similar_users.items():
                similar_users[key] = NotesService.calculate_similarity(value)

            for (user, similarity) in similar_users.items():
                user_notes = await NotesService.get_notes_list(self.uow, user_id=user)
                for note in user_notes:
                    relevant_products_ids.add(note.product_id)
                for product_id in relevant_products_ids.difference(interesting_products_ids):
                    relevant_products[product_id] = relevant_products.get(product_id, 0.) + similarity
                relevant_products_ids.clear()

            result = {
                "interesting_products": [(await ProductsService.get_product_info(self.uow, id=product_id)).article for
                                         product_id in interesting_products_ids],
                "similar_users": [
                    {
                        "user_id": _id,
                        "similarity": similarity
                    }
                    for (_id, similarity) in similar_users.items()],

                "relevant_products": [
                    {
                        "article": (await ProductsService.get_product_info(self.uow, id=product_id)).article,
                        "relevance": relevant_products[product_id]
                    }
                    for (product_id, relevance) in relevant_products.items()]
            }

        return result
