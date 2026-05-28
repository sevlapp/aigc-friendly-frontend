// src/app/router/index.tsx

import { Alert, Button, Result } from 'antd';
import {
  createBrowserRouter,
  isRouteErrorResponse,
  redirect,
  RouterProvider,
  useRouteError,
} from 'react-router';

import { AppLayout } from '@/app/layout';

import { HomePage } from '@/pages/home';
import { ProjectStructurePage } from '@/pages/project-structure';

import { getAppEnv } from '@/shared/env';
import { sanitizeInternalPath } from '@/shared/navigation';

import { canAccessPromptLab, PromptLabPage } from '@/labs/prompt-lab';
import { canAccessSandboxPlayground, SandboxPlaygroundPage } from '@/sandbox/playground';

function RouteErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <Result
        extra={
          <Button href={sanitizeInternalPath('/')} type="primary">
            返回工作台
          </Button>
        }
        status={error.status === 404 ? '404' : 'warning'}
        subTitle={error.statusText}
        title={error.status}
      />
    );
  }

  return (
    <Alert
      description={error instanceof Error ? error.message : '发生未知路由错误。'}
      showIcon
      type="error"
    />
  );
}

function promptLabLoader() {
  if (!canAccessPromptLab(getAppEnv())) {
    throw redirect('/');
  }

  return null;
}

function sandboxPlaygroundLoader() {
  if (!canAccessSandboxPlayground(getAppEnv())) {
    throw redirect('/');
  }

  return null;
}

const router = createBrowserRouter([
  {
    children: [
      {
        element: <HomePage />,
        index: true,
      },
      {
        element: <ProjectStructurePage />,
        path: 'project-structure',
      },
      {
        element: <PromptLabPage />,
        loader: promptLabLoader,
        path: 'labs/prompt-lab',
      },
      {
        element: <SandboxPlaygroundPage />,
        loader: sandboxPlaygroundLoader,
        path: 'sandbox/playground',
      },
      {
        element: (
          <Result
            extra={
              <Button href={sanitizeInternalPath('/')} type="primary">
                返回工作台
              </Button>
            }
            status="404"
            title="页面不存在"
          />
        ),
        path: '*',
      },
    ],
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    path: '/',
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
