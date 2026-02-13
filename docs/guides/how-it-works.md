# How BlackRoad Works

> A guide to understanding BlackRoad OS architecture and capabilities.

## What is BlackRoad OS?

BlackRoad OS is an **AI infrastructure orchestration platform** that coordinates multiple AI agents, tracks persistent state, and indexes code across distributed systems.

**Three core value propositions:**

1. **Orchestration** — Coordinate multiple AI agents working on the same codebase without conflicts
2. **Persistence** — Maintain state across sessions with append-only, verifiable logs
3. **Code Search** — Find existing solutions across thousands of indexed components instantly

Think of it as **Kubernetes for AI agents** — container orchestration manages compute resources, BlackRoad manages AI agent resources.

---

## The Four Core Systems

BlackRoad OS is built on four interconnected systems that work together to provide reliable AI infrastructure.

### 1. Agent Registry

The Agent Registry tracks all AI agents in your infrastructure, including their capabilities, health status, and current assignments.

```
┌─────────────────────────────────────────────────────────┐
│                    AGENT REGISTRY                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   ┌─────────┐   ┌─────────┐   ┌─────────┐              │
│   │ Agent A │   │ Agent B │   │ Agent C │   ...        │
│   │ active  │   │ active  │   │ idle    │              │
│   └────┬────┘   └────┬────┘   └────┬────┘              │
│        │             │             │                    │
│        └─────────────┴─────────────┘                    │
│                      │                                  │
│              ┌───────▼───────┐                          │
│              │   Heartbeat   │                          │
│              │   Monitor     │                          │
│              └───────────────┘                          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key features:**
- Register agents with unique identifiers
- Track agent health via heartbeats
- Query agent capabilities and specializations
- Automatic cleanup of stale agents

### 2. Memory System

The Memory System provides persistent, append-only state management that survives across sessions. All entries are hash-chained for integrity verification.

```
┌─────────────────────────────────────────────────────────┐
│                    MEMORY SYSTEM                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Entry N-2     Entry N-1      Entry N      Entry N+1   │
│  ┌──────┐     ┌──────┐      ┌──────┐     ┌──────┐     │
│  │ hash │────▶│ hash │─────▶│ hash │────▶│ hash │     │
│  │ data │     │ data │      │ data │     │ data │     │
│  └──────┘     └──────┘      └──────┘     └──────┘     │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Actions: announce | progress | deployed | fixed │   │
│  │          blocked | decided | milestone | ...    │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key features:**
- Append-only journal (immutable history)
- Hash-chained entries for tamper detection
- Structured action types for consistency
- Multi-agent coordination without conflicts

### 3. Codex Index

The Codex is a searchable index of all code components across your repositories — functions, classes, endpoints, and patterns.

```
┌─────────────────────────────────────────────────────────┐
│                     CODEX INDEX                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌────────────┐  │
│  │  Functions  │    │   Classes   │    │ Endpoints  │  │
│  │   11,729    │    │   10,402    │    │    600+    │  │
│  └──────┬──────┘    └──────┬──────┘    └─────┬──────┘  │
│         │                  │                  │         │
│         └──────────────────┼──────────────────┘         │
│                            │                            │
│                   ┌────────▼────────┐                   │
│                   │  Search Engine  │                   │
│                   │   (fuzzy match) │                   │
│                   └─────────────────┘                   │
│                                                         │
│  Query: "auth middleware"                               │
│  Results: api/auth.py:42, lib/middleware.ts:18, ...    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key features:**
- Index thousands of components automatically
- Fuzzy search across languages
- Find existing solutions before writing new code
- Track component usage and dependencies

### 4. Traffic Lights

Traffic Lights provide visual project status indicators — a simple system for communicating readiness and blockers.

```
┌─────────────────────────────────────────────────────────┐
│                   TRAFFIC LIGHTS                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │   🟢 GREEN    Ready for work / Deployed         │   │
│  │                                                 │   │
│  │   🟡 YELLOW   In progress / Needs attention     │   │
│  │                                                 │   │
│  │   🔴 RED      Blocked / Critical issue          │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Project Status Board:                                  │
│  ├── api-gateway         🟢 Ready                      │
│  ├── auth-service        🟡 Testing                    │
│  └── payment-processor   🔴 Blocked: awaiting review   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key features:**
- Three-state simplicity (green/yellow/red)
- Reason tracking for each status
- History of status changes
- Quick project health overview

