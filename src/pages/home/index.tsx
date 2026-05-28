// src/pages/home/index.tsx

import { Button, Card, Descriptions, Tag } from 'antd';
import { useNavigate } from 'react-router';

import { LOCAL_ASSISTANT_PROMPTS } from '@/features/local-assistant';

import { getAppEnv, getGraphQLEndpoint, getHealthEndpoint } from '@/shared/env';

const workflowCards = [
  {
    description: 'Stable app shell with router, navigation truth, providers, and sidecar slot.',
    title: 'App Shell',
  },
  {
    description: 'Feature work starts in the smallest owner and uses public barrels.',
    title: 'Layered Ownership',
  },
  {
    description: 'A lab and sandbox are included to show safe AI-generated experimentation.',
    title: 'Experiment Flow',
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const healthEndpoint = getHealthEndpoint();

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h1 className="page-title">AIGC Workbench</h1>
          <p className="page-description">
            A compact frontend baseline for AI-assisted product work, with the app shell, sidecar,
            route catalog, GraphQL ingress, and experiment lanes already separated.
          </p>
        </div>
        <Button type="primary" onClick={() => navigate('/blueprint')}>
          View blueprint
        </Button>
      </div>

      <div className="surface-panel">
        <Descriptions
          bordered
          column={{ lg: 3, md: 2, sm: 1, xs: 1 }}
          items={[
            {
              key: 'env',
              label: 'App env',
              children: <Tag>{getAppEnv()}</Tag>,
            },
            {
              key: 'graphql',
              label: 'GraphQL',
              children: getGraphQLEndpoint(),
            },
            {
              key: 'health',
              label: 'Health',
              children: healthEndpoint || 'not configured',
            },
          ]}
          size="small"
        />
      </div>

      <section className="card-grid" aria-label="Workflow slices">
        {workflowCards.map((card) => (
          <Card key={card.title} title={card.title}>
            <p className="m-0 text-text-secondary">{card.description}</p>
          </Card>
        ))}
      </section>

      <section className="surface-panel" aria-label="Starter prompt inventory">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="m-0 text-lg font-semibold">Starter Prompts</h2>
          <span className="text-sm text-text-tertiary">
            {LOCAL_ASSISTANT_PROMPTS.length} prompts
          </span>
        </div>
        <div className="card-grid">
          {LOCAL_ASSISTANT_PROMPTS.map((prompt) => (
            <div className="route-suggestion" key={prompt.key}>
              <div className="route-suggestion-title">{prompt.label}</div>
              <div className="route-suggestion-description">{prompt.prompt}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
