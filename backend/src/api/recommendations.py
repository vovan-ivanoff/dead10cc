import json

import requests
from fastapi import APIRouter, Depends

from services.auth.dependencies import get_current_user_id
from usecases.dependencies import NoteCase

router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"],
)


@router.get("/")
async def get_recommendation(
        count: int,
        note_case: NoteCase,
        user_id: int = Depends(get_current_user_id)
):
    stat = await note_case.get_statistics(user_id)

    data = json.dumps(stat, ensure_ascii=True, indent=4)
    response = requests.post(f"http://recommender:5100/recommendation/{count}", data=data,
                             headers={"Content-Type": "application/json"})
    rec = json.loads(response.content)

    for (key, val) in rec.items():
        stat[key] = val
    return stat