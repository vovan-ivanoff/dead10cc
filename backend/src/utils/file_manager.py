import os

from fastapi import UploadFile

from domain.usecases.product import AbstractProductUseCase
from domain.usecases.user import AbstractUserUseCase
from schemas.exceptions import (AccessForbiddenException, BadFileException,
                                BadRequestException)
from usecases.dependencies import UserCase


class FileUploader:
    @staticmethod
    async def poster_upload(
        product_id: int, poster: UploadFile, user_case: AbstractUserUseCase, user_id: int
    ):
        if not await user_case.is_moderator(user_id):
            raise AccessForbiddenException

        if poster.content_type != "image/jpeg":
            raise BadFileException
        with open(f"../resources/posters/poster_{product_id}.jpeg", "wb") as file:
            file.write(await poster.read())

    @staticmethod
    async def my_avatar_upload(avatar: UploadFile, user_id: int):
        if avatar.content_type != "image/jpeg":
            raise BadFileException
        with open(f"../resources/avatars/avatar_{user_id}.jpeg", "wb") as file:
            file.write(await avatar.read())

    @staticmethod
    async def get_poster(product_id: int) -> bytes:
        if os.path.exists(f"../resources/posters/poster_{product_id}.jpeg"):
            with open(f"../resources/posters/poster_{product_id}.jpeg", "rb") as file:
                return file.read()
        else:
            with open(f"../resources/posters/poster_default.jpeg", "rb") as file:
                return file.read()

    @staticmethod
    async def get_my_avatar(user_id: int) -> bytes:
        if os.path.exists(f"../resources/avatars/avatar_{user_id}.jpeg"):
            with open(f"../resources/avatars/avatar_{user_id}.jpeg", "rb") as file:
                return file.read()
        else:
            with open(f"../resources/avatars/avatar_default.jpeg", "rb") as file:
                return file.read()

    @staticmethod
    async def delete_my_avatar(user_id: int):
        if os.path.exists(f"../resources/avatars/avatar_{user_id}.jpeg"):
            os.remove(f"../resources/avatars/avatar_{user_id}.jpeg")
        else:
            raise BadRequestException

    @staticmethod
    async def delete_poster(
        product_id: int, user_case: AbstractUserUseCase, user_id: int
    ):
        if not await user_case.is_moderator(user_id):
            raise AccessForbiddenException

        if os.path.exists(f"../resources/posters/poster_{product_id}.jpeg"):
            os.remove(f"../resources/posters/poster_{product_id}.jpeg")
        else:
            raise BadRequestException
