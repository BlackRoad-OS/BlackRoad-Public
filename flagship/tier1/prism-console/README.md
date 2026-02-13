# PRISM Console

**The AI Infrastructure Command Center**

PRISM (Production Resource Infrastructure & Service Manager) is the flagship BlackRoad OS management console.

## Features

- **Real-time Dashboard**: Monitor all agents, services, and infrastructure
- **Traffic Light System**: Visual project status at a glance
- **Memory Explorer**: Browse PS-SHA-infinity journals
- **Codex Search**: Search 22,000+ indexed components
- **Agent Orchestration**: Deploy and manage AI agents
- **Multi-Cloud View**: Cloudflare, Railway, and edge devices

## Screenshots

![Dashboard](./screenshots/dashboard.png)
![Agents](./screenshots/agents.png)
![Memory](./screenshots/memory.png)

## Quick Start

```bash
# Install CLI
npm install -g @blackroad/prism

# Login
prism login

# Open console
prism open
```

## Architecture

```
┌────────────────────────────────────────────────┐
│              PRISM Console UI                  │
├────────────────────────────────────────────────┤
│  Dashboard │ Agents │ Memory │ Codex │ Deploy │
├────────────────────────────────────────────────┤
│              BlackRoad API Gateway             │
├────────────────────────────────────────────────┤
│   Agent     │  Memory  │  Codex  │  Traffic   │
│   Registry  │  System  │  Index  │  Lights    │
└────────────────────────────────────────────────┘
```

## Deployment

- **Web**: https://console.blackroad.io
- **Desktop**: macOS, Windows, Linux
- **Self-hosted**: Docker, Kubernetes

## License

© 2026 BlackRoad OS, Inc. Proprietary.
