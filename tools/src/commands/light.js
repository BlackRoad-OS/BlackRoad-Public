/**
 * Traffic Light CLI Commands
 */

import { BlackRoadClient } from '@blackroad/sdk';
import { requireApiKey } from '../config.js';

const COLORS = {
  green: '🟢',
  yellow: '🟡',
  red: '🔴'
};

export function lightCommands(program, config) {
  program
    .command('list')
    .description('List all project statuses')
    .option('-s, --status <status>', 'Filter by status (green, yellow, red)')
    .option('-f, --format <format>', 'Output format (json, table)', 'table')
    .action(async (options) => {
      requireApiKey(config);
      const client = new BlackRoadClient({ apiKey: config.apiKey, apiUrl: config.apiUrl });

      const result = await client.trafficLights.list({ status: options.status });

      if (options.format === 'json') {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log('\n  Traffic Light Summary\n');
        console.log(`  ${COLORS.green} Green: ${result.summary.green}   ${COLORS.yellow} Yellow: ${result.summary.yellow}   ${COLORS.red} Red: ${result.summary.red}\n`);

        if (result.projects.length > 0) {
          console.log('  Projects:\n');
          result.projects.forEach(p => {
            console.log(`  ${COLORS[p.status]} ${p.projectId}`);
            console.log(`     ${p.reason}`);
            console.log(`     Updated: ${p.updatedAt.slice(0, 19)}\n`);
          });
        }
      }
    });

  program
    .command('get <projectId>')
    .description('Get project status')
    .action(async (projectId) => {
      requireApiKey(config);
      const client = new BlackRoadClient({ apiKey: config.apiKey, apiUrl: config.apiUrl });

      const project = await client.trafficLights.get(projectId);

      console.log(`\n  ${COLORS[project.status]} ${project.projectId}\n`);
      console.log(`  Status: ${project.status}`);
      console.log(`  Reason: ${project.reason}`);
      console.log(`  Updated: ${project.updatedAt}`);

      if (project.history && project.history.length > 0) {
        console.log('\n  History:');
        project.history.slice(0, 5).forEach(h => {
          console.log(`    ${h.timestamp.slice(0, 19)} ${COLORS[h.status]} ${h.reason}`);
        });
      }
      console.log('');
    });

  program
    .command('set <projectId> <status> [reason]')
    .description('Set project status (green, yellow, red)')
    .action(async (projectId, status, reason) => {
      requireApiKey(config);
      const client = new BlackRoadClient({ apiKey: config.apiKey, apiUrl: config.apiUrl });

      if (!['green', 'yellow', 'red'].includes(status)) {
        console.error('Status must be: green, yellow, or red');
        process.exit(1);
      }

      const updated = await client.trafficLights.set(projectId, {
        status,
        reason: reason || `Set to ${status}`
      });

      console.log(`\n  ✓ ${projectId} set to ${COLORS[updated.status]} ${updated.status}\n`);
    });

  program
    .command('summary')
    .description('Show status summary')
    .action(async () => {
      requireApiKey(config);
      const client = new BlackRoadClient({ apiKey: config.apiKey, apiUrl: config.apiUrl });

      const result = await client.trafficLights.list();
      const { summary } = result;

      console.log('\n  🚦 Traffic Light Summary\n');
      console.log(`  ${COLORS.green} Ready (green):    ${summary.green}`);
      console.log(`  ${COLORS.yellow} In Progress:      ${summary.yellow}`);
      console.log(`  ${COLORS.red} Blocked (red):    ${summary.red}`);
      console.log(`\n  Total: ${summary.green + summary.yellow + summary.red} projects\n`);
    });
}
