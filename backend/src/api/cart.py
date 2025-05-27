from fastapi import APIRouter, Depends

from services.auth.dependencies import get_current_user_id
from usecases.dependencies import CartCase

router = APIRouter(
    prefix="/carts",
    tags=["Carts"],
)


@router.get("/")
async def get(
        cart_case: CartCase,
        user_id: int = Depends(get_current_user_id)
):
    return await cart_case.get_my(user_id)


@router.patch("/{product_id}")
async def add_product(
        cart_case: CartCase,
        product_id: int,
        count: int = 1,
        user_id: int = Depends(get_current_user_id)
):
    return await cart_case.add_product_my(user_id, product_id, count)



@router.delete("/delete/{product_id}/{count}")
async def delete_product(
        cart_case: CartCase,
        product_id: int,
        count: int = 0,
        user_id: int = Depends(get_current_user_id)
):
    return await cart_case.delete_product_my(user_id, product_id, count)


@router.delete("/")
async def clear(
        cart_case: CartCase,
        user_id: int = Depends(get_current_user_id)
):
    await cart_case.clear_my(user_id)
    return {"status": "OK"}