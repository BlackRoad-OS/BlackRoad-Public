# BlackRoad CLI Tools

Command-line tools for interacting with BlackRoad OS.

## Installation

```bash
npm install -g @blackroad/cli
```

Or install from source:

```bash
git clone https://github.com/BlackRoad-OS/BlackRoad-Public.git
cd BlackRoad-Public/tools
npm install
npm link
```

## Available Commands

### blackroad

Main CLI entry point.

```bash
# Show help
blackroad --help

# Show version
blackroad --version
```

### Agent Commands

```bash
# Register a new agent
blackroad agent register --name my-agent --type ai

# List all agents
blackroad agent list

# Send heartbeat
blackroad agent heartbeat <agent-id>

# Deregister agent
blackroad agent deregister <agent-id>
```

### Memory Commands

```bash
# Log an entry
blackroad memory log --action deployed --entity my-service --details "Deployed to prod"

# List recent entries
blackroad memory list --limit 20

# Search entries
blackroad memory search "deployment"

# Verify chain integrity
blackroad memory verify
```

### Codex Commands

```bash
# Search for components
blackroad codex search "auth middleware"

# Show statistics
blackroad codex stats

# Filter by type and language
blackroad codex search "handler" --type function --lang python
```

### Traffic Light Commands

```bash
# List all statuses
blackroad light list

# Get project status
blackroad light get my-project

# Set project status
blackroad light set my-project green "All tests passing"

# Show summary
blackroad light summary
```

### Task Commands

```bash
# List available tasks
blackroad task list

# Claim a task
blackroad task claim <task-id>

# Complete a task
blackroad task complete <task-id> "Done"

# Create a task
blackroad task create --title "Fix bug" --priority high
```

## Configuration

Create `~/.blackroad/config.json`:

```json
{
  "apiKey": "br_live_xxxxxxxxxxxxx",
  "apiUrl": "https://api.blackroad.io/v1",
  "defaultAgent": "my-agent"
}
```

Or use environment variables:

```bash
export BLACKROAD_API_KEY=br_live_xxxxxxxxxxxxx
export BLACKROAD_API_URL=https://api.blackroad.io/v1
```

## Output Formats

```bash
# JSON output (default)
blackroad agent list --format json

# Table output
blackroad agent list --format table

# Compact output
blackroad agent list --format compact
```

---

© 2026 BlackRoad OS, Inc.
