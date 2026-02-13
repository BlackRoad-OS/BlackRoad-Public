# BlackRoad OS JavaScript SDK

Official JavaScript/TypeScript client for BlackRoad OS infrastructure.

## Installation

```bash
npm install @blackroad/sdk
# or
pnpm add @blackroad/sdk
# or
yarn add @blackroad/sdk
```

## Quick Start

```typescript
import { BlackRoadClient } from '@blackroad/sdk';

// Initialize client
const client = new BlackRoadClient({
  apiKey: 'br_your_api_key',
});

// List agents
const agents = await client.agents.list();
agents.forEach(agent => {
  console.log(`${agent.name}: ${agent.status}`);
});

// Search the Codex
const results = await client.codex.search({ query: 'authentication' });
results.forEach(comp => {
  console.log(`${comp.name} in ${comp.filePath}`);
});

// Log to memory system
await client.memory.log({
  action: 'deployed',
  entity: 'my-service',
  details: 'Version 1.0.0 deployed to production',
  tags: ['prod', 'release'],
});
```

## Features

- **Agent Registry**: Register, manage, and coordinate AI agents
- **Memory System**: Access PS-SHA-infinity journals for state persistence
- **Codex Search**: Search 22,000+ indexed components across 1,085 repos
- **Full TypeScript Support**: Complete type definitions included

## Authentication

Set your API key via environment variable:

```bash
export BLACKROAD_API_KEY="br_your_api_key"
```

Or pass it directly:

```typescript
const client = new BlackRoadClient({
  apiKey: 'br_your_api_key',
});
```

## Documentation

- [Full Documentation](https://docs.blackroad.io/sdk/javascript)
- [API Reference](https://api.blackroad.io/docs)
- [Examples](https://github.com/BlackRoad-OS/blackroad-js-sdk/tree/main/examples)

## License

© 2026 BlackRoad OS, Inc. All rights reserved.
