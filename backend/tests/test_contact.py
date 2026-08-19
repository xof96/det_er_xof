from app.db import SessionLocal
from app.models import ContactMessage

VALID = {
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "message": "Hello, I really enjoyed exploring the atlas. Let's talk!",
}


def test_contact_valid_stores_message(client):
    resp = client.post("/api/contact", json=VALID)
    assert resp.status_code == 201
    body = resp.json()
    assert body["ok"] is True
    assert body["delivered"] is False  # no SMTP configured in tests

    with SessionLocal() as db:
        rows = db.query(ContactMessage).all()
        assert len(rows) == 1
        assert rows[0].email == "ada@example.com"


def test_contact_invalid_email(client):
    resp = client.post("/api/contact", json={**VALID, "email": "not-an-email"})
    assert resp.status_code == 422


def test_contact_message_too_short(client):
    resp = client.post("/api/contact", json={**VALID, "message": "hi"})
    assert resp.status_code == 422


def test_contact_honeypot_rejected(client):
    resp = client.post("/api/contact", json={**VALID, "website": "http://spam.example"})
    # Schema enforces an empty honeypot -> validation error.
    assert resp.status_code == 422


def test_contact_rate_limit(client):
    # Default limit is 5 per window.
    for _ in range(5):
        assert client.post("/api/contact", json=VALID).status_code == 201
    blocked = client.post("/api/contact", json=VALID)
    assert blocked.status_code == 429
