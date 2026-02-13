/**
 * BlackRoad OS Memory System
 */

import type { BlackRoadClient } from './client';

export interface MemoryEntry {
  id: string;
  timestamp: string;
  action: string;
  entity: string;
  details: string;
  tags: string[];
  agentId?: string;
}

export type MemoryAction =
  | 'announce'
  | 'progress'
  | 'deployed'
  | 'created'
  | 'configured'
  | 'decided'
  | 'coordinate'
  | 'blocked'
  | 'fixed'
  | 'validated'
  | 'milestone';

export class MemorySystem {
  constructor(private client: BlackRoadClient) {}

  /**
   * Log an entry to the memory system
   */
  async log(options: {
    action: MemoryAction;
    entity: string;
    details: string;
    tags?: string[];
  }): Promise<MemoryEntry> {
    return this.client.post('/v1/memory/log', {
      action: options.action,
      entity: options.entity,
      details: options.details,
      tags: options.tags || [],
    });
  }

  /**
   * Search memory entries
   */
  async search(options?: {
    query?: string;
    tags?: string[];
    action?: MemoryAction;
    agentId?: string;
    since?: Date;
    limit?: number;
  }): Promise<MemoryEntry[]> {
    const params: Record<string, string | number> = {
      limit: options?.limit || 100,
    };
    if (options?.query) params.q = options.query;
    if (options?.tags) params.tags = options.tags.join(',');
    if (options?.action) params.action = options.action;
    if (options?.agentId) params.agent_id = options.agentId;
    if (options?.since) params.since = options.since.toISOString();

    const response = await this.client.get<{ entries: MemoryEntry[] }>(
      '/v1/memory/search',
      params
    );
    return response.entries;
  }

  /**
   * Get memory system summary
   */
  async summary(): Promise<{
    totalEntries: number;
    activeAgents: number;
    recentActivity: MemoryEntry[];
  }> {
    return this.client.get('/v1/memory/summary');
  }

  /**
   * Get real-time context for an agent
   */
  async context(agentId: string): Promise<{
    recentEntries: MemoryEntry[];
    activeAgents: string[];
    conflicts: string[];
  }> {
    return this.client.get(`/v1/memory/context/${agentId}`);
  }
}
