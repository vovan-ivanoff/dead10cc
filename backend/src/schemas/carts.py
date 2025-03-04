from pydantic import BaseModel


class CartSchema(BaseModel):
    user_id: int
    products: list


class CartInfoSchema(BaseModel):
    products: list
