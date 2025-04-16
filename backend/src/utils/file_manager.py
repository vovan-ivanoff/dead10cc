import os

from fastapi import UploadFile

from domain.usecases.user import AbstractUserUseCase
from schemas.exceptions import (AccessForbiddenException, BadFileException,
                                BadRequestException)


class FileManager:
    @staticmethod
    async def upload_my_avatar(avatar: UploadFile, user_id: int):
        if avatar.content_type != "image/jpg":
            raise BadFileException
        with open(f"../resources/avatar_{user_id}.jpg", "wb") as file:
            file.write(await avatar.read())

    @staticmethod
    async def get_my_avatar(user_id: int) -> bytes:
        if os.path.exists(f"../resources/avatars/avatar_{user_id}.jpg"):
            with open(f"../resources/avatars/avatar_{user_id}.jpg", "rb") as file:
                return file.read()
        else:
            with open(f"../resources/avatars/default.jpg", "rb") as file:
                return file.read()

    @staticmethod
    async def delete_my_avatar(user_id: int):
        if os.path.exists(f"../resources/avatars/avatar_{user_id}.jpg"):
            os.remove(f"../resources/avatars/avatar_{user_id}.jpg")
        else:
            raise BadRequestException

    @staticmethod
    async def upload_preview(
            product_id: int, poster: UploadFile, user_case: AbstractUserUseCase, user_id: int
    ):
        if not await user_case.is_moderator(user_id):
            raise AccessForbiddenException

        if poster.content_type != "image/jpg":
            raise BadFileException
        with open(f"../resources/products/{product_id}_preview.jpg", "wb") as file:
            file.write(await poster.read())

    @staticmethod
    async def upload_image(
            product_id: int, poster: UploadFile, user_case: AbstractUserUseCase, user_id: int
    ):
        if not await user_case.is_moderator(user_id):
            raise AccessForbiddenException

        if poster.content_type != "image/jpg":
            raise BadFileException

        for i in range(20):
            if os.path.exists(f"../resources/products/{product_id}_{i}.jpg"):
                continue

            with open(f"../resources/products/{product_id}_{i}.jpg", "wb") as file:
                file.write(await poster.read())
                return {"status": "Success",
                        "image": i}

        return {"status": "Fail"}

    @staticmethod
    async def get_preview(product_id: int) -> bytes:
        if os.path.exists(f"../resources/products/{product_id}_preview.jpg"):
            with open(f"../resources/products/{product_id}_preview.jpg", "rb") as file:
                return file.read()
        else:
            with open(f"../resources/products/default.jpg", "rb") as file:
                return file.read()

    @staticmethod
    async def get_image(product_id: int, image_id: int) -> bytes:
        if not os.path.exists(f"../resources/products/{product_id}_{image_id}.jpg"):
            raise BadRequestException
        with open(f"../resources/products/{product_id}_{image_id}.jpg", "rb") as file:
            return file.read()

    @staticmethod
    async def delete_preview(
            product_id: int, user_case: AbstractUserUseCase, user_id: int
    ):
        if not await user_case.is_moderator(user_id):
            raise AccessForbiddenException

        if os.path.exists(f"../resources/products/{product_id}_preview.jpg"):
            os.remove(f"../resources/products/{product_id}_preview.jpg")
        else:
            raise BadRequestException

    @staticmethod
    async def delete_image(
            product_id: int, image_id: int, user_case: AbstractUserUseCase, user_id: int
    ):
        if not await user_case.is_moderator(user_id):
            raise AccessForbiddenException

        if os.path.exists(f"../resources/products/{product_id}_{image_id}.jpg"):
            os.remove(f"../resources/products/{product_id}_{image_id}.jpg")
        else:
            raise BadRequestException

        for i in range(image_id + 1, 20):
            if not os.path.exists(f"../resources/products/{product_id}_{i}.jpg"):
                break

            os.rename(f"../resources/products/{product_id}_{i}.jpg", f"../resources/products/{product_id}_{i - 1}.jpg")
