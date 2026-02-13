"""
BlackRoad OS API Client

Main client for interacting with BlackRoad OS infrastructure.
"""

import os
import json
import httpx
from typing import Optional, Dict, Any, List
from dataclasses import dataclass


@dataclass
class BlackRoadConfig:
    """Configuration for BlackRoad client."""
    api_key: str
    base_url: str = "https://api.blackroad.io"
    timeout: int = 30


class BlackRoadClient:
    """
    Main client for BlackRoad OS API.

    Example:
        >>> from blackroad import BlackRoadClient
        >>> client = BlackRoadClient(api_key="br_...")
        >>> agents = client.agents.list()
        >>> print(f"Found {len(agents)} agents")
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: str = "https://api.blackroad.io",
        timeout: int = 30,
    ):
        self.api_key = api_key or os.environ.get("BLACKROAD_API_KEY")
        if not self.api_key:
            raise ValueError(
                "API key required. Pass api_key or set BLACKROAD_API_KEY env var."
            )

        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self._client = httpx.Client(
            base_url=self.base_url,
            timeout=timeout,
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
                "User-Agent": "blackroad-python/0.1.0",
            },
        )

        # Initialize sub-clients
        from .agents import AgentRegistry
        from .memory import MemorySystem
        from .codex import CodexSearch

        self.agents = AgentRegistry(self)
        self.memory = MemorySystem(self)
        self.codex = CodexSearch(self)

    def request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Make an API request."""
        response = self._client.request(
            method=method,
            url=endpoint,
            json=data,
            params=params,
        )
        response.raise_for_status()
        return response.json()

    def get(self, endpoint: str, **kwargs) -> Dict[str, Any]:
        """GET request."""
        return self.request("GET", endpoint, **kwargs)

    def post(self, endpoint: str, data: Dict[str, Any], **kwargs) -> Dict[str, Any]:
        """POST request."""
        return self.request("POST", endpoint, data=data, **kwargs)

    def put(self, endpoint: str, data: Dict[str, Any], **kwargs) -> Dict[str, Any]:
        """PUT request."""
        return self.request("PUT", endpoint, data=data, **kwargs)

    def delete(self, endpoint: str, **kwargs) -> Dict[str, Any]:
        """DELETE request."""
        return self.request("DELETE", endpoint, **kwargs)

    def close(self):
        """Close the client connection."""
        self._client.close()

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.close()
