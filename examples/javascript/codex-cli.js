#!/usr/bin/env node
/**
 * Codex CLI Tool
 *
 * Command-line interface for searching the BlackRoad Codex.
 *
 * Usage:
 *   node codex-cli.js search "auth middleware"
 *   node codex-cli.js stats
 *   node codex-cli.js search "database" --type class --lang python
 */

import { BlackRoadClient } from '@blackroad/sdk';

const API_KEY = process.env.BLACKROAD_API_KEY;
const client = new BlackRoadClient({ apiKey: API_KEY });

const ICONS = {
  function: 'ƒ',
  class: '⬡',
  module: '📦',
  endpoint: '🔌'
};

async function showStats() {
  console.log('\n📊 Codex Statistics\n');

  const stats = await client.codex.stats();

  console.log(`Total Components: ${stats.totalComponents.toLocaleString()}`);
  console.log('');
  console.log('By Type:');
  Object.entries(stats.byType).forEach(([type, count]) => {
    console.log(`  ${ICONS[type] || '•'} ${type}: ${count.toLocaleString()}`);
  });
  console.log('');
  console.log('By Language:');
  Object.entries(stats.byLanguage)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([lang, count]) => {
      console.log(`  ${lang}: ${count.toLocaleString()}`);
    });
  console.log('');
  console.log(`Last Indexed: ${stats.lastIndexed}`);
}

async function search(query, options = {}) {
  console.log(`\n🔍 Searching: "${query}"`);
  if (options.type) console.log(`   Type: ${options.type}`);
  if (options.lang) console.log(`   Language: ${options.lang}`);
  console.log('');

  const results = await client.codex.search(query, {
    type: options.type,
    language: options.lang,
    limit: options.limit || 20
  });

  if (results.components.length === 0) {
    console.log('No results found.');
    return;
  }

  console.log(`Found ${results.components.length} components (${results.tookMs}ms)\n`);

  results.components.forEach((comp, i) => {
    const icon = ICONS[comp.type] || '•';
    console.log(`${i + 1}. ${icon} ${comp.name}`);
    console.log(`   ${comp.filePath}:${comp.lineNumber}`);
    console.log(`   Language: ${comp.language} | Type: ${comp.type}`);
    if (comp.signature) {
      const sig = comp.signature.length > 70
        ? comp.signature.slice(0, 67) + '...'
        : comp.signature;
      console.log(`   Signature: ${sig}`);
    }
    console.log('');
  });
}

function parseArgs(args) {
  const result = { _: [] };
  let i = 0;

  while (i < args.length) {
    const arg = args[i];

    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const value = args[i + 1];
      if (value && !value.startsWith('--')) {
        result[key] = value;
        i += 2;
      } else {
        result[key] = true;
        i += 1;
      }
    } else {
      result._.push(arg);
      i += 1;
    }
  }

  return result;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = args._[0];

  if (!API_KEY) {
    console.error('ERROR: BLACKROAD_API_KEY environment variable required');
    process.exit(1);
  }

  switch (command) {
    case 'stats':
      await showStats();
      break;

    case 'search':
      const query = args._.slice(1).join(' ');
      if (!query) {
        console.error('Usage: codex-cli search "query" [--type function|class] [--lang python|javascript]');
        process.exit(1);
      }
      await search(query, {
        type: args.type,
        lang: args.lang,
        limit: parseInt(args.limit || '20', 10)
      });
      break;

    case 'help':
    default:
      console.log(`
Codex CLI - Search the BlackRoad Codex

Usage:
  codex-cli stats                          Show index statistics
  codex-cli search "query"                 Search for components
  codex-cli search "query" --type class    Filter by type
  codex-cli search "query" --lang python   Filter by language
  codex-cli search "query" --limit 50      Limit results

Examples:
  codex-cli search "authentication"
  codex-cli search "database connection" --type class
  codex-cli search "middleware" --lang javascript
`);
      break;
  }
}

main().catch(console.error);
