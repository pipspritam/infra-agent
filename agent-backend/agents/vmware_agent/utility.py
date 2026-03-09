# ─── Logger & Redis ───────────────────────────────────────────────────────────

import logging
import sys
import redis.asyncio as redis
from agents.vmware_agent.config import REDIS_URL, REDIS_CHANNEL
import json

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%H:%M:%S",
    handlers=[logging.StreamHandler(sys.stdout)],
)
log = logging.getLogger("infra_agent")



# Redis client for state management and inter-agent communication
redis_client = redis.from_url(REDIS_URL, decode_responses=True)

async def push_agent_state(agent_name: str, act: str, text: str):
    payload = json.dumps({"agent_name": agent_name, "act": act, "text": text})
    try:
        await redis_client.publish(REDIS_CHANNEL, payload)
        log.info(f"[redis] {payload}")
    except Exception as e:
        raise e
        log.warning(f"[redis] publish failed: {e}")