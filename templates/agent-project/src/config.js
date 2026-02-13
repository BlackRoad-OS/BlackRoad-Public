/**
 * Agent Configuration
 *
 * Loads configuration from environment variables and config files.
 */

export const config = {
  // API Configuration
  apiKey: process.env.BLACKROAD_API_KEY,
  apiUrl: process.env.BLACKROAD_API_URL || 'https://api.blackroad.io/v1',

  // Agent Configuration
  agentName: process.env.AGENT_NAME || 'blackroad-agent',
  agentType: process.env.AGENT_TYPE || 'ai',
  capabilities: (process.env.AGENT_CAPABILITIES || 'general').split(','),

  // Heartbeat Configuration
  heartbeatInterval: parseInt(process.env.HEARTBEAT_INTERVAL || '30000', 10),

  // Task Polling Configuration
  taskPollInterval: parseInt(process.env.TASK_POLL_INTERVAL || '10000', 10),

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info'
};

// Validate required configuration
if (!config.apiKey) {
  console.error('ERROR: BLACKROAD_API_KEY environment variable is required');
  process.exit(1);
}
