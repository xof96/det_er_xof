from fastapi import APIRouter, HTTPException

from .. import content

router = APIRouter(tags=["photography"])


@router.get("/photography")
def get_photography() -> dict:
    return content.get_photography()


@router.get("/photography/{collection}")
def get_collection(collection: str) -> dict:
    found = content.get_photography_collection(collection)
    if found is None:
        raise HTTPException(status_code=404, detail="Collection not found")
    return found
