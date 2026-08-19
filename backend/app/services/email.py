"""Optional email delivery for contact messages via SMTP.

Delivery is fully optional: if SMTP is not configured, messages are still
validated and stored in the database, and ``send_contact_email`` reports that
nothing was delivered rather than raising.
"""
from __future__ import annotations

import smtplib
from email.message import EmailMessage

from ..config import get_settings


def send_contact_email(name: str, email: str, message: str) -> bool:
    """Send a contact message to the configured inbox. Returns True on success."""
    settings = get_settings()
    if not settings.email_enabled:
        return False

    msg = EmailMessage()
    msg["Subject"] = f"[Personal Atlas] Message from {name}"
    msg["From"] = settings.smtp_username
    msg["To"] = settings.contact_email
    msg["Reply-To"] = email
    msg.set_content(f"From: {name} <{email}>\n\n{message}")

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as server:
        if settings.smtp_use_tls:
            server.starttls()
        server.login(settings.smtp_username, settings.smtp_password)
        server.send_message(msg)
    return True
