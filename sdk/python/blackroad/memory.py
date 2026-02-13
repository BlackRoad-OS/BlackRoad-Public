"""
BlackRoad OS Memory System

Access the distributed memory system for agent coordination.
"""

from typing import Optional, List, Dict, Any
from dataclasses import dataclass
from datetime import datetime


@dataclass
class MemoryEntry:
    """A single memory journal entry."""
    id: str
    timestamp: datetime
    action: str
    entity: str
    details: str
    tags: List[str]
    agent_id: Optional[str] = None

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "MemoryEntry":
        return cls(
            id=data["id"],
            timestamp=datetime.fromisoformat(data["timestamp"]),
            action=data["action"],
            entity=data["entity"],
            details=data["details"],
            tags=data.get("tags", []),
            agent_id=data.get("agent_id"),
        )


class MemorySystem:
    """
    Access the BlackRoad memory system.

    The memory system uses PS-SHA-infinity journals for
    multi-agent coordination and state persistence.

    Example:
        >>> memory = client.memory
        >>> memory.log("deployed", "api-gateway", "Version 2.1.0 live", ["prod", "api"])
        >>> entries = memory.search(tags=["prod"])
    """

    def __init__(self, client):
        self._client = client

    def log(
        self,
        action: str,
        entity: str,
        details: str,
        tags: Optional[List[str]] = None,
    ) -> MemoryEntry:
        """
        Log an entry to the memory system.

        Actions: announce, progress, deployed, created, configured,
                 decided, coordinate, blocked, fixed, validated, milestone
        """
        data = {
            "action": action,
            "entity": entity,
            "details": details,
            "tags": tags or [],
        }
        response = self._client.post("/v1/memory/log", data=data)
        return MemoryEntry.from_dict(response)

    def search(
        self,
        query: Optional[str] = None,
        tags: Optional[List[str]] = None,
        action: Optional[str] = None,
        agent_id: Optional[str] = None,
        since: Optional[datetime] = None,
        limit: int = 100,
    ) -> List[MemoryEntry]:
        """Search memory entries."""
        params = {"limit": limit}
        if query:
            params["q"] = query
        if tags:
            params["tags"] = ",".join(tags)
        if action:
            params["action"] = action
        if agent_id:
            params["agent_id"] = agent_id
        if since:
            params["since"] = since.isoformat()

        response = self._client.get("/v1/memory/search", params=params)
        return [MemoryEntry.from_dict(e) for e in response.get("entries", [])]

    def summary(self) -> Dict[str, Any]:
        """Get memory system summary."""
        return self._client.get("/v1/memory/summary")

    def context(self, agent_id: str) -> Dict[str, Any]:
        """Get real-time context for an agent."""
        return self._client.get(f"/v1/memory/context/{agent_id}")
