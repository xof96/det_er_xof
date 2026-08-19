import httpx
import respx

from app import content


def _repo_payload(name: str) -> dict:
    return {
        "name": name,
        "full_name": f"octocat/{name}",
        "description": "A demo repo",
        "html_url": f"https://github.com/octocat/{name}",
        "stargazers_count": 42,
        "forks_count": 7,
        "language": "Python",
        "pushed_at": "2026-01-01T00:00:00Z",
        "topics": ["demo", "atlas"],
    }


def test_github_empty_featured(client, monkeypatch):
    monkeypatch.setattr(content, "get_github_featured", lambda: [])
    resp = client.get("/api/github/repos")
    assert resp.status_code == 200
    assert resp.json() == {"repos": [], "cached": False}


@respx.mock
def test_github_fetch_and_cache(client, monkeypatch):
    monkeypatch.setattr(content, "get_github_featured", lambda: ["octocat/hello"])
    route = respx.get("https://api.github.com/repos/octocat/hello").mock(
        return_value=httpx.Response(200, json=_repo_payload("hello"))
    )

    first = client.get("/api/github/repos").json()
    assert first["cached"] is False
    assert len(first["repos"]) == 1
    repo = first["repos"][0]
    assert repo["name"] == "hello"
    assert repo["stars"] == 42
    assert repo["language"] == "Python"
    assert "demo" in repo["topics"]

    # Second call should be served from cache (no extra HTTP request).
    second = client.get("/api/github/repos").json()
    assert second["cached"] is True
    assert route.call_count == 1


@respx.mock
def test_github_skips_failed_repo(client, monkeypatch):
    monkeypatch.setattr(content, "get_github_featured", lambda: ["octocat/missing", "octocat/ok"])
    respx.get("https://api.github.com/repos/octocat/missing").mock(
        return_value=httpx.Response(404)
    )
    respx.get("https://api.github.com/repos/octocat/ok").mock(
        return_value=httpx.Response(200, json=_repo_payload("ok"))
    )
    body = client.get("/api/github/repos").json()
    assert [r["name"] for r in body["repos"]] == ["ok"]
