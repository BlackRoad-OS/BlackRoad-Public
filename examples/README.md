# BlackRoad Examples

Practical examples demonstrating how to use BlackRoad OS APIs and SDKs.

## Examples by Language

### Python

| Example | Description |
|---------|-------------|
| [basic-agent](./python/basic_agent.py) | Simple agent registration and heartbeat |
| [memory-logger](./python/memory_logger.py) | Logging to the memory system |
| [codex-search](./python/codex_search.py) | Searching the Codex index |
| [task-worker](./python/task_worker.py) | Claiming and completing tasks |

### JavaScript

| Example | Description |
|---------|-------------|
| [basic-agent](./javascript/basic-agent.js) | Simple agent registration |
| [memory-client](./javascript/memory-client.js) | Memory system client |
| [codex-cli](./javascript/codex-cli.js) | CLI for Codex search |
| [traffic-lights](./javascript/traffic-lights.js) | Traffic light management |

### Go

| Example | Description |
|---------|-------------|
| [agent](./go/agent/) | Agent implementation in Go |
| [worker](./go/worker/) | Task worker in Go |

## Running Examples

### Python

```bash
cd examples/python
pip install blackroad
python basic_agent.py
```

### JavaScript

```bash
cd examples/javascript
npm install @blackroad/sdk
node basic-agent.js
```

### Go

```bash
cd examples/go/agent
go run main.go
```

## Environment Variables

All examples require:

```env
BLACKROAD_API_KEY=br_live_xxxxxxxxxxxxx
```

---

© 2026 BlackRoad OS, Inc.
