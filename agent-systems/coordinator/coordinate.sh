#!/bin/bash
# 🤝 BlackRoad Multi-Agent Coordination System
# Enables agents to discover, communicate, and collaborate on complex tasks

set -e

# Directories
MEMORY_DIR="$HOME/.blackroad/memory"
TASKS_DIR="$MEMORY_DIR/tasks"
COORDINATION_DIR="$MEMORY_DIR/coordinator"
MESSAGES_DIR="$MEMORY_DIR/messages"
JOURNAL="$MEMORY_DIR/journals/$(date +%Y%m%d).jsonl"

# Ensure directories exist
mkdir -p "$TASKS_DIR" "$COORDINATION_DIR" "$MESSAGES_DIR" "$(dirname $JOURNAL)"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Command: discover - Find available agents
if [ "$1" = "discover" ]; then
    echo -e "${CYAN}🔍 Discovering Active Agents...${NC}"
    echo ""
    
    ACTIVE_DIR="$MEMORY_DIR/active-agents"
    TOTAL=$(ls -1 "$ACTIVE_DIR"/*.json 2>/dev/null | wc -l | tr -d ' ')
    
    echo "Total active agents: $TOTAL"
    echo ""
    
    for agent_file in "$ACTIVE_DIR"/*.json; do
        if [ -f "$agent_file" ]; then
            AGENT_ID=$(jq -r '.agent_id' "$agent_file" 2>/dev/null || echo "unknown")
            NAME=$(jq -r '.display_name' "$agent_file" 2>/dev/null || echo "Unknown")
            ROLE=$(jq -r '.role // "agent"' "$agent_file" 2>/dev/null)
            SPEC=$(jq -r '.specialization // "general"' "$agent_file" 2>/dev/null)
            STATUS=$(jq -r '.status // "unknown"' "$agent_file" 2>/dev/null)
            
            if [ "$STATUS" = "active" ]; then
                echo -e "  ${GREEN}●${NC} $NAME ($ROLE) - $SPEC"
                echo "     ID: $AGENT_ID"
            fi
        fi
    done
    
    exit 0
fi

# Command: assign - Assign task to agent based on specialization
if [ "$1" = "assign" ]; then
    TASK_DESC="$2"
    REQUIRED_SPEC="$3"
    
    echo -e "${CYAN}🎯 Finding agent for task...${NC}"
    echo "Task: $TASK_DESC"
    echo "Required: $REQUIRED_SPEC"
    echo ""
    
    # Find best matching agent
    BEST_AGENT=""
    for agent_file in "$MEMORY_DIR/active-agents"/*.json; do
        if [ -f "$agent_file" ]; then
            SPEC=$(jq -r '.specialization // ""' "$agent_file" 2>/dev/null)
            STATUS=$(jq -r '.status' "$agent_file" 2>/dev/null)
            READY=$(jq -r '.ready_for_tasks // true' "$agent_file" 2>/dev/null)
            
            if [ "$STATUS" = "active" ] && [ "$READY" = "true" ]; then
                if [[ "$SPEC" == *"$REQUIRED_SPEC"* ]]; then
                    AGENT_ID=$(jq -r '.agent_id' "$agent_file" 2>/dev/null)
                    BEST_AGENT="$AGENT_ID"
                    break
                fi
            fi
        fi
    done
    
    if [ -n "$BEST_AGENT" ]; then
        echo -e "${GREEN}✅ Assigned to: $BEST_AGENT${NC}"
        
        # Create task file
        TASK_ID="task-$(date +%s)-$(echo $RANDOM | shasum | cut -c1-8)"
        cat > "$TASKS_DIR/${TASK_ID}.json" << TASK
{
  "task_id": "$TASK_ID",
  "description": "$TASK_DESC",
  "assigned_to": "$BEST_AGENT",
  "required_spec": "$REQUIRED_SPEC",
  "status": "assigned",
  "created": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "priority": "normal"
}
TASK
        
        echo "Task ID: $TASK_ID"
        
        # Log to memory
        cat >> "$JOURNAL" << MEMORY
{"timestamp":"$(date -u +"%Y-%m-%dT%H:%M:%SZ")","action":"task_assigned","task":"$TASK_ID","description":"$TASK_DESC","assigned_to":"$BEST_AGENT","required_spec":"$REQUIRED_SPEC"}
MEMORY
        
        echo "$TASK_ID"
    else
        echo -e "${YELLOW}⚠️  No suitable agent found${NC}"
        exit 1
    fi
    
    exit 0
fi

# Command: broadcast - Send message to all agents  
if [ "$1" = "broadcast" ]; then
    FROM_AGENT="$2"
    MESSAGE="$3"
    
    echo -e "${CYAN}📡 Broadcasting message...${NC}"
    
    MSG_ID="msg-$(date +%s)-$(echo $RANDOM | shasum | cut -c1-8)"
    cat > "$MESSAGES_DIR/${MSG_ID}.json" << MSG
{
  "message_id": "$MSG_ID",
  "from": "$FROM_AGENT",
  "to": "broadcast",
  "message": "$MESSAGE",
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "type": "broadcast"
}
MSG
    
    # Log to memory
    cat >> "$JOURNAL" << MEMORY
{"timestamp":"$(date -u +"%Y-%m-%dT%H:%M:%SZ")","action":"message_broadcast","message_id":"$MSG_ID","from":"$FROM_AGENT","message":"$MESSAGE"}
MEMORY
    
    echo -e "${GREEN}✅ Message broadcast${NC}"
    echo "Message ID: $MSG_ID"
    
    exit 0
fi

# Command: status - Show coordination status
if [ "$1" = "status" ]; then
    echo -e "${CYAN}📊 Coordination System Status${NC}"
    echo ""
    
    ACTIVE_AGENTS=$(ls -1 "$MEMORY_DIR/active-agents"/*.json 2>/dev/null | wc -l | tr -d ' ')
    PENDING_TASKS=$(find "$TASKS_DIR" -name "*.json" 2>/dev/null | wc -l | tr -d ' ')
    TOTAL_MESSAGES=$(ls -1 "$MESSAGES_DIR"/*.json 2>/dev/null | wc -l | tr -d ' ')
    
    echo -e "  Active Agents:    ${GREEN}$ACTIVE_AGENTS${NC}"
    echo -e "  Pending Tasks:    ${YELLOW}$PENDING_TASKS${NC}"
    echo -e "  Total Messages:   ${BLUE}$TOTAL_MESSAGES${NC}"
    
    exit 0
fi

# Default: show help
echo "🤝 BlackRoad Multi-Agent Coordination System"
echo ""
echo "Commands:"
echo "  discover                          - List all active agents"
echo "  assign <task> <specialization>    - Assign task to best agent"
echo "  broadcast <from> <message>        - Broadcast message to all"
echo "  status                            - Show coordination status"
