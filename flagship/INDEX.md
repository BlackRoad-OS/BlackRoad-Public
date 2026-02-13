# Flagship Products Index

> Multiple versions, approaches, truths exist. This is how to find them.

## Tier System

Products are organized by maturity and strategic importance:

| Tier | Criteria | Count |
|------|----------|-------|
| **Tier 1** | Core platform, production-ready | 3 |
| **Tier 2** | Platform services, stable | 2+ |
| **Tier 3** | Emerging, experimental | 10+ |

## Tier 1 - Core Products

These define BlackRoad OS identity.

| Product | What It Is | When to Use |
|---------|------------|-------------|
| **PRISM Console** | AI infrastructure command center | Managing agents, viewing status, exploring memory |
| **Codex** | Codebase index (22K+ components) | Finding code, understanding patterns |
| **Memory System** | PS-SHA-infinity state coordination | Multi-agent coordination, logging |

## Tier 2 - Platform Services

Essential services that support Tier 1.

| Product | What It Is | Differs From |
|---------|------------|--------------|
| **Agent Registry** | Unified agent management | Codex (agents vs code) |
| **Traffic Lights** | Visual project status | Memory (status vs events) |

## Tier 3 - Emerging Products

Experiments, forks, and emerging capabilities.

| Product | Status | Notes |
|---------|--------|-------|
| Task Marketplace | active | Async task coordination |
| GreenLight System | active | Agent communication protocol |
| blackroad-vllm | experimental | vLLM deployment |
| blackroad-kubernetes | active | K8s configurations |
| blackroad-home-assistant | active | Home automation |

## How They Relate

```
┌─────────────────────────────────────────────┐
│              PRISM Console                   │ ◀── UI Layer
├─────────────────────────────────────────────┤
│  Codex  │  Memory  │  Agent Registry        │ ◀── Core Services
├─────────────────────────────────────────────┤
│  Traffic Lights  │  Task Marketplace        │ ◀── Coordination
├─────────────────────────────────────────────┤
│           Tier 3 Experiments                 │ ◀── Emerging
└─────────────────────────────────────────────┘
```

## Moving Between Tiers

Products move up when:
- Production usage increases
- Stability proven
- Strategic importance grows

Products move down when:
- Better alternatives emerge
- Usage declines
- Maintenance burden exceeds value
