import { Card, Tag, Typography } from 'antd';
import { CalendarOutlined, FolderOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';

import type { PostView } from '../types/blog.types';

const { Title, Text, Paragraph } = Typography;

interface PostCardProps {
  post: PostView;
}

export function PostCard({ post }: PostCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/blog/${post.slug}`);
  };

  return (
    <Card
      hoverable
      onClick={handleClick}
      style={{ marginBottom: 16, cursor: 'pointer', transition: 'all 0.3s' }}
      bodyStyle={{ padding: 24 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <Title level={3} style={{ marginBottom: 8, margin: 0 }}>
            {post.title}
            <ArrowRightOutlined style={{ marginLeft: 8, fontSize: 16, color: '#1890ff' }} />
          </Title>
        </div>
      </div>

      <Paragraph
        ellipsis={{ rows: 2 }}
        style={{ marginBottom: 12, color: '#666', fontSize: 14 }}
      >
        {post.excerpt || post.content}
      </Paragraph>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 12 }}>
        {post.category && (
          <span className="flex items-center gap-2 text-gray-500 text-sm">
            <FolderOutlined />
            <Text>{post.category.name}</Text>
          </span>
        )}
        <span className="flex items-center gap-2 text-gray-500 text-sm">
          <CalendarOutlined />
          <Text>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</Text>
        </span>
      </div>

      {post.tags.length > 0 && (
        <div>
          {post.tags.map((tag) => (
            <Tag key={tag.id} color="blue">{tag.name}</Tag>
          ))}
        </div>
      )}
    </Card>
  );
}