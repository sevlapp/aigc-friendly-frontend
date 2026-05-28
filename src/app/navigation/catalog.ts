// src/app/navigation/catalog.ts

import { type AppEnv, getAppEnv } from '@/shared/env';

import type { NavigationItem } from './types';

const STABLE_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    description: '面向 AI 辅助开发的主工作台。',
    id: 'home',
    kind: 'stable',
    label: '工作台',
    path: '/',
    tags: ['home', 'workbench', 'aigc', 'assistant', 'dashboard', '工作台', '助手'],
  },
];

const LAB_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    description: '受控开放的提示词迭代实验。',
    id: 'prompt-lab',
    kind: 'labs',
    label: '提示实验',
    path: '/labs/prompt-lab',
    tags: ['lab', 'prompt', 'experiment', '提示', '实验'],
  },
];

const SANDBOX_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    description: '用于一次性交互验证的开发试验场。',
    id: 'sandbox-playground',
    kind: 'sandbox',
    label: '沙盒',
    path: '/sandbox/playground',
    tags: ['sandbox', 'prototype', 'playground', '沙盒', '原型'],
  },
];

function canExposeLabs(env: AppEnv) {
  return env === 'dev' || env === 'test';
}

function canExposeSandbox(env: AppEnv) {
  return env === 'dev' || env === 'test';
}

export function getNavigationItems(env = getAppEnv()): NavigationItem[] {
  return [
    ...STABLE_NAVIGATION_ITEMS,
    ...(canExposeLabs(env) ? LAB_NAVIGATION_ITEMS : []),
    ...(canExposeSandbox(env) ? SANDBOX_NAVIGATION_ITEMS : []),
  ];
}
