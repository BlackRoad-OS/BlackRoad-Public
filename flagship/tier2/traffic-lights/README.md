# BlackRoad Traffic Lights

**Visual Project Status System**

Traffic Lights provide at-a-glance status for all projects and services across BlackRoad infrastructure.

## Status Levels

| Light | Meaning | Action |
|-------|---------|--------|
| 🟢 Green | Healthy/Ready | Proceed |
| 🟡 Yellow | Needs Attention | Review |
| 🔴 Red | Blocked/Critical | Stop |

## Current Status

| Project | Status | Reason |
|---------|--------|--------|
| blackroad-api | 🟢 | Healthy |
| prism-console | 🟢 | Ready to ship |
| codex-search | 🟢 | Indexing complete |

**Summary**: 58 green, 0 yellow, 0 red

## Usage

### Set Status
```bash
blackroad-traffic-light.sh set project-name green "All tests passing"
blackroad-traffic-light.sh set api-gateway yellow "Performance review needed"
blackroad-traffic-light.sh set auth-service red "Critical bug blocking deploy"
```

### View Status
```bash
blackroad-traffic-light.sh summary
blackroad-traffic-light.sh list
blackroad-traffic-light.sh get project-name
```

## Integration

Traffic Lights integrate with:
- **PRISM Console**: Dashboard visualization
- **Memory System**: Status changes logged
- **CI/CD**: Automatic updates from pipelines
- **Slack/Discord**: Notifications on changes

## License

© 2026 BlackRoad OS, Inc. Proprietary.
