// src/pages/blueprint/index.tsx

import { Card, Timeline } from 'antd';

const layerItems = [
  {
    children: 'app: router, providers, shell layout, navigation truth',
    color: 'blue',
  },
  {
    children: 'pages: route composition without business infrastructure',
    color: 'blue',
  },
  {
    children: 'widgets and features: reusable page blocks and user workflows',
    color: 'blue',
  },
  {
    children: 'entities and shared: stable business types and generic infrastructure',
    color: 'blue',
  },
  {
    children: 'labs and sandbox: gated experiments and throwaway prototypes',
    color: 'gray',
  },
];

const promotionCards = [
  {
    body: 'Unknown business value starts here and stays access-gated.',
    title: 'Labs',
  },
  {
    body: 'Throwaway UI or interaction trials stay dev/test-only.',
    title: 'Sandbox',
  },
  {
    body: 'Validated behavior moves into the smallest stable owner after review.',
    title: 'Stable',
  },
];

export function BlueprintPage() {
  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h1 className="page-title">Blueprint</h1>
          <p className="page-description">
            The example keeps enough structure for AI agents to place changes correctly without
            importing the original product domain.
          </p>
        </div>
      </div>

      <div className="surface-panel">
        <Timeline items={layerItems} />
      </div>

      <section className="card-grid" aria-label="Promotion flow">
        {promotionCards.map((card) => (
          <Card key={card.title} title={card.title}>
            <p className="m-0 text-text-secondary">{card.body}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
