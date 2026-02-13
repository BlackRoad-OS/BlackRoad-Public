/**
 * Agent CLI Commands
 */

import { BlackRoadClient } from '@blackroad/sdk';
import { requireApiKey } from '../config.js';

export function agentCommands(program, config) {
  program
    .command('list')
    .description('List all registered agents')
    .option('-s, --status <status>', 'Filter by status (active, idle, offline)')
    .option('-t, --type <type>', 'Filter by type (ai, hardware, service)')
    .option('-f, --format <format>', 'Output format (json, table)', 'table')
    .action(async (options) => {
      requireApiKey(config);
      const client = new BlackRoadClient({ apiKey: config.apiKey, apiUrl: config.apiUrl });

      const result = await client.agents.list({
        status: options.status,
        type: options.type
      });

      if (options.format === 'json') {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log('\n  ID                                    | Name           | Type     | Status');
        console.log('  ' + '-'.repeat(80));
        result.agents.forEach(a => {
          console.log(`  ${a.id.padEnd(40)} | ${a.name.padEnd(14)} | ${a.type.padEnd(8)} | ${a.status}`);
        });
        console.log(`\n  Total: ${result.agents.length} agents\n`);
      }
    });

  program
    .command('register')
    .description('Register a new agent')
    .requiredOption('-n, --name <name>', 'Agent name')
    .option('-t, --type <type>', 'Agent type', 'ai')
    .option('-c, --capabilities <caps>', 'Comma-separated capabilities')
    .action(async (options) => {
      requireApiKey(config);
      const client = new BlackRoadClient({ apiKey: config.apiKey, apiUrl: config.apiUrl });

      const agent = await client.agents.register({
        name: options.name,
        type: options.type,
        capabilities: options.capabilities?.split(',') || []
      });

      console.log(`\n  ✓ Agent registered: ${agent.id}\n`);
    });

  program
    .command('heartbeat <agentId>')
    .description('Send heartbeat for an agent')
    .action(async (agentId) => {
      requireApiKey(config);
      const client = new BlackRoadClient({ apiKey: config.apiKey, apiUrl: config.apiUrl });

      await client.agents.heartbeat({ agentId, status: 'active' });
      console.log(`\n  ✓ Heartbeat sent for ${agentId}\n`);
    });

  program
    .command('deregister <agentId>')
    .description('Deregister an agent')
    .action(async (agentId) => {
      requireApiKey(config);
      const client = new BlackRoadClient({ apiKey: config.apiKey, apiUrl: config.apiUrl });

      await client.agents.deregister(agentId);
      console.log(`\n  ✓ Agent deregistered: ${agentId}\n`);
    });
}
