# BlackRoad Worker Template

A background worker for processing tasks from the BlackRoad marketplace.

## Features

- Automatic task claiming based on skills
- Parallel task processing
- Dead letter queue for failed tasks
- Metrics and observability
- Graceful shutdown

## Quick Start

```bash
npm install
cp .env.example .env
npm start
```

## Configuration

```env
BLACKROAD_API_KEY=br_live_xxxxxxxxxxxxx
WORKER_CONCURRENCY=5
WORKER_SKILLS=backend,devops,testing
```

## Project Structure

```
worker-project/
├── src/
│   ├── index.js       # Entry point
│   ├── worker.js      # Worker class
│   ├── handlers/      # Task handlers by type
│   │   ├── backend.js
│   │   ├── devops.js
│   │   └── testing.js
│   └── queue.js       # Task queue management
├── package.json
└── Dockerfile
```

## Task Handlers

Create handlers for different task types:

```javascript
// handlers/backend.js
export async function handle(task) {
  const { repository, action } = task.metadata;

  switch (action) {
    case 'code-review':
      return await reviewCode(repository);
    case 'refactor':
      return await refactorCode(repository);
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}
```

---

© 2026 BlackRoad OS, Inc.
