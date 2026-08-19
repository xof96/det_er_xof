from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from ..config import get_settings
from ..db import get_db
from ..models import ContactMessage
from ..schemas import ContactRequest, ContactResponse
from ..services.email import send_contact_email
from ..services.ratelimit import RateLimiter

router = APIRouter(tags=["contact"])

_settings = get_settings()
_limiter = RateLimiter(_settings.contact_rate_limit, _settings.contact_rate_window)


def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


@router.post("/contact", response_model=ContactResponse, status_code=201)
def submit_contact(
    payload: ContactRequest,
    request: Request,
    db: Session = Depends(get_db),
) -> ContactResponse:
    settings = get_settings()

    # Honeypot is enforced by the schema (max_length=0), but double-check.
    if payload.website:
        raise HTTPException(status_code=400, detail="Invalid submission.")

    # Reject near-instant submissions when the client reports timing.
    if 0 < payload.elapsed_ms < settings.contact_min_elapsed_ms:
        raise HTTPException(status_code=400, detail="Submission was too fast.")

    ip = _client_ip(request)
    if not _limiter.allow(ip):
        raise HTTPException(
            status_code=429,
            detail="Too many messages. Please try again later.",
        )

    record = ContactMessage(
        name=payload.name.strip(),
        email=str(payload.email).strip(),
        message=payload.message.strip(),
        ip=ip,
    )

    delivered = False
    try:
        delivered = send_contact_email(record.name, record.email, record.message)
    except Exception:  # noqa: BLE001 — delivery is best-effort; storage is source of truth
        delivered = False

    record.delivered = delivered
    db.add(record)
    db.commit()

    return ContactResponse(ok=True, delivered=delivered, message="Message received.")
