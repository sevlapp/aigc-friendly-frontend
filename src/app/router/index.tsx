// src/app/router/index.tsx

import {
  createBrowserRouter,
  isRouteErrorResponse,
  redirect,
  RouterProvider,
  useRouteError,
} from 'react-router';


import TestConnection from '@/pages/TestConnection';
import { AppLayout } from '@/app/layout';

import { ErrorPreviewPage } from '@/pages/error-preview';
import { HomePage } from '@/pages/home';
import { ProjectStructurePage } from '@/pages/project-structure';
import { Error403, Error404, Error500, ErrorRouteCrash } from '@/features/error-feedback';

import { BlogHomePage } from '@/features/blog/pages/BlogHomePage';
import { PostDetailPage } from '@/features/blog/pages/PostDetailPage';
import { CategoryPage } from '@/features/blog/pages/CategoryPage';
import { TagPage } from '@/features/blog/pages/TagPage';
import { BlogAdminPage } from '@/features/blog/pages/BlogAdminPage';
import { CategoryAdminPage } from '@/features/blog/pages/CategoryAdminPage';
import { TagAdminPage } from '@/features/blog/pages/TagAdminPage';
import { ConfigAdminPage } from '@/features/blog/pages/ConfigAdminPage';
import { LinkAdminPage } from '@/features/blog/pages/LinkAdminPage';
import { BlogStatsPage } from '@/features/blog/pages/BlogStatsPage';

import { getAppEnv } from '@/shared/env';

import { canAccessGame2048Lab, Game2048LabPage } from '@/labs/game-2048';
import { canAccessSandboxPlayground, SandboxPlaygroundPage } from '@/sandbox/playground';

function RouteErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 403) {
      return <Error403 />;
    }

    if (error.status === 404) {
      return <Error404 />;
    }

    if (error.status >= 500) {
      return <Error500 />;
    }
  }

  return <ErrorRouteCrash />;
}

function RouteErrorBoundary() {
  return (
    <AppLayout>
      <RouteErrorPage />
    </AppLayout>
  );
}

function game2048LabLoader() {
  if (!canAccessGame2048Lab(getAppEnv())) {
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
	  path: '/test-connection',
	  element: <TestConnection />,
	},
      {
        element: <HomePage />,
        index: true,
      },
      {
        element: <ProjectStructurePage />,
        path: 'project-structure',
      },
      {
        element: <ErrorPreviewPage />,
        path: 'error-preview',
      },
      {
        element: <Game2048LabPage />,
        loader: game2048LabLoader,
        path: 'labs/game-2048',
      },
      {
        element: <SandboxPlaygroundPage />,
        loader: sandboxPlaygroundLoader,
        path: 'sandbox/playground',
      },
      {
        element: <BlogHomePage />,
        path: 'blog',
      },
      {
        element: <CategoryPage />,
        path: 'blog/category/:slug',
      },
      {
        element: <TagPage />,
        path: 'blog/tag/:slug',
      },
      {
        element: <PostDetailPage />,
        path: 'blog/:slug',
      },
      {
        element: <BlogAdminPage />,
        path: 'admin/blog',
      },
      {
        element: <CategoryAdminPage />,
        path: 'admin/categories',
      },
      {
        element: <TagAdminPage />,
        path: 'admin/tags',
      },
      {
        element: <ConfigAdminPage />,
        path: 'admin/config',
      },
      {
        element: <LinkAdminPage />,
        path: 'admin/links',
      },
      {
        element: <BlogStatsPage />,
        path: 'admin/stats',
      },
      {
        element: <Error404 />,
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
