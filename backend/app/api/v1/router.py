from fastapi import APIRouter

from app.features.auth.router import auth_router
from app.features.metadata.router import metadata_router
from app.features.movies.router import movies_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(movies_router, prefix="/movies", tags=["movies"])
api_router.include_router(metadata_router, prefix="", tags=["metadata"])
