# BlackRoad GreenLight System

**AI Agent Communication Protocol**

GreenLight provides standardized templates for AI agents to communicate status, progress, and coordination signals.

## Templates

### gl_announce
```bash
gl_announce "agent-name" "project" "tasks" "goal"
```
Announce starting work on a project.

### gl_progress
```bash
gl_progress "agent-name" "completed" "next"
```
Report progress on current work.

### gl_deploy
```bash
gl_deploy "service-name" "url" "details"
```
Log a deployment.

### gl_blocked
```bash
gl_blocked "agent-name" "reason" "needs"
```
Signal a blocker.

### gl_phase_done
```bash
gl_phase_done "phase" "project" "summary" "emoji"
```
Mark a phase complete.

## Usage

```bash
source ~/memory-greenlight-templates.sh

# Announce work
gl_announce "prometheus" "api-refactor" "restructure endpoints, add caching" "improve performance"

# Report progress
gl_progress "prometheus" "restructured endpoints" "implementing caching layer"

# Log deployment
gl_deploy "api-v2" "https://api.blackroad.io" "Deployed v2.1.0 with improved caching"
```

## Integration

GreenLight logs are stored in the Memory System and visible in PRISM Console.

## License

© 2026 BlackRoad OS, Inc. Proprietary.
