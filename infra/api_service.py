from time import sleep
from typing import List
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
import os
from pydantic import BaseModel
import uvicorn
import asyncio
import redis.asyncio as redis
from contextlib import asynccontextmanager

# --- NEW: Connection Manager to handle broadcasting ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                pass 

manager = ConnectionManager()
REDIS_URL = "redis://192.168.0.112:32769"
r = redis.from_url(REDIS_URL, decode_responses=True)
pubsub = r.pubsub()

# --- NEW: Always-on background task ---
async def redis_listener():
    await pubsub.subscribe("agent_events")
    print("🚀 Background Redis Listener Active")
    async for message in pubsub.listen():
        if message["type"] == "message":
            data = message["data"]
            print(f"📡 Redis Event: {data}")
            await manager.broadcast(data)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start redis listener when server starts
    listener_task = asyncio.create_task(redis_listener())
    yield
    # Cleanup on shutdown
    listener_task.cancel()
    await r.close()

# Initialize app with lifespan
app = FastAPI(lifespan=lifespan)

# 1. CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ... (StorageUpdate, CPUUpdate, MemoryUpdate classes stay same) ...
class StorageUpdate(BaseModel):
    volume_name: str
    size_gb: int
 
class CPUUpdate(BaseModel):
    vm_name: str
    cores: int

class MemoryUpdate(BaseModel):
    vm_name: str
    ram_gb: int

DATA_FILE = "alerts.json"

# --- UPDATED: WebSocket Endpoint ---
@app.websocket("/ws/state")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    print("✅ Frontend connected to WebSocket")
    try:
        while True:
            # Just keep the connection alive, background task handles the data
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print("❌ Friend disconnected.")

# --- REST OF YOUR FUNCTIONS (UNCHANGED) ---
@app.get("/alerts/latest")
async def get_latest_alert():
    await asyncio.sleep(5)
    if not os.path.exists(DATA_FILE):
        return {"message": "File not found"}
    try:
        with open(DATA_FILE, "r") as file:
            data = json.load(file)
            return data[0] if data else {"message": "Empty"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/alerts/receive/{alert_id}")
async def receive_alert(alert_id: str):
    
    print(f"📥 Agent processed alert: {alert_id}")
    return {"status": "received", "alert_id": alert_id}

@app.post("/infra/storage/increase")
async def increase_storage(data: StorageUpdate):
    
    print("Storage update received!")
    print(f"📥 Agent processed storage update: {data}")
    return {"status": "success", "received": data}

@app.post("/infra/vm/increase-cpu")
async def increase_cpu(data: CPUUpdate):
    print("CPU update received!")
    print(f"📥 Agent processed CPU update: {data}")
    return {"status": "success", "received": data}

@app.post("/infra/vm/increase-mem")
async def increase_memory(data: MemoryUpdate):
    print("Memory update received!")
    print(f"📥 Agent processed memory update: {data}")
    return {"status": "success", "received": data}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)