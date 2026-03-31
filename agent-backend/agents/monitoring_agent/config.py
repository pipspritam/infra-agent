from dotenv import load_dotenv
import os
load_dotenv()


# ─── Config ───────────────────────────────────────────────────────────────────

ALERTS_API_URL    = "http://192.168.0.109:8000/alerts/latest"
ACK_API_URL       = "http://192.168.0.109:8000/alerts/receive/{alert_id}"
OLLAMA_BASE_URL   = "https://openrouter.ai/api/v1"
OLLAMA_API_KEY     = os.getenv("OR_API_KEY", "ollama")  # Default to "ollama" for local testing without a real API key
# OLLAMA_BASE_URL   = "http://localhost:11434/v1/"
OLLAMA_MODEL      = "stepfun/step-3.5-flash:free" 
# OLLAMA_MODEL      = "qwen3:14b"
POLL_INTERVAL_SEC = 10
REDIS_URL         = "redis://localhost:32768"
REDIS_CHANNEL     = "agent_events"
INFRA_STORAGE_API = "http://192.168.0.109:8000/infra/storage/increase"
INFRA_CPU_API     = "http://192.168.0.109:8000/infra/vm/increase-cpu"
INFRA_MEM_API     = "http://192.168.0.109:8000/infra/vm/increase-mem"

MAX_ITERATIONS    = 10 

VMWARE_A2A_URL    = "http://127.0.0.1:8005/"