from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "ITMS Dashboard"
    SECRET_KEY: str = "a_super_secret_jwt_key_that_should_be_in_env_file_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./itms.db"

    class Config:
        case_sensitive = True

settings = Settings()
