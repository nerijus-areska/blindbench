from fastapi import APIRouter
from app.api.v1.endpoints import health, slm_endpoint

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(slm_endpoint.router, prefix="/slm", tags=["slm"])
