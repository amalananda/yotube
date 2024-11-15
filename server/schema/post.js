const redis = require('../config/redis')
const Post = require('../models/Post')
const { ObjectId } = require('mongodb')



const typeDefs = `#graphql

type Post {
    _id: ID!
    content: String! # (required)
    tags: [String]
    imgUrl: String
    authorId: ID! # (required)
    authorDetails: Author
    comments: [Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
  }
  type Author {
  _id: ID
  username: String
  imgUrl: String
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
    postsSorted: [Post]
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
        const memory = await redis.get("posts")
        if (memory) return JSON.parse(memory)
        const posts = await Post.findAll()
        redis.set("posts", JSON.stringify(posts))
        return posts
      } catch (err) {
        console.log(err)
        throw new Error("Failed to fetch posts")
      }
    },
    postsSorted: async () => {
      try {
        return await Post.findAllSorted()
      } catch (err) {
        throw new Error("Failed to fetch posts")
      }
    },
    postById: async (_, { id }) => {
      try {
        const post = await Post.findById(id)
        // Ensure the post has authorDetails populated before returning
        return post
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
        new ObjectId(authorId),
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
      await redis.del("posts")
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
