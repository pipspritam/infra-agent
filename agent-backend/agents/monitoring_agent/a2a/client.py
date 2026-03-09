"""
client.py — Monitoring Agent (A2A Client)
=========================================
This agent acts as the system entry point. It polls for alerts and uses 
the A2A SDK to dynamically route compute tasks to the remote VMware Agent.
"""

import asyncio
import logging
import signal
import sys
import uuid
from datetime import datetime
from typing import Literal

import httpx
from langchain_openai import ChatOpenAI
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.tools import tool
from langgraph.graph import StateGraph, MessagesState, END
from langgraph.prebuilt import ToolNode

# --- A2A SDK Imports ---
from a2a.client import A2ACardResolver, A2AClient
from a2a.types import MessageSendParams, SendMessageRequest

# --- Your existing config ---
from agents.monitoring_agent.config import ALERTS_API_URL, ACK_API_URL, OLLAMA_BASE_URL, OLLAMA_MODEL, POLL_INTERVAL_SEC, MAX_ITERATIONS
from agents.monitoring_agent.utility import log, push_agent_state

VMWARE_A2A_URL = "http://localhost:8005"

# ─── 1. Core Infrastructure Tools ─────────────────────────────────────────────

@tool
async def fetch_pending_alerts() -> dict:
    """Fetch the latest infrastructure alert from the monitoring system. Call this first."""
    await push_agent_state("Monitor Agent", "Acting", "Fetching pending alerts")
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(ALERTS_API_URL)
            resp.raise_for_status()
            data = resp.json()
            log.info(f"📥 [fetch_pending_alerts] {data}")
            return data
    except Exception as e:
        return {"error": str(e)}

@tool
async def acknowledge_alert(alert_id: str) -> dict:
    """Acknowledge and close an alert after successful remediation.
    Always call this as the final step once the remediation tool has returned.
    """
    await push_agent_state("Monitor Agent", "Acting", f"Acknowledging alert {alert_id}")
    url = ACK_API_URL.format(alert_id=alert_id)
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            log.info(f"✅ [acknowledge_alert] Alert {alert_id} acknowledged.")
            return resp.json()
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ─── 2. The A2A Handoff Tool ──────────────────────────────────────────────────

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
        log.error(f"❌ [A2A Error] Communication failed: {str(e)}")
        return f"A2A Communication failed: {str(e)}"

# ─── 3. LangGraph Setup ───────────────────────────────────────────────────────

monitor_tools = [fetch_pending_alerts, acknowledge_alert, transfer_to_vmware]

SYSTEM_PROMPT = """You are the Lead Infrastructure Monitoring Agent.
You fetch alerts, but you DO NOT fix compute issues yourself. 

WORKFLOW:
1. Call `fetch_pending_alerts`
2. If the alert is about CPU, memory, or compute, call `transfer_to_vmware`
3. Wait for the VMware agent to return success.
4. Call `acknowledge_alert` using the alert_id.
5. Provide a plain-text summary of what was done.

CRITICAL RULES:
- Call ONE tool at a time.
- Always wait for the tool to finish before calling the next one.
- If no alerts are found, simply output "No alerts found."
"""

llm = ChatOpenAI(base_url=OLLAMA_BASE_URL, api_key="ollama", model=OLLAMA_MODEL, temperature=0.0)
llm_with_tools = llm.bind_tools(monitor_tools)

async def call_model(state: MessagesState):
    log.info("  Calling LLM...")
    await push_agent_state("Monitor Agent", "Thinking", "Deciding next action")
    
    messages = state["messages"]
    response = await llm_with_tools.ainvoke(messages)
    
    # Enforce sequential logic for local model
    if response.tool_calls and len(response.tool_calls) > 1:
        discarded = [tc["name"] for tc in response.tool_calls[1:]]
        log.warning(f"  Enforcing sequential: running '{response.tool_calls[0]['name']}' only.")
        response = AIMessage(content=response.content, tool_calls=[response.tool_calls[0]], id=response.id)

    if response.tool_calls:
        fn_name = response.tool_calls[0]["name"]
        await push_agent_state("Monitor Agent", "ToolCalled", f"I called {fn_name}")

    return {"messages": [response]}

def should_continue(state: MessagesState) -> Literal["tools", "__end__"]:
    if state["messages"][-1].tool_calls:
        return "tools"
    return "__end__"

workflow = StateGraph(MessagesState)
workflow.add_node("agent", call_model)
workflow.add_node("tools", ToolNode(monitor_tools))
workflow.set_entry_point("agent")
workflow.add_conditional_edges("agent", should_continue)
workflow.add_edge("tools", "agent")

app = workflow.compile()

# ─── 4. The Main Polling Loop ─────────────────────────────────────────────────

_running = True

def _stop(sig, _):
    global _running
    log.info(f"\nReceived {sig.name} — stopping.")
    _running = False

async def run_agent_cycle(cycle_num: int):
    log.info(f"{'─' * 55}")
    log.info(f"  Cycle #{cycle_num} — {datetime.now().strftime('%H:%M:%S')}")
    log.info(f"{'─' * 55}")

    inputs = {
        "messages": [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content="Check for infrastructure alerts and resolve them now.")
        ]
    }

    try:
        async for event in app.astream(inputs, stream_mode="updates", config={"recursion_limit": MAX_ITERATIONS}):
            if "agent" in event and not event["agent"]["messages"][0].tool_calls:
                final_msg = event["agent"]["messages"][0].content
                log.info(f"  ✓ Agent done: {final_msg}")
                await push_agent_state("Monitor Agent", "Idle", final_msg)
    except Exception as e:
        log.warning(f"  Cycle failed or timed out: {e}")

async def main():
    global _running
    signal.signal(signal.SIGINT,  _stop)
    signal.signal(signal.SIGTERM, _stop)

    log.info("=" * 55)
    log.info("  Monitoring Agent (A2A Client) Started")
    log.info("=" * 55)

    cycle = 0
    while _running:
        cycle += 1
        await run_agent_cycle(cycle)
        if _running:
            log.info(f"  Sleeping {POLL_INTERVAL_SEC}s...\n")
            await asyncio.sleep(POLL_INTERVAL_SEC)

if __name__ == "__main__":
    asyncio.run(main())