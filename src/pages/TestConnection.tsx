import { useState } from 'react';

export default function TestConnection() {
  const [result, setResult] = useState<string>('');

  const testBackend = async () => {
    try {
      const res = await fetch('http://localhost:3000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `mutation {
            createMagicItemCraftTask(input: {
              itemName: "连通测试",
              itemType: WEAPON,
              materialLevel: 3
            }) {
              id
              itemName
              status
              createdAt
            }
          }`
        })
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setResult('错误: ' + err.message);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>前后端连通测试</h2>
      <button onClick={testBackend} style={{ marginBottom: 16, padding: '8px 16px' }}>
        点击测试魔法工坊
      </button>
      <pre style={{ background: '#f0f0f0', padding: 16, borderRadius: 4 }}>
        {result || '点击按钮测试...'}
      </pre>
    </div>
  );
}
