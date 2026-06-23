from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db.database import get_db
from app.models.vehicle import Vehicle
from app.models.challan import Challan, ChallanStatus
from app.schemas.challan import Challan as ChallanSchema
from app.core.security import create_access_token
from app.api.deps import get_current_citizen
from app.models.payment import Payment

router = APIRouter()

class VerifyRequest(BaseModel):
    plate_number: str
    chassis_last_5: str

class VerifyResponse(BaseModel):
    success: bool
    token: str
    vehicle_id: str
    owner_name: str

# In a real app, this would use JWT. For simulation, we just verify and return a simple token/flag.
@router.post("/verify", response_model=VerifyResponse)
def verify_citizen(data: VerifyRequest, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.plate_number == data.plate_number).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
        
    if vehicle.chassis_number[-5:] != data.chassis_last_5:
        raise HTTPException(status_code=400, detail="Invalid chassis number")
        
    # Generate a real JWT token
    access_token = create_access_token(data={"sub": vehicle.id, "type": "citizen"})
    
    return {
        "success": True,
        "token": access_token,
        "vehicle_id": vehicle.id,
        "owner_name": vehicle.owner_name
    }

@router.get("/challans/{plate_number}", response_model=List[ChallanSchema])
def get_citizen_challans(plate_number: str, db: Session = Depends(get_db), current_citizen: Vehicle = Depends(get_current_citizen)):
    if current_citizen.plate_number != plate_number:
        raise HTTPException(status_code=403, detail="Not authorized to view these challans")
    return db.query(Challan).filter(Challan.vehicle_plate == plate_number).order_by(Challan.date_issued.desc()).all()

class DisputeRequest(BaseModel):
    reason: str
    evidence_url: str | None = None

@router.post("/challans/{challan_id}/dispute", response_model=ChallanSchema)
def dispute_challan(challan_id: str, data: DisputeRequest, db: Session = Depends(get_db)):
    challan = db.query(Challan).filter(Challan.id == challan_id).first()
    if not challan:
        raise HTTPException(status_code=404, detail="Challan not found")
        
    if challan.status != ChallanStatus.PENDING:
        raise HTTPException(status_code=400, detail="Only pending challans can be disputed")
        
    challan.status = ChallanStatus.DISPUTED
    challan.dispute_reason = data.reason
    challan.dispute_evidence_url = data.evidence_url
    db.commit()
    db.refresh(challan)
    return challan

@router.post("/challans/{challan_id}/pay", response_model=ChallanSchema)
def pay_challan(challan_id: str, db: Session = Depends(get_db), current_citizen: Vehicle = Depends(get_current_citizen)):
    challan = db.query(Challan).filter(Challan.id == challan_id).first()
    if not challan:
        raise HTTPException(status_code=404, detail="Challan not found")
        
    if challan.vehicle_id != current_citizen.id and challan.vehicle_plate != current_citizen.plate_number:
        raise HTTPException(status_code=403, detail="Not authorized to pay this challan")
        
    if challan.status not in [ChallanStatus.PENDING, ChallanStatus.WARNING]:
        raise HTTPException(status_code=400, detail="Challan cannot be paid")
        
    challan.status = ChallanStatus.PAID
    
    # Record the payment
    payment = Payment(
        challan_id=challan.id,
        amount=challan.fine_amount
    )
    db.add(payment)
    db.commit()
    db.refresh(challan)
    return challan

from fastapi import File, UploadFile
import os
import shutil
import uuid

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_evidence(file: UploadFile = File(...)):
    # Generate unique filename to prevent overwrites
    file_extension = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": f"/uploads/{unique_filename}"}
