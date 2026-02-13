"""
BlackRoad OS Codex Search

Search the indexed codebase of 22,000+ components.
"""

from typing import Optional, List, Dict, Any
from dataclasses import dataclass


@dataclass
class CodexComponent:
    """A component from the Codex index."""
    name: str
    type: str  # 'function', 'class', 'module'
    language: str
    file_path: str
    line_number: int
    signature: Optional[str] = None
    docstring: Optional[str] = None
    repository: Optional[str] = None

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "CodexComponent":
        return cls(
            name=data["name"],
            type=data["type"],
            language=data["language"],
            file_path=data["file_path"],
            line_number=data["line_number"],
            signature=data.get("signature"),
            docstring=data.get("docstring"),
            repository=data.get("repository"),
        )


class CodexSearch:
    """
    Search the BlackRoad Codex.

    The Codex indexes 22,000+ components across 1,085 repositories:
    - 11,729 functions
    - 10,402 classes
    - Multiple languages: Python, JavaScript, TypeScript, Go, Rust

    Example:
        >>> codex = client.codex
        >>> results = codex.search("agent registry")
        >>> for comp in results:
        ...     print(f"{comp.name} ({comp.type}) in {comp.file_path}")
    """

    def __init__(self, client):
        self._client = client

    def search(
        self,
        query: str,
        type: Optional[str] = None,
        language: Optional[str] = None,
        repository: Optional[str] = None,
        limit: int = 20,
    ) -> List[CodexComponent]:
        """
        Search for components in the Codex.

        Args:
            query: Search query (name, description, or code pattern)
            type: Filter by type ('function', 'class', 'module')
            language: Filter by language ('python', 'javascript', etc.)
            repository: Filter by repository name
            limit: Maximum results to return
        """
        params = {
            "q": query,
            "limit": limit,
        }
        if type:
            params["type"] = type
        if language:
            params["language"] = language
        if repository:
            params["repository"] = repository

        response = self._client.get("/v1/codex/search", params=params)
        return [CodexComponent.from_dict(c) for c in response.get("components", [])]

    def get(self, component_id: str) -> CodexComponent:
        """Get a specific component by ID."""
        response = self._client.get(f"/v1/codex/components/{component_id}")
        return CodexComponent.from_dict(response)

    def stats(self) -> Dict[str, Any]:
        """Get Codex statistics."""
        return self._client.get("/v1/codex/stats")

    def languages(self) -> List[Dict[str, Any]]:
        """Get breakdown by language."""
        response = self._client.get("/v1/codex/languages")
        return response.get("languages", [])
