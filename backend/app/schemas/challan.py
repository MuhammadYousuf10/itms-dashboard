from pydantic import BaseModel
from datetime import datetime
from app.models.challan import ChallanStatus

class ChallanBase(BaseModel):
    vehicle_plate: str
    violation_type: str
    fine_amount: float
    camera_id: str
    status: ChallanStatus = ChallanStatus.PENDING

class ChallanCreate(ChallanBase):
    pass

class Challan(ChallanBase):
    id: str
    date_issued: datetime

    class Config:
        from_attributes = True
