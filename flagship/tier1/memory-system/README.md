# BlackRoad Memory System

**PS-SHA-infinity Distributed State**

The Memory System provides persistent, cryptographically-verified state coordination for AI agents across the BlackRoad infrastructure.

## Core Concepts

### PS-SHA-infinity Journals

Append-only logs with cryptographic verification:
- **Immutable**: Entries cannot be modified once written
- **Verifiable**: PS-SHA-infinity hashes for integrity
- **Distributed**: Replicated across infrastructure

### Action Types

| Action | Purpose |
|--------|---------|
| `announce` | Starting new work |
| `progress` | Task step completed |
| `deployed` | Service is live |
| `created` | Built something new |
| `configured` | Setup complete |
| `decided` | Architectural choice |
| `coordinate` | Sync with other agents |
| `blocked` | Need help |
| `fixed` | Issue resolved |
| `validated` | Tests passed |
| `milestone` | Major achievement |

## Features

- **Multi-Agent Coordination**: Prevent conflicts, enable collaboration
- **Real-time Context**: Agents see relevant recent activity
- **TIL Broadcasts**: Share learnings across all agents
- **Task Marketplace**: Post, claim, and complete tasks
- **Infinite Todos**: Recurring tasks that reset automatically

## Usage

### CLI
```bash
# Log entry
memory-system.sh log announce "my-project" "Starting feature X" "dev,feature"

# Search
memory-system.sh search "deployment"

# Summary
memory-system.sh summary
```

### SDK
```python
from blackroad import BlackRoadClient

client = BlackRoadClient(api_key="br_...")
client.memory.log(
    action="deployed",
    entity="api-gateway",
    details="v2.1.0 live",
    tags=["prod", "api"]
)
```

## Stats

- **4,000+ entries** in master journal
- **149 TIL broadcasts** shared
- **246 marketplace tasks** tracked

## License

© 2026 BlackRoad OS, Inc. Proprietary.
