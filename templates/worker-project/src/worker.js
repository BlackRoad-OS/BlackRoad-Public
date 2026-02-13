/**
 * BlackRoad Worker Class
 *
 * Handles task polling, claiming, processing, and completion.
 */

export class BlackRoadWorker {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.apiUrl = config.apiUrl;
    this.concurrency = config.concurrency || 5;
    this.skills = config.skills || [];
    this.pollInterval = config.pollInterval || 5000;
    this.handlers = new Map();
    this.activeTasks = new Set();
    this.running = false;
    this.pollTimer = null;
  }

  /**
   * Register a handler for a task type
   */
  registerHandler(type, handler) {
    this.handlers.set(type, handler);
  }

  /**
   * Start the worker
   */
  async start() {
    this.running = true;
    this._poll();
  }

  /**
   * Stop the worker
   */
  async stop() {
    this.running = false;
    if (this.pollTimer) {
      clearTimeout(this.pollTimer);
    }

    // Wait for active tasks to complete
    while (this.activeTasks.size > 0) {
      console.log(`Waiting for ${this.activeTasks.size} active tasks...`);
      await this._sleep(1000);
    }
  }

  /**
   * Poll for available tasks
   */
  async _poll() {
    if (!this.running) return;

    try {
      // Check if we have capacity
      if (this.activeTasks.size >= this.concurrency) {
        this._schedulePoll();
        return;
      }

      // Fetch available tasks
      const tasks = await this._request('GET', '/tasks?status=available');

      // Filter by skills
      const matchingTasks = (tasks.tasks || []).filter(task =>
        this._matchesSkills(task)
      );

      // Claim and process tasks up to concurrency limit
      for (const task of matchingTasks) {
        if (this.activeTasks.size >= this.concurrency) break;

        try {
          await this._claimAndProcess(task);
        } catch (error) {
          // Task might already be claimed
          if (error.status !== 409) {
            console.error(`Error claiming task ${task.id}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.error('Poll error:', error.message);
    }

    this._schedulePoll();
  }

  /**
   * Schedule next poll
   */
  _schedulePoll() {
    this.pollTimer = setTimeout(() => this._poll(), this.pollInterval);
  }

  /**
   * Claim and process a task
   */
  async _claimAndProcess(task) {
    // Claim the task
    await this._request('POST', `/tasks/${task.id}/claim`);
    this.activeTasks.add(task.id);

    console.log(`Claimed task: ${task.id} - ${task.title}`);

    // Process asynchronously
    this._processTask(task).catch(error => {
      console.error(`Task ${task.id} failed:`, error.message);
    }).finally(() => {
      this.activeTasks.delete(task.id);
    });
  }

  /**
   * Process a single task
   */
  async _processTask(task) {
    const handler = this.handlers.get(task.type) || this.handlers.get('default');

    if (!handler) {
      throw new Error(`No handler for task type: ${task.type}`);
    }

    try {
      const result = await handler(task);

      // Complete the task
      await this._request('POST', `/tasks/${task.id}/complete`, {
        summary: result || 'Task completed successfully'
      });

      console.log(`Completed task: ${task.id}`);
    } catch (error) {
      // Log failure
      await this._request('POST', '/memory/log', {
        action: 'blocked',
        entity: task.id,
        details: `Task failed: ${error.message}`,
        tags: ['worker', 'error']
      });

      throw error;
    }
  }

  /**
   * Check if task matches worker skills
   */
  _matchesSkills(task) {
    if (!task.requiredSkills || task.requiredSkills.length === 0) {
      return true;
    }
    return task.requiredSkills.some(skill => this.skills.includes(skill));
  }

  /**
   * Make API request
   */
  async _request(method, path, body = null) {
    const url = `${this.apiUrl}${path}`;
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const error = new Error(`API error: ${response.status}`);
      error.status = response.status;
      throw error;
    }

    return response.json();
  }

  /**
   * Sleep helper
   */
  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
