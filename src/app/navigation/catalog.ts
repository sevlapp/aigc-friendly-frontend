// src/app/navigation/catalog.ts

import { type AppEnv, getAppEnv } from '@/shared/env';

import type { NavigationItem } from './types';

const STABLE_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    description: 'The main AI-assisted frontend workbench.',
    id: 'home',
    kind: 'stable',
    label: 'Workbench',
    path: '/',
    tags: ['home', 'aigc', 'assistant', 'dashboard'],
  },
  {
    description: 'A compact map of layers, ownership, and promotion flow.',
    id: 'blueprint',
    kind: 'stable',
    label: 'Blueprint',
    path: '/blueprint',
    tags: ['architecture', 'layers', 'rules', 'structure'],
  },
];

const LAB_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    description: 'A gated prompt iteration experiment.',
    id: 'prompt-lab',
    kind: 'labs',
    label: 'Prompt Lab',
    path: '/labs/prompt-lab',
    tags: ['lab', 'prompt', 'experiment'],
  },
];

const SANDBOX_NAVIGATION_ITEMS: NavigationItem[] = [
  {
    description: 'A dev-only playground for throwaway UI trials.',
    id: 'sandbox-playground',
    kind: 'sandbox',
    label: 'Sandbox',
    path: '/sandbox/playground',
    tags: ['sandbox', 'prototype', 'playground'],
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
