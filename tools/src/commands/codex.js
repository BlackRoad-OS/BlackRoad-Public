/**
 * Codex CLI Commands
 */

import { BlackRoadClient } from '@blackroad/sdk';
import { requireApiKey } from '../config.js';

const ICONS = {
  function: 'ƒ',
  class: '⬡',
  module: '📦',
  endpoint: '🔌'
};

export function codexCommands(program, config) {
  program
    .command('search <query>')
    .description('Search the Codex index')
    .option('-t, --type <type>', 'Filter by type (function, class, module)')
    .option('-l, --lang <language>', 'Filter by language')
    .option('-n, --limit <limit>', 'Number of results', '20')
    .option('-f, --format <format>', 'Output format (json, table)', 'table')
    .action(async (query, options) => {
      requireApiKey(config);
      const client = new BlackRoadClient({ apiKey: config.apiKey, apiUrl: config.apiUrl });

      const result = await client.codex.search(query, {
        type: options.type,
        language: options.lang,
        limit: parseInt(options.limit)
      });

      if (options.format === 'json') {
        console.log(JSON.stringify(result, null, 2));
      } else {
        console.log(`\n  🔍 "${query}" - Found ${result.components.length} results (${result.tookMs}ms)\n`);

        result.components.forEach((c, i) => {
          const icon = ICONS[c.type] || '•';
          console.log(`  ${i + 1}. ${icon} ${c.name}`);
          console.log(`     ${c.filePath}:${c.lineNumber}`);
          console.log(`     Language: ${c.language} | Type: ${c.type}`);
          if (c.signature) {
            const sig = c.signature.length > 60 ? c.signature.slice(0, 57) + '...' : c.signature;
            console.log(`     Signature: ${sig}`);
          }
          console.log('');
        });
      }
    });

  program
    .command('stats')
    .description('Show Codex statistics')
    .option('-f, --format <format>', 'Output format (json, table)', 'table')
    .action(async (options) => {
      requireApiKey(config);
      const client = new BlackRoadClient({ apiKey: config.apiKey, apiUrl: config.apiUrl });

      const stats = await client.codex.stats();

      if (options.format === 'json') {
        console.log(JSON.stringify(stats, null, 2));
      } else {
        console.log('\n  📊 Codex Statistics\n');
        console.log(`  Total Components: ${stats.totalComponents.toLocaleString()}\n`);

        console.log('  By Type:');
        Object.entries(stats.byType).forEach(([type, count]) => {
          console.log(`    ${ICONS[type] || '•'} ${type}: ${count.toLocaleString()}`);
        });

        console.log('\n  Top Languages:');
        Object.entries(stats.byLanguage)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .forEach(([lang, count]) => {
            console.log(`    ${lang}: ${count.toLocaleString()}`);
          });

        console.log(`\n  Last Indexed: ${stats.lastIndexed}\n`);
      }
    });
}
