from fastapi import APIRouter, Depends

from services.auth.dependencies import get_current_user_id
from usecases.dependencies import NoteCase

router = APIRouter(
    prefix="/statistics",
    tags=["Statistics"],
)


@router.post("/")
async def get_notes(
        note_case: NoteCase,
        user_id: int = Depends(get_current_user_id),
):
    return await note_case.get_list(user_id)


@router.get("/{note_id}")
async def get_note_info(
        note_case: NoteCase,
        note_id: int,
        user_id: int = Depends(get_current_user_id),
):
    return await note_case.get_info(user_id, note_id)


@router.post("/find")
async def find_notes(
        note_case: NoteCase,
        filter_by: dict,
        current_user_id: int = Depends(get_current_user_id),

):
    return await note_case.get_list(current_user_id, **filter_by)


@router.get("/rec_stat/{user_id}")
async def get_statistics(
        note_case: NoteCase,
        user_id: int = Depends(get_current_user_id),
):
    return await note_case.get_statistics(user_id)