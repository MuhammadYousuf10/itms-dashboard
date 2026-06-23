import uuid
from sqlalchemy import Column, String, Float, Enum, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.db.database import Base

class ChallanStatus(str, enum.Enum):
    PENDING = "PENDING"
    PAID = "PAID"

class Challan(Base):
    __tablename__ = "challans"

    id = Column(String, primary_key=True, default=lambda: f"CH-{str(uuid.uuid4())[:8].upper()}", index=True)
    vehicle_plate = Column(String, nullable=False, index=True)
    violation_type = Column(String, nullable=False)
    fine_amount = Column(Float, nullable=False)
    status = Column(Enum(ChallanStatus), default=ChallanStatus.PENDING, nullable=False)
    
    camera_id = Column(String, ForeignKey("cameras.id"), nullable=False)
    date_issued = Column(DateTime, default=datetime.utcnow, nullable=False)

    camera = relationship("Camera")
