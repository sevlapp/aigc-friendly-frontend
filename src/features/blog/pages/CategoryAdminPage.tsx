import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Table, Button, Form, Input, Modal, Popconfirm, message, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';

import { GET_CATEGORIES, CREATE_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY } from '../api/blog.queries';
import type { CategoryView } from '../types/blog.types';

const { Title } = Typography;

export function CategoryAdminPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryView | null>(null);
  const [form] = Form.useForm();

  const { loading, error, data, refetch } = useQuery(GET_CATEGORIES);

  const [createCategory] = useMutation(CREATE_CATEGORY, {
    onCompleted: () => {
      message.success('分类创建成功');
      setShowForm(false);
      form.resetFields();
      refetch();
    },
    onError: () => {
      message.error('分类创建失败');
    },
  });

  const [updateCategory] = useMutation(UPDATE_CATEGORY, {
    onCompleted: () => {
      message.success('分类更新成功');
      setShowForm(false);
      form.resetFields();
      refetch();
    },
    onError: () => {
      message.error('分类更新失败');
    },
  });

  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    onCompleted: () => {
      message.success('分类删除成功');
      refetch();
    },
    onError: () => {
      message.error('分类删除失败');
    },
  });

  const categories: CategoryView[] = data?.categories || [];

  const handleCreate = () => {
    setEditingCategory(null);
    form.resetFields();
    setShowForm(true);
  };

  const handleEdit = (category: CategoryView) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      slug: category.slug,
      description: category.description,
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    deleteCategory({ variables: { id } });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingCategory) {
        await updateCategory({ variables: { input: { ...values, id: editingCategory.id } } });
      } else {
        await createCategory({ variables: { input: values } });
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
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
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
      render: (_, record: CategoryView) => (
        <>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个分类吗？"
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
        <Title level={2}>分类管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          创建分类
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingCategory ? '编辑分类' : '创建分类'}
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
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: '请输入 slug' }]}
          >
            <Input placeholder="请输入分类标识（英文）" />
          </Form.Item>

          <Form.Item name="description" label="描述">
            <Input.TextArea rows={2} placeholder="请输入分类描述" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
              {editingCategory ? '保存修改' : '创建分类'}
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