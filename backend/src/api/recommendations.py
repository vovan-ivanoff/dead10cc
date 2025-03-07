from fastapi import APIRouter, Depends, UploadFile

from services.auth.dependencies import get_current_user_id
from usecases.dependencies import NoteCase

router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"],
)


@router.get("/statistics")
async def get_notes(
        note_case: NoteCase,
        user_id: int = Depends(get_current_user_id),
):
    return await note_case.get_list(user_id)


@router.get("/statistics/{note_id}")
async def get_note_info(
        note_case: NoteCase,
        note_id: int,
        user_id: int = Depends(get_current_user_id),
):
    return await note_case.get_info(user_id, note_id)


@router.get("/{product_id}/statistics")
async def get_notes_by_product(
        note_case: NoteCase,
        product_id: int,
        user_id: int = Depends(get_current_user_id),
):
    return await note_case.get_list(user_id, product_id=product_id)


@router.get("/")
async def get_recommendation():
    return {"work": "in progress"}