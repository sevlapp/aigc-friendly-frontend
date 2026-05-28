// src/features/local-assistant/local-assistant.spec.ts

import { describe, expect, it } from 'vitest';

import { resolveLocalAssistantQuery } from './index';

const candidates = [
  {
    description: 'AIGC 主工作台',
    id: 'home',
    label: '工作台',
    path: '/',
    tags: ['home', 'aigc', '工作台'],
  },
  {
    description: '提示词实验页面',
    id: 'prompt-lab',
    label: '提示实验',
    path: '/labs/prompt-lab',
    tags: ['prompt', 'lab', '提示', '实验'],
  },
];

describe('resolveLocalAssistantQuery', () => {
  it('returns matching route suggestions', () => {
    const reply = resolveLocalAssistantQuery('提示实验', candidates);

    expect(reply.suggestions[0]?.id).toBe('prompt-lab');
  });
});
