from fastapi import APIRouter, Depends, UploadFile

from schemas.products import ProductAddSchema
from services.auth.dependencies import get_current_user_id
from usecases.dependencies import ProductCase

router = APIRouter(
    prefix="/products",
    tags=["Products"],
)


@router.get("/")
async def get_list(
    product_case: ProductCase
):
    return await product_case.get_list()


@router.get("/{product_id}")
async def get(
    product_case: ProductCase,
    product_id: int,
    user_id: int = Depends(get_current_user_id)
):
    return await product_case.get_info(user_id, product_id)


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
