from fastapi import APIRouter

from app.features.auth.router import auth_router
from app.features.metadata.router import metadata_router
from app.features.movies.router import movies_router
from app.features.people.router import people_router
from app.features.reviews.router import reviews_router
from app.features.user_library.router import user_library_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(user_library_router, prefix="/user", tags=["user_library"])
api_router.include_router(reviews_router, prefix="/movies", tags=["reviews"])
api_router.include_router(movies_router, prefix="/movies", tags=["movies"])
api_router.include_router(people_router, prefix="/people", tags=["people"])
api_router.include_router(metadata_router, prefix="", tags=["metadata"])

