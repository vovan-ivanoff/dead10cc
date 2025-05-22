import json

import requests
from fastapi import APIRouter, Depends

from services.auth.dependencies import get_current_user_id
from usecases.dependencies import NoteCase, ProductCase

router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"],
)


@router.get("/")
async def get_recommendation(
        page_index: int,
        page_size: int,
        note_case: NoteCase,
        product_case: ProductCase,
        user_id: int = Depends(get_current_user_id)
):
    amount = (page_index + 1) * page_size
    statistics = await note_case.get_statistics(user_id)

    data = json.dumps(statistics, ensure_ascii=True, indent=4)
    model_response = requests.post(f"http://recommender:5100/recommendation/{amount}", data=data,
                             headers={"Content-Type": "application/json"})
    recommendation = json.loads(model_response.content)

    response = {"content": await product_case.find_list(page_index, page_size, article=recommendation["recommended"]),
                "collaborative": await product_case.find_list(page_index, page_size, article=[pr["article"] for pr in statistics["relevant_products"]])}  # по-хорошему бы переделать ато две сессии в бдшку
    return response