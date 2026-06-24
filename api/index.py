import sys
import os

# Add the root and backend directories to the python path
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_dir = os.path.join(root_dir, "backend")
sys.path.append(root_dir)
sys.path.append(backend_dir)

# CRITICAL: Set env vars BEFORE any imports that read them.
# The database engine is created at import time from settings,
# so these must be set first.
os.environ["SQLALCHEMY_DATABASE_URI"] = "sqlite:////tmp/itms.db"
os.environ["VERCEL"] = "1"

# Now it is safe to import the app and init_db
from main import app
from init_db import init_db

# Seed the database on every cold start
try:
    init_db()
except Exception as e:
    print("Database init error:", e)
