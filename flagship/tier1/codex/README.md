# BlackRoad Codex

**The Living Codebase Index**

Codex indexes every function, class, and module across the BlackRoad ecosystem—22,000+ components across 1,085 repositories.

## Stats

| Metric | Count |
|--------|-------|
| Components | 22,244 |
| Functions | 11,729 |
| Classes | 10,402 |
| Repositories | 1,085 |
| Languages | 15+ |

## Features

- **Semantic Search**: Natural language queries across all code
- **PS-SHA-infinity Integration**: Cryptographic component verification
- **Real-time Indexing**: Automatic updates from GitHub
- **Cross-repo References**: Find usage across all projects
- **AI-powered Suggestions**: "Similar to" recommendations

## Usage

### CLI
```bash
codex search "authentication handler"
codex get component-id
codex stats
```

### SDK
```python
from blackroad import BlackRoadClient

client = BlackRoadClient(api_key="br_...")
results = client.codex.search("rate limiting")
```

### API
```bash
curl -H "Authorization: Bearer br_..." \
  "https://api.blackroad.io/v1/codex/search?q=authentication"
```

## Language Breakdown

| Language | Components | % |
|----------|------------|---|
| Python | 8,500+ | 38% |
| TypeScript | 6,200+ | 28% |
| JavaScript | 4,100+ | 18% |
| Go | 1,800+ | 8% |
| Rust | 900+ | 4% |
| Other | 700+ | 4% |

## License

© 2026 BlackRoad OS, Inc. Proprietary.
