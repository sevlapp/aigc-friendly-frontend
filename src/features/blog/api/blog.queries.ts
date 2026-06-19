import { gql } from '@apollo/client';

export const POST_FRAGMENT = gql`
  fragment PostFields on PostDTO {
    id
    title
    slug
    content
    excerpt
    status
    visibility
    createdAt
    updatedAt
  }
`;

export const CATEGORY_FRAGMENT = gql`
  fragment CategoryFields on CategoryDTO {
    id
    name
    slug
    description
    createdAt
    updatedAt
  }
`;

export const TAG_FRAGMENT = gql`
  fragment TagFields on TagDTO {
    id
    name
    slug
    createdAt
    updatedAt
  }
`;

export const COMMENT_FRAGMENT = gql`
  fragment CommentFields on CommentDTO {
    id
    postId
    parentId
    authorName
    authorEmail
    authorAvatar
    content
    status
    likeCount
    createdAt
    updatedAt
  }
`;

export const GET_POSTS = gql`
  ${POST_FRAGMENT}
  ${CATEGORY_FRAGMENT}
  ${TAG_FRAGMENT}
  query Posts($page: Int, $limit: Int, $categoryId: Int, $tagId: Int, $status: PostStatus) {
    posts(page: $page, limit: $limit, categoryId: $categoryId, tagId: $tagId, status: $status) {
      items {
        ...PostFields
        category {
          ...CategoryFields
        }
        tags {
          ...TagFields
        }
      }
      total
      page
      limit
    }
  }
`;

export const GET_POST_BY_ID = gql`
  ${POST_FRAGMENT}
  ${CATEGORY_FRAGMENT}
  ${TAG_FRAGMENT}
  ${COMMENT_FRAGMENT}
  query Post($id: Int!) {
    post(id: $id) {
      ...PostFields
      category {
        ...CategoryFields
      }
      tags {
        ...TagFields
      }
      comments {
        ...CommentFields
      }
    }
  }
`;

export const GET_POST_BY_SLUG = gql`
  ${POST_FRAGMENT}
  ${CATEGORY_FRAGMENT}
  ${TAG_FRAGMENT}
  ${COMMENT_FRAGMENT}
  query PostBySlug($slug: String!) {
    postBySlug(slug: $slug) {
      ...PostFields
      category {
        ...CategoryFields
      }
      tags {
        ...TagFields
      }
      comments {
        ...CommentFields
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  ${CATEGORY_FRAGMENT}
  query Categories {
    categories {
      ...CategoryFields
    }
  }
`;

export const GET_TAGS = gql`
  ${TAG_FRAGMENT}
  query Tags {
    tags {
      ...TagFields
    }
  }
`;

export const GET_LINKS = gql`
  query Links {
    links {
      id
      name
      url
      description
      avatar
      sortOrder
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const GET_COMMENTS_BY_POST = gql`
  ${COMMENT_FRAGMENT}
  query Comments($postId: Int!) {
    comments(postId: $postId) {
      ...CommentFields
    }
  }
`;

export const CREATE_COMMENT = gql`
  ${COMMENT_FRAGMENT}
  mutation CreateComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      ...CommentFields
    }
  }
`;

export const CREATE_POST = gql`
  ${POST_FRAGMENT}
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      ...PostFields
    }
  }
`;

export const UPDATE_POST = gql`
  ${POST_FRAGMENT}
  mutation UpdatePost($input: UpdatePostInput!) {
    updatePost(input: $input) {
      ...PostFields
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: Int!) {
    deletePost(id: $id)
  }
`;

export const PUBLISH_POST = gql`
  ${POST_FRAGMENT}
  mutation PublishPost($id: Int!) {
    publishPost(id: $id) {
      ...PostFields
    }
  }
`;

export const CREATE_CATEGORY = gql`
  ${CATEGORY_FRAGMENT}
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      ...CategoryFields
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  ${CATEGORY_FRAGMENT}
  mutation UpdateCategory($input: UpdateCategoryInput!) {
    updateCategory(input: $input) {
      ...CategoryFields
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: Int!) {
    deleteCategory(id: $id)
  }
`;

export const CREATE_TAG = gql`
  ${TAG_FRAGMENT}
  mutation CreateTag($input: CreateTagInput!) {
    createTag(input: $input) {
      ...TagFields
    }
  }
`;

export const UPDATE_TAG = gql`
  ${TAG_FRAGMENT}
  mutation UpdateTag($input: UpdateTagInput!) {
    updateTag(input: $input) {
      ...TagFields
    }
  }
`;

export const DELETE_TAG = gql`
  mutation DeleteTag($id: Int!) {
    deleteTag(id: $id)
  }
`;

export const GET_CONFIG = gql`
  query Config {
    config {
      key
      value
      description
    }
  }
`;

export const UPDATE_CONFIG = gql`
  mutation UpdateConfig($input: [UpdateConfigInput!]!) {
    updateConfig(input: $input) {
      key
      value
    }
  }
`;

export const CREATE_LINK = gql`
  mutation CreateLink($input: CreateLinkInput!) {
    createLink(input: $input) {
      id
      name
      url
      description
      avatar
      sortOrder
      isActive
    }
  }
`;

export const UPDATE_LINK = gql`
  mutation UpdateLink($input: UpdateLinkInput!) {
    updateLink(input: $input) {
      id
      name
      url
      description
      avatar
      sortOrder
      isActive
    }
  }
`;

export const DELETE_LINK = gql`
  mutation DeleteLink($id: Int!) {
    deleteLink(id: $id)
  }
`;

export const GET_STATS = gql`
  query Stats {
    stats {
      totalPosts
      totalComments
      totalViews
      totalLikes
      publishedPosts
      pendingComments
    }
  }
`;

export const GET_ARCHIVE_STATS = gql`
  query ArchiveStats {
    archiveStats {
      year
      month
      count
    }
  }
`;