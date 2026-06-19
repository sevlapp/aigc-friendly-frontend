import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Typography, Row, Col, Card, Spin, Breadcrumb, Tag } from 'antd';
import { ArrowLeftOutlined, TagOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router';

import { GET_TAGS, GET_POSTS } from '../api/blog.queries';
import { PostCard } from '../components/PostCard';
import { Pagination } from '../components/Pagination';
import type { TagView, PostView } from '../types/blog.types';

const { Title, Text } = Typography;

export function TagPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { loading: tagsLoading, data: tagsData } = useQuery(GET_TAGS);
  const { loading: postsLoading, error: postsError, data: postsData } = useQuery(GET_POSTS, {
    variables: { page, limit: pageSize, status: 'PUBLISHED' },
  });

  const tags: TagView[] = tagsData?.tags || [];
  const tag = tags.find((t) => t.slug === slug);
  const allPosts = postsData?.posts?.items || [];
  const total = postsData?.posts?.total || 0;
  const currentPage = postsData?.posts?.page || 1;

  const filteredPosts = tag ? allPosts.filter((post: PostView) => 
    post.tags.some((t) => t.slug === slug)
  ) : [];

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleBack = () => {
    navigate('/blog');
  };

  if (tagsLoading || postsLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!tag) {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Text type="danger">标签不存在</Text>
            <br />
            <Button type="primary" onClick={handleBack} style={{ marginTop: 16 }}>
              返回博客首页
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Breadcrumb style={{ marginBottom: 24 }}>
        <Breadcrumb.Item onClick={handleBack}>
          <ArrowLeftOutlined />
          博客首页
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <TagOutlined />
          {tag.name}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={24}>
        <Col xs={24} md={18}>
          <div style={{ marginBottom: 32 }}>
            <Title level={1} style={{ marginBottom: 8 }}>
              <Tag color="blue">{tag.name}</Tag>
            </Title>
            <Text type="secondary">共有 {filteredPosts.length} 篇相关文章</Text>
          </div>

          {filteredPosts.length === 0 ? (
            <Card>该标签下暂无文章</Card>
          ) : (
            <>
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              <Pagination
                current={currentPage}
                total={total}
                pageSize={pageSize}
                onChange={handlePageChange}
              />
            </>
          )}
        </Col>

        <Col xs={24} md={6}>
          <Card title="所有标签">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {tags.map((t) => (
                <Tag
                  key={t.id}
                  onClick={() => navigate(`/blog/tag/${t.slug}`)}
                  color={t.slug === slug ? 'blue' : 'default'}
                  style={{ cursor: 'pointer' }}
                >
                  {t.name}
                </Tag>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

function Button({ type, onClick, children, style }: { type?: string; onClick?: () => void; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '8px 16px',
        backgroundColor: type === 'primary' ? '#1890ff' : '#fff',
        color: type === 'primary' ? '#fff' : '#666',
        border: type === 'primary' ? 'none' : '1px solid #d9d9d9',
        borderRadius: '4px',
        cursor: 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  );
}