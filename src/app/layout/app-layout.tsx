// src/app/layout/app-layout.tsx

import { useMemo, useState } from 'react';
import { Button, Segmented } from 'antd';
import { NavLink, Outlet, useNavigate } from 'react-router';

import { getNavigationItems } from '@/app/navigation';
import { FONT_SCALE_OPTIONS, useTheme } from '@/app/providers';

import { AigcSidecar } from '@/widgets/aigc-sidecar';

import type { AssistantRouteCandidate } from '@/entities/assistant-session';

function toRouteCandidate(
  item: ReturnType<typeof getNavigationItems>[number],
): AssistantRouteCandidate {
  return {
    description: item.description,
    id: item.id,
    label: item.label,
    path: item.path,
    tags: item.tags,
  };
}

export function AppLayout() {
  const [isSidecarOpen, setIsSidecarOpen] = useState(false);
  const { fontScale, isDark, setFontScale, setIsDark } = useTheme();
  const navigate = useNavigate();
  const navigationItems = useMemo(() => getNavigationItems(), []);
  const routeCandidates = useMemo(
    () => navigationItems.map((item) => toRouteCandidate(item)),
    [navigationItems],
  );
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="flex min-w-0 items-center gap-3">
          <img alt="" className="brand-logo" src="/logo.svg" />
          <div className="min-w-0">
            <div className="brand-title">AIGC Friendly Frontend</div>
            <div className="brand-subtitle">AI 友好的 React 前端基线</div>
          </div>
        </div>

        <nav aria-label="主导航" className="app-nav">
          {navigationItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                isActive ? 'app-nav-link app-nav-link-active' : 'app-nav-link'
              }
              end={item.path === '/'}
              key={item.id}
              to={item.path}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="app-header-actions">
          <Segmented
            onChange={(value) => {
              if (value === 'compact' || value === 'standard' || value === 'comfortable') {
                setFontScale(value);
              }
            }}
            options={FONT_SCALE_OPTIONS}
            size="small"
            value={fontScale}
          />
          <Button onClick={() => setIsDark((previousValue) => !previousValue)}>
            {isDark ? '浅色' : '深色'}
          </Button>
          <Button type="primary" onClick={() => setIsSidecarOpen(true)}>
            AI
          </Button>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <AigcSidecar
        onClose={() => setIsSidecarOpen(false)}
        onNavigate={(path) => {
          navigate(path);
          setIsSidecarOpen(false);
        }}
        open={isSidecarOpen}
        routeCandidates={routeCandidates}
      />
    </div>
  );
}
