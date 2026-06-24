try:
    import cv2
    import numpy as np
    HAS_CV2 = True
except ImportError:
    HAS_CV2 = False
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
    source = int(video_url) if video_url.isdigit() else video_url
    if not source:
        source = 0
        
    if HAS_CV2:
        cap = cv2.VideoCapture(source)
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
                
            if not HAS_CV2:
                # If OpenCV is missing (like on Vercel), just yield a 1px blank JPEG repeatedly
                DUMMY_JPEG = b'\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x01\x00H\x00H\x00\x00\xff\xdb\x00C\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\t\t\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.\' ",#\x1c\x1c(7),01444\x1f\'9=82<.342\xff\xc0\x00\x0b\x08\x00\x01\x00\x01\x01\x01\x11\x00\xff\xc4\x00\x1f\x00\x00\x01\x05\x01\x01\x01\x01\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x01\x02\x03\x04\x05\x06\x07\x08\t\n\x0b\xff\xc4\x00\xb5\x10\x00\x02\x01\x03\x03\x02\x04\x03\x05\x05\x04\x04\x00\x00\x01}\x01\x02\x03\x00\x04\x11\x05\x12!1A\x06\x13Qa\x07"q\x142\x81\x91\xa1\x08#B\xb1\xc1\x15R\xd1\xf0$3br\x82\t\n\x16\x17\x18\x19\x1a%&\'()*456789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz\x83\x84\x85\x86\x87\x88\x89\x8a\x92\x93\x94\x95\x96\x97\x98\x99\x9a\xa2\xa3\xa4\xa5\xa6\xa7\xa8\xa9\xaa\xb2\xb3\xb4\xb5\xb6\xb7\xb8\xb9\xba\xc2\xc3\xc4\xc5\xc6\xc7\xc8\xc9\xca\xd2\xd3\xd4\xd5\xd6\xd7\xd8\xd9\xda\xe1\xe2\xe3\xe4\xe5\xe6\xe7\xe8\xe9\xea\xf1\xf2\xf3\xf4\xf5\xf6\xf7\xf8\xf9\xfa\xff\xda\x00\x0c\x03\x01\x00\x02\x11\x03\x11\x00?\x00\xfd\xfc\xa2\x8a(\xa0\x0f\xff\xd9'
                yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + DUMMY_JPEG + b'\r\n')
                await asyncio.sleep(2)
                continue

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
        if HAS_CV2 and 'cap' in locals():
            cap.release()
        active_streams.pop(camera_id, None)

def stop_stream(camera_id: str):
    """Forcefully stops a specific camera stream by breaking its generator loop"""
    active_streams[camera_id] = False
