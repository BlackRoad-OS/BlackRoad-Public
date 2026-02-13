#!/usr/bin/env python3
"""
Memory System Logger Example

Demonstrates various memory logging patterns and queries.
"""

import os
from datetime import datetime, timedelta
from blackroad import BlackRoadClient

API_KEY = os.environ.get("BLACKROAD_API_KEY")
client = BlackRoadClient(api_key=API_KEY)


def main():
    print("=== BlackRoad Memory Logger Example ===\n")

    # 1. Log different action types
    print("Logging various action types...")

    actions = [
        {
            "action": "announce",
            "entity": "feature-auth",
            "details": "Starting work on authentication module",
            "tags": ["auth", "feature"]
        },
        {
            "action": "progress",
            "entity": "feature-auth",
            "details": "Implemented login endpoint",
            "tags": ["auth", "api"]
        },
        {
            "action": "decided",
            "entity": "feature-auth",
            "details": "Using JWT for session management",
            "tags": ["auth", "architecture"]
        },
        {
            "action": "deployed",
            "entity": "auth-service",
            "details": "Deployed to staging environment",
            "tags": ["auth", "staging"]
        },
        {
            "action": "milestone",
            "entity": "feature-auth",
            "details": "Authentication module complete",
            "tags": ["auth", "milestone"]
        }
    ]

    for entry in actions:
        result = client.memory.log(**entry)
        print(f"  ✓ {entry['action']}: {result.id[:12]}...")

    # 2. Query recent entries
    print("\nQuerying recent entries...")
    recent = client.memory.list(limit=10)
    print(f"  Found {len(recent.entries)} recent entries")

    for entry in recent.entries[:5]:
        print(f"  [{entry.timestamp[:19]}] {entry.action}: {entry.entity}")

    # 3. Filter by action type
    print("\nFiltering by action type...")
    deployments = client.memory.list(action="deployed", limit=5)
    print(f"  Found {len(deployments.entries)} deployments")

    # 4. Filter by time range
    print("\nFiltering by time range...")
    since = datetime.utcnow() - timedelta(hours=24)
    recent_24h = client.memory.list(since=since.isoformat())
    print(f"  Found {len(recent_24h.entries)} entries in last 24h")

    # 5. Verify hash chain integrity
    print("\nVerifying hash chain integrity...")
    verification = client.memory.verify()
    if verification.valid:
        print(f"  ✓ Chain valid: {verification.entries_checked} entries verified")
    else:
        print(f"  ✗ Chain invalid: {verification.errors}")

    # 6. Search entries
    print("\nSearching memory...")
    search_results = client.memory.search("authentication")
    print(f"  Found {len(search_results.entries)} matching entries")

    print("\n✓ Memory logging complete!")


if __name__ == "__main__":
    if not API_KEY:
        print("ERROR: BLACKROAD_API_KEY environment variable required")
        exit(1)
    main()
