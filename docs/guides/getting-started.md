# Getting Started with BlackRoad OS

## Overview

BlackRoad OS is a distributed AI infrastructure platform that enables:

- **Agent Orchestration**: Manage AI agents across multiple devices
- **Memory Coordination**: PS-SHA-infinity journals for state persistence
- **Codex Search**: Index and search 22,000+ code components
- **Multi-Cloud Deployment**: Deploy to Cloudflare, Railway, and edge devices

## Quick Start

### 1. Get Your API Key

Sign up at [blackroad.io](https://blackroad.io) and generate an API key.

### 2. Install the SDK

**Python:**
```bash
pip install blackroad
```

**JavaScript:**
```bash
npm install @blackroad/sdk
```

### 3. Initialize the Client

**Python:**
```python
from blackroad import BlackRoadClient

client = BlackRoadClient(api_key="br_your_api_key")
```

**JavaScript:**
```typescript
import { BlackRoadClient } from '@blackroad/sdk';

const client = new BlackRoadClient({
  apiKey: 'br_your_api_key',
});
```

### 4. Register an Agent

```python
agent = client.agents.register(
    name="my-agent",
    type="ai",
    capabilities=["code-generation", "analysis"],
)
print(f"Registered: {agent.id}")
```

### 5. Log to Memory

```python
client.memory.log(
    action="announce",
    entity="my-agent",
    details="Starting work on feature X",
    tags=["development", "feature-x"],
)
```

### 6. Search the Codex

```python
results = client.codex.search("authentication handler")
for comp in results:
    print(f"{comp.name} ({comp.type}) - {comp.file_path}")
```

## Next Steps

- [API Reference](../api/README.md)
- [Agent Patterns](./agent-patterns.md)
- [Memory System Guide](./memory-system.md)
- [Deployment Guide](./deployment.md)

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    BlackRoad OS                         │
├─────────────┬─────────────┬─────────────┬──────────────┤
│   Agents    │   Memory    │   Codex     │   Traffic    │
│   Registry  │   System    │   Index     │   Lights     │
├─────────────┴─────────────┴─────────────┴──────────────┤
│                     API Gateway                         │
├─────────────────────────────────────────────────────────┤
│   Cloudflare Workers  │  Railway  │  Edge Devices       │
└─────────────────────────────────────────────────────────┘
```

## Support

- Documentation: https://docs.blackroad.io
- GitHub: https://github.com/BlackRoad-OS
- Email: support@blackroad.io
