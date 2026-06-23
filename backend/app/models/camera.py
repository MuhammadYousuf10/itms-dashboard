from sqlalchemy import Column, String, Enum
import enum
from app.db.database import Base

class CameraStatus(str, enum.Enum):
    LIVE = "LIVE"
    OFFLINE = "OFFLINE"

class CongestionLevel(str, enum.Enum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"

class Camera(Base):
    __tablename__ = "cameras"

    id = Column(String, primary_key=True, index=True) # e.g. CAM-01
    name = Column(String, nullable=False)
    status = Column(Enum(CameraStatus), default=CameraStatus.LIVE, nullable=False)
    congestion_level = Column(Enum(CongestionLevel), default=CongestionLevel.LOW, nullable=False)
