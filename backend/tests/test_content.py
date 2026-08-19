def test_sections_list(client):
    resp = client.get("/api/sections")
    assert resp.status_code == 200
    sections = resp.json()
    assert len(sections) == 10
    slugs = {s["slug"] for s in sections}
    assert {"projects", "photography", "contact"} <= slugs
    # Every section carries an atmosphere for the reactive background.
    assert all("atmosphere" in s and "accent" in s["atmosphere"] for s in sections)


def test_projects_list_and_detail(client):
    resp = client.get("/api/projects")
    assert resp.status_code == 200
    projects = resp.json()
    assert any(p["slug"] == "redactame" for p in projects)

    detail = client.get("/api/projects/redactame")
    assert detail.status_code == 200
    assert detail.json()["title"] == "Redactame"


def test_project_not_found(client):
    resp = client.get("/api/projects/does-not-exist")
    assert resp.status_code == 404


def test_photography_and_collection(client):
    resp = client.get("/api/photography")
    assert resp.status_code == 200
    data = resp.json()
    assert "collections" in data
    first = data["collections"][0]["slug"]

    coll = client.get(f"/api/photography/{first}")
    assert coll.status_code == 200
    assert coll.json()["slug"] == first

    missing = client.get("/api/photography/nope")
    assert missing.status_code == 404
