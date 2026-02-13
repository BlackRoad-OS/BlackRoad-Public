# BlackRoad Public - Master Index

> "We don't merge knowledge — we index it. We merge only when we ship."

This index documents the structure and purpose of all public-facing components.

## What This Repo IS

- Public-facing SDKs, documentation, and specifications
- Brand assets and guidelines
- Product showcases and examples
- The **promise layer** — what we commit to externally
- See [CONTRACT_BOUNDARY.md](./CONTRACT_BOUNDARY.md) for details

## What This Repo is NOT

- **Not internal infrastructure** — That's BlackRoad-Private
- **Not deployment scripts** — Those are internal
- **Not experiments or drafts** — This is polished, shippable
- **Not a place for messy thinking** — Keep that private
- **Not implementation details** — Only interfaces and contracts

## What NEVER Belongs Here

| Never Add | Why | Where Instead |
|-----------|-----|---------------|
| Internal scripts | Wrong audience | BlackRoad-Private/infra |
| Unfinished features | Breaks trust | BlackRoad-Private/experimental |
| Implementation details | Leaks internals | BlackRoad-Private |
| Secrets or credentials | Security | Never in any repo |
| Debug/test artifacts | Noise | .gitignore |

## Promise vs Implementation

See [CONTRACT_BOUNDARY.md](./CONTRACT_BOUNDARY.md) for the definitive guide on what's a promise (versioned, stable) vs implementation (can change).

## Escalation

If unsure whether something is public-ready:
1. Default to BlackRoad-Private first
2. Graduate to Public only when polished
3. Ask in #sdk-maintainers channel

## Directory Structure

### `/sdk` - Software Development Kits
| Language | Status | Install |
|----------|--------|---------|
| Python | active | `pip install blackroad` |
| JavaScript/TS | active | `npm install @blackroad/sdk` |
| Go | planned | TBD |
| Rust | planned | TBD |

### `/docs` - Documentation
| Section | Purpose |
|---------|---------|
| api/ | API reference and endpoints |
| guides/ | Getting started, tutorials |
| tutorials/ | Step-by-step walkthroughs |
| reference/ | Technical specifications |

### `/specs` - Specifications
| Spec | Format | Purpose |
|------|--------|---------|
| api/openapi.yaml | OpenAPI 3.0 | API contract |
| protocols/ | Markdown | Communication protocols |
| formats/ | Markdown | Data format definitions |

### `/flagship` - Product Showcase

#### Tier 1 - Core Products
| Product | Status | Description |
|---------|--------|-------------|
| PRISM Console | active | AI infrastructure command center |
| Codex | active | 22,000+ component index |
| Memory System | active | PS-SHA-infinity state coordination |

#### Tier 2 - Platform Services
| Product | Status | Description |
|---------|--------|-------------|
| Agent Registry | active | Unified agent management |
| Traffic Lights | active | Visual project status |

#### Tier 3 - Emerging Products
| Product | Status | Description |
|---------|--------|-------------|
| Task Marketplace | active | Distributed task coordination |
| GreenLight System | active | AI communication protocol |

### `/branding` - Brand Assets
| Asset | Purpose |
|-------|---------|
| blackroad-brand.css | Design system CSS |
| blackroad-colors.html | Color palette reference |

### `/clients` - Client Applications
| Client | Status | Platform |
|--------|--------|----------|
| chrome-extension | active | Chrome/Chromium |

## How to Navigate

1. **Building an integration?** Start with `/sdk/`
2. **Learning the API?** Read `/docs/api/`
3. **Understanding products?** Browse `/flagship/`
4. **Need brand assets?** Check `/branding/`

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---
© 2026 BlackRoad OS, Inc.
