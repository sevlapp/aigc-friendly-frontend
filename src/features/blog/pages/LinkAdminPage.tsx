import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Table, Button, Form, Input, Modal, Popconfirm, message, Typography, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';

import { GET_LINKS, CREATE_LINK, UPDATE_LINK, DELETE_LINK } from '../api/blog.queries';
import type { LinkView } from '../types/blog.types';

const { Title } = Typography;

export function LinkAdminPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkView | null>(null);
  const [form] = Form.useForm();

  const { data, refetch } = useQuery(GET_LINKS);

  const [createLink] = useMutation(CREATE_LINK, {
    onCompleted: () => {
      message.success('链接创建成功');
      setShowForm(false);
      form.resetFields();
      refetch();
    },
    onError: () => {
      message.error('链接创建失败');
    },
  });

  const [updateLink] = useMutation(UPDATE_LINK, {
    onCompleted: () => {
      message.success('链接更新成功');
      setShowForm(false);
      form.resetFields();
      refetch();
    },
    onError: () => {
      message.error('链接更新失败');
    },
  });

  const [deleteLink] = useMutation(DELETE_LINK, {
    onCompleted: () => {
      message.success('链接删除成功');
      refetch();
    },
    onError: () => {
      message.error('链接删除失败');
    },
  });

  const links: LinkView[] = data?.links || [];

  const handleCreate = () => {
    setEditingLink(null);
    form.resetFields();
    setShowForm(true);
  };

  const handleEdit = (link: LinkView) => {
    setEditingLink(link);
    form.setFieldsValue({
      name: link.name,
      url: link.url,
      description: link.description,
      avatar: link.avatar,
      sortOrder: link.sortOrder,
      isActive: link.isActive,
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    deleteLink({ variables: { id } });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingLink) {
        await updateLink({ variables: { input: { ...values, id: editingLink.id } } });
      } else {
        await createLink({ variables: { input: values } });
      }
    } catch (err) {
      console.error('Form validation failed:', err);
    }
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      key: 'url',
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (isActive ? '启用' : '禁用'),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('zh-CN'),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record: LinkView) => (
        <>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个链接吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>友情链接管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          添加链接
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={links}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingLink ? '编辑链接' : '添加链接'}
        visible={showForm}
        onCancel={() => {
          setShowForm(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入链接名称' }]}
          >
            <Input placeholder="请输入链接名称" />
          </Form.Item>

          <Form.Item
            name="url"
            label="URL"
            rules={[{ required: true, message: '请输入链接地址' }]}
          >
            <Input placeholder="请输入链接地址" />
          </Form.Item>

          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} placeholder="请输入链接描述" />
          </Form.Item>

          <Form.Item name="avatar" label="头像">
            <Input placeholder="请输入头像地址" />
          </Form.Item>

          <Form.Item name="sortOrder" label="排序">
            <Input type="number" placeholder="请输入排序号" />
          </Form.Item>

          <Form.Item name="isActive" label="状态" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              {editingLink ? '保存修改' : '添加链接'}
            </Button>
            <Button onClick={() => { setShowForm(false); form.resetFields(); }} style={{ marginLeft: 8 }}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}