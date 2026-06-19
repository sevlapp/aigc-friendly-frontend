import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Table, Button, Tag, Space, Popconfirm, message, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

import { GET_POSTS, DELETE_POST, PUBLISH_POST } from '../api/blog.queries';
import { PostForm } from '../components/PostForm';
import type { PostView } from '../types/blog.types';

const { Title } = Typography;

const statusColors: Record<string, string> = {
  DRAFT: 'default',
  PENDING_REVIEW: 'warning',
  PUBLISHED: 'success',
  ARCHIVED: 'default',
};

const statusLabels: Record<string, string> = {
  DRAFT: '草稿',
  PENDING_REVIEW: '待审核',
  PUBLISHED: '已发布',
  ARCHIVED: '已归档',
};

export function BlogAdminPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<PostView | null>(null);

  const { loading, error, data, refetch } = useQuery(GET_POSTS, {
    variables: { page: 1, limit: 20 },
  });

  const [deletePost] = useMutation(DELETE_POST, {
    onCompleted: () => {
      message.success('文章删除成功');
      refetch();
    },
    onError: () => {
      message.error('文章删除失败');
    },
  });

  const [publishPost] = useMutation(PUBLISH_POST, {
    onCompleted: () => {
      message.success('文章发布成功');
      refetch();
    },
    onError: () => {
      message.error('文章发布失败');
    },
  });

  const posts: PostView[] = data?.posts?.items || [];

  const handleCreate = () => {
    setEditingPost(null);
    setShowForm(true);
  };

  const handleEdit = (post: PostView) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    deletePost({ variables: { id } });
  };

  const handlePublish = (id: number) => {
    publishPost({ variables: { id } });
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    refetch();
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category: { name: string }) => category?.name || '-',
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: { name: string }[]) => (
        <Space>
          {tags.map((tag) => (
            <Tag key={tag.name}>{tag.name}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
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
      render: (_, record: PostView) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => window.open(`/blog/${record.slug}`, '_blank')}
          >
            预览
          </Button>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          {record.status !== 'PUBLISHED' && (
            <Button
              type="text"
              icon={<PlusOutlined />}
              onClick={() => handlePublish(record.id)}
            >
              发布
            </Button>
          )}
          <Popconfirm
            title="确定删除这篇文章吗？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2}>文章管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          创建文章
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={posts}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {showForm && (
        <PostForm
          post={editingPost}
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}