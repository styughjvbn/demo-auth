from fastapi.testclient import TestClient

from app.config import get_settings
from app.main import app


def test_me_returns_logged_out_without_cookie() -> None:
    client = TestClient(app)

    response = client.get("/api/me")

    assert response.status_code == 200
    assert response.json() == {"loggedIn": False, "user": None}


def test_projects_returns_configured_demo_projects() -> None:
    client = TestClient(app)

    response = client.get("/api/projects")

    assert response.status_code == 200
    assert response.json() == {
        "projects": [
            {"name": "COCO", "url": "https://coco.sjw-project.site"},
        ],
    }


def test_demo_login_sets_cookie_and_me_returns_user() -> None:
    client = TestClient(app, base_url="https://auth.sjw-project.site")
    settings = get_settings()

    login_response = client.post("/api/demo-login")

    assert login_response.status_code == 200
    user = login_response.json()["user"]
    assert user["id"].startswith("temp-user-")
    assert user["nickname"].startswith("tempUser-")
    assert user["role"] == "DEMO"
    assert settings.cookie_name in login_response.cookies

    me_response = client.get("/api/me")

    assert me_response.status_code == 200
    assert me_response.json() == {"loggedIn": True, "user": user}


def test_logout_expires_cookie() -> None:
    client = TestClient(app, base_url="https://auth.sjw-project.site")

    client.post("/api/demo-login")
    logout_response = client.post("/api/logout")
    me_response = client.get("/api/me")

    assert logout_response.status_code == 200
    assert logout_response.json() == {"loggedIn": False}
    assert me_response.json() == {"loggedIn": False, "user": None}


def test_cors_allows_configured_origin_with_credentials() -> None:
    client = TestClient(app)

    response = client.options(
        "/api/me",
        headers={
            "Origin": "https://coco.sjw-project.site",
            "Access-Control-Request-Method": "GET",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "https://coco.sjw-project.site"
    assert response.headers["access-control-allow-credentials"] == "true"
