"""
vmware_agent_core.py — Core LangGraph Logic for VMware Agent
=============================================================
This module contains ONLY the agentic brain (LangGraph).
It has zero knowledge of A2A, FastAPI, or webhooks.
"""

import asyncio
from typing import Literal

from langchain_openai import ChatOpenAI
from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langgraph.graph import StateGraph, MessagesState, END
from langgraph.prebuilt import ToolNode

# Assume 'tools' contains all tools, but we selectively bind only the VM ones
from agents.vmware_agent.tools import increase_cpu, increase_memory 
from agents.vmware_agent.utility import log, push_agent_state
from agents.vmware_agent.config import OLLAMA_BASE_URL, OLLAMA_MODEL, OLLAMA_API_KEY

# ─── 1. Narrow the Agent's Identity & Tools ───────────────────────────────────

VM_TOOLS = [increase_cpu, increase_memory]

SYSTEM_PROMPT = """You are a specialized VMware Infrastructure Agent.
Your ONLY job is to manage virtual machine compute resources (CPU and Memory).

## CRITICAL RULES
1. Call exactly ONE tool per response using the tool_calls mechanism.
2. NEVER write tool calls as text or JSON in your message. Use the actual tool call feature.
3. If a request requires adjusting both CPU and Memory, do them sequentially.
4. If asked to do something outside of CPU or Memory, politely decline.
5. Always wait for the tool result before deciding the next step.
"""

# ─── 2. The LangGraph Brain ───────────────────────────────────────────────────

llm = ChatOpenAI(
    base_url=OLLAMA_BASE_URL, 
    api_key=OLLAMA_API_KEY, 
    model=OLLAMA_MODEL, 
    temperature=0.0,
    
)
llm_with_tools = llm.bind_tools(VM_TOOLS)

async def call_model(state: MessagesState):
    log.info("  Calling LLM...")
    await push_agent_state("VMware Agent", "Thinking", "Deciding next action")
    
    messages = state["messages"]
    response = await llm_with_tools.ainvoke(messages)
    
    # Enforce one tool call at a time to prevent local model batching errors
    if response.tool_calls and len(response.tool_calls) > 1:
        discarded = [tc["name"] for tc in response.tool_calls[1:]]
        log.warning(f"  Enforcing sequential: running '{response.tool_calls[0]['name']}' only, discarding: {discarded}")
        response = AIMessage(
            content=response.content,
            tool_calls=[response.tool_calls[0]],
            id=response.id
        )

    if response.content:
        await push_agent_state("VMware Agent", "Decided", response.content)
    if response.tool_calls:
        fn_name = response.tool_calls[0]["name"]
        await push_agent_state("VMware Agent", "ToolCalled", f"I called {fn_name}")

    return {"messages": [response]}

async def should_continue(state: MessagesState) -> Literal["tools", "__end__"]:
    last_message = state["messages"][-1]
    if last_message.tool_calls:
        return "tools"
    await push_agent_state("VMware Agent", "Done", "No more tools to call, ending execution.")
    return "__end__"

# ─── 3. Build & Compile the Graph ─────────────────────────────────────────────

workflow = StateGraph(MessagesState)
workflow.add_node("agent", call_model)
workflow.add_node("tools", ToolNode(VM_TOOLS)) 
workflow.set_entry_point("agent")
workflow.add_conditional_edges("agent", should_continue)
workflow.add_edge("tools", "agent")

# We expose this compiled application so other modules can import it.
vmware_app = workflow.compile()


# ─── 4. Local Testing (Optional) ──────────────────────────────────────────────
# This allows you to test the core logic directly in the terminal 
# without needing the A2A server running.

async def test_core():
    log.info("Running local test of the VMware Agent Core...")
    inputs = {
        "messages": [
            SystemMessage(content=SYSTEM_PROMPT),
            HumanMessage(content="Increase CPU for web-server-01 by 4 cores.")
        ]
    }
    
    async for event in vmware_app.astream(inputs, stream_mode="updates"):
        if "agent" in event and not event["agent"]["messages"][0].tool_calls:
            print(f"\n✅ Agent Finished:\n{event['agent']['messages'][0].content}")

if __name__ == "__main__":
    asyncio.run(test_core())