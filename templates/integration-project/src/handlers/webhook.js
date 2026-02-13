/**
 * Generic Webhook Handler
 *
 * Processes arbitrary webhook events.
 */

export class WebhookHandler {
  constructor({ client }) {
    this.client = client;
  }

  async handle(headers, payload) {
    // Extract common fields
    const eventType = headers['x-event-type'] ||
                      headers['x-webhook-event'] ||
                      payload.type ||
                      payload.event ||
                      'unknown';

    console.log(`Generic webhook: ${eventType}`);

    // Log to memory
    await this.client.memory.log({
      action: 'created',
      entity: `webhook-${eventType}`,
      details: `Received webhook event: ${eventType}`,
      tags: ['webhook', eventType]
    });

    // Transform based on payload structure
    const transformed = this.transform(payload);

    // Handle specific patterns
    if (transformed.isDeployment) {
      await this.handleDeployment(transformed);
    }

    if (transformed.isAlert) {
      await this.handleAlert(transformed);
    }

    if (transformed.isTask) {
      await this.handleTask(transformed);
    }

    return {
      event: eventType,
      transformed
    };
  }

  transform(payload) {
    // Detect payload patterns
    return {
      raw: payload,

      // Deployment patterns
      isDeployment: this.matchesPattern(payload, [
        'deployment', 'deploy', 'release', 'environment'
      ]),

      // Alert patterns
      isAlert: this.matchesPattern(payload, [
        'alert', 'alarm', 'incident', 'error', 'critical'
      ]),

      // Task patterns
      isTask: this.matchesPattern(payload, [
        'task', 'issue', 'ticket', 'story', 'todo'
      ]),

      // Extract common fields
      title: payload.title || payload.name || payload.summary,
      description: payload.description || payload.body || payload.message,
      status: payload.status || payload.state,
      priority: payload.priority || payload.severity,
      url: payload.url || payload.link || payload.html_url,
      timestamp: payload.timestamp || payload.created_at || new Date().toISOString()
    };
  }

  matchesPattern(obj, keywords) {
    const str = JSON.stringify(obj).toLowerCase();
    return keywords.some(k => str.includes(k));
  }

  async handleDeployment(data) {
    const project = data.raw.project || data.raw.repository || data.raw.service || 'unknown';
    const environment = data.raw.environment || data.raw.env || 'production';
    const status = data.status === 'success' ? 'green' : 'yellow';

    await this.client.trafficLights.set(project, {
      status,
      reason: `Deployed to ${environment}`
    });

    await this.client.memory.log({
      action: 'deployed',
      entity: project,
      details: `Deployed to ${environment}`,
      tags: ['webhook', 'deployment', environment]
    });
  }

  async handleAlert(data) {
    const severity = data.priority || 'medium';
    const status = severity === 'critical' ? 'red' : 'yellow';
    const entity = data.raw.service || data.raw.source || 'unknown';

    await this.client.trafficLights.set(entity, {
      status,
      reason: data.title || 'Alert triggered'
    });

    await this.client.memory.log({
      action: 'blocked',
      entity,
      details: data.description || data.title,
      tags: ['webhook', 'alert', severity]
    });
  }

  async handleTask(data) {
    const taskId = `webhook-${Date.now()}`;

    await this.client.tasks.create({
      id: taskId,
      title: data.title || 'Webhook Task',
      description: data.description || 'Created from webhook',
      priority: this.mapPriority(data.priority),
      tags: ['webhook', 'external'],
      metadata: {
        source: 'webhook',
        originalUrl: data.url
      }
    });
  }

  mapPriority(priority) {
    const map = {
      critical: 'urgent',
      high: 'high',
      medium: 'medium',
      low: 'low',
      p0: 'urgent',
      p1: 'high',
      p2: 'medium',
      p3: 'low'
    };
    return map[priority?.toLowerCase()] || 'medium';
  }
}
