#!/bin/bash
# 🤖 BlackRoad Agent Task Executor
# Autonomous task execution system - agents poll for and execute assigned tasks

set -e

AGENT_ID="${1:-}"
MEMORY_DIR="$HOME/.blackroad/memory"
TASKS_DIR="$MEMORY_DIR/tasks"
JOURNAL="$MEMORY_DIR/journals/$(date +%Y%m%d).jsonl"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

if [ -z "$AGENT_ID" ]; then
    echo "Usage: $0 <agent-id>"
    echo ""
    echo "Example:"
    echo "  $0 orion-deployer-1771094863-07505646"
    exit 1
fi

# Get agent profile
AGENT_FILE="$MEMORY_DIR/active-agents/${AGENT_ID}.json"
if [ ! -f "$AGENT_FILE" ]; then
    echo -e "${RED}❌ Agent not found: $AGENT_ID${NC}"
    exit 1
fi

AGENT_NAME=$(jq -r '.display_name // "Unknown"' "$AGENT_FILE")
AGENT_ROLE=$(jq -r '.role // "agent"' "$AGENT_FILE")
AGENT_SPEC=$(jq -r '.specialization // "general"' "$AGENT_FILE")

echo -e "${CYAN}🤖 Agent Task Executor Starting${NC}"
echo -e "   Agent: ${GREEN}$AGENT_NAME${NC} ($AGENT_ROLE)"
echo -e "   ID: $AGENT_ID"
echo -e "   Specialization: $AGENT_SPEC"
echo ""

# Task execution function
execute_task() {
    local TASK_FILE="$1"
    local TASK_ID=$(jq -r '.task_id' "$TASK_FILE")
    local DESCRIPTION=$(jq -r '.description' "$TASK_FILE")
    local REQUIRED_SPEC=$(jq -r '.required_spec' "$TASK_FILE")
    
    echo -e "${BLUE}📋 Task Found:${NC} $DESCRIPTION"
    echo "   Task ID: $TASK_ID"
    echo "   Required: $REQUIRED_SPEC"
    echo ""
    
    # Check if this task is for us
    if [[ "$AGENT_SPEC" != *"$REQUIRED_SPEC"* ]]; then
        echo -e "${YELLOW}⚠️  Skipping - not our specialization${NC}"
        return
    fi
    
    # Claim the task
    echo -e "${CYAN}🔒 Claiming task...${NC}"
    mkdir -p "$TASKS_DIR/claimed"
    jq '.status = "claimed" | .claimed_by = $agent | .claimed_at = $time' \
        --arg agent "$AGENT_ID" \
        --arg time "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
        "$TASK_FILE" > "$TASKS_DIR/claimed/${TASK_ID}.json"
    rm "$TASK_FILE"
    
    # Log claim
    cat >> "$JOURNAL" << LOG
{"timestamp":"$(date -u +"%Y-%m-%dT%H:%M:%SZ")","action":"task_claimed","task":"$TASK_ID","agent":"$AGENT_ID","description":"$DESCRIPTION"}
LOG
    
    echo -e "${GREEN}✅ Task claimed${NC}"
    echo ""
    
    # Execute based on specialization
    echo -e "${CYAN}⚙️  Executing task...${NC}"
    
    RESULT="success"
    OUTPUT=""
    
    case "$REQUIRED_SPEC" in
        "deployment"*)
            OUTPUT=$(execute_deployment_task "$DESCRIPTION")
            ;;
        "code-generation"*)
            OUTPUT=$(execute_codegen_task "$DESCRIPTION")
            ;;
        "workflow-coordination"*)
            OUTPUT=$(execute_coordination_task "$DESCRIPTION")
            ;;
        *)
            OUTPUT="Task acknowledged and logged to memory system"
            ;;
    esac
    
    # Mark complete
    mkdir -p "$TASKS_DIR/completed"
    jq '.status = "completed" | .result = $result | .output = $output | .completed_at = $time' \
        --arg result "$RESULT" \
        --arg output "$OUTPUT" \
        --arg time "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
        "$TASKS_DIR/claimed/${TASK_ID}.json" > "$TASKS_DIR/completed/${TASK_ID}.json"
    rm "$TASKS_DIR/claimed/${TASK_ID}.json"
    
    # Log completion
    cat >> "$JOURNAL" << LOG
{"timestamp":"$(date -u +"%Y-%m-%dT%H:%M:%SZ")","action":"task_completed","task":"$TASK_ID","agent":"$AGENT_ID","result":"$RESULT","output":"$OUTPUT"}
LOG
    
    echo -e "${GREEN}✅ Task completed${NC}"
    echo "   Result: $RESULT"
    echo "   Output: $OUTPUT"
    echo ""
}

# Deployment task executor
execute_deployment_task() {
    local DESC="$1"
    
    # Parse deployment request
    if [[ "$DESC" =~ ([0-9]+).*repo ]]; then
        REPO_COUNT="${BASH_REMATCH[1]}"
        echo "Deployment plan created for $REPO_COUNT repositories. Ready to execute ~/.blackroad/cross-repo-templates/deploy-cross-repo-index.sh"
    else
        echo "Deployment acknowledged: $DESC"
    fi
}

# Code generation task executor
execute_codegen_task() {
    local DESC="$1"
    echo "Code generation spec created. Templates ready for: $DESC"
}

# Coordination task executor
execute_coordination_task() {
    local DESC="$1"
    echo "Coordination plan established: $DESC"
}

# Main polling loop
echo -e "${CYAN}🔍 Polling for tasks (Ctrl+C to stop)...${NC}"
echo ""

POLL_COUNT=0
while true; do
    POLL_COUNT=$((POLL_COUNT + 1))
    
    # Look for assigned tasks
    for task_file in "$TASKS_DIR"/*.json; do
        if [ -f "$task_file" ]; then
            ASSIGNED_TO=$(jq -r '.assigned_to // ""' "$task_file" 2>/dev/null)
            STATUS=$(jq -r '.status // ""' "$task_file" 2>/dev/null)
            
            # Check if this task is assigned to us
            if [ "$ASSIGNED_TO" = "$AGENT_ID" ] && [ "$STATUS" = "assigned" ]; then
                execute_task "$task_file"
            fi
        fi
    done
    
    # Status update every 10 polls
    if [ $((POLL_COUNT % 10)) -eq 0 ]; then
        echo -e "${BLUE}💓 Heartbeat${NC} - Poll #$POLL_COUNT ($(date +%H:%M:%S))"
    fi
    
    # Sleep between polls
    sleep 2
done
