/**
 * BlackRoad OS Codex Search
 */

import type { BlackRoadClient } from './client';

export interface CodexComponent {
  name: string;
  type: 'function' | 'class' | 'module';
  language: string;
  filePath: string;
  lineNumber: number;
  signature?: string;
  docstring?: string;
  repository?: string;
}

export class CodexSearch {
  constructor(private client: BlackRoadClient) {}

  /**
   * Search for components in the Codex
   *
   * The Codex indexes 22,000+ components across 1,085 repositories
   */
  async search(options: {
    query: string;
    type?: 'function' | 'class' | 'module';
    language?: string;
    repository?: string;
    limit?: number;
  }): Promise<CodexComponent[]> {
    const params: Record<string, string | number> = {
      q: options.query,
      limit: options.limit || 20,
    };
    if (options.type) params.type = options.type;
    if (options.language) params.language = options.language;
    if (options.repository) params.repository = options.repository;

    const response = await this.client.get<{ components: CodexComponent[] }>(
      '/v1/codex/search',
      params
    );
    return response.components;
  }

  /**
   * Get a specific component by ID
   */
  async get(componentId: string): Promise<CodexComponent> {
    return this.client.get(`/v1/codex/components/${componentId}`);
  }

  /**
   * Get Codex statistics
   */
  async stats(): Promise<{
    totalComponents: number;
    functions: number;
    classes: number;
    repositories: number;
    languages: Record<string, number>;
  }> {
    return this.client.get('/v1/codex/stats');
  }

  /**
   * Get breakdown by language
   */
  async languages(): Promise<Array<{
    language: string;
    count: number;
    percentage: number;
  }>> {
    const response = await this.client.get<{ languages: Array<{ language: string; count: number; percentage: number }> }>(
      '/v1/codex/languages'
    );
    return response.languages;
  }
}
