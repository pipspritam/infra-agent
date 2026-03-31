"""
langgraph_agent.py — InfraGuard Monitoring Agent (LangGraph Version)
====================================================================
True agentic loop implemented using LangGraph.
Retains the single-tool-call enforcement for local Ollama models.
Now includes an action-memory loop to prevent alert fatigue.
"""

import asyncio
import signal
import time
from datetime import datetime
from typing import Literal

import httpx

from langchain_openai import ChatOpenAI
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.tools import tool
from langgraph.graph import StateGraph, MessagesState, END
from langgraph.prebuilt import ToolNode

from agents.monitoring_agent.tools import tools
from agents.monitoring_agent.utility import log, push_agent_state
from agents.monitoring_agent.config import OLLAMA_BASE_URL, OLLAMA_MODEL, POLL_INTERVAL_SEC, MAX_ITERATIONS, OLLAMA_API_KEY

# ─── Action Memory Database (In-Memory for now) ───────────────────────────────

ALERT_MEMORY = {}
MEMORY_WINDOW_SECONDS = 1800 # 30 minutes

@tool
def check_alert_memory(identifier: str) -> str:
    """Check if an alert or host has been acted upon recently. Pass the alert_id or hostname."""
    record = ALERT_MEMORY.get(identifier)
    if not record:
        return "No recent actions found in memory."
    
    elapsed = time.time() - record["timestamp"]
    if elapsed < MEMORY_WINDOW_SECONDS:
        return f"Action '{record['action']}' was taken {int(elapsed/60)} minutes ago."
    
    return "Prior action found, but it is older than the 30-minute threshold. Treat as new."

@tool
def update_alert_memory(identifier: str, action_taken: str) -> str:
    """Log the action taken for an alert or host to prevent duplicate work. Pass the alert_id or hostname and the action."""
    ALERT_MEMORY[identifier] = {
        "action": action_taken,
        "timestamp": time.time()
    }
    return f"Memory successfully updated for {identifier}."

# Combine imported tools with our new memory tools
all_tools = tools + [check_alert_memory, update_alert_memory]


# ─── System Prompt ────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """You are the Lead Infrastructure Monitoring Agent.
You fetch alerts, but you DO NOT fix compute issues yourself. You maintain an action memory to prevent duplicate work.

WORKFLOW:
1. Call `fetch_pending_alerts`.
2. If no alerts are found, output "No alerts found." and stop.
3. For the fetched alert, call `check_alert_memory` using the alert_id or hostname to see if action was recently taken.
4. DECISION MATRIX:
   - IF the memory shows the same issue was routed or resolved recently: 
     a. Decide to IGNORE the alert.
     b. Call `acknowledge_alert` using the alert_id.
     c. Call `update_alert_memory` logging that the alert was ignored due to recent prior action.
     d. Provide a plain-text summary and stop.
   - IF the memory shows no recent action AND the alert is about CPU, memory, or compute:
     a. Call `transfer_to_vmware`.
     b. Wait for the VMware agent to return success.
     c. Call `acknowledge_alert` using the alert_id.
     d. Call `update_alert_memory` logging that the issue was routed to VMware.
     e. Provide a plain-text summary and stop.

