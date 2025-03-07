from pydantic import BaseModel, Field


class ProductSchema(BaseModel):
    id: int
    article: int
    title: str = Field(max_length=30)
    price: int
    tags: list | None
    seller: str
    rating: float
    reviews: int


class ProductInfoSchema(BaseModel):
    article: int
    title: str = Field(max_length=30)
    price: int
    tags: list | None
    seller: str
    rating: float
    reviews: int


class ProductAddSchema(BaseModel):
    article: int
    title: str = Field(
        max_length=30,
        examples=["Dildo"],
    )
    price: int
    tags: list | None = Field(examples=[["for_male", "18+"], ["for_kids"]])
    seller: str = Field(examples=["OZON"])
    rating: float
    reviews: int
