import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Form, Input, Select, Switch, Button, message, Modal } from 'antd';
import { SaveOutlined, PlusOutlined } from '@ant-design/icons';

import { CREATE_POST, UPDATE_POST, GET_CATEGORIES, GET_TAGS } from '../api/blog.queries';
import type { PostView, CategoryView, TagView, PostStatus, PostVisibility } from '../types/blog.types';

const { TextArea } = Input;

interface PostFormProps {
  post?: PostView | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PostForm({ post, onSuccess, onCancel }: PostFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const { data: tagsData } = useQuery(GET_TAGS);

  const [createPost] = useMutation(CREATE_POST, {
    onCompleted: () => {
      setLoading(false);
      message.success('文章创建成功');
      onSuccess?.();
    },
    onError: () => {
      setLoading(false);
      message.error('文章创建失败');
    },
  });

  const [updatePost] = useMutation(UPDATE_POST, {
    onCompleted: () => {
      setLoading(false);
      message.success('文章更新成功');
      onSuccess?.();
    },
    onError: () => {
      setLoading(false);
      message.error('文章更新失败');
    },
  });

  const categories: CategoryView[] = categoriesData?.categories || [];
  const tags: TagView[] = tagsData?.tags || [];

  useEffect(() => {
    if (post) {
      form.setFieldsValue({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        status: post.status,
        visibility: post.visibility,
        categoryId: post.category?.id,
        tagIds: post.tags.map((t) => t.id),
      });
    }
  }, [post, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const input = {
        ...values,
        tagIds: values.tagIds || [],
      };

      if (post) {
        await updatePost({ variables: { input: { ...input, id: post.id } } });
      } else {
        await createPost({ variables: { input } });
      }
    } catch (err) {
      console.error('Form validation failed:', err);
    }
  };

  return (
    <Modal
      title={post ? '编辑文章' : '创建文章'}
      visible={true}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="title"
          label="标题"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input placeholder="请输入文章标题" />
        </Form.Item>

        <Form.Item
          name="slug"
          label="Slug"
          rules={[{ required: true, message: '请输入 slug' }]}
        >
          <Input placeholder="请输入文章标识（英文）" />
        </Form.Item>

        <Form.Item name="excerpt" label="摘要">
          <TextArea rows={2} placeholder="请输入文章摘要" />
        </Form.Item>

        <Form.Item
          name="content"
          label="内容"
          rules={[{ required: true, message: '请输入文章内容' }]}
        >
          <TextArea rows={8} placeholder="请输入文章内容" />
        </Form.Item>

        <Form.Item name="categoryId" label="分类">
          <Select placeholder="选择分类" allowClear>
            {categories.map((cat) => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="tagIds" label="标签">
          <Select mode="multiple" placeholder="选择标签">
            {tags.map((tag) => (
              <Select.Option key={tag.id} value={tag.id}>
                {tag.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="status" label="状态">
          <Select defaultValue="DRAFT">
            <Select.Option value="DRAFT">草稿</Select.Option>
            <Select.Option value="PENDING_REVIEW">待审核</Select.Option>
            <Select.Option value="PUBLISHED">已发布</Select.Option>
            <Select.Option value="ARCHIVED">已归档</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="visibility" label="可见性">
          <Select defaultValue="PUBLIC">
            <Select.Option value="PUBLIC">公开</Select.Option>
            <Select.Option value="PRIVATE">私有</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
            {post ? '保存修改' : '创建文章'}
          </Button>
          <Button onClick={onCancel} style={{ marginLeft: 8 }}>
            取消
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}