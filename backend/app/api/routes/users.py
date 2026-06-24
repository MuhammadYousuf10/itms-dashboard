from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.user import User, UserRole
from app.schemas.user import User as UserSchema, UserUpdate, PaginatedUsers
from app.api.deps import get_current_user

router = APIRouter()

# Dependency to check if current user is ADMIN
def get_current_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return current_user

@router.get("/me", response_model=UserSchema)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Get the currently logged-in user.
    """
    return current_user

from app.schemas.user import UserSettingsUpdate
from app.core.security import verify_password, get_password_hash

@router.put("/me/settings", response_model=UserSchema)
def update_my_settings(
    settings_in: UserSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update own user settings.
    """
    # Verify password if user wants to change it
    if settings_in.new_password:
        if not settings_in.current_password or not verify_password(settings_in.current_password, current_user.hashed_password):
            raise HTTPException(status_code=400, detail="Incorrect current password")
        current_user.hashed_password = get_password_hash(settings_in.new_password)
        
    if settings_in.full_name is not None:
        current_user.full_name = settings_in.full_name
    if settings_in.email is not None:
        # Check if new email already exists
        if settings_in.email != current_user.email:
            existing = db.query(User).filter(User.email == settings_in.email).first()
            if existing:
                raise HTTPException(status_code=400, detail="Email already registered")
        current_user.email = settings_in.email
        
    if settings_in.settings is not None:
        # Merge settings so we don't overwrite everything if partial update
        current_settings = dict(current_user.settings or {})
        current_settings.update(settings_in.settings)
        current_user.settings = current_settings
        
    db.commit()
    db.refresh(current_user)
    return current_user

import os
import shutil
from fastapi import UploadFile, File

@router.post("/me/avatar", response_model=UserSchema)
def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Upload a new profile picture.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
        
    os.makedirs("uploads/avatars", exist_ok=True)
    
    file_ext = file.filename.split('.')[-1]
    filename = f"{current_user.id}.{file_ext}"
    filepath = f"uploads/avatars/{filename}"
    
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Update user settings with avatar url
    current_settings = dict(current_user.settings or {})
    current_settings['avatarUrl'] = f"http://localhost:8000/{filepath}"
    current_user.settings = current_settings
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/", response_model=PaginatedUsers)
def get_users(
    skip: int = 0,
    limit: int = 100,
    search: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    Retrieve all users. Only accessible by admins.
    """
    query = db.query(User)
    if search:
        query = query.filter(
            (User.email.ilike(f"%{search}%")) |
            (User.full_name.ilike(f"%{search}%")) |
            (User.id.ilike(f"%{search}%"))
        )
    total = query.count()
    items = query.offset(skip).limit(limit).all()
    return {"items": items, "total": total}

@router.patch("/{user_id}", response_model=UserSchema)
def update_user(
    user_id: str,
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    Update a user's role or active status.
    """
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot modify your own account status or role.")
        
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user_in.role is not None:
        user.role = user_in.role
    if user_in.is_active is not None:
        user.is_active = user_in.is_active
        
    db.commit()
    db.refresh(user)
    return user

@router.delete("/{user_id}")
def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """
    Delete a user.
    """
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account.")
        
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}
