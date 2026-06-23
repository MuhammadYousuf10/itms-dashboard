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
            # Keep connection alive but don't send fake violations anymore
            await asyncio.sleep(60)
                
    except WebSocketDisconnect:
        active_connections.remove(websocket)
