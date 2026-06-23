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
