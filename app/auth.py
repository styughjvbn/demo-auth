from __future__ import annotations

import time
import uuid
from typing import Any

import jwt

from app.config import Settings


class InvalidTokenError(ValueError):
    pass


def create_temp_user() -> dict[str, str]:
    suffix = uuid.uuid4().hex[:8]
    return {
        "id": f"temp-user-{suffix}",
        "nickname": f"tempUser-{suffix}",
        "role": "DEMO",
    }


def create_token(user: dict[str, str], settings: Settings) -> str:
    now = int(time.time())
    payload: dict[str, Any] = {
        "sub": user["id"],
        "nickname": user["nickname"],
        "role": user["role"],
        "type": "DEMO_USER",
        "iat": now,
        "exp": now + settings.token_ttl_seconds,
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_token(token: str, settings: Settings) -> dict[str, Any]:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except jwt.PyJWTError as exc:
        raise InvalidTokenError("invalid demo token") from exc

    if payload.get("type") != "DEMO_USER" or payload.get("role") != "DEMO":
        raise InvalidTokenError("invalid demo user token")

    subject = payload.get("sub")
    nickname = payload.get("nickname")
    if not isinstance(subject, str) or not isinstance(nickname, str):
        raise InvalidTokenError("missing user claims")

    return payload


def user_from_payload(payload: dict[str, Any]) -> dict[str, str]:
    return {
        "id": str(payload["sub"]),
        "nickname": str(payload["nickname"]),
        "role": str(payload["role"]),
    }

