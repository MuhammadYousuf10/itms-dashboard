import uuid
from sqlalchemy import Column, String
from app.db.database import Base

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(String, primary_key=True, default=lambda: f"VEH-{str(uuid.uuid4())[:8].upper()}", index=True)
    plate_number = Column(String, unique=True, index=True, nullable=False)
    chassis_number = Column(String, nullable=False) # Only last 5 digits are usually checked for verification
    owner_name = Column(String, nullable=False)
    owner_phone = Column(String, nullable=True)
