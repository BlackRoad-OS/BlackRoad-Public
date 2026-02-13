"""
BlackRoad OS Agent Registry

Manage AI agents in the BlackRoad ecosystem.
"""

from typing import Optional, List, Dict, Any
from dataclasses import dataclass
from datetime import datetime


@dataclass
class Agent:
    """Represents a BlackRoad agent."""
    id: str
    name: str
    type: str  # 'ai', 'hardware', 'hybrid'
    status: str  # 'active', 'idle', 'offline'
    capabilities: List[str]
    metadata: Dict[str, Any]
    created_at: datetime
    last_seen: Optional[datetime] = None

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "Agent":
        """Create Agent from API response."""
        return cls(
            id=data["id"],
            name=data["name"],
            type=data["type"],
            status=data["status"],
            capabilities=data.get("capabilities", []),
            metadata=data.get("metadata", {}),
            created_at=datetime.fromisoformat(data["created_at"]),
            last_seen=datetime.fromisoformat(data["last_seen"]) if data.get("last_seen") else None,
        )


class AgentRegistry:
    """
    Manage agents in the BlackRoad ecosystem.

    Example:
        >>> registry = client.agents
        >>> agents = registry.list(type="ai")
        >>> for agent in agents:
        ...     print(f"{agent.name}: {agent.status}")
    """

    def __init__(self, client):
        self._client = client

    def list(
        self,
        type: Optional[str] = None,
        status: Optional[str] = None,
        limit: int = 100,
    ) -> List[Agent]:
        """List all registered agents."""
        params = {"limit": limit}
        if type:
            params["type"] = type
        if status:
            params["status"] = status

        response = self._client.get("/v1/agents", params=params)
        return [Agent.from_dict(a) for a in response.get("agents", [])]

    def get(self, agent_id: str) -> Agent:
        """Get a specific agent by ID."""
        response = self._client.get(f"/v1/agents/{agent_id}")
        return Agent.from_dict(response)

    def register(
        self,
        name: str,
        type: str = "ai",
        capabilities: Optional[List[str]] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Agent:
        """Register a new agent."""
        data = {
            "name": name,
            "type": type,
            "capabilities": capabilities or [],
            "metadata": metadata or {},
        }
        response = self._client.post("/v1/agents", data=data)
        return Agent.from_dict(response)

    def update(
        self,
        agent_id: str,
        status: Optional[str] = None,
        capabilities: Optional[List[str]] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Agent:
        """Update an existing agent."""
        data = {}
        if status:
            data["status"] = status
        if capabilities:
            data["capabilities"] = capabilities
        if metadata:
            data["metadata"] = metadata

        response = self._client.put(f"/v1/agents/{agent_id}", data=data)
        return Agent.from_dict(response)

    def heartbeat(self, agent_id: str) -> Dict[str, Any]:
        """Send a heartbeat for an agent."""
        return self._client.post(f"/v1/agents/{agent_id}/heartbeat", data={})

    def deregister(self, agent_id: str) -> bool:
        """Remove an agent from the registry."""
        self._client.delete(f"/v1/agents/{agent_id}")
        return True
