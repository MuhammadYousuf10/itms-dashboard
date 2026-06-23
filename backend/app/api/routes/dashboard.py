from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.challan import Challan
from app.models.camera import Camera

router = APIRouter()

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # 1. Total Challans Issued
    total_challans = db.query(func.count(Challan.id)).scalar() or 0
    
    # 2. Total Pending Violations (Unpaid Challans)
    pending_violations = db.query(func.count(Challan.id)).filter(Challan.status == "UNPAID").scalar() or 0
    
    # 3. Active Cameras (Dummy metric proxying for Total Vehicles for now)
    total_cameras = db.query(func.count(Camera.id)).scalar() or 0
    
    # 4. Recent Violations
    recent_challans = db.query(Challan).order_by(Challan.date_issued.desc()).limit(4).all()
    
    recent_violations = []
    for c in recent_challans:
        recent_violations.append({
            "id": c.id,
            "plate": c.vehicle_plate,
            "speed": f"{c.fine_amount / 10} km/h", # Proxy speed based on fine for demo
            "limit": "60",
            "time": c.date_issued.strftime("%H:%M") if c.date_issued else "Just now",
            "color": "error.main" if c.fine_amount > 1000 else "warning.main"
        })

    # 5. Simulated Chart Data (Hourly volume)
    chart_data = [
        {"time": "00:00", "volume": 120},
        {"time": "04:00", "volume": 80},
        {"time": "08:00", "volume": 450},
        {"time": "12:00", "volume": 320},
        {"time": "16:00", "volume": 580},
        {"time": "20:00", "volume": 210},
    ]

    # 6. Simulated Violation Types Breakdown
    violation_types = [
        {"name": "Speeding", "value": 45},
        {"name": "Red Light", "value": 25},
        {"name": "Illegal Parking", "value": 20},
        {"name": "No Helmet", "value": 10},
    ]

    # 7. Simulated System Health
    system_health = {
        "edgeTpu": 82, # percentage
        "cameraUptime": 98,
        "dbLatency": 45 # ms
    }

    # 8. Simulated Live Feeds
    live_feeds = [
        {"id": "CAM-01", "location": "Main Highway Junc", "status": "Active", "fps": 30},
        {"id": "CAM-02", "location": "Downtown Blvd", "status": "Active", "fps": 28},
        {"id": "CAM-03", "location": "Airport Road", "status": "Active", "fps": 30},
        {"id": "CAM-04", "location": "Industrial Park", "status": "Active", "fps": 31},
    ]

    # 9. Simulated Hotspots
    hotspots = [
        {"name": "Downtown Square", "intensity": 85},
        {"name": "Westside Mall", "intensity": 60},
        {"name": "Highway Exit 4", "intensity": 95},
    ]

    # 10. Quick Disputes Queue
    quick_disputes = [
        {"id": "CHL-9981", "plate": "XYZ-123", "reason": "Not my vehicle", "status": "PENDING"},
        {"id": "CHL-9982", "plate": "ABC-999", "reason": "Hospital emergency", "status": "PENDING"},
        {"id": "CHL-9983", "plate": "LMN-456", "reason": "Traffic light was broken", "status": "PENDING"},
    ]

    # 11. Revenue Forecast
    revenue_forecast = {
        "current": 450000,
        "target": 600000,
        "predicted": 620000
    }

    return {
        "totalVehicles": 12458 + (total_cameras * 100), # Simulated
        "avgSpeed": 64,
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
