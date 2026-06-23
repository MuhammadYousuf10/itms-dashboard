import cv2
import numpy as np
import time

import asyncio
from fastapi import Request

# Global dictionary to force-stop streams from the outside
active_streams = {}

async def generate_frames(request: Request, camera_id: str, video_url: str):
    """
    Connects to an IP camera stream, detects moving objects using background subtraction,
    estimates speed, and yields MJPEG frames asynchronously.
    """
    # Use 0 for local webcam, or the URL for an IP camera
    # If the string is empty, we default to 0
    source = int(video_url) if video_url.isdigit() else video_url
    if not source:
        source = 0
        
    cap = cv2.VideoCapture(source)
    
    # Use Background Subtraction for simple motion detection
    fgbg = cv2.createBackgroundSubtractorMOG2(history=500, varThreshold=50, detectShadows=False)
    
    loop = asyncio.get_event_loop()
    
    # Register stream as active
    active_streams[camera_id] = True
    
    try:
        while active_streams.get(camera_id, True):
            # Bulletproof disconnect detection: Check explicitly before doing any heavy OpenCV work
            if await request.is_disconnected():
                print("Client disconnected! Stopping camera stream instantly.")
                break
                
            # Run blocking cap.read() in a background thread to keep event loop free
            success, frame = await loop.run_in_executor(None, cap.read)
            if not success:
                # If we lose the stream, try to reconnect or just wait
                await asyncio.sleep(0.5)
                # Re-initialize
                cap.release()
                cap = cv2.VideoCapture(source)
                continue
                
            # Resize for performance
            frame = cv2.resize(frame, (640, 480))
            
            # Apply background subtraction
            fgmask = fgbg.apply(frame)
            
            # Remove noise
            kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
            fgmask = cv2.morphologyEx(fgmask, cv2.MORPH_OPEN, kernel)
            
            # Find contours of moving objects
            contours, _ = cv2.findContours(fgmask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            for contour in contours:
                if cv2.contourArea(contour) < 2000: # Ignore small objects
                    continue
                    
                x, y, w, h = cv2.boundingRect(contour)
                
                # Draw bounding box
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
                
                # Fake speed calculation based on object size
                speed = int((w + h) / 3) + 15
                
                color = (0, 255, 0)
                if speed > 60:
                    color = (0, 0, 255) # Red for speeding
                    cv2.putText(frame, "SPEEDING VIOLATION!", (x, y - 25), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
                    
                cv2.putText(frame, f"{speed} km/h", (x, y - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
                
            # Add system overlay
            cv2.putText(frame, "ITMS LIVE DETECTION STREAM", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            cv2.putText(frame, time.strftime("%Y-%m-%d %H:%M:%S"), (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 2)
                
            # Encode to JPEG
            ret, buffer = cv2.imencode('.jpg', frame)
            if not ret:
                continue
                
            frame_bytes = buffer.tobytes()
            
            # Yield multipart response byte stream
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
                   
            # Yield control back to the FastAPI event loop so it can detect client disconnects INSTANTLY
            await asyncio.sleep(0.01)
    finally:
        # This will execute immediately when the client disconnects or stop is called!
        cap.release()
        active_streams.pop(camera_id, None)

def stop_stream(camera_id: str):
    """Forcefully stops a specific camera stream by breaking its generator loop"""
    active_streams[camera_id] = False
