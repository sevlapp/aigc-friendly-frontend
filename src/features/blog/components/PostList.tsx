import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Spin } from 'antd';

import { GET_POSTS } from '../api/blog.queries';
import { PostCard } from './PostCard';
import { Pagination } from './Pagination';
import type { PostView, PostStatus } from '../types/blog.types';

interface PostListProps {
  categoryId?: number;
  tagId?: number;
  status?: PostStatus;
}

export function PostList({ categoryId, tagId, status = 'PUBLISHED' }: PostListProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const { loading, error, data } = useQuery(GET_POSTS, {
    variables: {
      page,
      limit: pageSize,
      categoryId,
      tagId,
      status,
    },
  });

  const posts: PostView[] = data?.posts?.items || [];
  const total = data?.posts?.total || 0;
  const currentPage = data?.posts?.page || 1;

  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>Error: {error.message}</div>;
  }

  if (posts.length === 0) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>暂无文章</div>;
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      <Pagination
        current={currentPage}
        total={total}
        pageSize={pageSize}
        onChange={handlePageChange}
      />
    </div>
  );
}

