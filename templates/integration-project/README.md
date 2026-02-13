# BlackRoad Integration Template

Connect external services to BlackRoad infrastructure.

## Features

- Webhook handlers for external events
- Data synchronization
- Event transformation
- Error handling and retries
- Health monitoring

## Quick Start

```bash
npm install
cp .env.example .env
npm start
```

## Configuration

```env
BLACKROAD_API_KEY=br_live_xxxxxxxxxxxxx
INTEGRATION_NAME=github-sync
WEBHOOK_SECRET=your-webhook-secret
```

## Project Structure

```
integration-project/
├── src/
│   ├── index.js           # Entry point & webhook server
│   ├── handlers/          # Event handlers
│   │   ├── github.js      # GitHub events
│   │   ├── slack.js       # Slack events
│   │   └── webhook.js     # Generic webhooks
│   ├── transforms/        # Data transformations
│   └── sync.js            # Synchronization logic
├── package.json
└── Dockerfile
```

## Supported Integrations

| Platform | Events | Status |
|----------|--------|--------|
| GitHub | push, pr, issues | ✅ Ready |
| Slack | messages, reactions | ✅ Ready |
| Linear | issues, projects | ✅ Ready |
| Notion | pages, databases | ✅ Ready |
| Custom | webhooks | ✅ Ready |

## Event Flow

```
External Service → Webhook → Handler → Transform → BlackRoad API
                                                   ↓
                                            Memory System
                                            Traffic Lights
                                            Tasks
```

## Usage

### Handle GitHub Events

```javascript
import { GitHubHandler } from './handlers/github.js';

const handler = new GitHubHandler({
  secret: process.env.WEBHOOK_SECRET
});

handler.on('push', async (event) => {
  await blackroad.memory.log({
    action: 'progress',
    entity: event.repository.name,
    details: `${event.commits.length} commits pushed by ${event.pusher.name}`,
    tags: ['github', 'push']
  });
});
```

### Sync External Data

```javascript
import { Sync } from './sync.js';

const sync = new Sync({
  source: 'github',
  destination: 'blackroad-tasks'
});

// Sync GitHub issues to BlackRoad tasks
await sync.run();
```

---

© 2026 BlackRoad OS, Inc.
