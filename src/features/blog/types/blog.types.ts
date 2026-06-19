export interface PostView {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: PostStatus;
  visibility: PostVisibility;
  createdAt: string;
  updatedAt: string;
  category?: CategoryView;
  tags: TagView[];
}

export interface CategoryView {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TagView {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface LinkView {
  id: number;
  name: string;
  url: string;
  description?: string;
  avatar?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommentView {
  id: number;
  postId: number;
  parentId?: number;
  authorName: string;
  authorEmail: string;
  authorAvatar?: string;
  content: string;
  status: CommentStatus;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  replies?: CommentView[];
}

export interface PostsListResponse {
  items: PostView[];
  total: number;
  page: number;
  limit: number;
}

export type PostStatus = 'DRAFT' | 'PENDING_REVIEW' | 'PUBLISHED' | 'ARCHIVED';

export type PostVisibility = 'PUBLIC' | 'PRIVATE';

export type CommentStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface CreatePostInput {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status?: PostStatus;
  visibility?: PostVisibility;
  categoryId?: number;
  tagIds?: number[];
}

export interface UpdatePostInput {
  id: number;
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  status?: PostStatus;
  visibility?: PostVisibility;
  categoryId?: number | null;
  tagIds?: number[];
}