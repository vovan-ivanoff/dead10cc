from pydantic import BaseModel, Field


class ProductSchema(BaseModel):
    id: int
    title: str = Field(max_length=30)
    price: int
    tags: list | None
    seller: str


class ProductInfoSchema(BaseModel):
    title: str = Field(max_length=30)
    price: int
    tags: list | None
    seller: str


class ProductAddSchema(BaseModel):
    title: str = Field(
        max_length=30,
        examples=["Dildo"],
    )
    price: int
    tags: list | None = Field(examples=[["for_male", "18+"], ["for_kids"]])
    seller: str = Field(examples=["OZON"])
