// src/features/local-assistant/local-assistant.spec.ts

import { describe, expect, it } from 'vitest';

import { resolveLocalAssistantQuery } from './index';

const candidates = [
  {
    description: 'Main AIGC workbench',
    id: 'home',
    label: 'Workbench',
    path: '/',
    tags: ['home', 'aigc'],
  },
  {
    description: 'Prompt experiment lab',
    id: 'prompt-lab',
    label: 'Prompt Lab',
    path: '/labs/prompt-lab',
    tags: ['prompt', 'lab'],
  },
];

describe('resolveLocalAssistantQuery', () => {
  it('returns matching route suggestions', () => {
    const reply = resolveLocalAssistantQuery('prompt lab', candidates);

    expect(reply.suggestions[0]?.id).toBe('prompt-lab');
  });
});
