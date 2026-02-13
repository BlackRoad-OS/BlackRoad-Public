/**
 * Slack Event Handler
 *
 * Processes Slack events and syncs to BlackRoad.
 */

export class SlackHandler {
  constructor({ client }) {
    this.client = client;
  }

  async handle(headers, payload) {
    // Handle Slack URL verification
    if (payload.type === 'url_verification') {
      return { challenge: payload.challenge };
    }

    const event = payload.event;
    if (!event) {
      return { status: 'no_event' };
    }

    console.log(`Slack event: ${event.type}`);

    switch (event.type) {
      case 'message':
        return await this.handleMessage(event);

      case 'reaction_added':
        return await this.handleReaction(event);

      case 'app_mention':
        return await this.handleMention(event);

      default:
        return { event: event.type, status: 'ignored' };
    }
  }

  async handleMessage(event) {
    // Skip bot messages
    if (event.bot_id || event.subtype === 'bot_message') {
      return { status: 'skipped', reason: 'bot_message' };
    }

    // Check for deployment keywords
    if (this.isDeploymentMessage(event.text)) {
      await this.client.memory.log({
        action: 'announce',
        entity: 'slack-deployment',
        details: `Deployment discussion in channel ${event.channel}`,
        tags: ['slack', 'deployment']
      });
    }

    // Check for blocked/help keywords
    if (this.isBlockedMessage(event.text)) {
      await this.client.memory.log({
        action: 'blocked',
        entity: 'slack-support',
        details: `Help requested in channel ${event.channel}`,
        tags: ['slack', 'support']
      });
    }

    return {
      event: 'message',
      channel: event.channel
    };
  }

  async handleReaction(event) {
    // Track approval reactions
    const approvalReactions = ['white_check_mark', 'heavy_check_mark', 'rocket', 'ship'];

    if (approvalReactions.includes(event.reaction)) {
      await this.client.memory.log({
        action: 'progress',
        entity: 'slack-approval',
        details: `Approval reaction :${event.reaction}: in channel ${event.item.channel}`,
        tags: ['slack', 'approval']
      });
    }

    return {
      event: 'reaction_added',
      reaction: event.reaction
    };
  }

  async handleMention(event) {
    await this.client.memory.log({
      action: 'coordinate',
      entity: 'slack-mention',
      details: `Bot mentioned in channel ${event.channel}: ${event.text.slice(0, 100)}`,
      tags: ['slack', 'mention']
    });

    return {
      event: 'app_mention',
      channel: event.channel
    };
  }

  isDeploymentMessage(text) {
    const keywords = ['deploy', 'release', 'ship', 'push to prod', 'going live'];
    return keywords.some(k => text.toLowerCase().includes(k));
  }

  isBlockedMessage(text) {
    const keywords = ['blocked', 'stuck', 'help', 'need assistance', 'broken'];
    return keywords.some(k => text.toLowerCase().includes(k));
  }
}
