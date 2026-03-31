"""
langgraph_agent.py — InfraGuard Monitoring Agent (LangGraph Version)
====================================================================
True agentic loop implemented using LangGraph.
Retains the single-tool-call enforcement for local Ollama models.
"""

import asyncio
import signal
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

# ─── System Prompt ────────────────────────────────────────────────────────────

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

# ─── LangGraph Setup ──────────────────────────────────────────────────────────

llm = ChatOpenAI(
    base_url=OLLAMA_BASE_URL, 
    api_key=OLLAMA_API_KEY, 
    model=OLLAMA_MODEL, 
    temperature=0.0
)
llm_with_tools = llm.bind_tools(tools)

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
workflow.add_node("tools", ToolNode(tools)) # LangGraph's prebuilt node handles execution

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
                    log.info(f"  ← Tool result: {msg.content}")
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
    log.info("  InfraGuard LangGraph Agent")
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