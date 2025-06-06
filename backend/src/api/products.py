from fastapi import APIRouter, Depends, UploadFile, Response

from schemas.products import ProductAddSchema
from services.auth.dependencies import get_current_user_id
from usecases.dependencies import ProductCase, UserCase
from utils.file_manager import FileManager as Fm
from variables.gl import iterators

router = APIRouter(
    prefix="/products",
    tags=["Products"],
)


@router.get("/")
async def get_list(
        product_case: ProductCase
):
    return await product_case.get_list()


@router.get("/get_page")
async def get_page(
        product_case: ProductCase,
        user_id: int = Depends(get_current_user_id),
):
    page = await product_case.get_page(user_id, iterators)
    if len(page) == 0:
        return {"pages": "reached end"}
    return page


@router.delete("/reset_paging")
async def reset_paging(
        user_id: int = Depends(get_current_user_id),
):
    del iterators[user_id]
    return {"status": "OK"}


@router.get("/{product_id}")
async def get(
        product_case: ProductCase,
        product_id: int,
        user_id: int = Depends(get_current_user_id)
):
    return await product_case.get_info(user_id, product_id)


@router.get("/find/{article}")
async def get(
        product_case: ProductCase,
        article: int,
):
    return await product_case.get_info(article)


@router.post("/")
async def add(
        product_case: ProductCase,
        product: ProductAddSchema,
        user_id: int = Depends(get_current_user_id)
):
    await product_case.add(product, user_id)
    return {"status": "OK"}


@router.patch("/{product_id}")
async def edit_info(
        product_case: ProductCase,
        product_id: int,
        changes: dict,
        user_id: int = Depends(get_current_user_id),
):
    await product_case.edit_info(user_id, product_id, **changes)
    return {"status": "OK"}


@router.delete("/{product_id}")
async def delete(
        product_case: ProductCase,
        product_id: int,
        user_id: int = Depends(get_current_user_id),
):
    await product_case.delete(user_id, product_id)
    return {"status": "OK"}


@router.patch("/review/{product_id}")
async def create_review(
        product_case: ProductCase,
        product_id: int,
        mark: float,
        user_id: int = Depends(get_current_user_id)
):
    await product_case.add_review(user_id, product_id, mark)
    return {"status": "OK"}


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


@router.get("/image{image_id}/{product_id}")
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


@router.delete("/image/{product_id}/{image_id}")
async def delete_image(
        product_id: int,
        image_id: int,
        user_case: UserCase,
        user_id: int = Depends(get_current_user_id)
):
    await Fm.delete_image(product_id, image_id, user_case, user_id)
    return {"status": "ok"}