---

## How They Work Together

The four systems integrate to form a cohesive infrastructure:

```
┌───────────────────────────────────────────────────────────────────┐
│                      BLACKROAD OS                                 │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│                    ┌──────────────────┐                           │
│                    │  Agent Registry  │                           │
│                    │    (who's who)   │                           │
│                    └────────┬─────────┘                           │
│                             │                                     │
│         ┌───────────────────┼───────────────────┐                 │
│         │                   │                   │                 │
│         ▼                   ▼                   ▼                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐           │
│  │   Memory    │◀──▶│    Codex    │◀──▶│   Traffic   │           │
│  │   System    │    │    Index    │    │   Lights    │           │
│  │  (history)  │    │   (code)    │    │  (status)   │           │
│  └─────────────┘    └─────────────┘    └─────────────┘           │
│         │                   │                   │                 │
│         └───────────────────┼───────────────────┘                 │
│                             │                                     │
│                    ┌────────▼─────────┐                           │
│                    │   Coordination   │                           │
│                    │     Engine       │                           │
│                    └──────────────────┘                           │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

**Flow example:**

1. Agent A registers and checks in with **Agent Registry**
2. Agent A queries **Codex** to see if a solution already exists
3. Agent A logs its intent to **Memory System** (preventing conflicts)
4. Agent A sets **Traffic Light** to yellow (in progress)
5. Agent A completes work, logs to **Memory**, sets light to green
6. Agent B reads **Memory** and sees what Agent A accomplished

---

## Common Use Cases

### 1. Multi-Agent Coordination

**Problem:** Multiple AI agents working on the same codebase create conflicts.

**Solution:** Agents announce intent via Memory System, check for conflicts, and coordinate through structured action types.

```
Agent A: "Announce: Working on auth module"
Agent B: [Reads memory] → Sees Agent A on auth → Works on API instead
```

### 2. Code Discovery and Reuse

**Problem:** Teams rewrite code that already exists elsewhere.

**Solution:** Query Codex before implementation to find existing solutions.

```
Query: "rate limiting middleware"
Result: Found in api/middleware/rate-limit.ts:15
        Similar pattern in lib/throttle.py:42
```

### 3. Deployment Status Tracking

**Problem:** Unclear which services are ready, in progress, or blocked.

**Solution:** Traffic Lights provide instant visibility.

```
Dashboard:
  auth-api       🟢 Deployed 2h ago
  user-service   🟡 Testing (eta: 1h)
  payments       🔴 Blocked: needs security review
```

### 4. State Persistence Across Sessions

**Problem:** Context lost between AI sessions.

**Solution:** Memory System maintains history that new sessions can read.

```
New Session: [Reads last 20 memory entries]
             → Understands: Project X was deployed, Bug Y was fixed
             → Continues from where previous session stopped
```

---

## Quick Reference

| System | Purpose | Key Operations |
|--------|---------|----------------|
| Agent Registry | Track agents | register, heartbeat, query, cleanup |
| Memory System | Persist state | log, read, search, verify |
| Codex Index | Search code | index, search, stats |
| Traffic Lights | Show status | set, get, list, history |

| Action Types | When to Use |
|--------------|-------------|
| `announce` | Starting new work |
| `progress` | Completing a step |
| `deployed` | Service is live |
| `blocked` | Need help |
| `decided` | Made a choice |
| `fixed` | Bug resolved |
| `milestone` | Major achievement |

---

## Next Steps

- **Getting Started**: [Quick Start Guide](./getting-started.md)
- **SDK Reference**: See `/sdk/` for Python and JavaScript libraries
- **API Documentation**: See `/docs/api/` for endpoint reference
- **Architecture Deep Dive**: See `/specs/` for technical specifications

---

*BlackRoad OS — Infrastructure for the AI age.*

© 2026 BlackRoad OS, Inc.
