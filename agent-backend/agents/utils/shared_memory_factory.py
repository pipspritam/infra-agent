"""
shared_memory.py — Reusable PGVector Memory Factory
===================================================
Provides an isolated memory space for any agent that requests it.
"""

import time
from langchain_core.tools import tool
from langchain_core.documents import Document
from langchain_postgres import PGVectorStore
from langchain_ollama import OllamaEmbeddings

# ─── Global Configuration ─────────────────────────────────────────────────────

CONNECTION_STRING = "postgresql+psycopg://langchain:langchain@localhost:5432/monitoring"
MEMORY_WINDOW_SECONDS = 1800  # 30 minutes

# Initialize the embedding model once to be shared across all agents
embeddings = OllamaEmbeddings(
    model="nomic-embed-text", 
    base_url="http://localhost:11434"
)

# ─── Tool Factory ─────────────────────────────────────────────────────────────

def get_agent_memory_tools(agent_name: str):
    """
    Creates isolated memory tools for a specific agent.
    The agent_name is used as the PGVector collection name, isolating its data.
    """
    
    # Initialize a PGVectorStore scoped strictly to this agent_name
    vector_store = PGVectorStore(
        embeddings=embeddings,
        collection_name=f"{agent_name}_memory", # Complete data isolation here
        connection=CONNECTION_STRING,
        use_jsonb=True,
    )

    @tool
    async def check_memory(identifier: str, context_description: str) -> str:
        """Check if a similar task has been acted upon recently. 
        Pass a unique identifier (like hostname or ticket ID) and a text description."""
        
        results = await vector_store.asimilarity_search_with_score(
            query=context_description,
            k=1,
            filter={"identifier": identifier} 
        )
        
        if not results:
            return "No recent actions found in memory. Treat as new."
            
        best_doc, distance = results[0]
        action_taken = best_doc.metadata.get("action", "unknown action")
        timestamp = best_doc.metadata.get("timestamp", 0)
        
        elapsed = time.time() - timestamp
        
        if elapsed < MEMORY_WINDOW_SECONDS:
             return f"Similar item handled {int(elapsed/60)} minutes ago. Action: '{action_taken}'. (Similarity: {distance:.2f})"
             
        return "Prior action found, but it is older than 30 minutes. Treat as new."

    @tool
    async def update_memory(identifier: str, context_description: str, action_taken: str) -> str:
        """Log the action taken for a specific task to prevent duplicate work. 
        Pass the identifier, a text description, and the action taken."""
        
        doc = Document(
            page_content=context_description,
            metadata={
                "identifier": identifier,
                "action": action_taken,
                "timestamp": time.time()
            }
        )
        
        await vector_store.aadd_documents([doc])
        return f"Memory successfully updated for {identifier}."

    # Return the newly minted, isolated tools
    return check_memory, update_memory