from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.camera import Camera
from app.schemas.camera import Camera as CameraSchema, CameraCreate
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[CameraSchema])
def get_cameras(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Camera).all()

@router.post("/", response_model=CameraSchema)
def create_camera(camera_in: CameraCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_camera = db.query(Camera).filter(Camera.id == camera_in.id).first()
    if db_camera:
        raise HTTPException(status_code=400, detail="Camera with this ID already exists")
    
    new_camera = Camera(
        id=camera_in.id,
        name=camera_in.name,
        status=camera_in.status,
        congestion_level=camera_in.congestion_level
    )
    db.add(new_camera)
    db.commit()
    db.refresh(new_camera)
    return new_camera

@router.get("/{camera_id}", response_model=CameraSchema)
def get_camera(camera_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    camera = db.query(Camera).filter(Camera.id == camera_id).first()
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    return camera
