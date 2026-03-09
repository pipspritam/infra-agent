# ─── Config ───────────────────────────────────────────────────────────────────

ALERTS_API_URL    = "http://192.168.0.109:8000/alerts/latest"
ACK_API_URL       = "http://192.168.0.109:8000/alerts/receive/{alert_id}"
OLLAMA_BASE_URL   = "http://192.168.0.109:11434/v1/"
# OLLAMA_BASE_URL   = "http://localhost:11434/v1/"
OLLAMA_MODEL      = "gpt-oss:20b" 
# OLLAMA_MODEL      = "qwen3:14b"
POLL_INTERVAL_SEC = 10
REDIS_URL         = "redis://localhost:32769"
REDIS_CHANNEL     = "agent_events"
INFRA_STORAGE_API = "http://192.168.0.109:8000/infra/storage/increase"
INFRA_CPU_API     = "http://192.168.0.109:8000/infra/vm/increase-cpu"
INFRA_MEM_API     = "http://192.168.0.109:8000/infra/vm/increase-mem"

MAX_ITERATIONS    = 10 