CRITICAL RULES:
- Call ONE tool at a time.
- Always wait for the tool to finish before calling the next one.
- Always check memory before routing, and always update memory after acting.
"""

# ─── LangGraph Setup ──────────────────────────────────────────────────────────

llm = ChatOpenAI(
    base_url=OLLAMA_BASE_URL, 
    api_key=OLLAMA_API_KEY, 
    model=OLLAMA_MODEL, 
    temperature=0.0
)
# Bind the expanded toolset
llm_with_tools = llm.bind_tools(all_tools)

# Node 1: Call the Model
async def call_model(state: MessagesState):
    log.info("  Calling LLM...")
    await push_agent_state("Monitoring Agent", "Thinking", "Deciding next action")
    
    messages = state["messages"]
    response = await llm_with_tools.ainvoke(messages)
    
    # ── CORE FIX: Enforce one tool call at a time ──
    if response.tool_calls and len(response.tool_calls) > 1:
        discarded = [tc["name"] for tc in response.tool_calls[1:]]
        log.warning(
            f"  LLM batched {len(response.tool_calls)} tools — "
            f"enforcing sequential: running '{response.tool_calls[0]['name']}' only, "
            f"discarding: {discarded}"
        )
        # Create a new AIMessage overriding the tool calls list to just the first one
        response = AIMessage(
            content=response.content,
            tool_calls=[response.tool_calls[0]],
            id=response.id
        )

    if response.content:
        await push_agent_state("Monitoring Agent", "Decided", response.content)
    if response.tool_calls:
        fn_name = response.tool_calls[0]["name"]
        await push_agent_state("Monitoring Agent", "ToolCalled", f"I called {fn_name}")

    return {"messages": [response]}

# Edge Logic: Determine routing based on tool calls
def should_continue(state: MessagesState) -> Literal["tools", "__end__"]:
    last_message = state["messages"][-1]
    if last_message.tool_calls:
        return "tools"
    return "__end__"

# Build Graph
workflow = StateGraph(MessagesState)
workflow.add_node("agent", call_model)
workflow.add_node("tools", ToolNode(all_tools)) # Pass the expanded toolset here

workflow.set_entry_point("agent")
workflow.add_conditional_edges("agent", should_continue)
workflow.add_edge("tools", "agent")

app = workflow.compile()

# ─── Main Execution Loop ──────────────────────────────────────────────────────

_running = True

def _stop(sig, _):
    global _running
    log.info(f"\nReceived {sig.name} — stopping.")
    _running = False

async def run_agent_cycle(cycle_num: int):
    log.info(f"{'─' * 55}")
    log.info(f"  Cycle #{cycle_num} — {datetime.now().strftime('%H:%M:%S')}")
    log.info(f"{'─' * 55}")

    await push_agent_state("Monitoring Agent", "Starting", f"Starting monitoring cycle {cycle_num}")

    # Initialize graph state
    inputs = {
        "messages": [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content="Check for infrastructure alerts and resolve them now.")
        ]
    }

    # Execute graph with recursion limit (acts as your MAX_ITERATIONS)
    try:
        async for event in app.astream(inputs, stream_mode="updates", config={"recursion_limit": MAX_ITERATIONS}):
            if "tools" in event:
                # Log the tool return event (ToolNode appends ToolMessages)
                tool_msgs = event["tools"]["messages"]
                for msg in tool_msgs:
                    log.info(f"  ← Tool result ({msg.name}): {msg.content}")
                    await push_agent_state("Monitoring Agent", "ToolReturned", "Tool call completed")
            
            if "agent" in event and not event["agent"]["messages"][0].tool_calls:
                final_msg = event["agent"]["messages"][0].content
                log.info(f"  ✓ Agent done: {final_msg}")
                await push_agent_state("Monitoring Agent", "Idle", final_msg)

    except Exception as e:
        if "Recursion limit" in str(e):
            log.warning(f"  Cycle {cycle_num} hit MAX_ITERATIONS ({MAX_ITERATIONS}) without completing.")
            await push_agent_state("Monitoring Agent", "Timeout", f"Cycle {cycle_num} timed out")
        else:
            raise e

    await push_agent_state("Monitoring Agent", "Finished", f"Cycle {cycle_num} complete")


async def main():
    global _running

    log.info("=" * 55)
    log.info("  InfraGuard LangGraph Agent (With Memory)")
    log.info("=" * 55)
    
    signal.signal(signal.SIGINT,  _stop)
    signal.signal(signal.SIGTERM, _stop)

    cycle = 0
    while _running:
        cycle += 1
        try:
            await run_agent_cycle(cycle)
        except Exception as e:
            log.error(f"Cycle {cycle} failed: {e}", exc_info=True)

        if _running:
            log.info(f"  Sleeping {POLL_INTERVAL_SEC}s...\n")
            await asyncio.sleep(POLL_INTERVAL_SEC)

    log.info("Agent stopped.")

if __name__ == "__main__":
    asyncio.run(main())