/**
 * GitHub Event Handler
 *
 * Processes GitHub webhook events and syncs to BlackRoad.
 */

export class GitHubHandler {
  constructor({ client, secret }) {
    this.client = client;
    this.secret = secret;
  }

  async handle(headers, payload) {
    const event = headers['x-github-event'];
    const delivery = headers['x-github-delivery'];

    console.log(`GitHub event: ${event} (${delivery})`);

    switch (event) {
      case 'push':
        return await this.handlePush(payload);

      case 'pull_request':
        return await this.handlePullRequest(payload);

      case 'issues':
        return await this.handleIssue(payload);

      case 'workflow_run':
        return await this.handleWorkflowRun(payload);

      case 'deployment':
        return await this.handleDeployment(payload);

      default:
        return { event, status: 'ignored' };
    }
  }

  async handlePush(payload) {
    const { repository, commits, pusher, ref } = payload;
    const branch = ref.replace('refs/heads/', '');

    // Log to memory
    await this.client.memory.log({
      action: 'progress',
      entity: repository.name,
      details: `${commits.length} commit(s) pushed to ${branch} by ${pusher.name}`,
      tags: ['github', 'push', repository.name]
    });

    // Update traffic light if main branch
    if (branch === 'main' || branch === 'master') {
      await this.client.trafficLights.set(repository.name, {
        status: 'yellow',
        reason: `New commits pushed, awaiting CI`
      });
    }

    return {
      event: 'push',
      repository: repository.name,
      branch,
      commits: commits.length
    };
  }

  async handlePullRequest(payload) {
    const { action, pull_request: pr, repository } = payload;

    const details = {
      opened: `PR #${pr.number} opened: ${pr.title}`,
      closed: pr.merged
        ? `PR #${pr.number} merged: ${pr.title}`
        : `PR #${pr.number} closed: ${pr.title}`,
      synchronize: `PR #${pr.number} updated: ${pr.title}`
    }[action] || `PR #${pr.number} ${action}`;

    await this.client.memory.log({
      action: action === 'closed' && pr.merged ? 'milestone' : 'progress',
      entity: repository.name,
      details,
      tags: ['github', 'pr', repository.name]
    });

    return {
      event: 'pull_request',
      action,
      number: pr.number,
      repository: repository.name
    };
  }

  async handleIssue(payload) {
    const { action, issue, repository } = payload;

    // Sync to task marketplace
    if (action === 'opened') {
      await this.client.tasks.create({
        id: `github-${repository.name}-${issue.number}`,
        title: issue.title,
        description: issue.body || 'No description',
        priority: issue.labels.some(l => l.name === 'urgent') ? 'urgent' : 'medium',
        tags: ['github', repository.name, ...issue.labels.map(l => l.name)],
        metadata: {
          source: 'github',
          issueUrl: issue.html_url
        }
      });
    }

    return {
      event: 'issues',
      action,
      number: issue.number,
      repository: repository.name
    };
  }

  async handleWorkflowRun(payload) {
    const { action, workflow_run: run, repository } = payload;

    if (action === 'completed') {
      const status = run.conclusion === 'success' ? 'green' : 'red';
      const reason = run.conclusion === 'success'
        ? `${run.name} passed`
        : `${run.name} failed`;

      await this.client.trafficLights.set(repository.name, { status, reason });

      await this.client.memory.log({
        action: run.conclusion === 'success' ? 'validated' : 'blocked',
        entity: repository.name,
        details: `Workflow ${run.name}: ${run.conclusion}`,
        tags: ['github', 'ci', repository.name]
      });
    }

    return {
      event: 'workflow_run',
      action,
      conclusion: run.conclusion,
      repository: repository.name
    };
  }

  async handleDeployment(payload) {
    const { deployment, repository } = payload;

    await this.client.memory.log({
      action: 'deployed',
      entity: repository.name,
      details: `Deployed to ${deployment.environment}`,
      tags: ['github', 'deployment', deployment.environment]
    });

    await this.client.trafficLights.set(repository.name, {
      status: 'green',
      reason: `Deployed to ${deployment.environment}`
    });

    return {
      event: 'deployment',
      environment: deployment.environment,
      repository: repository.name
    };
  }
}
