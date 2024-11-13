const Post = require('../models/Post')

const typeDefs = `#graphql

type Post {
    _id: ID!
    content: String! # (required)
    tags: [String]
    imgUrl: String
    authorId: ID! # (required)
    authorDetails: User
    comments: [Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
  }
  type Comment {
    content: String!
    username: String!
    createdAt: String
    updatedAt: String
    }

    type Like {
    username: String!
    createdAt: String
    updatedAt: String
  }
  type Query {
    posts: [Post]
    postById(id: ID!): Post
  }
  type Mutation {
    addPost(content: String!, authorId: ID!, tags: [String], imgUrl: String): Post
    commentPost(postId: ID!, comment: CommentInput!): Post
    likePost(postId: ID!, like: LikeInput!): Post
}
input PostInput {
  content: String!
  tags: [String]
  imgUrl: String
  authorId: ID!
}

input CommentInput {
  content: String!
  username: String!
}

input LikeInput {
  username: String!
}
`
const resolvers = {
  Query: {
    posts: async () => {
      try {
        return await Post.findAll()
      } catch (err) {
        throw new Error("Failed to fetch posts")
      }
    },
    posts: async () => {
      try {
        return await Post.findAllSorted()
      } catch (err) {
        throw new Error("Failed to fetch posts")
      }
    },
    postById: async (_, { id }) => {
      try {
        return await Post.findById(id)
      } catch (err) {
        throw new Error("Failed to fetch post by id")
      }
    }
  },
  Mutation: {
    addPost: async (_, args) => {
      const { content, tags, imgUrl, authorId } = args
      const createdAt = new Date()
      const updatedAt = new Date()

      const newPost = await Post.addPost(
        content,
        tags,
        imgUrl,
        authorId,
        createdAt,
        updatedAt
      )

      const savedPost = {
        _id: newPost.insertedId,
        content,
        tags,
        imgUrl,
        authorId,
        comments: [],
        likes: [],
        createdAt,
        updatedAt,
      }

      return savedPost
    },
    commentPost: async (_, { postId, comment }) => {
      const newComment = {
        ...comment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      const updatedPost = await Post.addComment(postId, newComment)
      return updatedPost
    },
    likePost: async (_, { postId, like }) => {
      const newLike = {
        ...like,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      const updatedPost = await Post.addLike(postId, newLike)
      return updatedPost
    },
  },
}

module.exports = { typeDefs, resolvers }
