import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Form, Input, Button, message, Typography, Card } from 'antd';
import { SaveOutlined, RefreshOutlined } from '@ant-design/icons';

import { GET_CONFIG, UPDATE_CONFIG } from '../api/blog.queries';
import type { ConfigView } from '../types/blog.types';

const { Title, Text } = Typography;

export function ConfigAdminPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { data, refetch } = useQuery(GET_CONFIG);

  const [updateConfig] = useMutation(UPDATE_CONFIG, {
    onCompleted: () => {
      setLoading(false);
      message.success('配置更新成功');
      refetch();
    },
    onError: () => {
      setLoading(false);
      message.error('配置更新失败');
    },
  });

  const configs: ConfigView[] = data?.config || [];

  const configMap = configs.reduce((acc, config) => {
    acc[config.key] = config.value;
    return acc;
  }, {} as Record<string, string>);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      const configInputs = Object.entries(values).map(([key, value]) => ({
        key,
        value: String(value),
      }));

      await updateConfig({ variables: { input: configInputs } });
    } catch (err) {
      console.error('Form validation failed:', err);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>博客配置</Title>
        <Button icon={<RefreshOutlined />} onClick={() => refetch()}>
          刷新
        </Button>
      </div>

      <Card>
        <Form
          form={form}
          layout="vertical"
          initialValues={configMap}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="blog.title"
            label="博客标题"
            rules={[{ required: true, message: '请输入博客标题' }]}
          >
            <Input placeholder="请输入博客标题" />
          </Form.Item>

          <Form.Item
            name="blog.description"
            label="博客描述"
            rules={[{ required: true, message: '请输入博客描述' }]}
          >
            <Input.TextArea rows={2} placeholder="请输入博客描述" />
          </Form.Item>

          <Form.Item name="blog.keywords" label="关键词">
            <Input placeholder="请输入关键词，用逗号分隔" />
          </Form.Item>

          <Form.Item name="blog.author" label="作者名称">
            <Input placeholder="请输入作者名称" />
          </Form.Item>

          <Form.Item name="blog.footer" label="页脚信息">
            <Input.TextArea rows={2} placeholder="请输入页脚信息" />
          </Form.Item>

          <Form.Item name="blog.logo" label="Logo URL">
            <Input placeholder="请输入 Logo 图片地址" />
          </Form.Item>

          <Form.Item name="blog.favicon" label="Favicon URL">
            <Input placeholder="请输入网站图标地址" />
          </Form.Item>

          <Form.Item name="blog.metaTitle" label="Meta 标题">
            <Input placeholder="请输入页面 Meta 标题" />
          </Form.Item>

          <Form.Item name="blog.metaDescription" label="Meta 描述">
            <Input.TextArea rows={2} placeholder="请输入页面 Meta 描述" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
              保存配置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}