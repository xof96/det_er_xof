"""GitHub integration: fetch curated repositories with an in-memory TTL cache.

Works without a token for public repositories (subject to GitHub's lower
unauthenticated rate limit); a ``GITHUB_TOKEN`` env var raises the limit. The
token is only ever read on the server and never exposed to the frontend.
"""
from __future__ import annotations

import time
from dataclasses import dataclass

import httpx

from ..config import get_settings
from ..schemas import GitHubRepo

GITHUB_API = "https://api.github.com"


@dataclass
class _CacheEntry:
    fetched_at: float
    repos: list[GitHubRepo]


class GitHubService:
    def __init__(self) -> None:
        self._cache: _CacheEntry | None = None

    def _headers(self) -> dict[str, str]:
        settings = get_settings()
        headers = {
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "personal-atlas",
        }
        if settings.github_token:
            headers["Authorization"] = f"Bearer {settings.github_token}"
        return headers

    def _cache_valid(self) -> bool:
        settings = get_settings()
        return (
            self._cache is not None
            and (time.time() - self._cache.fetched_at) < settings.github_cache_ttl
        )

    def clear_cache(self) -> None:
        self._cache = None

    @staticmethod
    def _to_repo(data: dict) -> GitHubRepo:
        return GitHubRepo(
            name=data.get("name", ""),
            full_name=data.get("full_name", ""),
            description=data.get("description"),
            url=data.get("html_url", ""),
            stars=data.get("stargazers_count", 0),
            forks=data.get("forks_count", 0),
            language=data.get("language"),
            updated_at=data.get("pushed_at") or data.get("updated_at"),
            topics=data.get("topics", []) or [],
        )

    async def get_repos(self, featured: list[str]) -> tuple[list[GitHubRepo], bool]:
        """Return (repos, cached). Fetches only the curated ``owner/name`` list."""
        if not featured:
            return [], False
        if self._cache_valid():
            return self._cache.repos, True  # type: ignore[union-attr]

        repos: list[GitHubRepo] = []
        async with httpx.AsyncClient(timeout=10.0, headers=self._headers()) as client:
            for full_name in featured:
                try:
                    resp = await client.get(f"{GITHUB_API}/repos/{full_name}")
                    if resp.status_code == 200:
                        repos.append(self._to_repo(resp.json()))
                    # Silently skip missing/failed repos so one bad entry
                    # doesn't break the whole strip.
                except httpx.HTTPError:
                    continue

        self._cache = _CacheEntry(fetched_at=time.time(), repos=repos)
        return repos, False


# Module-level singleton so the cache persists across requests.
github_service = GitHubService()
