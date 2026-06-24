from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.models.challan import Challan, ChallanStatus
from app.models.camera import Camera, CameraStatus
from datetime import datetime

router = APIRouter()

@router.get("/dashboard")
def get_analytics_dashboard(db: Session = Depends(get_db)):
    # 1. Total Violations
    total_violations = db.query(Challan).count()
    
    # 2. Total Revenue
    total_revenue = db.query(func.sum(Challan.fine_amount)).filter(Challan.status == ChallanStatus.PAID).scalar() or 0
    
    # 3. Collection Rate
    paid_count = db.query(Challan).filter(Challan.status == ChallanStatus.PAID).count()
    collection_rate = (paid_count / total_violations * 100) if total_violations > 0 else 0
    
    # 4. Active Cameras
    active_cameras = db.query(Camera).filter(Camera.status == CameraStatus.LIVE).count()
    
    # 5. Violations Breakdown (Pie Chart)
    violation_counts = db.query(Challan.violation_type, func.count(Challan.id)).group_by(Challan.violation_type).all()
    violation_data = []
    color_map = {
        "Speeding": "#EF4444",
        "Red Light": "#F59E0B",
        "Wrong Way": "#10B981",
        "No Helmet": "#3B82F6",
        "Illegal Parking": "#8B5CF6",
    }
    for v_type, count in violation_counts:
        violation_data.append({
            "name": v_type,
            "value": count,
            "color": color_map.get(v_type, "#6B7280")
        })
        
    # 6. Revenue Collection (Bar Chart by Month)
    # SQLite strftime implementation
    revenue_by_month = db.query(
        func.strftime('%Y-%m', Challan.date_issued).label('month'),
        func.sum(Challan.fine_amount).label('revenue')
    ).filter(Challan.status == ChallanStatus.PAID).group_by('month').order_by('month').all()
    
    revenue_data = []
    for row in revenue_by_month:
        if row.month:
            dt = datetime.strptime(row.month, '%Y-%m')
            revenue_data.append({
                "month": dt.strftime('%b'),
                "revenue": row.revenue or 0
            })
            
    # If no revenue data exists, pad with some empty months to make chart look okay
    if not revenue_data:
        revenue_data = [{"month": "Jan", "revenue": 0}]
        
    # 7. Violation Hotspots (Table)
    hotspots = db.query(
        Camera.name,
        func.count(Challan.id).label('count')
    ).join(Challan, Challan.camera_id == Camera.id).group_by(Camera.name).order_by(func.count(Challan.id).desc()).limit(5).all()
    
    hotspots_data = [{"camera": h.name, "violations": h.count} for h in hotspots]
    
    # 8. Hourly Traffic (Mocked using db challans by hour)
    hourly_counts = db.query(
        func.strftime('%H', Challan.date_issued).label('hour'),
        func.count(Challan.id).label('count')
    ).group_by('hour').order_by('hour').all()
    
    hourly_data = []
    for i in range(24):
        hour_str = f"{i:02d}"
        count = next((h.count for h in hourly_counts if h.hour == hour_str), 0)
        # Multiply by a factor to simulate 'traffic volume' vs just 'violations'
        volume = count * 150 + 500  # Baseline 500 cars + 150 cars per violation caught
        hourly_data.append({
            "time": f"{hour_str}:00",
            "volume": volume
        })

    return {
        "kpis": {
            "totalRevenue": total_revenue,
            "totalViolations": total_violations,
            "collectionRate": round(collection_rate, 1),
            "activeCameras": active_cameras
        },
        "violationData": violation_data,
        "revenueData": revenue_data,
        "hotspotsData": hotspots_data,
        "hourlyData": hourly_data
    }
