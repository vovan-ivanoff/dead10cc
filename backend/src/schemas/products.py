from pydantic import BaseModel, Field


class ProductSchema(BaseModel):
    id: int
    article: int
    title: str = Field(max_length=128)
    price: int
    tags: list | None
    seller: str | None
    rating: float
    reviews: int
    description: str | None


class ProductInfoSchema(BaseModel):
    article: int
    title: str = Field(max_length=128)
    price: int
    tags: list | None
    seller: str | None
    rating: float
    reviews: int
    description: str | None


class ProductAddSchema(BaseModel):
    article: int
    title: str = Field(
        max_length=128,
        examples=["Dildo"],
    )
    price: int
    tags: list | None = Field(examples=[["for_male", "18+"], ["for_kids"]])
    seller: str | None = Field(examples=["OZON"])
    rating: float
    reviews: int
    description: str | None = Field(
        max_length=1024,
        examples=["Для жеского кайфа"],
    )