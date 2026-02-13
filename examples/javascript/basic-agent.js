/**
 * Basic BlackRoad Agent Example
 *
 * Demonstrates agent registration, heartbeat, and basic operations.
 */

import { BlackRoadClient } from '@blackroad/sdk';

const API_KEY = process.env.BLACKROAD_API_KEY;
const AGENT_NAME = process.env.AGENT_NAME || 'js-example-agent';

const client = new BlackRoadClient({ apiKey: API_KEY });

let agentId = null;

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down...');
  if (agentId) {
    await client.agents.deregister(agentId);
    console.log(`Deregistered agent: ${agentId}`);
  }
  process.exit(0);
});

async function main() {
  console.log('=== BlackRoad Basic Agent Example ===\n');

  // 1. Register agent
  console.log('Registering agent...');
  const agent = await client.agents.register({
    name: AGENT_NAME,
    type: 'ai',
    capabilities: ['javascript', 'frontend', 'testing'],
    metadata: {
      version: '1.0.0',
      runtime: 'node',
      language: 'javascript'
    }
  });
  agentId = agent.id;
  console.log(`✓ Registered: ${agentId}`);

  // 2. Log startup to memory
  console.log('\nLogging to memory...');
  const entry = await client.memory.log({
    action: 'announce',
    entity: AGENT_NAME,
    details: 'JavaScript agent started with capabilities: javascript, frontend, testing',
    tags: ['startup', 'javascript', 'example']
  });
  console.log(`✓ Memory entry: ${entry.id.slice(0, 16)}...`);

  // 3. Search Codex
  console.log('\nSearching Codex...');
  const results = await client.codex.search('react component', { limit: 5 });
  console.log(`✓ Found ${results.components.length} components:`);
  results.components.slice(0, 3).forEach(comp => {
    console.log(`  - ${comp.name} (${comp.type}) in ${comp.filePath}`);
  });

  // 4. Check traffic lights
  console.log('\nChecking traffic lights...');
  const lights = await client.trafficLights.list();
  const { summary } = lights;
  console.log(`✓ Projects: ${summary.green} green, ${summary.yellow} yellow, ${summary.red} red`);

  // 5. Start heartbeat loop
  console.log('\nStarting heartbeat (Ctrl+C to stop)...');
  setInterval(async () => {
    await client.agents.heartbeat({
      agentId: agentId,
      status: 'active',
      metrics: {
        uptime: process.uptime(),
        memoryMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
      }
    });
    process.stdout.write('♥');
  }, 30000);
}

if (!API_KEY) {
  console.error('ERROR: BLACKROAD_API_KEY environment variable required');
  process.exit(1);
}

main().catch(console.error);
