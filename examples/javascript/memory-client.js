/**
 * Memory System Client Example
 *
 * Demonstrates memory logging, querying, and verification.
 */

import { BlackRoadClient } from '@blackroad/sdk';

const API_KEY = process.env.BLACKROAD_API_KEY;
const client = new BlackRoadClient({ apiKey: API_KEY });

async function main() {
  console.log('=== BlackRoad Memory Client Example ===\n');

  // 1. Log different action types
  console.log('Logging various action types...');

  const actions = [
    {
      action: 'announce',
      entity: 'feature-ui-redesign',
      details: 'Starting UI redesign project',
      tags: ['ui', 'frontend']
    },
    {
      action: 'progress',
      entity: 'feature-ui-redesign',
      details: 'Completed component library migration',
      tags: ['ui', 'components']
    },
    {
      action: 'decided',
      entity: 'feature-ui-redesign',
      details: 'Using CSS-in-JS with styled-components',
      tags: ['ui', 'architecture']
    },
    {
      action: 'blocked',
      entity: 'feature-ui-redesign',
      details: 'Waiting for design team approval on color palette',
      tags: ['ui', 'blocked']
    },
    {
      action: 'fixed',
      entity: 'feature-ui-redesign',
      details: 'Resolved responsive layout issues on mobile',
      tags: ['ui', 'bugfix']
    }
  ];

  for (const entry of actions) {
    const result = await client.memory.log(entry);
    console.log(`  ✓ ${entry.action}: ${result.id.slice(0, 12)}...`);
  }

  // 2. Query recent entries
  console.log('\nQuerying recent entries...');
  const recent = await client.memory.list({ limit: 10 });
  console.log(`  Found ${recent.entries.length} recent entries`);

  recent.entries.slice(0, 5).forEach(entry => {
    console.log(`  [${entry.timestamp.slice(0, 19)}] ${entry.action}: ${entry.entity}`);
  });

  // 3. Filter by action type
  console.log('\nFiltering by action type...');
  const blocked = await client.memory.list({ action: 'blocked', limit: 5 });
  console.log(`  Found ${blocked.entries.length} blocked entries`);

  // 4. Filter by tags
  console.log('\nFiltering by tags...');
  const uiEntries = await client.memory.list({ tags: ['ui'], limit: 10 });
  console.log(`  Found ${uiEntries.entries.length} UI-related entries`);

  // 5. Verify hash chain
  console.log('\nVerifying hash chain integrity...');
  const verification = await client.memory.verify();
  if (verification.valid) {
    console.log(`  ✓ Chain valid: ${verification.entriesChecked} entries verified`);
  } else {
    console.log(`  ✗ Chain invalid: ${verification.errors.join(', ')}`);
  }

  // 6. Get timeline view
  console.log('\nTimeline view...');
  const timeline = await client.memory.list({
    limit: 20,
    order: 'desc'
  });

  console.log('\n  📅 Recent Activity:');
  let currentDate = '';
  timeline.entries.forEach(entry => {
    const date = entry.timestamp.slice(0, 10);
    if (date !== currentDate) {
      currentDate = date;
      console.log(`\n  ${date}`);
    }
    console.log(`    ${entry.timestamp.slice(11, 19)} ${entry.action.padEnd(10)} ${entry.entity}`);
  });

  console.log('\n✓ Memory client example complete!');
}

if (!API_KEY) {
  console.error('ERROR: BLACKROAD_API_KEY environment variable required');
  process.exit(1);
}

main().catch(console.error);
