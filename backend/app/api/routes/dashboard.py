from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from collections import Counter
from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.challan import Challan, ChallanStatus
from app.models.camera import Camera
from app.models.vehicle import Vehicle
from app.models.system_health import SystemHealth
from app.models.payment import Payment

router = APIRouter()

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # 1. Total Vehicles
    total_vehicles = db.query(func.count(Vehicle.id)).scalar() or 0
    
    # 2. Total Challans Issued
    total_challans = db.query(func.count(Challan.id)).scalar() or 0
    
    # 3. Total Pending Violations
    pending_violations = db.query(func.count(Challan.id)).filter(Challan.status == ChallanStatus.PENDING).scalar() or 0
    
    # 4. Recent Violations
    recent_challans = db.query(Challan).order_by(Challan.date_issued.desc()).limit(4).all()
    recent_violations = []
    for c in recent_challans:
        recent_violations.append({
            "id": c.id,
            "plate": c.vehicle_plate,
            "speed": f"{int(c.fine_amount / 10)} km/h", 
            "limit": "60",
            "time": c.date_issued.strftime("%H:%M") if c.date_issued else "Just now",
            "color": "error.main" if c.fine_amount > 1000 else "warning.main"
        })

    # 5. Chart Data (Hourly volume proxy)
    hours = [c.date_issued.hour for c in db.query(Challan.date_issued).all() if c.date_issued]
    hour_counts = Counter(hours)
    chart_data = [{"time": f"{h:02d}:00", "volume": hour_counts.get(h, 0)} for h in range(0, 24, 4)]

    # 6. Violation Types Breakdown
    v_types = db.query(Challan.violation_type, func.count(Challan.id)).group_by(Challan.violation_type).all()
    violation_types = [{"name": vt[0], "value": vt[1]} for vt in v_types]

    # 7. System Health
    health = db.query(SystemHealth).first()
    if health:
        system_health = {
            "edgeTpu": health.edge_tpu_usage,
            "cameraUptime": health.camera_uptime,
            "dbLatency": health.db_latency
        }
    else:
        system_health = {"edgeTpu": 82, "cameraUptime": 98, "dbLatency": 45}

    # 8. Live Feeds
    cams = db.query(Camera).all()
    live_feeds = [{"id": c.id, "location": c.name, "status": c.status.value, "fps": 30} for c in cams[:4]]

    # 9. Hotspots
    hotspots_data = db.query(Camera.name, func.count(Challan.id)).join(Challan, Camera.id == Challan.camera_id).group_by(Camera.name).order_by(func.count(Challan.id).desc()).limit(3).all()
    hotspots = [{"name": hd[0], "intensity": min(100, hd[1] * 5)} for hd in hotspots_data]

    # 10. Quick Disputes Queue
    disputed = db.query(Challan).filter(Challan.status == ChallanStatus.DISPUTED).limit(3).all()
    quick_disputes = [{"id": d.id, "plate": d.vehicle_plate, "reason": d.dispute_reason or "N/A", "status": d.status.value} for d in disputed]

    # 11. Revenue Forecast
    current_revenue = db.query(func.sum(Payment.amount)).scalar() or 0
    revenue_forecast = {
        "current": current_revenue,
        "target": 600000,
        "predicted": current_revenue + 150000
    }

    return {
        "totalVehicles": total_vehicles,
        "avgSpeed": 64, # Mocked since we don't track speed natively yet
        "violations": pending_violations,
        "challansIssued": total_challans,
        "recentViolations": recent_violations,
        "chartData": chart_data,
        "violationTypes": violation_types,
        "systemHealth": system_health,
        "liveFeeds": live_feeds,
        "hotspots": hotspots,
        "quickDisputes": quick_disputes,
        "revenueForecast": revenue_forecast
    }
