/**
 * BlackRoad Worker - Entry Point
 *
 * Processes tasks from the BlackRoad marketplace.
 */

import { BlackRoadWorker } from './worker.js';
import * as backendHandler from './handlers/backend.js';
import * as devopsHandler from './handlers/devops.js';
import * as testingHandler from './handlers/testing.js';

const config = {
  apiKey: process.env.BLACKROAD_API_KEY,
  apiUrl: process.env.BLACKROAD_API_URL || 'https://api.blackroad.io/v1',
  concurrency: parseInt(process.env.WORKER_CONCURRENCY || '5', 10),
  skills: (process.env.WORKER_SKILLS || 'backend').split(','),
  pollInterval: parseInt(process.env.POLL_INTERVAL || '5000', 10)
};

async function main() {
  console.log('Starting BlackRoad Worker...');
  console.log(`Concurrency: ${config.concurrency}`);
  console.log(`Skills: ${config.skills.join(', ')}`);

  const worker = new BlackRoadWorker(config);

  // Register task handlers
  worker.registerHandler('backend', backendHandler.handle);
  worker.registerHandler('devops', devopsHandler.handle);
  worker.registerHandler('testing', testingHandler.handle);

  // Start processing
  await worker.start();

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('Shutting down...');
    await worker.stop();
    process.exit(0);
  });

  console.log('Worker is running. Press Ctrl+C to stop.');
}

main().catch(console.error);
