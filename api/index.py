import sys
import os

# Add the root directory to the python path so the backend package can be found
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set SQLite and Uploads directory to /tmp which is writable on Vercel
os.environ["SQLALCHEMY_DATABASE_URI"] = "sqlite:////tmp/itms.db"

# We must ensure the backend app knows we are in a serverless environment
from backend.main import app

# Create mock data if it doesn't exist in /tmp
from backend.init_db import init_db
try:
    init_db()
except Exception as e:
    print("Database init error:", e)
