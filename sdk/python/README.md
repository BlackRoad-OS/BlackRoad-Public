# BlackRoad OS Python SDK

Official Python client for BlackRoad OS infrastructure.

## Installation

```bash
pip install blackroad
```

## Quick Start

```python
from blackroad import BlackRoadClient

# Initialize client
client = BlackRoadClient(api_key="br_your_api_key")

# List agents
agents = client.agents.list()
for agent in agents:
    print(f"{agent.name}: {agent.status}")

# Search the Codex
results = client.codex.search("authentication")
for comp in results:
    print(f"{comp.name} in {comp.file_path}")

# Log to memory system
client.memory.log(
    action="deployed",
    entity="my-service",
    details="Version 1.0.0 deployed to production",
    tags=["prod", "release"]
)
```

## Features

- **Agent Registry**: Register, manage, and coordinate AI agents
- **Memory System**: Access PS-SHA-infinity journals for state persistence
- **Codex Search**: Search 22,000+ indexed components across 1,085 repos
- **Full API Coverage**: Complete access to BlackRoad OS infrastructure

## Authentication

Set your API key via environment variable:

```bash
export BLACKROAD_API_KEY="br_your_api_key"
```

Or pass it directly:

```python
client = BlackRoadClient(api_key="br_your_api_key")
```

## Documentation

- [Full Documentation](https://docs.blackroad.io/sdk/python)
- [API Reference](https://api.blackroad.io/docs)
- [Examples](https://github.com/BlackRoad-OS/blackroad-python-sdk/tree/main/examples)

## License

© 2026 BlackRoad OS, Inc. All rights reserved.
