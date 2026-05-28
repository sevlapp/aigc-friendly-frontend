// src/labs/prompt-lab/access.ts

import type { AppEnv } from '@/shared/env';

export function canAccessPromptLab(env: AppEnv) {
  return env === 'dev' || env === 'test';
}
