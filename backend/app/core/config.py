import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "ITMS Dashboard"
    SECRET_KEY: str = "a_super_secret_jwt_key_that_should_be_in_env_file_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days

    # Can be overridden via environment variable (e.g., in api/index.py for Vercel /tmp)
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./itms.db"

    # Email Settings
    SMTP_HOST: str | None = None
    SMTP_PORT: int = 587
    SMTP_USER: str | None = None
    SMTP_PASSWORD: str | None = None

    class Config:
        case_sensitive = True
        env_file = ".env"
        env_file_encoding = "utf-8"
        # Environment variables take priority over .env file
        extra = "ignore"

settings = Settings()
