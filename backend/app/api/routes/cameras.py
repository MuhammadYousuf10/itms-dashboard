from typing import List
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.camera import Camera
from app.schemas.camera import Camera as CameraSchema, CameraCreate, PaginatedCameras
from app.api.deps import get_current_user
from app.models.user import User

from fastapi.responses import StreamingResponse
from app.services.vision_service import generate_frames, stop_stream

router = APIRouter()

@router.get("/", response_model=PaginatedCameras)
def get_cameras(skip: int = 0, limit: int = 100, search: str = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Camera)
    if search:
        query = query.filter(
            (Camera.id.ilike(f"%{search}%")) |
            (Camera.name.ilike(f"%{search}%"))
        )
    total = query.count()
    items = query.offset(skip).limit(limit).all()
    return {"items": items, "total": total}

@router.get("/{camera_id}/stream")
def get_camera_stream(request: Request, camera_id: str, url: str = "0"):
    """
    Stream live video from the camera using OpenCV.
    Accepts an optional URL parameter for an IP camera, defaults to "0" (local webcam).
    """
    return StreamingResponse(
        generate_frames(request, camera_id, url), 
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@router.post("/{camera_id}/stop")
def stop_camera_endpoint(camera_id: str):
    """Explicitly stops the streaming loop for a camera"""
    stop_stream(camera_id)
    return {"status": "success", "message": f"Camera {camera_id} stopped"}

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
