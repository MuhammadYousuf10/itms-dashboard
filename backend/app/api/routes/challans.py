from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.challan import Challan
from app.schemas.challan import Challan as ChallanSchema, ChallanCreate
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[ChallanSchema])
def get_challans(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Challan).order_by(Challan.date_issued.desc()).offset(skip).limit(limit).all()

@router.post("/", response_model=ChallanSchema)
def create_challan(challan_in: ChallanCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_challan = Challan(
        vehicle_plate=challan_in.vehicle_plate,
        violation_type=challan_in.violation_type,
        fine_amount=challan_in.fine_amount,
        camera_id=challan_in.camera_id,
        status=challan_in.status
    )
    db.add(new_challan)
    db.commit()
    db.refresh(new_challan)
    return new_challan

@router.patch("/{challan_id}/pay", response_model=ChallanSchema)
def mark_challan_paid(challan_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    challan = db.query(Challan).filter(Challan.id == challan_id).first()
    if not challan:
        raise HTTPException(status_code=404, detail="Challan not found")
    
    from app.models.challan import ChallanStatus
    challan.status = ChallanStatus.PAID
    db.commit()
    db.refresh(challan)
    return challan

from pydantic import BaseModel

class StatusUpdate(BaseModel):
    status: str

@router.patch("/{challan_id}/status", response_model=ChallanSchema)
def update_challan_status(
    challan_id: str, 
    status_update: StatusUpdate,
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if current_user.role.value != "ADMIN":
        raise HTTPException(status_code=403, detail="Only admins can update challan status arbitrarily.")
        
    challan = db.query(Challan).filter(Challan.id == challan_id).first()
    if not challan:
        raise HTTPException(status_code=404, detail="Challan not found")
        
    from app.models.challan import ChallanStatus
    try:
        new_status = ChallanStatus(status_update.status)
        challan.status = new_status
        db.commit()
        db.refresh(challan)
        return challan
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid status")

@router.delete("/{challan_id}")
def delete_challan(
    challan_id: str, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if current_user.role.value != "ADMIN":
        raise HTTPException(status_code=403, detail="Only admins can delete challans.")
        
    challan = db.query(Challan).filter(Challan.id == challan_id).first()
    if not challan:
        raise HTTPException(status_code=404, detail="Challan not found")
        
    db.delete(challan)
    db.commit()
class CancelRequest(BaseModel):
    reason: str

@router.post("/{challan_id}/request-cancel", response_model=ChallanSchema)
def request_cancellation(
    challan_id: str,
    request_data: CancelRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.value != "OPERATOR":
        raise HTTPException(status_code=403, detail="Only operators can request cancellations.")
        
    challan = db.query(Challan).filter(Challan.id == challan_id).first()
    if not challan:
        raise HTTPException(status_code=404, detail="Challan not found")
        
    from app.models.challan import ChallanStatus
    if challan.status != ChallanStatus.PENDING:
        raise HTTPException(status_code=400, detail="Only pending challans can be cancelled.")
        
    challan.status = ChallanStatus.CANCELLATION_REQUESTED
    challan.cancellation_reason = request_data.reason
    db.commit()
    db.refresh(challan)
    return challan

@router.post("/{challan_id}/approve-cancel", response_model=ChallanSchema)
def approve_cancellation(
    challan_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.value != "ADMIN":
        raise HTTPException(status_code=403, detail="Only admins can approve cancellations.")
        
    challan = db.query(Challan).filter(Challan.id == challan_id).first()
    if not challan:
        raise HTTPException(status_code=404, detail="Challan not found")
        
    from app.models.challan import ChallanStatus
    if challan.status not in [ChallanStatus.CANCELLATION_REQUESTED, ChallanStatus.DISPUTED]:
        raise HTTPException(status_code=400, detail="Challan is not pending cancellation or dispute.")
        
    challan.status = ChallanStatus.CANCELLED
    db.commit()
    db.refresh(challan)
    return challan

@router.post("/{challan_id}/reject-cancel", response_model=ChallanSchema)
def reject_cancellation(
    challan_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.value != "ADMIN":
        raise HTTPException(status_code=403, detail="Only admins can reject cancellations.")
        
    challan = db.query(Challan).filter(Challan.id == challan_id).first()
    if not challan:
        raise HTTPException(status_code=404, detail="Challan not found")
        
    from app.models.challan import ChallanStatus
    if challan.status not in [ChallanStatus.CANCELLATION_REQUESTED, ChallanStatus.DISPUTED]:
        raise HTTPException(status_code=400, detail="Challan is not pending cancellation or dispute.")
        
    challan.status = ChallanStatus.PENDING
    challan.cancellation_reason = None
    challan.dispute_reason = None
    db.commit()
    db.refresh(challan)
    return challan
