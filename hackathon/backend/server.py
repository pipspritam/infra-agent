import asyncio
import json
import logging
import uvicorn
from starlette.applications import Starlette
from starlette.routing import WebSocketRoute
from starlette.websockets import WebSocket, WebSocketDisconnect
from starlette.middleware.cors import CORSMiddleware

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-7s  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("infrasage")

HOST = "0.0.0.0"
PORT = 8000

SCRIPTS = [
    # ── Script A: DB latency spike ──────────────────────────────────────────
    [
        {"agent_name": "Shail",  "act": "Reading",    "text": "Alert: API latency spike on prod — p99 at 840 ms!"},
        {"agent_name": "Shail",  "act": "Thinking",   "text": "Analyzing patterns… could be a DB connection pool issue."},
        {"agent_name": "Shail",  "act": "Responding", "text": "Summoning DevBot to investigate the database layer!"},
        {"agent_name": "DevBot", "act": "Reading",    "text": "On it! Pulling DB metrics now…"},
        {"agent_name": "DevBot", "act": "Thinking",   "text": "Found 847 idle connections — pool completely exhausted."},
        {"agent_name": "Shail",  "act": "Responding", "text": "Confirmed spike at 14:32 UTC. Can you flush the stale connections?"},
        {"agent_name": "DevBot", "act": "Responding", "text": "Running PURGE on connection pool now…"},
        {"agent_name": "DevBot", "act": "Thinking",   "text": "Pool cleared. Monitoring response times closely…"},
        {"agent_name": "Shail",  "act": "Reading",    "text": "Latency dropping — 840 ms → 220 ms → 95 ms. Looking great!"},
        {"agent_name": "DevBot", "act": "Responding", "text": "All connections healthy. Back to baseline 87 ms!"},
        {"agent_name": "DevBot", "act": "Done",       "text": "Issue resolved. Signing off!"},
        {"agent_name": "Shail",  "act": "Done",       "text": "All systems green. Great work, DevBot!"},
    ],

    # ── Script B: Memory leak hunt ──────────────────────────────────────────
    [
        {"agent_name": "Shail",    "act": "Reading",    "text": "Warning: service memory climbing — 4.1 GB and still rising."},
        {"agent_name": "Shail",    "act": "Thinking",   "text": "Looks like a slow leak. Could be an unclosed stream or cache growth."},
        {"agent_name": "Shail",    "act": "Responding", "text": "PatchBot, can you pull a heap snapshot for service-worker-3?"},
        {"agent_name": "PatchBot", "act": "Reading",    "text": "Fetching heap snapshot… this will take ~20 s."},
        {"agent_name": "PatchBot", "act": "Thinking",   "text": "Snapshot ready. Largest retained object: EventEmitter × 12,400 instances."},
        {"agent_name": "Shail",    "act": "Responding", "text": "That's it — listeners added inside a loop and never removed."},
        {"agent_name": "PatchBot", "act": "Responding", "text": "Patching cleanup logic and restarting the pod."},
        {"agent_name": "PatchBot", "act": "Thinking",   "text": "Pod restarted. Memory at 1.2 GB and stable."},
        {"agent_name": "Shail",    "act": "Reading",    "text": "Metrics confirm: no further growth over 5-minute window."},
        {"agent_name": "PatchBot", "act": "Done",       "text": "Leak patched and verified. PR raised."},
        {"agent_name": "Shail",    "act": "Done",       "text": "Excellent catch, PatchBot. Closing the incident."},
    ],

    # ── Script C: Disk space emergency ─────────────────────────────────────
    [
        {"agent_name": "Shail",    "act": "Reading",    "text": "CRITICAL: /var/log on node-07 at 97% — writes starting to fail."},
        {"agent_name": "Shail",    "act": "Thinking",   "text": "Log rotation might have stalled. Need immediate cleanup."},
        {"agent_name": "Shail",    "act": "Responding", "text": "CleanBot, emergency log purge on node-07 — keep last 24 h."},
        {"agent_name": "CleanBot", "act": "Reading",    "text": "Connecting to node-07 via SSH…"},
        {"agent_name": "CleanBot", "act": "Thinking",   "text": "Found 48 GB of unrotated nginx logs from the past 9 days."},
        {"agent_name": "CleanBot", "act": "Responding", "text": "Purging stale logs… freed 41 GB."},
        {"agent_name": "Shail",    "act": "Reading",    "text": "Disk now at 31%. Writes recovering. Nice!"},
        {"agent_name": "CleanBot", "act": "Thinking",   "text": "Re-enabling logrotate cron — was disabled by last deploy script."},
        {"agent_name": "Shail",    "act": "Responding", "text": "Pin that deploy script for review. That config change was risky."},
        {"agent_name": "CleanBot", "act": "Done",       "text": "Logrotate restored and tested. Node-07 healthy."},
        {"agent_name": "Shail",    "act": "Done",       "text": "Crisis averted. Let's add an 80% disk alert so we catch this earlier."},
    ],
]

async def ws_handler(websocket: WebSocket):
    try:
        await websocket.accept()
        client = websocket.client
        log.info("✓ Client connected: %s:%s", client.host, client.port)
        
        script_index = 0
        while True:
            script = SCRIPTS[script_index % len(SCRIPTS)]
            log.info("▶ Playing script %d/%d", script_index % len(SCRIPTS) + 1, len(SCRIPTS))
            
            for msg in script:
                await websocket.send_text(json.dumps(msg))
                await asyncio.sleep(2.8)
            
            await asyncio.sleep(5.0)
            script_index += 1
            
    except WebSocketDisconnect:
        log.info("✗ Client disconnected: %s:%s", client.host, client.port)
    except Exception as e:
        log.error("✗ Error: %s", e)

app = Starlette(routes=[WebSocketRoute("/ws/state", ws_handler)])

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    log.info("🚀 InfraSage backend starting...")
    log.info("📡 WebSocket: ws://%s:%d/ws/state", HOST, PORT)
    log.info("💡 Try: ws://localhost:%d/ws/state", PORT)
    uvicorn.run(app, host=HOST, port=PORT, log_level="info")