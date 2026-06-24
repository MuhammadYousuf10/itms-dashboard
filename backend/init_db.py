from app.db.database import engine, Base
from app.models import user, camera, challan
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.core.security import get_password_hash

def init_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

    db = SessionLocal()
    
    # Check if default system admin exists
    admin = db.query(user.User).filter(user.User.email == "admin@itms.gov").first()
    if not admin:
        print("Creating default system admin user...")
        admin = user.User(
            email="admin@itms.gov",
            hashed_password=get_password_hash("admin123"),
            full_name="System Administrator",
            role=user.UserRole.ADMIN
        )
        db.add(admin)
        db.commit()

    # Check if personal admin exists
    personal_admin = db.query(user.User).filter(user.User.email == "m.yousufuddin10@gmail.com").first()
    if not personal_admin:
        print("Creating personal admin user...")
        personal_admin = user.User(
            email="m.yousufuddin10@gmail.com",
            hashed_password=get_password_hash("asdqwe123"),
            full_name="Muhammad Yousuf",
            role=user.UserRole.ADMIN
        )
        db.add(personal_admin)
        db.commit()

    # Create dummy cameras
    cam1 = db.query(camera.Camera).filter(camera.Camera.id == "CAM-01").first()
    if not cam1:
        print("Creating default cameras...")
        cameras = [
            camera.Camera(id="CAM-01", name="Highway 1 North", status=camera.CameraStatus.LIVE, congestion_level=camera.CongestionLevel.HIGH, latitude=40.7128, longitude=-74.0060),
            camera.Camera(id="CAM-02", name="City Center Junction", status=camera.CameraStatus.LIVE, congestion_level=camera.CongestionLevel.MODERATE, latitude=40.7580, longitude=-73.9855),
            camera.Camera(id="CAM-04", name="East Toll Plaza", status=camera.CameraStatus.OFFLINE, congestion_level=camera.CongestionLevel.LOW, latitude=40.7829, longitude=-73.9654),
        ]
        db.add_all(cameras)
        db.commit()

    db.close()
    print("Database initialization complete.")

if __name__ == "__main__":
    init_db()
