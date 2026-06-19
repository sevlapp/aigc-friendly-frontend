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