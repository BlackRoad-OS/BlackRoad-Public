# BlackRoad Agent Template

A complete AI agent implementation for BlackRoad OS.

## Features

- Automatic registration with Agent Registry
- Heartbeat monitoring
- Task claiming and completion
- Memory system integration
- Traffic light status updates

## Quick Start

```bash
# Install dependencies
npm install

# Configure
cp .env.example .env
# Edit .env with your API key

# Register and start
npm start
```

## Configuration

Create `.env` file:

```env
BLACKROAD_API_KEY=br_live_xxxxxxxxxxxxx
BLACKROAD_API_URL=https://api.blackroad.io/v1
AGENT_NAME=my-agent
AGENT_TYPE=ai
AGENT_CAPABILITIES=code-review,testing,deployment
```

## Project Structure

```
agent-project/
├── src/
│   ├── index.js          # Entry point
│   ├── agent.js          # Agent class
│   ├── heartbeat.js      # Heartbeat service
│   ├── tasks.js          # Task handling
│   └── memory.js         # Memory integration
├── config/
│   └── default.json      # Default config
├── .env.example
├── package.json
├── Dockerfile
└── blackroad.config.js
```

## Usage

### Register Agent

```javascript
import { BlackRoadAgent } from './src/agent.js';

const agent = new BlackRoadAgent({
  name: 'my-agent',
  type: 'ai',
  capabilities: ['code-review', 'testing']
});

await agent.register();
```

### Handle Tasks

```javascript
agent.on('task', async (task) => {
  console.log('Received task:', task.title);

  // Do work...

  await agent.completeTask(task.id, 'Completed successfully');
});
```

### Log to Memory

```javascript
await agent.logMemory({
  action: 'progress',
  entity: 'feature-x',
  details: 'Implemented authentication flow',
  tags: ['auth', 'feature']
});
```

## Deployment

### Docker

```bash
docker build -t my-agent .
docker run -e BLACKROAD_API_KEY=xxx my-agent
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-agent
spec:
  replicas: 1
  template:
    spec:
      containers:
        - name: agent
          image: my-agent:latest
          env:
            - name: BLACKROAD_API_KEY
              valueFrom:
                secretKeyRef:
                  name: blackroad-secrets
                  key: api-key
```

---

© 2026 BlackRoad OS, Inc.
