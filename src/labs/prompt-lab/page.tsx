// src/labs/prompt-lab/page.tsx

import { useState } from 'react';
import { Alert, Card, Input, Space, Tag } from 'antd';

import { promptLabMeta } from './meta';

export function PromptLabPage() {
  const [prompt, setPrompt] = useState('Draft a route plan for a new AI feature.');

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h1 className="page-title">{promptLabMeta.name}</h1>
          <p className="page-description">{promptLabMeta.description}</p>
        </div>
        <Space>
          <Tag>labs</Tag>
          <Tag>dev/test</Tag>
        </Space>
      </div>

      <Alert message="This lab is intentionally local and access-gated." showIcon type="info" />

      <Card title="Prompt Draft">
        <Input.TextArea
          autoSize={{ minRows: 5, maxRows: 8 }}
          onChange={(event) => setPrompt(event.target.value)}
          value={prompt}
        />
      </Card>
    </div>
  );
}
