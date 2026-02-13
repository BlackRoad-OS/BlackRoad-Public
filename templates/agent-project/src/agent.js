/**
 * BlackRoad Agent Class
 *
 * Handles registration, heartbeat, tasks, and memory integration.
 */

import { EventEmitter } from 'events';

export class BlackRoadAgent extends EventEmitter {
  constructor(options) {
    super();
    this.name = options.name;
    this.type = options.type || 'ai';
    this.capabilities = options.capabilities || [];
    this.apiKey = options.apiKey;
    this.apiUrl = options.apiUrl || 'https://api.blackroad.io/v1';
    this.id = null;
    this.status = 'idle';
    this.heartbeatInterval = null;
    this.taskPollInterval = null;
  }

  /**
   * Register agent with the Agent Registry
   */
  async register() {
    const response = await this._request('POST', '/agents', {
      name: this.name,
      type: this.type,
      capabilities: this.capabilities,
      metadata: {
        version: '1.0.0',
        startedAt: new Date().toISOString()
      }
    });

    this.id = response.id;
    this.status = 'active';
    return response;
  }

  /**
   * Deregister agent
   */
  async deregister() {
    if (!this.id) return;

    this.stopHeartbeat();
    this.stopTaskPolling();

    await this._request('DELETE', `/agents/${this.id}`);
    this.status = 'offline';
  }

  /**
   * Start heartbeat monitoring
   */
  startHeartbeat(intervalMs = 30000) {
    this.heartbeatInterval = setInterval(async () => {
      try {
        await this._request('POST', `/agents/${this.id}/heartbeat`, {
          status: this.status,
          metrics: this._collectMetrics()
        });
      } catch (error) {
        console.error('Heartbeat failed:', error.message);
      }
    }, intervalMs);
  }

  /**
   * Stop heartbeat monitoring
   */
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * Start polling for tasks
   */
  startTaskPolling(intervalMs = 10000) {
    this.taskPollInterval = setInterval(async () => {
      try {
        const tasks = await this._request('GET', '/tasks?status=available');

        for (const task of tasks.tasks || []) {
          // Check if task matches our capabilities
          if (this._canHandle(task)) {
            // Claim the task
            const claimed = await this.claimTask(task.id);
            if (claimed) {
              this.emit('task', task);
            }
          }
        }
      } catch (error) {
        console.error('Task polling failed:', error.message);
      }
    }, intervalMs);
  }

  /**
   * Stop task polling
   */
  stopTaskPolling() {
    if (this.taskPollInterval) {
      clearInterval(this.taskPollInterval);
      this.taskPollInterval = null;
    }
  }

  /**
   * Claim a task
   */
  async claimTask(taskId) {
    try {
      await this._request('POST', `/tasks/${taskId}/claim`);
      this.status = 'busy';
      return true;
    } catch (error) {
      if (error.status === 409) {
        return false; // Already claimed
      }
      throw error;
    }
  }

  /**
   * Complete a task
   */
  async completeTask(taskId, summary, artifacts = []) {
    await this._request('POST', `/tasks/${taskId}/complete`, {
      summary,
      artifacts
    });
    this.status = 'active';

    // Log to memory
    await this.logMemory({
      action: 'progress',
      entity: taskId,
      details: summary,
      tags: ['task', 'completed']
    });
  }

  /**
   * Log entry to Memory System
   */
  async logMemory(entry) {
    return this._request('POST', '/memory/log', {
      ...entry,
      agentId: this.id
    });
  }

  /**
   * Search Codex
   */
  async searchCodex(query, options = {}) {
    const params = new URLSearchParams({ q: query, ...options });
    return this._request('GET', `/codex/search?${params}`);
  }

  /**
   * Set traffic light status
   */
  async setTrafficLight(projectId, status, reason) {
    return this._request('PUT', `/traffic-lights/${projectId}`, {
      status,
      reason
    });
  }

  /**
   * Check if agent can handle a task
   */
  _canHandle(task) {
    if (!task.requiredSkills || task.requiredSkills.length === 0) {
      return true;
    }
    return task.requiredSkills.some(skill =>
      this.capabilities.includes(skill)
    );
  }

  /**
   * Collect runtime metrics
   */
  _collectMetrics() {
    return {
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
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
}
