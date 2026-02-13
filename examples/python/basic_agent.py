#!/usr/bin/env python3
"""
Basic BlackRoad Agent Example

Demonstrates agent registration, heartbeat, and basic operations.
"""

import os
import time
import signal
import sys
from blackroad import BlackRoadClient

# Configuration
API_KEY = os.environ.get("BLACKROAD_API_KEY")
AGENT_NAME = os.environ.get("AGENT_NAME", "python-example-agent")

# Initialize client
client = BlackRoadClient(api_key=API_KEY)

# Global agent reference for cleanup
agent_id = None


def signal_handler(sig, frame):
    """Handle shutdown signals"""
    print("\nShutting down...")
    if agent_id:
        client.agents.deregister(agent_id)
        print(f"Deregistered agent: {agent_id}")
    sys.exit(0)


def main():
    global agent_id

    print("=== BlackRoad Basic Agent Example ===\n")

    # Register signal handler
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    # 1. Register agent
    print("Registering agent...")
    agent = client.agents.register(
        name=AGENT_NAME,
        agent_type="ai",
        capabilities=["python", "data-processing", "testing"],
        metadata={
            "version": "1.0.0",
            "language": "python"
        }
    )
    agent_id = agent.id
    print(f"✓ Registered: {agent_id}")

    # 2. Log startup to memory
    print("\nLogging to memory...")
    entry = client.memory.log(
        action="announce",
        entity=AGENT_NAME,
        details=f"Python agent started with capabilities: python, data-processing, testing",
        tags=["startup", "python", "example"]
    )
    print(f"✓ Memory entry: {entry.id[:16]}...")

    # 3. Search Codex for existing solutions
    print("\nSearching Codex...")
    results = client.codex.search("data processing", limit=5)
    print(f"✓ Found {len(results.components)} components:")
    for comp in results.components[:3]:
        print(f"  - {comp.name} ({comp.type}) in {comp.file_path}")

    # 4. Check traffic lights
    print("\nChecking traffic lights...")
    lights = client.traffic_lights.list()
    summary = lights.summary
    print(f"✓ Projects: {summary.green} green, {summary.yellow} yellow, {summary.red} red")

    # 5. Start heartbeat loop
    print("\nStarting heartbeat (Ctrl+C to stop)...")
    while True:
        client.agents.heartbeat(
            agent_id=agent_id,
            status="active",
            metrics={
                "uptime": time.time(),
                "memory_mb": 50  # Example metric
            }
        )
        print("♥", end="", flush=True)
        time.sleep(30)


if __name__ == "__main__":
    if not API_KEY:
        print("ERROR: BLACKROAD_API_KEY environment variable required")
        sys.exit(1)
    main()
