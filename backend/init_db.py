from app.db.database import engine, Base
from app.models import user, camera, challan
from app.db.database import SessionLocal

# Pre-computed bcrypt hashes — avoids running expensive bcrypt on every cold start.
# Generated locally with: get_password_hash("<password>")
# To regenerate: python -c "from app.core.security import get_password_hash; print(get_password_hash('yourpassword'))"
_HASHES = {
    "admin123":      "$2b$12$dm.00BueskUuDmpvA.O9k.apbXa5/YeKepqSl.qMIZZRwQ7BR33Ua",
    "asdqwe123":     "$2b$12$i0bAUtG0tO3lqlMPoOVaJujmcbDGAiHYyXZXJq7Flf/s6y/MtX.p2",
    "operator123":   "$2b$12$5diMufp1EpgWyAtFvm2EOOvmfbg6t8YtMyNYewiaIgUTtXYlLI2Ty",
    "suspended123":  "$2b$12$sVfuDofvDll7xEUA2AkjOuT0CcM8/4dykbDxtZqhQI3Pbe8UHMnfC",
    "sara123":       "$2b$12$JVF.LFMir2ixnUSnCPU3junB/UhamxYQcOxjMYQEdHtu3CXiyX0pG",
    "testadmin123":  "$2b$12$1Eun8LT3yKW2LhEoPREzEOwyvv0YaUopAzaigBV5383nFUqSsaBS.",
}

def init_db():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully.")

    db = SessionLocal()

    # --- Admin accounts ---
    _seed_user(db,
        email="admin@itms.gov",
        hashed_password=_HASHES["admin123"],
        full_name="System Administrator",
        role=user.UserRole.ADMIN,
        is_active=True,
        upsert=False,
    )

    # Personal admin — always upsert to enforce correct credentials
    _seed_user(db,
        email="m.yousufuddin10@gmail.com",
        hashed_password=_HASHES["asdqwe123"],
        full_name="Muhammad Yousuf",
        role=user.UserRole.ADMIN,
        is_active=True,
        upsert=True,
    )

    # --- Test accounts ---
    test_accounts = [
        ("operator@itms.gov",      _HASHES["operator123"],  "Ali Hassan",     user.UserRole.OPERATOR, True),
        ("suspended@test.com",     _HASHES["suspended123"], "Suspended User", user.UserRole.OPERATOR, False),
        ("sara.operator@itms.gov", _HASHES["sara123"],      "Sara Khan",      user.UserRole.OPERATOR, True),
        ("test.admin@itms.gov",    _HASHES["testadmin123"], "Test Admin",     user.UserRole.ADMIN,    True),
    ]
    for email, hashed_pw, full_name, role, is_active in test_accounts:
        _seed_user(db, email=email, hashed_password=hashed_pw, full_name=full_name,
                   role=role, is_active=is_active, upsert=False)

    db.commit()

    # --- Cameras ---
    cam1 = db.query(camera.Camera).filter(camera.Camera.id == "CAM-01").first()
    if not cam1:
        print("Creating default cameras...")
        cameras = [
            camera.Camera(id="CAM-01", name="Highway 1 North",      status=camera.CameraStatus.LIVE,    congestion_level=camera.CongestionLevel.HIGH,     latitude=40.7128, longitude=-74.0060),
            camera.Camera(id="CAM-02", name="City Center Junction", status=camera.CameraStatus.LIVE,    congestion_level=camera.CongestionLevel.MODERATE, latitude=40.7580, longitude=-73.9855),
            camera.Camera(id="CAM-04", name="East Toll Plaza",      status=camera.CameraStatus.OFFLINE, congestion_level=camera.CongestionLevel.LOW,      latitude=40.7829, longitude=-73.9654),
        ]
        db.add_all(cameras)
        db.commit()

    db.close()
    print("Database initialization complete.")


def _seed_user(db, *, email, hashed_password, full_name, role, is_active, upsert=False):
    """Create a user if they don't exist. If upsert=True, also update existing record."""
    existing = db.query(user.User).filter(user.User.email == email).first()
    if not existing:
        print(f"Creating user: {email}")
        db.add(user.User(
            email=email,
            hashed_password=hashed_password,
            full_name=full_name,
            role=role,
            is_active=is_active,
        ))
    elif upsert:
        print(f"Updating user: {email}")
        existing.hashed_password = hashed_password
        existing.role = role
        existing.full_name = full_name
        existing.is_active = is_active


if __name__ == "__main__":
    init_db()
