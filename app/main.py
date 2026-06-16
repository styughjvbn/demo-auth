from fastapi import Cookie, Depends, FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

from app.auth import InvalidTokenError, create_temp_user, create_token, decode_token, user_from_payload
from app.config import Settings, get_settings


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=settings.app_name)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
    )

    @app.get("/healthz")
    def healthz() -> dict[str, str]:
        return {"status": "ok"}

    @app.post("/api/demo-login")
    def demo_login(response: Response, current_settings: Settings = Depends(get_settings)) -> dict[str, dict[str, str]]:
        user = create_temp_user()
        token = create_token(user, current_settings)
        response.set_cookie(
            key=current_settings.cookie_name,
            value=token,
            max_age=current_settings.token_ttl_seconds,
            httponly=True,
            secure=current_settings.cookie_secure,
            samesite=current_settings.cookie_samesite,
            domain=current_settings.cookie_domain,
            path="/",
        )
        return {"user": user}

    @app.get("/api/me")
    def me(
        demo_token: str | None = Cookie(default=None, alias=settings.cookie_name),
        current_settings: Settings = Depends(get_settings),
    ) -> dict[str, object]:
        if not demo_token:
            return {"loggedIn": False, "user": None}

        try:
            payload = decode_token(demo_token, current_settings)
        except InvalidTokenError:
            return {"loggedIn": False, "user": None}

        return {"loggedIn": True, "user": user_from_payload(payload)}

    @app.post("/api/logout")
    def logout(response: Response, current_settings: Settings = Depends(get_settings)) -> dict[str, bool]:
        response.delete_cookie(
            key=current_settings.cookie_name,
            domain=current_settings.cookie_domain,
            path="/",
            secure=current_settings.cookie_secure,
            httponly=True,
            samesite=current_settings.cookie_samesite,
        )
        return {"loggedIn": False}

    return app


app = create_app()

