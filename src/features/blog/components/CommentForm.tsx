import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Form, Input, Button, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';

import { CREATE_COMMENT } from '../api/blog.queries';

const { TextArea } = Input;

interface CommentFormProps {
  postId: number;
  parentId?: number;
  onSuccess?: () => void;
}

export function CommentForm({ postId, parentId, onSuccess }: CommentFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [createComment] = useMutation(CREATE_COMMENT, {
    onCompleted: () => {
      setLoading(false);
      form.resetFields();
      message.success('评论提交成功，等待审核');
      onSuccess?.();
    },
    onError: () => {
      setLoading(false);
      message.error('评论提交失败');
    },
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await createComment({
        variables: {
          input: {
            postId,
            parentId: parentId || undefined,
            authorName: values.authorName,
            authorEmail: values.authorEmail,
            content: values.content,
          },
        },
      });
    } catch (err) {
      console.error('Form validation failed:', err);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item
        name="authorName"
        label="您的名字"
        rules={[{ required: true, message: '请输入您的名字' }]}
      >
        <Input placeholder="请输入您的名字" />
      </Form.Item>
      <Form.Item
        name="authorEmail"
        label="邮箱"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入有效的邮箱地址' },
        ]}
      >
        <Input placeholder="请输入您的邮箱" />
      </Form.Item>
      <Form.Item
        name="content"
        label="评论内容"
        rules={[{ required: true, message: '请输入评论内容' }]}
      >
        <TextArea rows={4} placeholder="请输入评论内容" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} icon={<SendOutlined />}>
          提交评论
        </Button>
      </Form.Item>
    </Form>
  );
}