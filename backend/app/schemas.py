"""Pydantic request/response schemas."""
from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field


class HealthResponse(BaseModel):
    status: str = "ok"
    service: str
    version: str


class ContactRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    message: str = Field(min_length=10, max_length=2000)
    # Honeypot: must stay empty. Bots that fill every field get caught.
    website: str = Field(default="", max_length=0)
    elapsed_ms: int = Field(default=0, ge=0)


class ContactResponse(BaseModel):
    ok: bool = True
    delivered: bool = False
    message: str = "Message received."


class GitHubRepo(BaseModel):
    name: str
    full_name: str
    description: str | None = None
    url: str
    stars: int = 0
    forks: int = 0
    language: str | None = None
    updated_at: str | None = None
    topics: list[str] = Field(default_factory=list)


class GitHubReposResponse(BaseModel):
    repos: list[GitHubRepo] = Field(default_factory=list)
    cached: bool = False
