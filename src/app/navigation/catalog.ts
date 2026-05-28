// src/app/navigation/catalog.ts

import { type AppEnv, getAppEnv } from '@/shared/env';

import type { NavigationItem } from './types';

const STABLE_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    description: '面向 AI 辅助开发的主工作台。',
    id: 'home',
    kind: 'stable',
    label: 'Workspace',
    path: '/',
    tags: ['home', 'workbench', 'aigc', 'assistant', 'dashboard', '工作台', '助手'],
  },
];

const LAB_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    description: '受控开放的提示词迭代实验。',
    id: 'prompt-lab',
    kind: 'labs',
    label: 'Lab',
    path: '/labs/prompt-lab',
    tags: ['lab', 'prompt', 'experiment', '提示', '实验'],
  },
];

const SANDBOX_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    description: '用于一次性交互验证的开发试验场。',
    id: 'sandbox-playground',
    kind: 'sandbox',
    label: 'Sandbox',
    path: '/sandbox/playground',
    tags: ['sandbox', 'prototype', 'playground', '沙盒', '原型'],
  },
];

const SUPPORT_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    description: '预览通用路由和运行时错误反馈。',
    id: 'error-preview',
    kind: 'stable',
    label: 'Errors',
    path: '/error-preview',
    tags: ['error', 'feedback', '404', '500', 'route', '错误页', '异常反馈'],
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
    ...SUPPORT_NAVIGATION_ITEMS,
  ];
}
