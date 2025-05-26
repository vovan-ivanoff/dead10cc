import json

import requests
from PIL.ImageChops import offset
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
    model_response = requests.post(f"http://recommender:5100/recommendation", data=data,
                             headers={"Content-Type": "application/json"})
    recommendation = json.loads(model_response.content)

    response = {"content": await product_case.find_list(page_index, page_size, article=recommendation["recommended"]),
                "collaborative": await product_case.find_list(page_index, page_size, article=[pr["article"] for pr in statistics["relevant_products"]])}

    length = len(response["content"])
    if length < page_size:
        if response["content"] == {"paging": "reached end"}:
            length -= 1

        base_idx = page_index - (len(recommendation["recommended"]) // page_size)
        if length > 0:
            response["base"] = await product_case.get_page(base_idx, page_size - length)
        else:
            offs = (len(recommendation["recommended"]) % page_size)
            response["base"] = await product_case.get_page(base_idx, page_size, offs)

    return response