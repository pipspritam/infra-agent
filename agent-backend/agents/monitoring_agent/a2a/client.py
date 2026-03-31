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
from datetime import datetime
from typing import Literal

import httpx
from langchain_openai import ChatOpenAI
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.tools import tool
from langgraph.graph import StateGraph, MessagesState, END
from langgraph.prebuilt import ToolNode

# --- Make sure these imports are at the top of your file ---
from a2a.types import MessageSendParams, SendMessageRequest
from a2a.client import A2ACardResolver, ClientFactory, ClientConfig
import uuid

# --- Your existing config ---
from agents.monitoring_agent.config import ALERTS_API_URL, ACK_API_URL, OLLAMA_API_KEY, OLLAMA_BASE_URL, OLLAMA_MODEL, POLL_INTERVAL_SEC, MAX_ITERATIONS
from agents.monitoring_agent.utility import log, push_agent_state

VMWARE_A2A_URL = "http://localhost:8005"

# ─── 1. Core Infrastructure Tools ─────────────────────────────────────────────

@tool
async def fetch_pending_alerts() -> dict:
    """Fetch the latest infrastructure alert from the monitoring system. Call this first."""
    # await push_agent_state("Monitor Agent", "Acting", "Fetching pending alerts")
    # try:
    #     async with httpx.AsyncClient(timeout=10.0) as client:
    #         resp = await client.get(ALERTS_API_URL)
    #         resp.raise_for_status()
    #         data = resp.json()
    #         log.info(f"📥 [fetch_pending_alerts] {data}")
    #         return data
    # except Exception as e:
    #     return {"error": str(e)}
    # Simulated response for testing without a real API
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
    # await push_agent_state("Monitor Agent", "Acting", f"Acknowledging alert {alert_id}")
    # url = ACK_API_URL.format(alert_id=alert_id)
    # try:
    #     async with httpx.AsyncClient(timeout=10.0) as client:
    #         resp = await client.get(url)
    #         resp.raise_for_status()
    #         log.info(f"✅ [acknowledge_alert] Alert {alert_id} acknowledged.")
    #         return resp.json()
    # except Exception as e:
    #     return {"status": "error", "message": str(e)}
    # Simulated response for testing without a real API
    await asyncio.sleep(1)  # Simulate network delay
    log.info(f"✅ [acknowledge_alert] Alert {alert_id} acknowledged.")
    return {"status": "success", "message": f"Alert {alert_id} acknowledged."}


# ─── 2. The A2A Handoff Tool ──────────────────────────────────────────────────

@tool
async def talk_to_vmware(alert_id: str, message: str) -> str:
    """Communicate with the remote VMware Agent.
    Use this to send instructions OR answer the VMware Agent's clarifying questions.
    You MUST provide the alert_id to maintain the conversation history.
    """
    payload = f"SESSION:{alert_id}|{message}"
    log.info(f"📤 [A2A Chat to VMware]: {message}")
    
    try:
        async with httpx.AsyncClient(timeout=180.0) as httpx_client:
            # 1. Resolve the Card and build the Smart Client
            resolver = A2ACardResolver(httpx_client=httpx_client, base_url=VMWARE_A2A_URL)
            agent_card = await resolver.get_agent_card()
            
            factory = ClientFactory(
                ClientConfig(
                    supported_transports=["JSONRPC"],
                    httpx_client=httpx_client
                )
            )
            a2a_client = factory.create(card=agent_card)
            
            # 2. THE FIX: Just pass a raw message dictionary!
            # The smart client handles the UUIDs, SendMessageRequest, and JSON-RPC envelopes.
            message_payload = {
                "messageId": str(uuid.uuid4()),
                "contextId": alert_id,       # ← proper way to track session
                "role": "user",
                "parts": [{"text": message}] # ← clean message, no SESSION: prefix needed
            }
            
            # 3. Stream the response directly
            reply_text = ""
            
            async for event in a2a_client.send_message(message_payload):
                # Safely extract text from the streaming chunks, accounting for Pydantic V2
                event_data = event.root if hasattr(event, "root") else event
                
                # Dig down into the event structure
                msg_obj = getattr(event_data, "message", None)
                if not msg_obj and hasattr(event_data, "result"):
                    msg_obj = getattr(event_data.result, "message", None)
                
                # If we found the message parts, extract the text
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
                reply_text = "VMware agent completed the task successfully (no text returned)."
            
            log.info(f"🎯 [A2A Reply from VMware]: {reply_text}")
            return reply_text
            
    except Exception as e:
        log.error(f"❌ [Network Error] Communication failed: {str(e)}")
        return f"A2A Communication failed: {str(e)}"
    
# ─── 3. LangGraph Setup ───────────────────────────────────────────────────────

monitor_tools = [fetch_pending_alerts, acknowledge_alert, talk_to_vmware]

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