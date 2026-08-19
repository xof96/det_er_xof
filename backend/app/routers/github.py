from fastapi import APIRouter

from .. import content
from ..schemas import GitHubReposResponse
from ..services.github import github_service

router = APIRouter(tags=["github"])


@router.get("/github/repos", response_model=GitHubReposResponse)
async def github_repos() -> GitHubReposResponse:
    """Curated GitHub repositories, enriched with live data and cached."""
    featured = content.get_github_featured()
    repos, cached = await github_service.get_repos(featured)
    return GitHubReposResponse(repos=repos, cached=cached)
