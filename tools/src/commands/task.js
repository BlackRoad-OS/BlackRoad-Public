/**
 * Task CLI Commands
 */

import { BlackRoadClient } from '@blackroad/sdk';
import { requireApiKey } from '../config.js';

const PRIORITY_ICONS = {
  urgent: '🔴',
  high: '🟠',
  medium: '🟡',
  low: '🟢'
};

export function taskCommands(program, config) {
  program
    .command('list')
    .description('List tasks')
    .option('-s, --status <status>', 'Filter by status (available, claimed, completed)')
    .option('-p, --priority <priority>', 'Filter by priority')
    .option('-l, --limit <limit>', 'Number of tasks', '20')
    .option('-f, --format <format>', 'Output format (json, table)', 'table')
    .action(async (options) => {
      requireApiKey(config);
      const client = new BlackRoadClient({ apiKey: config.apiKey, apiUrl: config.apiUrl });

      const result = await client.tasks.list({
        status: options.status,
        priority: options.priority,
        limit: parseInt(options.limit)
      });

      if (options.format === 'json') {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log('\n  📋 Task Marketplace\n');
        console.log(`  Available: ${result.stats.available} | Claimed: ${result.stats.claimed} | Completed: ${result.stats.completed}\n`);

        if (result.tasks.length > 0) {
          result.tasks.forEach(t => {
            const icon = PRIORITY_ICONS[t.priority] || '⚪';
            console.log(`  ${icon} [${t.id.slice(0, 16)}] ${t.title}`);
            console.log(`     Status: ${t.status} | Priority: ${t.priority}`);
            if (t.tags?.length > 0) {
              console.log(`     Tags: ${t.tags.join(', ')}`);
            }
            console.log('');
          });
        } else {
          console.log('  No tasks found\n');
        }
      }
    });

  program
    .command('claim <taskId>')
    .description('Claim a task')
    .action(async (taskId) => {
      requireApiKey(config);
      const client = new BlackRoadClient({ apiKey: config.apiKey, apiUrl: config.apiUrl });

      try {
        const task = await client.tasks.claim(taskId);
        console.log(`\n  ✓ Claimed: ${task.title}\n`);
      } catch (error) {
        if (error.message.includes('409')) {
          console.error('\n  ✗ Task already claimed\n');
        } else {
          throw error;
        }
      }
    });

  program
    .command('complete <taskId> [summary]')
    .description('Complete a task')
    .action(async (taskId, summary) => {
      requireApiKey(config);
      const client = new BlackRoadClient({ apiKey: config.apiKey, apiUrl: config.apiUrl });

      const task = await client.tasks.complete(taskId, {
        summary: summary || 'Task completed'
      });

      console.log(`\n  ✓ Completed: ${task.title}\n`);
    });

  program
    .command('create')
    .description('Create a new task')
    .requiredOption('-t, --title <title>', 'Task title')
    .option('-d, --description <desc>', 'Task description')
    .option('-p, --priority <priority>', 'Priority (urgent, high, medium, low)', 'medium')
    .option('--tags <tags>', 'Comma-separated tags')
    .option('--skills <skills>', 'Required skills')
    .action(async (options) => {
      requireApiKey(config);
      const client = new BlackRoadClient({ apiKey: config.apiKey, apiUrl: config.apiUrl });

      const task = await client.tasks.create({
        id: `cli-${Date.now()}`,
        title: options.title,
        description: options.description || options.title,
        priority: options.priority,
        tags: options.tags?.split(',') || [],
        requiredSkills: options.skills?.split(',') || []
      });

      console.log(`\n  ✓ Created: ${task.id}\n`);
    });

  program
    .command('stats')
    .description('Show task statistics')
    .action(async () => {
      requireApiKey(config);
      const client = new BlackRoadClient({ apiKey: config.apiKey, apiUrl: config.apiUrl });

      const result = await client.tasks.list();
      const { stats } = result;

      console.log('\n  📊 Task Statistics\n');
      console.log(`  Available:  ${stats.available}`);
      console.log(`  Claimed:    ${stats.claimed}`);
      console.log(`  Completed:  ${stats.completed}`);
      console.log(`\n  Total: ${stats.available + stats.claimed + stats.completed}\n`);
    });
}
