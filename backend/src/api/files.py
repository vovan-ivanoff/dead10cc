from fastapi import APIRouter, Depends, Response

from services.auth.dependencies import get_current_user_id
from utils.file_manager import FileUploader as Fu

router = APIRouter(
    prefix="/file",
    tags=["Files"],
)


@router.get("/poster/{event_id}")
async def get_poster_image(
    event_id: int,
):
    return Response(content=await Fu.get_poster(event_id), media_type="image/jpeg")


@router.get("/avatar/my")
async def get_my_avatar_image(
    user_id: int = Depends(get_current_user_id),
):
    return Response(content=await Fu.get_my_avatar(user_id), media_type="image/jpeg")
