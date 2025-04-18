from pydantic import BaseModel


class CartSchema(BaseModel):
    id: int
    user_id: int
    products: dict


class CartInfoSchema(BaseModel):
    products: dict
