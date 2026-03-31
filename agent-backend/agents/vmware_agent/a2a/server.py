"""
server.py — VMware A2A Protocol Server
======================================
This module exposes the VMware LangGraph agent as a standard A2A service.
It supports real-time streaming (SSE) to report long-running VM provisioning steps.
"""

import asyncio
import logging
import uvicorn
from langchain_core.messages import HumanMessage, SystemMessage

# --- A2A SDK Imports ---
from a2a.types import AgentCard, AgentSkill, AgentCapabilities, TaskState, TaskStatusUpdateEvent, TaskStatus
from a2a.server.agent_execution import AgentExecutor
from a2a.server.request_handlers import DefaultRequestHandler
from a2a.server.tasks import InMemoryTaskStore
from a2a.server.apps import A2AFastAPIApplication
from a2a.utils import new_agent_text_message 

# --- Import your isolated LangGraph Brain ---
from agents.vmware_agent.agent import vmware_app, SYSTEM_PROMPT
from agents.vmware_agent.utility import log, push_agent_state

# ─── 1. The A2A Execution Bridge (Now with Streaming!) ────────────────────────

class VMwareAgentExecutor(AgentExecutor):
    """Bridges the A2A Protocol with our LangGraph Agent."""
    
    async def execute(self, context, event_queue):
        user_message = context.get_user_input()
        log.info(f"\n📥 [A2A Task Received]: {user_message}")
        
        # 1. Immediately acknowledge the task has started
        await event_queue.enqueue_event(
            TaskStatusUpdateEvent(
                taskId=context.task_id,
                contextId=context.context_id,
                status=TaskStatus(
                    state=TaskState.working,
                    message=new_agent_text_message("Analyzing Kubernetes resource request...", context.context_id, context.task_id)
                ),
                final=False
            )
        )
        
        inputs = {
            "messages": [
                SystemMessage(content=SYSTEM_PROMPT),
                HumanMessage(content=user_message)
            ]
        }
        
        # 2. Run LangGraph in STREAMING mode for long-running VM tasks
        log.info("⚙️  Passing task to LangGraph core (Streaming mode)...")
        final_msg = "Task completed, but no final message was generated."
        
        # We use astream to catch intermediate steps like "Cloning VM"
        async for event in vmware_app.astream(inputs, stream_mode="updates", config={"recursion_limit": 10}):
            # If the agent called a tool (e.g., clone_vm or hot_add_resources)
            if "agent" in event and event["agent"]["messages"][0].tool_calls:
                tool_name = event["agent"]["messages"][0].tool_calls[0]["name"]
                
                # Push real-time SSE updates over A2A so the Monitoring Agent isn't left hanging!
                update_text = f"Executing infrastructure task: {tool_name}..."
                log.info(f"📡 [Streaming to Client]: {update_text}")
                
                await event_queue.enqueue_event(
                    TaskStatusUpdateEvent(
                        taskId=context.task_id,
                        contextId=context.context_id,
                        status=TaskStatus(
                            state=TaskState.working,
                            message=new_agent_text_message(update_text, context.context_id, context.task_id)
                        ),
                        final=False
                    )
                )
            
            # Capture the final agent response
            if "agent" in event and not event["agent"]["messages"][0].tool_calls:
                final_msg = event["agent"]["messages"][0].content
        
        log.info(f"✅ [A2A Task Complete]: {final_msg}")
        
        # 3. Mark task as COMPLETED and send the final artifact/message
        await event_queue.enqueue_event(
            TaskStatusUpdateEvent(
                taskId=context.task_id,
                contextId=context.context_id,
                status=TaskStatus(
                    state=TaskState.completed,
                    message=new_agent_text_message(final_msg, context.context_id, context.task_id)
                ),
                final=True
            )
        )

    async def cancel(self, context, event_queue):
        log.warning("⚠️ [A2A Task Cancelled]: Client requested abort.")
        raise Exception("Cancellation is not supported while provisioning VMs.")

# ─── 2. Define the Agent Card (Hackathon Scenario Setup) ──────────────────────

agent_card = AgentCard(
    name="VMware Infrastructure Agent",
    description="Specialist agent for Kubernetes worker node remediation. Supports Vertical Scaling (Hot-Add), Horizontal Scaling (Cloning), and Scale-Downs.",
    version="1.0.0",
    url="http://localhost:8005",
    capabilities=AgentCapabilities(streaming=True), 
    defaultInputModes=["text/plain"],
    defaultOutputModes=["text/plain"],
    skills=[
        AgentSkill(
            id="vertical_scaling",
            name="Hot-Add CPU and Memory",
            description="Increases CPU cores and Memory GB on running VMs via pyvmomi without rebooting.",
            tags=["compute", "scaling", "vmware", "kubernetes-worker"],
            examples=["Increase CPU for k8s-worker-01 by 4 cores."]
        ),
        AgentSkill(
            id="horizontal_scaling",
            name="Clone Golden Image",
            description="Clones a pre-configured Kubernetes worker node template and joins it to the cluster to absorb load.",
            tags=["provisioning", "cloning", "vmware", "scaling"],
            examples=["The cluster is maxed out. Clone a new worker node from template 'k8s-golden-image' and add it to the cluster."]
        ),
        AgentSkill(
            id="scale_down",
            name="Decommission Node",
            description="Cordons, drains, and deletes a VM to save compute resources.",
            tags=["cleanup", "cost-saving", "vmware", "kubernetes-worker"],
            examples=["Cluster load is low. Delete extra worker node k8s-worker-04."]
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
    log.info("  Starting VMware A2A Server (Streaming Enabled) on port 8005...")
    log.info("=" * 55)
    uvicorn.run(a2a_app, host="0.0.0.0", port=8005)