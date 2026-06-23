from sqlalchemy import Column, String, Float, DateTime
from datetime import datetime
import uuid
from app.db.database import Base

class SystemHealth(Base):
    __tablename__ = "system_health"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    edge_tpu_usage = Column(Float, default=0.0)
    camera_uptime = Column(Float, default=0.0)
    db_latency = Column(Float, default=0.0)
    last_updated = Column(DateTime, default=datetime.utcnow)
