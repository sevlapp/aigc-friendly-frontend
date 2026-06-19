import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Table, Button, Form, Input, Modal, Popconfirm, message, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';

import { GET_TAGS, CREATE_TAG, UPDATE_TAG, DELETE_TAG } from '../api/blog.queries';
import type { TagView } from '../types/blog.types';

const { Title } = Typography;

export function TagAdminPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingTag, setEditingTag] = useState<TagView | null>(null);
  const [form] = Form.useForm();

  const { loading, error, data, refetch } = useQuery(GET_TAGS);

  const [createTag] = useMutation(CREATE_TAG, {
    onCompleted: () => {
      message.success('标签创建成功');
      setShowForm(false);
      form.resetFields();
      refetch();
    },
    onError: () => {
      message.error('标签创建失败');
    },
  });

  const [updateTag] = useMutation(UPDATE_TAG, {
    onCompleted: () => {
      message.success('标签更新成功');
      setShowForm(false);
      form.resetFields();
      refetch();
    },
    onError: () => {
      message.error('标签更新失败');
    },
  });

  const [deleteTag] = useMutation(DELETE_TAG, {
    onCompleted: () => {
      message.success('标签删除成功');
      refetch();
    },
    onError: () => {
      message.error('标签删除失败');
    },
  });

  const tags: TagView[] = data?.tags || [];

  const handleCreate = () => {
    setEditingTag(null);
    form.resetFields();
    setShowForm(true);
  };

  const handleEdit = (tag: TagView) => {
    setEditingTag(tag);
    form.setFieldsValue({
      name: tag.name,
      slug: tag.slug,
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    deleteTag({ variables: { id } });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingTag) {
        await updateTag({ variables: { input: { ...values, id: editingTag.id } } });
      } else {
        await createTag({ variables: { input: values } });
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
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
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
      render: (_, record: TagView) => (
        <>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个标签吗？"
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
        <Title level={2}>标签管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          创建标签
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tags}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingTag ? '编辑标签' : '创建标签'}
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
            rules={[{ required: true, message: '请输入标签名称' }]}
          >
            <Input placeholder="请输入标签名称" />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: '请输入 slug' }]}
          >
            <Input placeholder="请输入标签标识（英文）" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              {editingTag ? '保存修改' : '创建标签'}
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