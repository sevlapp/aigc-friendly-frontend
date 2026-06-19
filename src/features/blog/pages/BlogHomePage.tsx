import { useQuery } from '@apollo/client';
import { Card, Tag, Typography } from 'antd';
import { CalendarOutlined, FolderOutlined } from '@ant-design/icons';

import { GET_POSTS } from '../../api/blog.queries';
import type { PostView } from '../../types/blog.types';

const { Title, Text, Paragraph } = Typography;

function PostCard({ post }: { post: PostView }) {
  return (
    <Card hoverable style={{ marginBottom: 16 }}>
      <Title level={3} style={{ marginBottom: 8 }}>
        {post.title}
      </Title>
      <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 12 }}>
        {post.excerpt || post.content}
      </Paragraph>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        {post.category && (
          <span className="flex items-center gap-2 text-gray-500 text-sm">
            <FolderOutlined />
            <Text>{post.category.name}</Text>
          </span>
        )}
        <span className="flex items-center gap-2 text-gray-500 text-sm">
          <CalendarOutlined />
          <Text>{new Date(post.createdAt).toLocaleDateString()}</Text>
        </span>
      </div>
      {post.tags.length > 0 && (
        <div style={{ marginTop: 12 }}>
          {post.tags.map((tag) => (
            <Tag key={tag.id}>{tag.name}</Tag>
          ))}
        </div>
      )}
    </Card>
  );
}

export function BlogHomePage() {
  const { loading, error, data } = useQuery(GET_POSTS, {
    variables: { page: 1, limit: 10, status: 'PUBLISHED' },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const posts = data?.posts?.items || [];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <Title level={1} style={{ marginBottom: 32 }}>
        博客
      </Title>
      {posts.length === 0 ? (
        <Card>暂无文章</Card>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  );
}