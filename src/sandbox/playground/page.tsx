// src/sandbox/playground/page.tsx

import { useState } from 'react';
import { Card, Segmented, Tag } from 'antd';

export function SandboxPlaygroundPage() {
  const [density, setDensity] = useState('balanced');

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sandbox Playground</h1>
          <p className="page-description">
            Dev/test-only space for interaction trials before they become labs or stable code.
          </p>
        </div>
        <Tag>sandbox</Tag>
      </div>

      <Card title="Density Trial">
        <div className="flex flex-col gap-4">
          <Segmented
            onChange={(value) => setDensity(String(value))}
            options={[
              { label: 'Compact', value: 'compact' },
              { label: 'Balanced', value: 'balanced' },
              { label: 'Roomy', value: 'roomy' },
            ]}
            value={density}
          />
          <div className="route-suggestion">
            <div className="route-suggestion-title">Current density: {density}</div>
            <div className="route-suggestion-description">
              Sandbox state is local and disposable by design.
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
