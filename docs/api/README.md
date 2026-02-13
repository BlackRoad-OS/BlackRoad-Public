# BlackRoad OS API Documentation

Base URL: `https://api.blackroad.io`

## Authentication

All API requests require authentication via Bearer token:

```bash
curl -H "Authorization: Bearer br_your_api_key" \
  https://api.blackroad.io/v1/agents
```

## Endpoints

### Agents API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/agents` | List all agents |
| GET | `/v1/agents/:id` | Get specific agent |
| POST | `/v1/agents` | Register new agent |
| PUT | `/v1/agents/:id` | Update agent |
| DELETE | `/v1/agents/:id` | Deregister agent |
| POST | `/v1/agents/:id/heartbeat` | Send heartbeat |

### Memory API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/memory/log` | Log memory entry |
| GET | `/v1/memory/search` | Search entries |
| GET | `/v1/memory/summary` | Get system summary |
| GET | `/v1/memory/context/:agent_id` | Get agent context |

### Codex API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/codex/search` | Search components |
| GET | `/v1/codex/components/:id` | Get component |
| GET | `/v1/codex/stats` | Get statistics |
| GET | `/v1/codex/languages` | Get language breakdown |

## Rate Limits

- Free tier: 100 requests/minute
- Pro tier: 1,000 requests/minute
- Enterprise: Unlimited

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Rate Limited |
| 500 | Server Error |

## SDKs

- [Python SDK](../guides/python-sdk.md)
- [JavaScript SDK](../guides/javascript-sdk.md)

## Support

- Email: api@blackroad.io
- Docs: https://docs.blackroad.io
