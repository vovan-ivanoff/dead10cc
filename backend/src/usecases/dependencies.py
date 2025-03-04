from typing import Annotated

from fastapi import Depends

from domain.usecases.cart import AbstractCartUseCase
from domain.usecases.product import AbstractProductUseCase
from domain.usecases.user import AbstractUserUseCase
from usecases.cart import CartUseCase
from usecases.product import ProductUseCase
from usecases.user import UserUseCase

UserCase = Annotated[AbstractUserUseCase, Depends(UserUseCase)]
ProductCase = Annotated[AbstractProductUseCase, Depends(ProductUseCase)]
CartCase = Annotated[AbstractCartUseCase, Depends(CartUseCase)]
