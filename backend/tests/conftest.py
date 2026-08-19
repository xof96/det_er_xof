"""Shared pytest fixtures: an isolated app + client backed by a temp SQLite db."""
from __future__ import annotations

import os
import tempfile
from collections.abc import Iterator

import pytest

# Configure the environment BEFORE importing the app so settings pick it up.
_TMP_DB = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
_TMP_DB.close()
os.environ["DATABASE_URL"] = f"sqlite:///{_TMP_DB.name}"
os.environ["GITHUB_TOKEN"] = ""
os.environ["CONTACT_MIN_ELAPSED_MS"] = "0"  # disable timing gate in most tests

from fastapi.testclient import TestClient  # noqa: E402

from app.config import get_settings  # noqa: E402
from app.db import Base, engine, init_db  # noqa: E402
from app.main import app  # noqa: E402
from app.routers.contact import _limiter  # noqa: E402
from app.services.github import github_service  # noqa: E402


@pytest.fixture(autouse=True)
def _reset_state() -> Iterator[None]:
    get_settings.cache_clear()
    Base.metadata.drop_all(bind=engine)
    init_db()
    _limiter.reset()
    github_service.clear_cache()
    yield


@pytest.fixture
def client() -> Iterator[TestClient]:
    with TestClient(app) as c:
        yield c
