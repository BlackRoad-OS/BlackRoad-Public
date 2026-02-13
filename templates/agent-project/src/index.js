/**
 * BlackRoad Agent - Entry Point
 *
 * This is the main entry point for your BlackRoad agent.
 * It handles registration, heartbeat, and task processing.
 */

import { BlackRoadAgent } from './agent.js';
import { config } from './config.js';

async function main() {
  console.log('Starting BlackRoad Agent...');

  // Create agent instance
  const agent = new BlackRoadAgent({
    name: config.agentName,
    type: config.agentType,
    capabilities: config.capabilities,
    apiKey: config.apiKey,
    apiUrl: config.apiUrl
  });

  // Register with Agent Registry
  await agent.register();
  console.log(`Agent registered: ${agent.id}`);

  // Start heartbeat
  agent.startHeartbeat(30000); // 30 second intervals
  console.log('Heartbeat started');

  // Log startup to memory
  await agent.logMemory({
    action: 'announce',
    entity: config.agentName,
    details: `Agent started and registered with capabilities: ${config.capabilities.join(', ')}`,
    tags: ['startup', 'agent']
  });

  // Set up task handling
  agent.on('task', async (task) => {
    console.log(`Received task: ${task.id} - ${task.title}`);

    try {
      // Process the task
      const result = await processTask(task);

      // Complete the task
      await agent.completeTask(task.id, result);
      console.log(`Task completed: ${task.id}`);

    } catch (error) {
      console.error(`Task failed: ${task.id}`, error);
      await agent.logMemory({
        action: 'blocked',
        entity: task.id,
        details: `Task failed: ${error.message}`,
        tags: ['error', 'task']
      });
    }
  });

  // Start polling for tasks
  agent.startTaskPolling(10000); // 10 second intervals
  console.log('Task polling started');

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('Shutting down...');
    await agent.deregister();
    process.exit(0);
  });

  console.log('Agent is running. Press Ctrl+C to stop.');
}

/**
 * Process a task from the marketplace
 * @param {Object} task - The task to process
 * @returns {string} - Completion summary
 */
async function processTask(task) {
  // Implement your task processing logic here

  switch (task.type) {
    case 'code-review':
      return await handleCodeReview(task);
    case 'testing':
      return await handleTesting(task);
    case 'deployment':
      return await handleDeployment(task);
    default:
      return `Processed task: ${task.title}`;
  }
}

async function handleCodeReview(task) {
  // Implement code review logic
  return 'Code review completed. No issues found.';
}

async function handleTesting(task) {
  // Implement testing logic
  return 'All tests passed.';
}

async function handleDeployment(task) {
  // Implement deployment logic
  return 'Deployment successful.';
}

// Start the agent
main().catch(console.error);
