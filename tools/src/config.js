/**
 * CLI Configuration Loader
 */

import fs from 'fs';
import path from 'path';
import os from 'os';

export function loadConfig() {
  // Default config
  let config = {
    apiKey: process.env.BLACKROAD_API_KEY,
    apiUrl: process.env.BLACKROAD_API_URL || 'https://api.blackroad.io/v1'
  };

  // Try to load from config file
  const configPath = path.join(os.homedir(), '.blackroad', 'config.json');
  if (fs.existsSync(configPath)) {
    try {
      const fileConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      config = { ...config, ...fileConfig };
    } catch (e) {
      // Ignore parse errors
    }
  }

  // Environment variables override file config
  if (process.env.BLACKROAD_API_KEY) {
    config.apiKey = process.env.BLACKROAD_API_KEY;
  }
  if (process.env.BLACKROAD_API_URL) {
    config.apiUrl = process.env.BLACKROAD_API_URL;
  }

  return config;
}

export function requireApiKey(config) {
  if (!config.apiKey) {
    console.error('Error: API key required. Set BLACKROAD_API_KEY or create ~/.blackroad/config.json');
    process.exit(1);
  }
}
