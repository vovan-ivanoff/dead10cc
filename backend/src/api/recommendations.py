import json

import requests
from fastapi import APIRouter, Depends

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


@router.get("/{user_id}/products")
async def get_statistics(
        note_case: NoteCase,
        user_id: int = Depends(get_current_user_id),
):
    return await note_case.get_statistics(user_id)


@router.get("/")
async def get_recommendation(
        count: int,
        note_case: NoteCase,
        user_id: int = Depends(get_current_user_id)
):
    products = {"interesting_products": await note_case.get_statistics(user_id)}
    products = json.dumps(products, ensure_ascii=True, indent=4)
    response = requests.post(f"http://recommender:5100/recommendation/{count}", data=products,
                             headers={"Content-Type": "application/json"})

    return response.content