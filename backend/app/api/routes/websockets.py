from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import json
import random
import uuid

router = APIRouter()

# Store active connections
active_connections = []

@router.websocket("/live-feed")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            # We simulate a live feed by sending a random violation every 5 to 15 seconds
            await asyncio.sleep(random.randint(5, 15))
            
            cameras = ["CAM-01", "CAM-02", "CAM-04"]
            camera = random.choice(cameras)
            speed = random.randint(65, 120)
            
            violation_data = {
                "id": f"CH-{str(uuid.uuid4())[:8].upper()}",
                "vehicle_plate": f"TEST {random.randint(1000, 9999)}",
                "violation_type": "Speeding",
                "speed": f"{speed} km/h",
                "limit": "60 km/h",
                "camera_id": camera,
                "time": "Just now",
                "fine_amount": speed * 10
            }
            
            disconnected = []
            for connection in active_connections:
                try:
                    await connection.send_text(json.dumps(violation_data))
                except RuntimeError:
                    disconnected.append(connection)
                except Exception:
                    disconnected.append(connection)
            
            for conn in disconnected:
                if conn in active_connections:
                    active_connections.remove(conn)
                
    except WebSocketDisconnect:
        active_connections.remove(websocket)
