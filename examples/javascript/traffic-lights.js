/**
 * Traffic Lights Example
 *
 * Demonstrates managing project status with traffic lights.
 */

import { BlackRoadClient } from '@blackroad/sdk';

const API_KEY = process.env.BLACKROAD_API_KEY;
const client = new BlackRoadClient({ apiKey: API_KEY });

const COLORS = {
  green: '\x1b[32m🟢\x1b[0m',
  yellow: '\x1b[33m🟡\x1b[0m',
  red: '\x1b[31m🔴\x1b[0m'
};

async function main() {
  console.log('=== BlackRoad Traffic Lights Example ===\n');

  // 1. List all project statuses
  console.log('📊 Current Project Statuses:\n');

  const lights = await client.trafficLights.list();

  console.log(`Summary: ${lights.summary.green} green, ${lights.summary.yellow} yellow, ${lights.summary.red} red\n`);

  // Group by status
  const grouped = { green: [], yellow: [], red: [] };
  lights.projects.forEach(p => grouped[p.status].push(p));

  ['green', 'yellow', 'red'].forEach(status => {
    if (grouped[status].length > 0) {
      console.log(`${COLORS[status]} ${status.toUpperCase()} (${grouped[status].length})`);
      grouped[status].forEach(p => {
        console.log(`   ${p.projectId}: ${p.reason}`);
      });
      console.log('');
    }
  });

  // 2. Set a project status
  console.log('Setting project status...');

  const projectId = 'example-service';
  const updated = await client.trafficLights.set(projectId, {
    status: 'yellow',
    reason: 'Testing new deployment'
  });

  console.log(`  ✓ Set ${projectId} to ${COLORS[updated.status]} ${updated.status}`);
  console.log(`    Reason: ${updated.reason}`);
  console.log(`    Updated: ${updated.updatedAt}`);

  // 3. Get history for a project
  console.log('\nGetting status history...');

  const project = await client.trafficLights.get(projectId);

  if (project.history && project.history.length > 0) {
    console.log(`\n📅 History for ${projectId}:`);
    project.history.slice(0, 5).forEach(entry => {
      console.log(`  ${entry.timestamp.slice(0, 19)} ${COLORS[entry.status]} ${entry.reason}`);
    });
  }

  // 4. Update to green (deployment successful)
  console.log('\nUpdating to green...');

  await client.trafficLights.set(projectId, {
    status: 'green',
    reason: 'Deployment successful, all tests passing'
  });

  console.log(`  ✓ ${projectId} is now ${COLORS.green} green`);

  // 5. Log status change to memory
  await client.memory.log({
    action: 'deployed',
    entity: projectId,
    details: 'Deployment successful, status set to green',
    tags: ['traffic-light', 'deployment']
  });

  console.log('  ✓ Logged to memory');

  // 6. Demonstrate blocked workflow
  console.log('\n--- Demonstrating blocked workflow ---\n');

  const blockedProject = 'feature-payments';

  await client.trafficLights.set(blockedProject, {
    status: 'red',
    reason: 'Blocked: Waiting for security review'
  });

  console.log(`${COLORS.red} ${blockedProject}: Blocked - waiting for security review`);

  await client.memory.log({
    action: 'blocked',
    entity: blockedProject,
    details: 'Blocked on security review. Reviewer: security-team',
    tags: ['blocked', 'security']
  });

  console.log('  ✓ Logged blocker to memory');

  // Later, resolve the blocker
  console.log('\n  (Security review completed)');

  await client.trafficLights.set(blockedProject, {
    status: 'green',
    reason: 'Security review passed'
  });

  console.log(`${COLORS.green} ${blockedProject}: Ready - security review passed`);

  await client.memory.log({
    action: 'fixed',
    entity: blockedProject,
    details: 'Security review completed, blocker resolved',
    tags: ['unblocked', 'security']
  });

  console.log('\n✓ Traffic lights example complete!');
}

if (!API_KEY) {
  console.error('ERROR: BLACKROAD_API_KEY environment variable required');
  process.exit(1);
}

main().catch(console.error);
