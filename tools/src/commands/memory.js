/**
 * Memory CLI Commands
 */

import { BlackRoadClient } from '@blackroad/sdk';
import { requireApiKey } from '../config.js';

export function memoryCommands(program, config) {
  program
    .command('log')
    .description('Log an entry to the memory system')
    .requiredOption('-a, --action <action>', 'Action type')
    .requiredOption('-e, --entity <entity>', 'Entity name')
    .requiredOption('-d, --details <details>', 'Details message')
    .option('-t, --tags <tags>', 'Comma-separated tags')
    .action(async (options) => {
      requireApiKey(config);
      const client = new BlackRoadClient({ apiKey: config.apiKey, apiUrl: config.apiUrl });

      const entry = await client.memory.log({
        action: options.action,
        entity: options.entity,
        details: options.details,
        tags: options.tags?.split(',') || []
      });

      console.log(`\n  ✓ Entry logged: ${entry.id}\n`);
    });

  program
    .command('list')
    .description('List recent memory entries')
    .option('-l, --limit <limit>', 'Number of entries', '20')
    .option('-a, --action <action>', 'Filter by action type')
    .option('-f, --format <format>', 'Output format (json, table)', 'table')
    .action(async (options) => {
      requireApiKey(config);
      const client = new BlackRoadClient({ apiKey: config.apiKey, apiUrl: config.apiUrl });

      const result = await client.memory.list({
        limit: parseInt(options.limit),
        action: options.action
      });

      if (options.format === 'json') {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log('\n  Timestamp            | Action      | Entity           | Details');
        console.log('  ' + '-'.repeat(90));
        result.entries.forEach(e => {
          const time = e.timestamp.slice(0, 19);
          const details = e.details.slice(0, 40) + (e.details.length > 40 ? '...' : '');
          console.log(`  ${time} | ${e.action.padEnd(11)} | ${e.entity.padEnd(16)} | ${details}`);
        });
        console.log(`\n  Total: ${result.entries.length} entries\n`);
      }
    });

  program
    .command('search <query>')
    .description('Search memory entries')
    .option('-l, --limit <limit>', 'Number of results', '20')
    .action(async (query, options) => {
      requireApiKey(config);
      const client = new BlackRoadClient({ apiKey: config.apiKey, apiUrl: config.apiUrl });

      const result = await client.memory.search(query, {
        limit: parseInt(options.limit)
      });

      console.log(`\n  Found ${result.entries.length} matching entries:\n`);
      result.entries.forEach(e => {
        console.log(`  [${e.timestamp.slice(0, 19)}] ${e.action}: ${e.entity}`);
        console.log(`    ${e.details}\n`);
      });
    });

  program
    .command('verify')
    .description('Verify hash chain integrity')
    .action(async () => {
      requireApiKey(config);
      const client = new BlackRoadClient({ apiKey: config.apiKey, apiUrl: config.apiUrl });

      const result = await client.memory.verify();

      if (result.valid) {
        console.log(`\n  ✓ Chain valid: ${result.entriesChecked} entries verified\n`);
      } else {
        console.log(`\n  ✗ Chain invalid!`);
        console.log(`    Errors: ${result.errors.join(', ')}\n`);
      }
    });
}
