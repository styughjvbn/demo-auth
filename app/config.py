from functools import lru_cache
import json

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "demo-auth"
    jwt_secret: str = Field(default="change-me-in-kubernetes", alias="JWT_SECRET")
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    cookie_name: str = Field(default="DEMO_TOKEN", alias="COOKIE_NAME")
    cookie_domain: str = Field(default=".sjw-project.site", alias="COOKIE_DOMAIN")
    cookie_secure: bool = Field(default=True, alias="COOKIE_SECURE")
    cookie_samesite: str = Field(default="lax", alias="COOKIE_SAMESITE")
    token_ttl_seconds: int = Field(default=86_400, alias="TOKEN_TTL_SECONDS")
    allowed_origins: str = Field(
        default="https://auth.sjw-project.site,https://coco.sjw-project.site",
        alias="ALLOWED_ORIGINS",
    )
    demo_projects: str = Field(
        default='[{"name":"COCO","url":"https://coco.sjw-project.site"}]',
        alias="DEMO_PROJECTS",
    )

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]

    @property
    def projects(self) -> list[dict[str, str]]:
        try:
            parsed = json.loads(self.demo_projects)
        except json.JSONDecodeError:
            return []

        if not isinstance(parsed, list):
            return []

        projects: list[dict[str, str]] = []
        for project in parsed:
            if not isinstance(project, dict):
                continue

            name = project.get("name")
            url = project.get("url")
            if isinstance(name, str) and isinstance(url, str) and name and url:
                projects.append({"name": name, "url": url})

        return projects


@lru_cache
def get_settings() -> Settings:
    return Settings()
