from pydantic import BaseModel, EmailStr
from app.models.user import UserRole

# Shared properties
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.OPERATOR
    is_active: bool = True

# Properties to receive on creation
class UserCreate(UserBase):
    password: str

# Properties for updates by admin
class UserUpdate(BaseModel):
    role: UserRole | None = None
    is_active: bool | None = None

# Properties for updates by user themselves
class UserSettingsUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None
    settings: dict | None = None
    current_password: str | None = None
    new_password: str | None = None

# Properties to return to client
class User(UserBase):
    id: str
    settings: dict = {}

    class Config:
        from_attributes = True

# Token Response
class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

from typing import List

class PaginatedUsers(BaseModel):
    items: List[User]
    total: int
