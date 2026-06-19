import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Typography, Row, Col, Card, Spin, Breadcrumb } from 'antd';
import { ArrowLeftOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router';

import { GET_CATEGORIES, GET_POSTS } from '../api/blog.queries';
import { PostCard } from '../components/PostCard';
import { Pagination } from '../components/Pagination';
import type { CategoryView, PostView } from '../types/blog.types';

const { Title, Text } = Typography;

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { loading: categoriesLoading, data: categoriesData } = useQuery(GET_CATEGORIES);
  const { loading: postsLoading, error: postsError, data: postsData } = useQuery(GET_POSTS, {
    variables: { page, limit: pageSize, status: 'PUBLISHED' },
  });

  const categories: CategoryView[] = categoriesData?.categories || [];
  const category = categories.find((c) => c.slug === slug);
  const categoryPosts = postsData?.posts?.items || [];
  const total = postsData?.posts?.total || 0;
  const currentPage = postsData?.posts?.page || 1;

  const filteredPosts = category ? categoryPosts.filter((post: PostView) => 
    post.category?.slug === slug
  ) : [];

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleBack = () => {
    navigate('/blog');
  };

  if (categoriesLoading || postsLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!category) {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Text type="danger">分类不存在</Text>
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
          <FolderOpenOutlined />
          {category.name}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={24}>
        <Col xs={24} md={18}>
          <div style={{ marginBottom: 32 }}>
            <Title level={1} style={{ marginBottom: 8 }}>
              {category.name}
            </Title>
            {category.description && (
              <Text type="secondary">{category.description}</Text>
            )}
          </div>

          {filteredPosts.length === 0 ? (
            <Card>该分类下暂无文章</Card>
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
          <Card title="所有分类">
            <div>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => navigate(`/blog/category/${cat.slug}`)}
                  style={{
                    padding: '8px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    marginBottom: '4px',
                    backgroundColor: cat.slug === slug ? '#e6f7ff' : 'transparent',
                    color: cat.slug === slug ? '#1890ff' : '#666',
                  }}
                >
                  {cat.name}
                </div>
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