from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="ITMS Dashboard API",
    description="Intelligent Traffic Management System Backend API",
    version="1.0.0",
)

from fastapi.staticfiles import StaticFiles
import os

# Create uploads directory if it doesn't exist
os.makedirs("uploads", exist_ok=True)

# Configure CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173", 
        "http://localhost:5174", 
        "http://127.0.0.1:5174", 
        "http://localhost:3000",
        "http://localhost:5173/",
        "http://127.0.0.1:5173/",
        "http://localhost:5174/",
        "http://127.0.0.1:5174/"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the ITMS API"}

# Include routers
from app.api.routes import auth, cameras, challans, dashboard, websockets, users, citizen

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(cameras.router, prefix="/api/cameras", tags=["cameras"])
app.include_router(challans.router, prefix="/api/challans", tags=["challans"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(citizen.router, prefix="/api/citizen", tags=["citizen"])
app.include_router(websockets.router, prefix="/ws", tags=["websockets"])

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
