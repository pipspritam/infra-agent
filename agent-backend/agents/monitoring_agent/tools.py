from langchain_core.tools import tool
import httpx
import asyncio
from agents.monitoring_agent.utility import log, push_agent_state
from agents.monitoring_agent.config import ALERTS_API_URL, ACK_API_URL, INFRA_STORAGE_API, INFRA_CPU_API, INFRA_MEM_API, VMWARE_A2A_URL
from a2a.client import A2ACardResolver, A2AClient
from a2a.types import MessageSendParams, SendMessageRequest
import uuid

# ─── Tools (LangChain @tool decorators) ───────────────────────────────────────
# The docstrings and type hints automatically generate the TOOL_SCHEMAS for the LLM.

@tool
async def fetch_pending_alerts() -> dict:
    """Fetch the latest infrastructure alert from the monitoring system. Call this first."""
    await push_agent_state("Monitoring Agent", "Acting", "Calling fetch_pending_alerts")
    try:
        # async with httpx.AsyncClient(timeout=10.0) as client:
        #     resp = await client.get(ALERTS_API_URL)
        #     resp.raise_for_status()
        #     data = resp.json()
        #     log.info(f"[fetch_pending_alerts] {data}")
        #     return data
            # Simulated response for testing without a real API
        await asyncio.sleep(1)  # Simulate network delay
        data = {
            "alert_id": "alert-123",
            "infra_type": "node",
            "description": "Node 'node-5' is experiencing high CPU usage and throttling."
        }
        log.info(f"[fetch_pending_alerts] {data}")
        return data
    except httpx.ConnectError:
        log.warning("[fetch_pending_alerts] Cannot reach alert API.")
        return {"error": "connection refused"}
    except Exception as e:
        log.error(f"[fetch_pending_alerts] {e}")
        return {"error": str(e)}

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
    
@tool
async def transfer_to_vmware(vm_name: str, issue_description: str) -> str:
    """Call this to transfer compute alerts (CPU/Memory) to the remote A2A VMware Agent.
    Provide the VM name and a detailed description of the issue.
    """
    instruction = f"Fix this issue on {vm_name}: {issue_description}"
    log.info(f"📤 [A2A Handoff] Routing task to VMware Agent: {instruction}")
    await push_agent_state("Monitor Agent", "Delegating", f"Sending A2A task to VMware Agent")
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as httpx_client:
            # Step 1: Resolve the remote Agent Card dynamically
            resolver = A2ACardResolver(httpx_client=httpx_client, base_url=VMWARE_A2A_URL)
            agent_card = await resolver.get_agent_card()
            
            # Step 2: Initialize the A2A Client
            a2a_client = A2AClient(httpx_client=httpx_client, agent_card=agent_card)
            
            # Step 3: Build the strict A2A Request Payload
            request = SendMessageRequest(
                id=str(uuid.uuid4()),
                params=MessageSendParams(
                    message={
                        "messageId": uuid.uuid4().hex,
                        "role": "user",
                        "parts": [{"kind": "text", "text": instruction}]
                    }
                )
            )
            
            # Step 4: Dispatch over the network and wait for the artifact
            log.info("⏳ Waiting for VMware Agent to complete task...")
            response = await a2a_client.send_message(request)
            
            log.info(f"🎯 [A2A Success] Remote agent returned: {response.result.state}")
            return f"A2A Task completed by VMware Agent. State: {response.result.state}"
            
    except Exception as e:
        raise e
        log.error(f"❌ [A2A Error] Communication failed: {str(e)}")
        return f"A2A Communication failed: {str(e)}"

tools = [fetch_pending_alerts, acknowledge_alert, transfer_to_vmware]
