from langchain_core.tools import tool
import httpx
import asyncio
from agents.vmware_agent.utility import log, push_agent_state
from agents.vmware_agent.config import INFRA_CPU_API, INFRA_MEM_API

# ─── Tools (LangChain @tool decorators) ───────────────────────────────────────
# The docstrings and type hints automatically generate the TOOL_SCHEMAS for the LLM.

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


    except Exception as e:
        log.error(f"[acknowledge_alert] {e}")
        return {"status": "error", "message": str(e)}

tools = [increase_cpu, increase_memory]
