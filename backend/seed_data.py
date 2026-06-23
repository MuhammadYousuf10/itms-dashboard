import random
from datetime import datetime, timedelta
from app.db.database import engine, Base, SessionLocal
from app.models import user, camera, challan, vehicle, system_health, payment

def seed_db():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Seed SystemHealth
    print("Seeding System Health...")
    health = db.query(system_health.SystemHealth).first()
    if not health:
        health = system_health.SystemHealth(
            edge_tpu_usage=82.5,
            camera_uptime=98.2,
            db_latency=45.0
        )
        db.add(health)
        db.commit()

    # Vehicles (From the TESTING_CREDENTIALS)
    print("Seeding Vehicles...")
    citizens = [
        ("ABC-1234", "12345", "John Doe"),
        ("XYZ-9999", "67890", "Alice Smith"),
        ("LMN-4567", "11223", "Bob Johnson"),
        ("QWE-1111", "99887", "Charlie Brown")
    ]
    db_vehicles = []
    for plate, chassis, owner in citizens:
        v = db.query(vehicle.Vehicle).filter(vehicle.Vehicle.plate_number == plate).first()
        if not v:
            v = vehicle.Vehicle(
                plate_number=plate,
                chassis_number=f"VIN0000000{chassis}",
                owner_name=owner,
                owner_phone=f"contact_{plate}@example.com"
            )
            db.add(v)
            db.commit()
            db.refresh(v)
        db_vehicles.append(v)
    
    # 50 random vehicles
    for i in range(50):
        plate = f"RND-{random.randint(1000, 9999)}"
        v = db.query(vehicle.Vehicle).filter(vehicle.Vehicle.plate_number == plate).first()
        if not v:
            v = vehicle.Vehicle(
                plate_number=plate,
                chassis_number=f"VIN{random.randint(100000, 999999)}",
                owner_name=f"Random Owner {i}",
                owner_phone=f"owner{i}@example.com"
            )
            db.add(v)
    db.commit()

    # Ensure cameras exist
    cams = db.query(camera.Camera).all()
    if not cams:
        print("Please run init_db.py first to seed cameras.")
        return

    # Challans
    print("Seeding Challans...")
    all_vehicles = db.query(vehicle.Vehicle).all()
    violation_types = ["Speeding", "Red Light", "Illegal Parking", "No Helmet"]
    statuses = [challan.ChallanStatus.PENDING, challan.ChallanStatus.PAID, challan.ChallanStatus.UNPAID] if hasattr(challan.ChallanStatus, 'UNPAID') else [challan.ChallanStatus.PENDING, challan.ChallanStatus.PAID, challan.ChallanStatus.WARNING]

    if db.query(challan.Challan).count() < 100:
        for i in range(200):
            v = random.choice(all_vehicles)
            c = random.choice(cams)
            v_type = random.choice(violation_types)
            amount = {"Speeding": 1500, "Red Light": 2000, "Illegal Parking": 500, "No Helmet": 1000}[v_type]
            stat = random.choice(statuses)
            issued = datetime.utcnow() - timedelta(days=random.randint(0, 30), hours=random.randint(0, 23))
            
            new_challan = challan.Challan(
                vehicle_plate=v.plate_number,
                violation_type=v_type,
                fine_amount=amount,
                status=stat,
                camera_id=c.id,
                vehicle_id=v.id,
                date_issued=issued
            )
            db.add(new_challan)
        db.commit()

        # Add payments for PAID challans
        paid_challans = db.query(challan.Challan).filter(challan.Challan.status == challan.ChallanStatus.PAID).all()
        for pc in paid_challans:
            p = payment.Payment(
                challan_id=pc.id,
                amount=pc.fine_amount,
                date_paid=pc.date_issued + timedelta(days=random.randint(1, 5))
            )
            db.add(p)
        db.commit()

    print("Database seeded successfully!")

if __name__ == "__main__":
    seed_db()
