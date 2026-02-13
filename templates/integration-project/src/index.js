/**
 * BlackRoad Integration Server
 *
 * Receives webhooks from external services and syncs to BlackRoad.
 */

import http from 'http';
import crypto from 'crypto';
import { BlackRoadClient } from '@blackroad/sdk';
import { GitHubHandler } from './handlers/github.js';
import { SlackHandler } from './handlers/slack.js';
import { WebhookHandler } from './handlers/webhook.js';

// Configuration
const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  apiKey: process.env.BLACKROAD_API_KEY,
  webhookSecret: process.env.WEBHOOK_SECRET,
  integrationName: process.env.INTEGRATION_NAME || 'blackroad-integration'
};

// Initialize BlackRoad client
const blackroad = new BlackRoadClient({ apiKey: config.apiKey });

// Initialize handlers
const handlers = {
  github: new GitHubHandler({ client: blackroad, secret: config.webhookSecret }),
  slack: new SlackHandler({ client: blackroad }),
  generic: new WebhookHandler({ client: blackroad })
};

/**
 * Verify webhook signature
 */
function verifySignature(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(`sha256=${expected}`)
  );
}

/**
 * Parse request body
 */
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (e) {
        resolve({ raw: body });
      }
    });
    req.on('error', reject);
  });
}

/**
 * HTTP request handler
 */
async function handleRequest(req, res) {
  const url = new URL(req.url, `http://localhost:${config.port}`);

  // Health check
  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', integration: config.integrationName }));
    return;
  }

  // Webhook endpoints
  if (req.method === 'POST' && url.pathname.startsWith('/webhook/')) {
    const source = url.pathname.split('/')[2];
    const body = await parseBody(req);

    console.log(`[${new Date().toISOString()}] Webhook: ${source}`);

    try {
      const handler = handlers[source] || handlers.generic;
      const result = await handler.handle(req.headers, body);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, result }));
    } catch (error) {
      console.error(`Webhook error: ${error.message}`);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: error.message }));
    }
    return;
  }

  // 404 for unknown routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
}

/**
 * Start server
 */
async function main() {
  console.log(`Starting ${config.integrationName}...`);

  // Register with BlackRoad
  const agent = await blackroad.agents.register({
    name: config.integrationName,
    type: 'service',
    capabilities: ['webhook', 'integration', 'sync'],
    metadata: {
      version: '1.0.0',
      type: 'integration'
    }
  });

  console.log(`Registered as agent: ${agent.id}`);

  // Log startup
  await blackroad.memory.log({
    action: 'announce',
    entity: config.integrationName,
    details: `Integration server started on port ${config.port}`,
    tags: ['integration', 'startup']
  });

  // Start HTTP server
  const server = http.createServer(handleRequest);
  server.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
    console.log(`Webhook endpoints:`);
    console.log(`  POST /webhook/github`);
    console.log(`  POST /webhook/slack`);
    console.log(`  POST /webhook/generic`);
    console.log(`  GET  /health`);
  });

  // Heartbeat
  setInterval(async () => {
    await blackroad.agents.heartbeat({
      agentId: agent.id,
      status: 'active',
      metrics: { uptime: process.uptime() }
    });
  }, 30000);

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('Shutting down...');
    await blackroad.agents.deregister(agent.id);
    server.close();
    process.exit(0);
  });
}

if (!config.apiKey) {
  console.error('ERROR: BLACKROAD_API_KEY required');
  process.exit(1);
}

main().catch(console.error);
