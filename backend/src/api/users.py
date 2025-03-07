from fastapi import APIRouter, Depends, UploadFile

from services.auth.dependencies import get_current_user_id
from usecases.dependencies import UserCase

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get("/")
async def get_users_list(
    user_case: UserCase, user_id: int = Depends(get_current_user_id)
):
    return await user_case.get_list(user_id)


@router.patch("/moder/{target_user_id}")
async def give_permissions(
    target_user_id: int,
    user_case: UserCase,
    user_id: int = Depends(get_current_user_id),
):
    await user_case.make_moderator(user_id, target_user_id)
    return {"status": "ok"}
