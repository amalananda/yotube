const Post = require('../models/Post')

const typeDefs = `#graphql

type Post {
    _id: ID!
    content: String! # (required)
    tags: [String]
    imgUrl: String
    authorId: ID! # (required)
    comments: [Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
  }
  type Query {
    posts: [Post]
    postById(id: ID!): Post
  }
  type Mutation {
    addPost(content: String!, authorId: ID!, tags: [String], imgUrl: String): Post
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
    postById: async (_, { id }) => {
      try {
        return await Post.findById(id)
      } catch (err) {
        throw new Error("Failed to fetch post by id")
      }
    }
  },
  Mutation: {
    addPost: async (_, { content, authorId, tags, imgUrl }) => {
      try {
        const newPost = { content, authorId, tags, imgUrl }
        return await Post.create(newPost)
      } catch (err) {
        throw new Error("Failed to add post")
      }
    }
  }
}

module.exports = { typeDefs, resolvers }
