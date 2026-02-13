#!/usr/bin/env node
/**
 * BlackRoad CLI - Main Entry Point
 */

import { program } from 'commander';
import { agentCommands } from '../src/commands/agent.js';
import { memoryCommands } from '../src/commands/memory.js';
import { codexCommands } from '../src/commands/codex.js';
import { lightCommands } from '../src/commands/light.js';
import { taskCommands } from '../src/commands/task.js';
import { loadConfig } from '../src/config.js';

// Load configuration
const config = loadConfig();

program
  .name('blackroad')
  .description('BlackRoad OS Command Line Interface')
  .version('1.0.0');

// Agent commands
const agent = program.command('agent').description('Manage AI agents');
agentCommands(agent, config);

// Memory commands
const memory = program.command('memory').description('Memory system operations');
memoryCommands(memory, config);

// Codex commands
const codex = program.command('codex').description('Search code index');
codexCommands(codex, config);

// Traffic light commands
const light = program.command('light').description('Project status management');
lightCommands(light, config);

// Task commands
const task = program.command('task').description('Task marketplace');
taskCommands(task, config);

// Parse and execute
program.parse();
