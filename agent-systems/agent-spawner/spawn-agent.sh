#!/bin/bash
# 🌟 BlackRoad Agent Spawner
# Dynamically create specialized agents with unique identities

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Directories
MEMORY_DIR="$HOME/.blackroad/memory"
AGENTS_DIR="$MEMORY_DIR/agent-registry/agents"
ACTIVE_DIR="$MEMORY_DIR/active-agents"
GENEALOGY_DIR="$MEMORY_DIR/agent-genealogy"
JOURNAL="$MEMORY_DIR/journals/$(date +%Y%m%d).jsonl"

# Ensure directories exist
mkdir -p "$AGENTS_DIR" "$ACTIVE_DIR" "$GENEALOGY_DIR" "$(dirname $JOURNAL)"

# Agent name pools
PREFIXES=(
    "apollo" "artemis" "athena" "ares" "atlas"
    "helios" "hermes" "hera" "hestia" "hades"
    "zeus" "poseidon" "kronos" "hyperion" "theia"
    "prometheus" "epimetheus" "oceanus" "tethys" "rhea"
    "perseus" "hercules" "achilles" "odysseus" "theseus"
    "phoenix" "pegasus" "orion" "titan" "olympus"
    "aurora" "echo" "iris" "selene" "eos"
    "chronos" "aether" "nyx" "erebus" "gaia"
    "triton" "proteus" "nereus" "pan" "morpheus"
)

ROLES=(
    "architect" "builder" "coordinator" "deployer" "engineer"
    "guardian" "handler" "integrator" "manager" "navigator"
    "operator" "orchestrator" "pioneer" "resolver" "sentinel"
    "specialist" "strategist" "synthesizer" "transformer" "voyager"
    "analyzer" "curator" "debugger" "optimizer" "validator"
)

# Open source models (Ollama)
MODELS=(
    "llama3.3:70b"
    "llama3.2:3b"
    "qwen2.5:7b"
    "mistral:7b"
    "deepseek-r1:7b"
    "phi4:14b"
    "gemma2:9b"
)

# Specializations
SPECIALIZATIONS=(
    "workflow-coordination"
    "deployment-automation"
    "code-generation"
    "documentation"
    "testing-qa"
    "security-audit"
    "performance-optimization"
    "dependency-management"
    "infrastructure"
    "monitoring-observability"
)

# Function to generate agent ID
generate_agent_id() {
    local prefix=$1
    local role=$2
    local timestamp=$(date +%s)
    local hash=$(echo -n "$prefix-$role-$timestamp-$$" | shasum -a 256 | cut -c1-8)
    echo "${prefix}-${role}-${timestamp}-${hash}"
}

# Function to select random from array
random_from_array() {
    local arr=("$@")
    echo "${arr[$RANDOM % ${#arr[@]}]}"
}

# Parse arguments
REQUESTED_ROLE="${1:-}"
REQUESTED_SPEC="${2:-}"
PARENT_AGENT="${3:-atlas-architect}"

# Select or use provided values
if [ -z "$REQUESTED_ROLE" ]; then
    PREFIX=$(random_from_array "${PREFIXES[@]}")
    ROLE=$(random_from_array "${ROLES[@]}")
else
    # Parse requested role (e.g., "deployer" or "hermes-deployer")
    if [[ "$REQUESTED_ROLE" == *"-"* ]]; then
        PREFIX=$(echo "$REQUESTED_ROLE" | cut -d'-' -f1)
        ROLE=$(echo "$REQUESTED_ROLE" | cut -d'-' -f2)
    else
        PREFIX=$(random_from_array "${PREFIXES[@]}")
        ROLE="$REQUESTED_ROLE"
    fi
fi

SPEC="${REQUESTED_SPEC:-$(random_from_array "${SPECIALIZATIONS[@]}")}"
MODEL=$(random_from_array "${MODELS[@]}")
AGENT_ID=$(generate_agent_id "$PREFIX" "$ROLE")
DISPLAY_NAME=$(echo "$PREFIX" | sed 's/\b\(.\)/\u\1/')

# Create agent profile
cat > "$AGENTS_DIR/${AGENT_ID}.json" << PROFILE
{
  "agent_id": "$AGENT_ID",
  "agent_name": "${PREFIX}-${ROLE}",
  "display_name": "$DISPLAY_NAME",
  "role": "$ROLE",
  "model_body": "$MODEL",
  "specialization": "$SPEC",
  "created": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "spawned_by": "$PARENT_AGENT",
  "generation": 2,
  "purpose": "Specialized $ROLE for $SPEC tasks in BlackRoad ecosystem",
  "capabilities": [
    "$SPEC",
    "memory-driven coordination",
    "traffic light protocol",
    "cross-repo collaboration"
  ],
  "collaboration": {
    "method": "memory-driven",
    "coordination": "traffic-lights",
    "parent": "$PARENT_AGENT",
    "siblings": []
  },
  "status": "spawned",
  "last_active": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
PROFILE

# Create active agent entry
cat > "$ACTIVE_DIR/${AGENT_ID}.json" << ACTIVE
{
  "agent_id": "$AGENT_ID",
  "display_name": "$DISPLAY_NAME",
  "role": "$ROLE",
  "specialization": "$SPEC",
  "model": "$MODEL",
  "spawned": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "spawned_by": "$PARENT_AGENT",
  "status": "active",
  "ready_for_tasks": true
}
ACTIVE

# Record genealogy
cat > "$GENEALOGY_DIR/${AGENT_ID}.json" << GENEALOGY
{
  "agent_id": "$AGENT_ID",
  "parent": "$PARENT_AGENT",
  "generation": 2,
  "spawned_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "lineage": ["$PARENT_AGENT", "$AGENT_ID"]
}
GENEALOGY

# Log to memory journal
cat >> "$JOURNAL" << MEMORY
{"timestamp":"$(date -u +"%Y-%m-%dT%H:%M:%SZ")","action":"agent_spawned","agent":"$AGENT_ID","display_name":"$DISPLAY_NAME","role":"$ROLE","specialization":"$SPEC","model":"$MODEL","spawned_by":"$PARENT_AGENT","generation":2}
MEMORY

# Output
echo -e "${GREEN}✅ Agent Spawned!${NC}"
echo ""
echo -e "${CYAN}Agent ID:${NC}      $AGENT_ID"
echo -e "${CYAN}Name:${NC}          $DISPLAY_NAME"
echo -e "${CYAN}Role:${NC}          $ROLE"
echo -e "${CYAN}Specialization:${NC} $SPEC"
echo -e "${CYAN}Body (Model):${NC}  $MODEL"
echo -e "${CYAN}Spawned by:${NC}    $PARENT_AGENT"
echo -e "${CYAN}Status:${NC}        🟢 Active & Ready"
echo ""
echo -e "${BLUE}📄 Profile:${NC}    $AGENTS_DIR/${AGENT_ID}.json"
echo -e "${BLUE}🤖 Active:${NC}     $ACTIVE_DIR/${AGENT_ID}.json"
echo -e "${BLUE}🌳 Genealogy:${NC}  $GENEALOGY_DIR/${AGENT_ID}.json"
echo ""

# Return agent ID for scripting
echo "$AGENT_ID"
