from schemas.carts import CartInfoSchema
from utils.unit_of_work import AbstractUOW


class CartsService:
    @staticmethod
    async def create_cart(
            uow: AbstractUOW,
            user_id: int
    ):
        await uow.carts.add_one(user_id=user_id, products=dict())

    @staticmethod
    async def get_cart(
            uow: AbstractUOW,
            **field
    ) -> CartInfoSchema:
        cart = await uow.carts.find_one(**field)
        return CartInfoSchema(**cart.dict())

    @staticmethod
    async def add_product(
            uow: AbstractUOW,
            user_id: int,
            product_id: int,
            count: int
    ):
        key = str(product_id)
        products = (await uow.carts.find_one(user_id=user_id)).products
        products[key] = products.get(key, 0) + count
        await uow.carts.update_by_id(user_id, products=products)

    @staticmethod
    async def delete_product(
            uow: AbstractUOW,
            user_id: int,
            product_id: int,
            count: int
    ):
        key = str(product_id)
        products = (await uow.carts.find_one(user_id=user_id)).products
        if count == 0:
            del products[key]
        else:
            products[key] = products.get(key, 0) - count
            if products[key] < 1:
                del products[key]

        await uow.carts.update_by_id(user_id, products=products)

    @staticmethod
    async def clear_cart(
            uow: AbstractUOW, user_id: int
    ):
        await uow.carts.update_by_id(user_id, products=dict())