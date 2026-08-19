from fastapi import APIRouter

from .. import content

router = APIRouter(tags=["sections"])


@router.get("/sections")
def list_sections() -> list[dict]:
    """The ordered list of portfolio sections (single source of truth)."""
    return content.get_sections()
