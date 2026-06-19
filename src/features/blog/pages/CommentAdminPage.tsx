import React, { useState } from 'react';
import { Table, Button, Popconfirm, Tag, Input, Select, Space, Card, Empty } from 'antd';
import { EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from '@apollo/client';
import { GET_COMMENTS, APPROVE_COMMENT, REJECT_COMMENT, DELETE_COMMENT } from '@/features/blog/api/blog.queries';
import { CommentStatus } from '@/shared/types/blog.types';
const { Search } = Input;
const { Option } = Select;
interface CommentView {
 id: number;
 postId: number;
 postTitle: string;
 authorName: string;
 authorEmail?: string;
 authorAvatar?: string;
 content: string;
 status: CommentStatus;
 createdAt: string;
}
export const CommentAdminPage: React.FC = () => {
 const [searchText, setSearchText] = useState('');
 const [statusFilter, setStatusFilter] = useState<string>('');
 const { loading, data, refetch } = useQuery<{
 comments: CommentView[];
 }>(GET_COMMENTS, {
 variables: {
 options: {
 status: statusFilter || undefined,
 search: searchText || undefined,
 },
 },
 });
 const [approveComment] = useMutation(APPROVE_COMMENT, {
 onCompleted: () => refetch(),
 });
 const [rejectComment] = useMutation(REJECT_COMMENT, {
 onCompleted: () => refetch(),
 });
 const [deleteComment] = useMutation(DELETE_COMMENT, {
 onCompleted: () => refetch(),
 });
 const handleApprove = async (id: number) => {
 try {
 await approveComment({ variables: { id } });
 }
 catch (error) {
 console.error('Failed to approve comment:', error);
 }
 };
 const handleReject = async (id: number) => {
 try {
 await rejectComment({ variables: { id } });
 }
 catch (error) {
 console.error('Failed to reject comment:', error);
 }
 };
 const handleDelete = async (id: number) => {
 try {
 await deleteComment({ variables: { id } });
 }
 catch (error) {
 console.error('Failed to delete comment:', error);
 }
 };
 const columns = [
 {
 title: '作者',
 dataIndex: 'authorName',
 key: 'authorName',
 render: (name: string, record: CommentView) => (<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
 {record.authorAvatar && (<img src={record.authorAvatar} alt={name} style={{ width: 32, height: 32, borderRadius: '50%' }}/>)}
 <span>{name}</span>
 </div>),
 },
 {
 title: '文章',
 dataIndex: 'postTitle',
 key: 'postTitle',
 ellipsis: true,
 },
 {
 title: '内容',
 dataIndex: 'content',
 key: 'content',
 ellipsis: true,
 width: 300,
 },
 {
 title: '状态',
 dataIndex: 'status',
 key: 'status',
 render: (status: CommentStatus) => {
 const statusConfig = {
 [CommentStatus.PENDING]: { color: 'orange', text: '待审核' },
 [CommentStatus.APPROVED]: { color: 'green', text: '已通过' },
 [CommentStatus.REJECTED]: { color: 'red', text: '已拒绝' },
 };
 const config = statusConfig[status];
 return (<Tag color={config.color}>{config.text}</Tag>);
 },
 },
 {
 title: '创建时间',
 dataIndex: 'createdAt',
 key: 'createdAt',
 render: (date: string) => new Date(date).toLocaleString('zh-CN'),
 },
 {
 title: '操作',
 key: 'actions',
 render: (_, record: CommentView) => (<Space>
 {record.status === CommentStatus.PENDING && (<>
 <Button type="text" icon={<CheckOutlined />} onClick={() => handleApprove(record.id)}>
 通过
 </Button>
 <Button type="text" icon={<CloseOutlined />} onClick={() => handleReject(record.id)}>
 拒绝
 </Button>
 </>)}
 <Popconfirm title="确定删除这个评论吗？" onConfirm={() => handleDelete(record.id)}>
 <Button type="text" danger icon={<DeleteOutlined />}>删除</Button>
 </Popconfirm>
 </Space>),
 },
 ];
 const filteredData = data?.comments || [];
 return (<Card title="评论管理" extra={(<Space>
 <Search placeholder="搜索作者或内容" allowClear enterButton={<SearchOutlined />} size="middle" style={{ width: 250 }} onSearch={(value) => setSearchText(value)}/>
 <Select placeholder="筛选状态" style={{ width: 120 }} allowClear onChange={(value) => setStatusFilter(value || '')}>
 <Option value={CommentStatus.PENDING}>待审核</Option>
 <Option value={CommentStatus.APPROVED}>已通过</Option>
 <Option value={CommentStatus.REJECTED}>已拒绝</Option>
 </Select>
 </Space>)}>
 {loading ? (<div style={{ textAlign: 'center', padding: '50px' }}>加载中...</div>) : filteredData.length > 0 ? (<Table columns={columns} dataSource={filteredData} rowKey="id" pagination={{ pageSize: 10 }}/>) : (<Empty description="暂无评论"/>)}
 </Card>);
};