"""
server.py — VMware A2A Protocol Server
======================================
This module exposes the VMware LangGraph agent as a standard A2A service.
It handles the HTTP/JSON-RPC networking while delegating all logic to the core.
"""

import asyncio
import logging
import uvicorn
from langchain_core.messages import HumanMessage, SystemMessage

# --- A2A SDK Imports ---
from a2a.types import AgentCard, AgentSkill, AgentCapabilities
from a2a.server.agent_execution import AgentExecutor
from a2a.server.request_handlers import DefaultRequestHandler
from a2a.server.tasks import InMemoryTaskStore
from a2a.server.apps import A2AFastAPIApplication
from a2a.utils import new_agent_text_message  # <--- The official helper!

# --- Import your isolated LangGraph Brain ---
from agents.vmware_agent.agent import vmware_app, SYSTEM_PROMPT
from agents.vmware_agent.utility import log, push_agent_state

# ─── 1. The A2A Execution Bridge ──────────────────────────────────────────────

class VMwareAgentExecutor(AgentExecutor):
    """Bridges the A2A Protocol with our LangGraph Agent."""
    
    async def execute(self, context, event_queue):
        # 1. Official SDK way to securely extract the user's text
        user_message = context.get_user_input()
        
        log.info(f"\n📥 [A2A Task Received]: {user_message}")
        await push_agent_state("VMware A2A Server", "Starting", f"Received task via A2A")
        
        # Set up the initial state for LangGraph, injecting the System Prompt
        inputs = {
            "messages": [
                SystemMessage(content=SYSTEM_PROMPT),
                HumanMessage(content=user_message)
            ]
        }
        
        # Run the core LangGraph application
        log.info("⚙️  Passing task to LangGraph core...")
        final_state = await vmware_app.ainvoke(inputs, config={"recursion_limit": 10})
        
        # Extract the final conversational response from the agent
        final_msg = final_state["messages"][-1].content
        log.info(f"✅ [A2A Task Complete]: {final_msg}")
        await push_agent_state("VMware A2A Server", "Finished", final_msg)
        
        # 2. Official SDK way to format and send the response back over the network
        await event_queue.enqueue_event(
            new_agent_text_message(final_msg, context.context_id, context.task_id)
        )

    async def cancel(self, context, event_queue):
        """Required by the A2A SDK to handle task cancellation requests."""
        log.warning("⚠️ [A2A Task Cancelled]: Cancellation requested by client.")
        raise Exception("Cancellation is not supported by this agent.")

# ─── 2. Define the Agent Card ─────────────────────────────────────────────────

agent_card = AgentCard(
    name="VMware Compute Agent",
    description="Specialist agent that resolves infrastructure alerts by managing VM CPU and Memory.",
    version="1.0.0",
    url="http://localhost:8005",
    capabilities=AgentCapabilities(streaming=True),
    defaultInputModes=["text/plain"],
    defaultOutputModes=["text/plain"],
    skills=[
        AgentSkill(
            id="manage_compute",
            name="Manage Compute Resources",
            description="Increases CPU cores and Memory GB for virtual machines safely.",
            tags=["compute", "infrastructure", "scaling", "vmware"],
            examples=[
                "Increase CPU for web-server-01 by 4 cores.",
                "Add 8GB of memory to database-node-02.",
                "The web-server-01 VM is crashing due to OOM errors. Fix it."
            ]
        )
    ]
)

# ─── 3. Wire up the A2A Server ────────────────────────────────────────────────

request_handler = DefaultRequestHandler(
    agent_executor=VMwareAgentExecutor(),
    task_store=InMemoryTaskStore()
)

a2a_server = A2AFastAPIApplication(
    agent_card=agent_card,
    http_handler=request_handler
)
a2a_app = a2a_server.build()

if __name__ == "__main__":
    log.info("=" * 55)
    log.info("  Starting VMware A2A Server on port 8005...")
    log.info("  Agent Card available at: http://localhost:8005/.well-known/agent-card.json")
    log.info("=" * 55)
    
    uvicorn.run(a2a_app, host="0.0.0.0", port=8005)