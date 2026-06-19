import { useQuery, useMutation } from '@apollo/client';
import { Card, Tag, Typography, Button, Form, Input } from 'antd';
import { CalendarOutlined, FolderOutlined, SendOutlined } from '@ant-design/icons';
import { useParams } from 'react-router';

import { GET_POST_BY_SLUG, CREATE_COMMENT } from '../../api/blog.queries';
import type { PostView, CommentView } from '../../types/blog.types';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

function CommentItem({ comment }: { comment: CommentView }) {
  return (
    <div style={{ padding: 16, borderBottom: '1px solid #f0f0f0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <Text strong>{comment.authorName}</Text>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {new Date(comment.createdAt).toLocaleString()}
        </Text>
      </div>
      <Paragraph>{comment.content}</Paragraph>
    </div>
  );
}

export function PostDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [form] = Form.useForm();
  const { loading, error, data } = useQuery(GET_POST_BY_SLUG, {
    variables: { slug },
  });

  const [createComment] = useMutation(CREATE_COMMENT);

  const post: PostView = data?.postBySlug;
  const comments: CommentView[] = post?.comments || [];

  const handleSubmit = async () => {
    try {
      const values = form.getFieldsValue();
      await createComment({
        variables: {
          input: {
            postId: post.id,
            authorName: values.authorName,
            authorEmail: values.authorEmail,
            content: values.content,
          },
        },
      });
      form.resetFields();
    } catch (err) {
      console.error('Failed to create comment:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!post) return <div>文章不存在</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <Title level={1}>{post.title}</Title>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        {post.category && (
          <span className="flex items-center gap-2 text-gray-500">
            <FolderOutlined />
            <Text>{post.category.name}</Text>
          </span>
        )}
        <span className="flex items-center gap-2 text-gray-500">
          <CalendarOutlined />
          <Text>{new Date(post.createdAt).toLocaleDateString()}</Text>
        </span>
      </div>
      {post.tags.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          {post.tags.map((tag) => (
            <Tag key={tag.id}>{tag.name}</Tag>
          ))}
        </div>
      )}
      <Card>
        <Paragraph style={{ whiteSpace: 'pre-wrap' }}>{post.content}</Paragraph>
      </Card>

      <div style={{ marginTop: 48 }}>
        <Title level={2}>评论 ({comments.length})</Title>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="authorName" label="您的名字" rules={[{ required: true }]}>
            <Input placeholder="请输入您的名字" />
          </Form.Item>
          <Form.Item name="authorEmail" label="邮箱" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="请输入您的邮箱" />
          </Form.Item>
          <Form.Item name="content" label="评论内容" rules={[{ required: true }]}>
            <TextArea rows={4} placeholder="请输入评论内容" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
              提交评论
            </Button>
          </Form.Item>
        </Form>

        {comments.length > 0 && (
          <div style={{ marginTop: 32 }}>
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}