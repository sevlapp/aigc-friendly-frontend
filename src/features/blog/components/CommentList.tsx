import { useState } from 'react';
import { Typography, Button, Avatar, Divider } from 'antd';
import { ThumbsUpOutlined, ReplyOutlined } from '@ant-design/icons';

import type { CommentView } from '../types/blog.types';

const { Text, Paragraph } = Typography;

interface CommentListProps {
  comments: CommentView[];
  onReply?: (commentId: number) => void;
}

interface CommentItemProps {
  comment: CommentView;
  onReply?: (commentId: number) => void;
  level?: number;
}

function CommentItem({ comment, onReply, level = 0 }: CommentItemProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likeCount);

  const handleLike = () => {
    if (liked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setLiked(!liked);
  };

  return (
    <div style={{ paddingLeft: level * 24, marginBottom: 16 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <Avatar
          size="large"
          icon={<UserIcon />}
          style={{ backgroundColor: '#1890ff' }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Text strong>{comment.authorName}</Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {new Date(comment.createdAt).toLocaleString('zh-CN')}
            </Text>
            {comment.status === 'PENDING' && (
              <Text type="warning" style={{ fontSize: 12 }}>待审核</Text>
            )}
          </div>
          <Paragraph style={{ marginBottom: 8 }}>{comment.content}</Paragraph>
          <div style={{ display: 'flex', gap: 16 }}>
            <Button
              type="text"
              icon={<ThumbsUpOutlined />}
              onClick={handleLike}
              style={{ color: liked ? '#1890ff' : undefined }}
            >
              {likeCount}
            </Button>
            <Button
              type="text"
              icon={<ReplyOutlined />}
              onClick={() => onReply?.(comment.id)}
            >
              回复
            </Button>
          </div>
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginTop: 16 }}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

export function CommentList({ comments, onReply }: CommentListProps) {
  const sortedComments = comments.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      {sortedComments.map((comment) => (
        <div key={comment.id}>
          <CommentItem comment={comment} onReply={onReply} />
          <Divider style={{ margin: '16px 0' }} />
        </div>
      ))}
    </div>
  );
}