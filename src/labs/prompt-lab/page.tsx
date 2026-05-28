// src/labs/prompt-lab/page.tsx

import { useState } from 'react';
import { Alert, Card, Input, Space, Tag } from 'antd';

import { promptLabMeta } from './meta';

export function PromptLabPage() {
  const [prompt, setPrompt] = useState('为一个新的 AI 功能草拟路由落点方案。');

  return (
    <div className="page-stack">
      <div className="page-header">
        <div>
          <h1 className="page-title">{promptLabMeta.name}</h1>
          <p className="page-description">{promptLabMeta.description}</p>
        </div>
        <Space>
          <Tag>实验区</Tag>
          <Tag>dev/test</Tag>
        </Space>
      </div>

      <Alert message="这个实验保持本地化，并通过环境暴露规则受控开放。" showIcon type="info" />

      <Card title="提示草稿">
        <Input.TextArea
          autoSize={{ minRows: 5, maxRows: 8 }}
          onChange={(event) => setPrompt(event.target.value)}
          value={prompt}
        />
      </Card>
    </div>
  );
}
