import sys
import os
import traceback

# Add the root and backend directories to the python path
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_dir = os.path.join(root_dir, "backend")
sys.path.append(root_dir)
sys.path.append(backend_dir)

# CRITICAL: Set env vars BEFORE any imports that read them at module load time.
# The SQLAlchemy engine and pydantic Settings are created on first import,
# so these must be set before `from main import app`.
os.environ["SQLALCHEMY_DATABASE_URI"] = "sqlite:////tmp/itms.db"
os.environ["VERCEL"] = "1"

try:
    from main import app
    from init_db import init_db

    # Seed the database on every cold start (uses pre-computed hashes — fast)
    try:
        init_db()
    except Exception as e:
        print(f"[init_db] ERROR: {e}")
        traceback.print_exc()

except Exception as e:
    print(f"[startup] FATAL ERROR during import: {e}")
    traceback.print_exc()
    # Re-raise so Vercel reports a proper 500 with traceback in logs
    raise
