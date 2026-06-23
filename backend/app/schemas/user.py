from pydantic import BaseModel, EmailStr
from app.models.user import UserRole

# Shared properties
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.OPERATOR

# Properties to receive on creation
class UserCreate(UserBase):
    password: str

# Properties to return to client
class User(UserBase):
    id: str

    class Config:
        from_attributes = True

# Token Response
class Token(BaseModel):
    access_token: str
    token_type: str
    user: User
