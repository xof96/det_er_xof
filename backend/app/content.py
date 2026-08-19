"""Loads the shared repo-root content/ JSON — the single source of truth."""
from __future__ import annotations

import json
from pathlib import Path

from fastapi import HTTPException

from .config import get_settings


def _content_dir() -> Path:
    return get_settings().content_dir


def load(name: str) -> object:
    """Load and parse a content JSON file by base name (no extension)."""
    path = _content_dir() / f"{name}.json"
    if not path.exists():
        raise HTTPException(status_code=500, detail=f"Content file missing: {name}.json")
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def get_sections() -> list[dict]:
    return load("sections")


def get_projects() -> list[dict]:
    return load("projects")


def get_project(slug: str) -> dict | None:
    for project in get_projects():
        if project.get("slug") == slug:
            return project
    return None


def get_photography() -> dict:
    return load("photography")


def get_photography_collection(slug: str) -> dict | None:
    data = get_photography()
    for collection in data.get("collections", []):
        if collection.get("slug") == slug:
            return collection
    return None


def get_github_featured() -> list[str]:
    data = load("github")
    return list(data.get("featured", []))
