import { useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { Card, Tag, Typography, Breadcrumb } from 'antd';
import { CalendarOutlined, FolderOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router';

import { GET_POST_BY_SLUG, GET_COMMENTS_BY_POST } from '../api/blog.queries';
import { CommentList } from '../components/CommentList';
import { CommentForm } from '../components/CommentForm';
import type { PostView, CommentView } from '../types/blog.types';

const { Title, Text, Paragraph } = Typography;

export function PostDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [replyToCommentId, setReplyToCommentId] = useState<number | undefined>();
  const [loadComments, { data: commentsData }] = useLazyQuery(GET_COMMENTS_BY_POST);

  const { loading, error, data } = useQuery(GET_POST_BY_SLUG, {
    variables: { slug },
    onCompleted: (postData) => {
      const post = postData?.postBySlug;
      if (post) {
        loadComments({ variables: { postId: post.id } });
      }
    },
  });

  const post: PostView = data?.postBySlug;
  const comments: CommentView[] = commentsData?.comments || [];

  const handleBack = () => {
    navigate('/blog');
  };

  const handleReply = (commentId: number) => {
    setReplyToCommentId(commentId);
  };

  const handleCommentSuccess = () => {
    setReplyToCommentId(undefined);
    if (post) {
      loadComments({ variables: { postId: post.id } });
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>Error: {error.message}</div>;
  if (!post) return <div style={{ textAlign: 'center', padding: '40px' }}>文章不存在</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <Breadcrumb style={{ marginBottom: 24 }}>
        <Breadcrumb.Item onClick={handleBack}>
          <ArrowLeftOutlined />
          博客首页
        </Breadcrumb.Item>
        {post.category && (
          <Breadcrumb.Item onClick={() => navigate(`/blog/category/${post.category.slug}`)}>
            <FolderOutlined />
            {post.category.name}
          </Breadcrumb.Item>
        )}
        <Breadcrumb.Item>{post.title}</Breadcrumb.Item>
      </Breadcrumb>

      <Title level={1}>{post.title}</Title>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        {post.category && (
          <span 
            className="flex items-center gap-2 text-gray-500"
            onClick={() => navigate(`/blog/category/${post.category.slug}`)}
            style={{ cursor: 'pointer', color: '#1890ff' }}
          >
            <FolderOutlined />
            <Text>{post.category.name}</Text>
          </span>
        )}
        <span className="flex items-center gap-2 text-gray-500">
          <CalendarOutlined />
          <Text>{new Date(post.createdAt).toLocaleDateString('zh-CN')}</Text>
        </span>
      </div>
      {post.tags.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          {post.tags.map((tag) => (
            <Tag 
              key={tag.id} 
              color="blue"
              onClick={() => navigate(`/blog/tag/${tag.slug}`)}
              style={{ cursor: 'pointer' }}
            >
              {tag.name}
            </Tag>
          ))}
        </div>
      )}
      <Card>
        <Paragraph style={{ whiteSpace: 'pre-wrap', fontSize: 16, lineHeight: 1.8 }}>{post.content}</Paragraph>
      </Card>

      <div style={{ marginTop: 48 }}>
        <Title level={2}>评论 ({comments.length})</Title>
        
        {replyToCommentId && (
          <div style={{ marginBottom: 24, padding: 16, backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <Text type="secondary">正在回复评论...</Text>
            <CommentForm 
              postId={post.id} 
              parentId={replyToCommentId} 
              onSuccess={handleCommentSuccess} 
            />
          </div>
        )}

        <div style={{ marginBottom: 32 }}>
          <CommentForm postId={post.id} onSuccess={handleCommentSuccess} />
        </div>

        {comments.length > 0 ? (
          <CommentList comments={comments} onReply={handleReply} />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#fafafa', borderRadius: '4px' }}>
            <Text type="secondary">暂无评论，快来发表第一条评论吧！</Text>
          </div>
        )}
      </div>
    </div>
  );
}