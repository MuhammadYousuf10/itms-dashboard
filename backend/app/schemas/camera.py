from pydantic import BaseModel
from typing import Optional
from app.models.camera import CameraStatus, CongestionLevel

class CameraBase(BaseModel):
    name: str
    status: CameraStatus = CameraStatus.LIVE
    congestion_level: CongestionLevel = CongestionLevel.LOW
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class CameraCreate(CameraBase):
    id: str # Allow manually setting camera ID like CAM-01

class Camera(CameraBase):
    id: str

    class Config:
        from_attributes = True
