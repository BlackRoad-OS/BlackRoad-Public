/**
 * BlackRoad Agent Configuration
 *
 * This file configures the agent's behavior within the BlackRoad ecosystem.
 */

export default {
  // Agent identity
  agent: {
    name: process.env.AGENT_NAME || 'blackroad-agent',
    type: 'ai',
    version: '1.0.0'
  },

  // Capabilities this agent can handle
  capabilities: [
    'code-review',
    'testing',
    'deployment'
  ],

  // Task handling configuration
  tasks: {
    // Priority of tasks to claim (higher = more important)
    priorityOrder: ['urgent', 'high', 'medium', 'low'],

    // Maximum concurrent tasks
    maxConcurrent: 1,

    // Timeout for task processing (ms)
    timeout: 300000 // 5 minutes
  },

  // Memory system configuration
  memory: {
    // Automatic logging of actions
    autoLog: true,

    // Tags to add to all log entries
    defaultTags: ['agent']
  },

  // Traffic light configuration
  trafficLights: {
    // Projects this agent is responsible for
    projects: []
  },

  // Health check configuration
  health: {
    port: 3000,
    path: '/health'
  }
};
