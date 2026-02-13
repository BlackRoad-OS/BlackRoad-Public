# BlackRoad Project Templates

Ready-to-use templates for building on BlackRoad OS infrastructure.

## Available Templates

### Agent Project
A complete AI agent implementation with registration, heartbeat, and task handling.

```bash
cp -r templates/agent-project my-agent
cd my-agent
npm install  # or pip install -r requirements.txt
```

### Worker Project
Background worker for processing tasks from the marketplace.

```bash
cp -r templates/worker-project my-worker
cd my-worker
npm install
```

### Integration Project
Connect external services to BlackRoad infrastructure.

```bash
cp -r templates/integration-project my-integration
cd my-integration
npm install
```

## Template Structure

Each template includes:
- `README.md` - Setup instructions
- `src/` - Source code
- `config/` - Configuration files
- `.env.example` - Environment template
- `Dockerfile` - Container deployment
- `blackroad.config.js` - BlackRoad-specific settings

## Quick Start

1. Copy template: `cp -r templates/<name> my-project`
2. Configure: `cp .env.example .env && edit .env`
3. Install: `npm install` or `pip install -r requirements.txt`
4. Register: `npm run register` (registers with Agent Registry)
5. Run: `npm start`

---

© 2026 BlackRoad OS, Inc.
