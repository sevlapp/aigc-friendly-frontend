import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Card, Select, Tag, Typography, Row, Col } from 'antd';
import { FolderOpenOutlined, TagOutlined } from '@ant-design/icons';

import { GET_CATEGORIES, GET_TAGS } from '../api/blog.queries';
import { PostList } from '../components/PostList';
import type { CategoryView, TagView } from '../types/blog.types';

const { Title } = Typography;
const { Option } = Select;

export function BlogHomePage() {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>();
  const [selectedTag, setSelectedTag] = useState<number | undefined>();

  const { loading: categoriesLoading, error: categoriesError, data: categoriesData } = useQuery(GET_CATEGORIES);
  const { loading: tagsLoading, error: tagsError, data: tagsData } = useQuery(GET_TAGS);

  const categories: CategoryView[] = categoriesData?.categories || [];
  const tags: TagView[] = tagsData?.tags || [];

  const handleCategoryChange = (value: number | undefined) => {
    setSelectedCategory(value);
    setSelectedTag(undefined);
  };

  const handleTagChange = (value: number | undefined) => {
    setSelectedTag(value);
    setSelectedCategory(undefined);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Title level={1} style={{ marginBottom: 32 }}>
        博客
      </Title>

      <Row gutter={24} style={{ marginBottom: 32 }}>
        <Col xs={24} md={18}>
          <Card>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <div className="flex items-center gap-2">
                <FolderOpenOutlined style={{ color: '#1890ff' }} />
                <Select
                  placeholder="选择分类"
                  style={{ width: 180 }}
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  allowClear
                >
                  {categories.map((category) => (
                    <Option key={category.id} value={category.id}>
                      {category.name}
                    </Option>
                  ))}
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <TagOutlined style={{ color: '#52c41a' }} />
                <Select
                  placeholder="选择标签"
                  style={{ width: 180 }}
                  value={selectedTag}
                  onChange={handleTagChange}
                  allowClear
                >
                  {tags.map((tag) => (
                    <Option key={tag.id} value={tag.id}>
                      {tag.name}
                    </Option>
                  ))}
                </Select>
              </div>
            </div>
          </Card>

          <PostList categoryId={selectedCategory} tagId={selectedTag} />
        </Col>

        <Col xs={24} md={6}>
          <Card title="分类" style={{ marginBottom: 16 }}>
            {categoriesLoading ? (
              <div>Loading...</div>
            ) : categories.length === 0 ? (
              <div>暂无分类</div>
            ) : (
              <div>
                {categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    style={{
                      padding: '8px',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      marginBottom: '4px',
                      backgroundColor: selectedCategory === category.id ? '#e6f7ff' : 'transparent',
                      color: selectedCategory === category.id ? '#1890ff' : '#666',
                    }}
                  >
                    {category.name}
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="标签">
            {tagsLoading ? (
              <div>Loading...</div>
            ) : tags.length === 0 ? (
              <div>暂无标签</div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {tags.map((tag) => (
                  <Tag
                    key={tag.id}
                    onClick={() => handleTagChange(tag.id)}
                    color={selectedTag === tag.id ? 'blue' : 'default'}
                    style={{ cursor: 'pointer' }}
                  >
                    {tag.name}
                  </Tag>
                ))}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}