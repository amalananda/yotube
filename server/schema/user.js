const User = require("../models/User")

// Definisi schema menggunakan #graphql, tanpa gql
const typeDefs = `#graphql
type User {
    _id: ID!
    name: String
    username: String!
    email: String!
    password: String!
    followers: [User!]!
    followings: [User!]!
}
type Query {
    users: [User]
    userById(id: ID!): User
    searchUsers(query: String!): [User]
    getUserWithFollowersAndFollowing(userId: ID!): User
}
type Mutation {
    addUser(user: UserInput!): User
}
input UserInput {
    name: String
    username: String!
    email: String!
    password: String!
}
`

const resolvers = {
  Query: {
    users: async () => {

      try {
        const users = await User.findAll()
        return users
      } catch (err) {
        throw err
      }
    },
    userById: async (_, { id }) => {
      try {
        const user = await User.findById(id)
        return user
      } catch (err) {
        throw err
      }
    },
    searchUsers: async (_, { query }) => {
      try {
        const users = await User.search(query)
        return users
      } catch (err) {
        throw err
      }
    },
    getUserWithFollowersAndFollowing: async (_, { userId }) => {
      return await User.follower(userId)
    },
  },
  Mutation: {
    addUser: async (_, { user }) => {
      try {
        const newUser = await User.create(user)
        return newUser
      } catch (err) {
        throw new Error("Failed to add new user")
      }
    }
  }
}

module.exports = { typeDefs, resolvers }
