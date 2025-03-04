from api.auth import router as auth_router
from api.files import router as files_router
from api.users import router as users_router
from api.products import router as products_router
from api.cart import router as cart_router

all_routers = [
    auth_router,
    users_router,
    products_router,
    cart_router,
]
