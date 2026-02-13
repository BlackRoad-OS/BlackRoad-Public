# BlackRoad Agent Registry

**Unified Agent Management**

The Agent Registry tracks all AI and hardware agents across the BlackRoad infrastructure—from Claude instances to Raspberry Pi devices.

## Agent Types

| Type | Description |
|------|-------------|
| `ai` | AI model instances (Claude, GPT, Ollama) |
| `hardware` | Physical devices (Pi, servers, edge) |
| `hybrid` | Devices running AI workloads |

## Features

- **Registration**: Unique IDs with PS-SHA-infinity hashes
- **Heartbeats**: Track agent availability
- **Capabilities**: Declare what each agent can do
- **Metadata**: Custom key-value storage
- **Discovery**: Find agents by capability

## Current Fleet

| Agent | Type | Status |
|-------|------|--------|
| cecilia | hybrid | active |
| lucidia | hybrid | active |
| alice | hardware | active |
| aria | hardware | active |
| octavia | hardware | active |
| claude-* | ai | ephemeral |

## Usage

### Register
```bash
blackroad-agent-registry.sh register "my-agent" ai
```

### List
```bash
blackroad-agent-registry.sh list
```

### SDK
```python
agent = client.agents.register(
    name="my-agent",
    type="ai",
    capabilities=["code-generation"],
)
```

## License

© 2026 BlackRoad OS, Inc. Proprietary.
