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
    cancellation_reason: str | None = None
    dispute_reason: str | None = None
    dispute_evidence_url: str | None = None
    vehicle_id: str | None = None

    class Config:
        from_attributes = True
