"""
client.py — Monitoring Agent (A2A Client)
=========================================
This agent acts as the system entry point. It polls for alerts, dynamically 
discovers specialized peer agents using A2A Agent Cards, and delegates tasks.
"""

import asyncio
import logging
import signal
import sys
from datetime import datetime
from typing import Literal

import httpx
from langchain_openai import ChatOpenAI
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.tools import tool
from langgraph.graph import StateGraph, MessagesState, END
from langgraph.prebuilt import ToolNode

from a2a.types import MessageSendParams, SendMessageRequest
from a2a.client import A2ACardResolver, ClientFactory, ClientConfig
import uuid

# --- Your existing config ---
from agents.monitoring_agent.config import ALERTS_API_URL, ACK_API_URL, OLLAMA_API_KEY, OLLAMA_BASE_URL, OLLAMA_MODEL, POLL_INTERVAL_SEC, MAX_ITERATIONS
from agents.monitoring_agent.utility import log, push_agent_state


# ─── 1. Core Infrastructure Tools ─────────────────────────────────────────────

@tool
async def fetch_pending_alerts() -> dict:
    """Fetch the latest infrastructure alert from the monitoring system. Call this first."""
    await asyncio.sleep(1)  # Simulate network delay
    data = {
        "alert_id": "alert-123",
        "infra_type": "node",
        "description": "Node 'node-5' is experiencing high CPU usage and throttling."
    }
    log.info(f"📥 [fetch_pending_alerts] {data}")
    return data

@tool
async def acknowledge_alert(alert_id: str) -> dict:
    """Acknowledge and close an alert after successful remediation.
    Always call this as the final step once the remediation tool has returned.
    """
    await asyncio.sleep(1)  # Simulate network delay
    log.info(f"✅ [acknowledge_alert] Alert {alert_id} acknowledged.")
    return {"status": "success", "message": f"Alert {alert_id} acknowledged."}


# ─── 2. The Dynamic A2A Discovery & Handoff Tools ─────────────────────────────

# A simulated registry of known A2A endpoints on your network
KNOWN_AGENT_URLS = [
    "http://localhost:8005", # e.g., VMware/Compute Agent
    "http://localhost:8006", # e.g., Network Agent
    "http://localhost:8007", # e.g., Database Agent
]

@tool
async def discover_agent(required_capability: str) -> str:
    """Discover a remote A2A agent capable of handling a specific capability or task (e.g., 'cpu', 'network', 'database').
    Returns the dynamic URL of the appropriate agent so you can delegate to it.
    """
    log.info(f"🔍 [discover_agent] Searching network for agent with capability: '{required_capability}'")
    
    async with httpx.AsyncClient(timeout=5.0) as client:
        for base_url in KNOWN_AGENT_URLS:
            try:
                # The A2ACardResolver automatically hits the /.well-known/agent.json endpoint
                resolver = A2ACardResolver(httpx_client=client, base_url=base_url)
                card = await resolver.get_agent_card()
                
                # Extract text from the agent card to search for capabilities
                card_text = f"{getattr(card, 'name', '')} {getattr(card, 'description', '')}".lower()
                
                # Check explicit skills if the agent defined them
                skills = getattr(card, 'skills', [])
                skills_text = " ".join([f"{getattr(s, 'name', '')} {getattr(s, 'description', '')}" for s in skills]).lower()
                
                search_term = required_capability.lower()
                if search_term in card_text or search_term in skills_text:
                    log.info(f"✅ [discover_agent] Found matching agent '{card.name}' at {base_url}")
                    return f"Found matching agent: '{card.name}' at URL: {base_url}"
                    
            except Exception as e:
                log.debug(f"Failed to fetch or parse card from {base_url}: {e}")
                continue
                
    return "No suitable agent found for the required capability."

@tool
async def delegate_to_agent(agent_url: str, alert_id: str, message: str) -> str:
    """Communicate with a dynamically discovered remote A2A Agent.
    You MUST provide the exact agent_url returned from `discover_agent`, the alert_id, and your message/instructions.
    """
    log.info(f"📤 [A2A Chat to {agent_url}]: {message}")
    
    try:
        async with httpx.AsyncClient(timeout=180.0) as httpx_client:
            # Re-resolve the card to build the smart client
            resolver = A2ACardResolver(httpx_client=httpx_client, base_url=agent_url)
            agent_card = await resolver.get_agent_card()
            
            factory = ClientFactory(
                ClientConfig(
                    supported_transports=["JSONRPC"],
                    httpx_client=httpx_client
                )
            )
            a2a_client = factory.create(card=agent_card)
            
            # Send standard A2A message payload
            message_payload = {
                "messageId": str(uuid.uuid4()),
                "contextId": alert_id, 
                "role": "user",
                "parts": [{"text": message}] 
            }
            
            reply_text = ""
            async for event in a2a_client.send_message(message_payload):
                event_data = event.root if hasattr(event, "root") else event
                
                msg_obj = getattr(event_data, "message", None)
                if not msg_obj and hasattr(event_data, "result"):
                    msg_obj = getattr(event_data.result, "message", None)
                
                parts = getattr(msg_obj, "parts", None) or getattr(event_data, "parts", None)
                if parts:
                    for part in parts:
                        part_data = part.root if hasattr(part, "root") else part
                        text_chunk = getattr(part_data, "text", "")
                        if text_chunk:
                            reply_text += text_chunk
                elif hasattr(event_data, "text") and event_data.text:
                    reply_text += event_data.text
            
            if not reply_text:
                reply_text = "Remote agent completed the task successfully (no text returned)."
            
            log.info(f"🎯 [A2A Reply from {agent_url}]: {reply_text}")
            return reply_text
            
    except Exception as e:
        log.error(f"❌ [Network Error] Communication failed: {str(e)}")
        return f"A2A Communication failed: {str(e)}"
    
# ─── 3. LangGraph Setup ───────────────────────────────────────────────────────

# Note: We replaced talk_to_vmware with discover_agent and delegate_to_agent
monitor_tools = [fetch_pending_alerts, discover_agent, delegate_to_agent, acknowledge_alert]

# The prompt now dynamically orchestrates instead of assuming VMware
SYSTEM_PROMPT = """You are the Lead Infrastructure Monitoring Agent.
You fetch alerts, but you DO NOT fix infrastructure issues yourself. You must dynamically delegate to specialized remote agents.

WORKFLOW:
1. Call `fetch_pending_alerts`.
2. Analyze the alert to determine the core capability needed (e.g., 'cpu', 'memory', 'database').
3. Call `discover_agent` using that capability keyword to find an appropriate remote agent.
4. Call `delegate_to_agent` using the discovered URL and pass the instructions.
5. Wait for the remote agent to return success.
6. Call `acknowledge_alert` using the alert_id.
7. Provide a plain-text summary of what was done.

CRITICAL RULES:
- Call ONE tool at a time.
- Always wait for the tool to finish before calling the next one.
- Never guess or hardcode the agent URL. Always use `discover_agent` first.
- If no alerts are found, simply output "No alerts found."
"""

llm = ChatOpenAI(base_url=OLLAMA_BASE_URL, api_key=OLLAMA_API_KEY, model=OLLAMA_MODEL, temperature=0.0)
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

async def should_continue(state: MessagesState) -> Literal["tools", "__end__"]:
    if state["messages"][-1].tool_calls:
        return "tools"
    await push_agent_state("Monitor Agent", "Done", "No more tools to call, ending execution.")
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