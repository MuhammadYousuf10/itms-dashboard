import uuid
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(String, primary_key=True, default=lambda: f"PAY-{str(uuid.uuid4())[:8].upper()}", index=True)
    challan_id = Column(String, ForeignKey("challans.id"), nullable=False)
    amount = Column(Float, nullable=False)
    payment_method = Column(String, default="CREDIT_CARD")
    status = Column(String, default="COMPLETED")
    date_paid = Column(DateTime, default=datetime.utcnow)

    challan = relationship("Challan")
