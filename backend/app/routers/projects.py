from fastapi import APIRouter, HTTPException

from .. import content

router = APIRouter(tags=["projects"])


@router.get("/projects")
def list_projects() -> list[dict]:
    return content.get_projects()


@router.get("/projects/{slug}")
def get_project(slug: str) -> dict:
    project = content.get_project(slug)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project
