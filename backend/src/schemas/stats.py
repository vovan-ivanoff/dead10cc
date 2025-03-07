from pydantic import BaseModel, Field


class NoteSchema(BaseModel):
    id: int
    user_id: int
    product_id: int
    action: str


class NoteInfoSchema(BaseModel):
    user_id: int
    product_id: int
    action: str
