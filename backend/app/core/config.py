from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configurações carregadas de variáveis de ambiente ou do arquivo .env."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    project_name: str = "RocketLab API"
    project_version: str = "2026.2"
    environment: str = "local"
    api_v1_prefix: str = "/api/v1"
    database_url: str = "sqlite+aiosqlite:///./rocketlab.db"
    backend_cors_origins: list[str] = ["http://localhost:5173"]
    log_level: str = "INFO"

    # Autenticação e Segurança (JWT)
    jwt_secret_key: str = "rocketfilms-super-secret-jwt-key-2026-visagio-cinema"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 1440  # 24 horas

    # Credenciais do Administrador Padrão
    admin_email: str = "admin@rocketfilms.com"
    admin_password: str = "admin123"
    admin_name: str = "Miguel Batista AKA Dono do Pedaço"


@lru_cache
def get_settings() -> Settings:
    return Settings()
