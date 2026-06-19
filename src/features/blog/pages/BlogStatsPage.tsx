import { useQuery } from '@apollo/client';
import { Typography, Card, Statistic, Row, Col, Tag } from 'antd';
import { FileTextOutlined, MessageOutlined, EyeOutlined, ThumbsUpOutlined, CalendarOutlined, TrendingUpOutlined } from '@ant-design/icons';

import { GET_STATS, GET_ARCHIVE_STATS } from '../api/blog.queries';
import type { BlogStats, ArchiveStats } from '../types/blog.types';

const { Title, Text } = Typography;

export function BlogStatsPage() {
  const { data: statsData } = useQuery(GET_STATS);
  const { data: archiveData } = useQuery(GET_ARCHIVE_STATS);

  const stats: BlogStats = statsData?.stats || {};
  const archives: ArchiveStats[] = archiveData?.archiveStats || [];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Title level={2}>博客统计</Title>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总文章数"
              value={stats.totalPosts || 0}
              prefix={<FileTextOutlined />}
              suffix="篇"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已发布"
              value={stats.publishedPosts || 0}
              prefix={<TrendingUpOutlined />}
              suffix="篇"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总评论数"
              value={stats.totalComments || 0}
              prefix={<MessageOutlined />}
              suffix="条"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待审核评论"
              value={stats.pendingComments || 0}
              prefix={<CalendarOutlined />}
              suffix="条"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总访问量"
              value={stats.totalViews || 0}
              prefix={<EyeOutlined />}
              suffix="次"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总点赞数"
              value={stats.totalLikes || 0}
              prefix={<ThumbsUpOutlined />}
              suffix="次"
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 24 }}>
        <Title level={3}>归档统计</Title>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {archives.map((archive) => (
            <Tag key={`${archive.year}-${archive.month}`} color="blue">
              {archive.year}年{archive.month}月 ({archive.count}篇)
            </Tag>
          ))}
          {archives.length === 0 && (
            <Text type="secondary">暂无归档数据</Text>
          )}
        </div>
      </Card>
    </div>
  );
}