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
