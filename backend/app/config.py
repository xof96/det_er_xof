"""Application configuration, loaded from environment variables / .env."""
from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# repo-root/content is the single source of truth shared with the frontend.
_REPO_ROOT = Path(__file__).resolve().parents[2]
_DEFAULT_CONTENT_DIR = _REPO_ROOT / "content"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # --- App ---
    app_name: str = "Personal Atlas API"
    debug: bool = False
    content_dir: Path = _DEFAULT_CONTENT_DIR

    # --- CORS (comma-separated origins) ---
    cors_origins: str = "http://localhost:5173,http://localhost:4173"

    # --- Database ---
    database_url: str = f"sqlite:///{_REPO_ROOT / 'backend' / 'atlas.db'}"

    # --- GitHub integration ---
    github_username: str = ""
    github_token: str = ""
    github_cache_ttl: int = 3600  # seconds

    # --- Contact / email (optional) ---
    contact_email: str = ""
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: str = ""
    smtp_use_tls: bool = True

    # --- Contact rate limiting ---
    contact_rate_limit: int = 5          # max submissions
    contact_rate_window: int = 3600      # per window (seconds), per IP
    contact_min_elapsed_ms: int = 1200   # reject near-instant submissions (bots)

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def email_enabled(self) -> bool:
        return bool(self.smtp_host and self.smtp_username and self.contact_email)


@lru_cache
def get_settings() -> Settings:
    return Settings()
