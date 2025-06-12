from fastapi import APIRouter, Depends, UploadFile, Response

from services.auth.dependencies import get_current_user_id
from usecases.dependencies import UserCase
from utils.file_manager import FileManager as Fm

router = APIRouter(
    prefix="/files",
    tags=["Files"],
)


@router.get("/preview/{product_id}")
async def get_preview(
        product_id: int
):
    return Response(content=await Fm.get_preview(product_id), media_type="image/jpg")


@router.post("/preview/{product_id}")
async def upload_preview(
        preview: UploadFile,
        product_id: int,
        user_case: UserCase,
        user_id: int = Depends(get_current_user_id)
):
    await Fm.upload_preview(product_id, preview, user_case, user_id)
    return {"status": "ok"}


@router.delete("/preview/{product_id}")
async def delete_preview(
        product_id: int,
        user_case: UserCase,
        user_id: int = Depends(get_current_user_id)
):
    await Fm.delete_preview(product_id, user_case, user_id)
    return {"status": "ok"}


@router.get("/image/{image_id}/{product_id}", response_class=Response)
async def get_image(
        product_id: int,
        image_id: int
):
    return Response(content=await Fm.get_image(product_id, image_id), media_type="image/jpg")


@router.post("/image/{product_id}")
async def upload_image(
        image: UploadFile,
        product_id: int,
        user_case: UserCase,
        user_id: int = Depends(get_current_user_id)
):
    await Fm.upload_image(product_id, image, user_case, user_id)
    return {"status": "ok"}


@router.delete("/image/{image_id}/{product_id}")
async def delete_image(
        product_id: int,
        image_id: int,
        user_case: UserCase,
        user_id: int = Depends(get_current_user_id)
):
    await Fm.delete_image(product_id, image_id, user_case, user_id)
    return {"status": "ok"}


@router.get("/avatar/me")
async def get_my_avatar(
        user_id: int = Depends(get_current_user_id)
):
    return Response(content=await Fm.get_my_avatar(user_id), media_type="image/jpg")


@router.post("/avatar/me")
async def upload_my_avatar(
        avatar: UploadFile, user_id: int = Depends(get_current_user_id)
):
    await Fm.upload_my_avatar(avatar, user_id)
    return {"status": "ok"}


@router.delete("/avatar/me")
async def delete_my_avatar(user_id: int = Depends(get_current_user_id)):
    await Fm.delete_my_avatar(user_id)
    return {"status": "ok"}