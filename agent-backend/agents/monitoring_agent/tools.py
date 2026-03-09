from langchain_core.tools import tool
import httpx
import asyncio
from agents.monitoring_agent.utility import log, push_agent_state
from agents.monitoring_agent.config import ALERTS_API_URL, ACK_API_URL, INFRA_STORAGE_API, INFRA_CPU_API, INFRA_MEM_API

# ─── Tools (LangChain @tool decorators) ───────────────────────────────────────
# The docstrings and type hints automatically generate the TOOL_SCHEMAS for the LLM.

@tool
async def fetch_pending_alerts() -> dict:
    """Fetch the latest infrastructure alert from the monitoring system. Call this first."""
    await push_agent_state("Monitoring Agent", "Acting", "Calling fetch_pending_alerts")
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(ALERTS_API_URL)
            resp.raise_for_status()
            data = resp.json()
            log.info(f"[fetch_pending_alerts] {data}")
            return data
            # Simulated response for testing without a real API
        # await asyncio.sleep(1)  # Simulate network delay
        # data = {
        #     "alert_id": "alert-123",
        #     "infra_type": "node",
        #     "description": "Node 'node-5' is experiencing high disk usage (95% full)."
        # }
        # log.info(f"[fetch_pending_alerts] {data}")
        # return data
    except httpx.ConnectError:
        log.warning("[fetch_pending_alerts] Cannot reach alert API.")
        return {"error": "connection refused"}
    except Exception as e:
        log.error(f"[fetch_pending_alerts] {e}")
        return {"error": str(e)}

@tool
async def increase_storage(node: str, size_gb: int = 50) -> dict:
    """Increase disk/volume storage capacity for a node.
    Use when the alert relates to disk full, high IOPS, storage capacity, or volume exhaustion.
    
    Args:
        node: Node or host name from the alert description.
        size_gb: GB of storage to add. Use 50 if not specified.
    """
    await push_agent_state("Monitoring Agent", "Scaling", f"Increasing storage on {node} by {size_gb}GB")
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.post(INFRA_STORAGE_API, json={"volume_name": node, "size_gb": size_gb})
            r.raise_for_status()
            return r.json()
        # Simulated response for testing without a real API
        # await asyncio.sleep(1)  # Simulate network delay
        # result = {"status": "success", "message": f"Storage increased on {node} by {size_gb}GB"}
        # log.info(f"[increase_storage] {result}")
        # return result
    
    except Exception as e:
        log.error(f"[increase_storage] {e}")
        return {"status": "error", "message": str(e)}

@tool
async def increase_cpu(vm_name: str, cores: int = 2) -> dict:
    """Increase CPU core allocation for a VM.
    Use when the alert relates to high CPU utilization, CPU throttling, or compute pressure.
    
    Args:
        vm_name: VM name from the alert description.
        cores: Number of cores to add. Use 2 if not specified.
    """
    await push_agent_state("Monitoring Agent", "Scaling", f"Increasing CPU for {vm_name} by {cores} cores")
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.post(INFRA_CPU_API, json={"vm_name": vm_name, "cores": cores})
            r.raise_for_status()
            return r.json()
        # Simulated response for testing without a real API
        # await asyncio.sleep(1)  # Simulate network delay
        # result = {"status": "success", "message": f"CPU increased for {vm_name} by {cores} cores"}
        # log.info(f"[increase_cpu] {result}")
        # return result
    except Exception as e:
        log.error(f"[increase_cpu] {e}")
        return {"status": "error", "message": str(e)}

@tool
async def increase_memory(vm_name: str, memory_gb: int = 8) -> dict:
    """Increase RAM allocation for a VM.
    Use when the alert relates to high memory usage, OOM kills, or memory pressure.
    
    Args:
        vm_name: VM name from the alert description.
        memory_gb: GB of RAM to add. Use 8 if not specified.
    """
    await push_agent_state("Monitoring Agent", "Scaling", f"Increasing memory for {vm_name} by {memory_gb}GB")
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.post(INFRA_MEM_API, json={"vm_name": vm_name, "ram_gb": memory_gb})
            r.raise_for_status()
            return r.json()
        # Simulated response for testing without a real API
        # await asyncio.sleep(1)  # Simulate network delay
        # result = {"status": "success", "message": f"Memory increased for {vm_name} by {memory_gb}GB"}
        # log.info(f"[increase_memory] {result}")
        # return result
    
    except Exception as e:
        log.error(f"[increase_memory] {e}")
        return {"status": "error", "message": str(e)}

@tool
async def acknowledge_alert(alert_id: str) -> dict:
    """Acknowledge and close an alert after successful remediation.
    Always call this as the final step once the remediation tool has returned.
    
    Args:
        alert_id: The alert_id value from the fetched alert.
    """
    await push_agent_state("Monitoring Agent", "Acting", f"Acknowledging alert {alert_id}")
    url = ACK_API_URL.format(alert_id=alert_id)
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            result = resp.json()
            log.info(f"[acknowledge_alert] ✓ Alert {alert_id} acknowledged.")
            return result
        # Simulated response for testing without a real API
        # await asyncio.sleep(1)  # Simulate network delay
        # result = {"status": "success", "message": f"Alert {alert_id} acknowledged."}
        # log.info(f"[acknowledge_alert] ✓ Alert {alert_id} acknowledged.")
        # return result

    except Exception as e:
        log.error(f"[acknowledge_alert] {e}")
        return {"status": "error", "message": str(e)}

tools = [fetch_pending_alerts, increase_storage, increase_cpu, increase_memory, acknowledge_alert]
