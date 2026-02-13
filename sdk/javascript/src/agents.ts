/**
 * BlackRoad OS Agent Registry
 */

import type { BlackRoadClient } from './client';

export interface Agent {
  id: string;
  name: string;
  type: 'ai' | 'hardware' | 'hybrid';
  status: 'active' | 'idle' | 'offline';
  capabilities: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  lastSeen?: string;
}

export class AgentRegistry {
  constructor(private client: BlackRoadClient) {}

  /**
   * List all registered agents
   */
  async list(options?: {
    type?: string;
    status?: string;
    limit?: number;
  }): Promise<Agent[]> {
    const params: Record<string, string | number> = {
      limit: options?.limit || 100,
    };
    if (options?.type) params.type = options.type;
    if (options?.status) params.status = options.status;

    const response = await this.client.get<{ agents: Agent[] }>('/v1/agents', params);
    return response.agents;
  }

  /**
   * Get a specific agent by ID
   */
  async get(agentId: string): Promise<Agent> {
    return this.client.get(`/v1/agents/${agentId}`);
  }

  /**
   * Register a new agent
   */
  async register(options: {
    name: string;
    type?: 'ai' | 'hardware' | 'hybrid';
    capabilities?: string[];
    metadata?: Record<string, unknown>;
  }): Promise<Agent> {
    return this.client.post('/v1/agents', {
      name: options.name,
      type: options.type || 'ai',
      capabilities: options.capabilities || [],
      metadata: options.metadata || {},
    });
  }

  /**
   * Update an existing agent
   */
  async update(agentId: string, options: {
    status?: string;
    capabilities?: string[];
    metadata?: Record<string, unknown>;
  }): Promise<Agent> {
    return this.client.put(`/v1/agents/${agentId}`, options);
  }

  /**
   * Send a heartbeat for an agent
   */
  async heartbeat(agentId: string): Promise<{ ok: boolean }> {
    return this.client.post(`/v1/agents/${agentId}/heartbeat`, {});
  }

  /**
   * Remove an agent from the registry
   */
  async deregister(agentId: string): Promise<{ ok: boolean }> {
    return this.client.delete(`/v1/agents/${agentId}`);
  }
}
