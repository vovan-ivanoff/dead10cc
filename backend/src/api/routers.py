from api.auth import router as auth_router
from api.files import router as files_router
from api.users import router as users_router

all_routers = [
    auth_router,
    users_router,
    files_router,
]
