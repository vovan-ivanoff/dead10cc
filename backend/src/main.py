import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from api import health
from api.routers import all_routers

app = FastAPI(title="TootEvent")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://0.0.0.0:5500",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for router in all_routers:
    app.include_router(router, prefix="/api/v1")

app.include_router(health.router)

if __name__ == "__main__":
    uvicorn.run(app="main:app", reload=True, host="0.0.0.0", port=8080)
