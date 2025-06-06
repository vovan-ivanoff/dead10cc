from api.auth import router as auth_router
from api.cart import router as cart_router
from api.phone_auth import router as phone_auth_router
from api.products import router as products_router
from api.recommendations import router as recommendation_router
from api.users import router as users_router

all_routers = [
    auth_router,
    phone_auth_router,
    users_router,
    products_router,
    cart_router,
    recommendation_router,
]