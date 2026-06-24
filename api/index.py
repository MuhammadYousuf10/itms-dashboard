import sys
import os

# Add the root and backend directories to the python path
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_dir = os.path.join(root_dir, "backend")
sys.path.append(root_dir)
sys.path.append(backend_dir)

# Set SQLite and Uploads directory to /tmp which is writable on Vercel
os.environ["SQLALCHEMY_DATABASE_URI"] = "sqlite:////tmp/itms.db"
os.environ["VERCEL"] = "1"

# We must ensure the backend app knows we are in a serverless environment
from main import app

# Create mock data if it doesn't exist in /tmp
from init_db import init_db
try:
    init_db()
except Exception as e:
    print("Database init error:", e)
