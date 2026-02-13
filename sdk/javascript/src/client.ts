/**
 * BlackRoad OS API Client
 */

import { AgentRegistry } from './agents';
import { MemorySystem } from './memory';
import { CodexSearch } from './codex';

export interface BlackRoadConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

export class BlackRoadClient {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;

  public agents: AgentRegistry;
  public memory: MemorySystem;
  public codex: CodexSearch;

  constructor(config: BlackRoadConfig) {
    this.apiKey = config.apiKey || process.env.BLACKROAD_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('API key required. Pass apiKey or set BLACKROAD_API_KEY env var.');
    }

    this.baseUrl = (config.baseUrl || 'https://api.blackroad.io').replace(/\/$/, '');
    this.timeout = config.timeout || 30000;

    // Initialize sub-clients
    this.agents = new AgentRegistry(this);
    this.memory = new MemorySystem(this);
    this.codex = new CodexSearch(this);
  }

  async request<T>(
    method: string,
    endpoint: string,
    options?: {
      data?: Record<string, unknown>;
      params?: Record<string, string | number>;
    }
  ): Promise<T> {
    const url = new URL(endpoint, this.baseUrl);

    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const response = await fetch(url.toString(), {
      method,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'blackroad-js/0.1.0',
      },
      body: options?.data ? JSON.stringify(options.data) : undefined,
      signal: AbortSignal.timeout(this.timeout),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
    return this.request('GET', endpoint, { params });
  }

  async post<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    return this.request('POST', endpoint, { data });
  }

  async put<T>(endpoint: string, data: Record<string, unknown>): Promise<T> {
    return this.request('PUT', endpoint, { data });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request('DELETE', endpoint);
  }
}
