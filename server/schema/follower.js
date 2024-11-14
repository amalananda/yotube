const Follower = require("../models/Follower")

const typeDefs = `#graphql

type Follow {
    _id: ID!
    followingId: ID!
    followerId: ID!
    createdAt: String
    updatedAt: String
  }
  type Query {
    followers(userId: ID!): [Follow]        # Mendapatkan daftar pengguna yang mengikuti user tertentu
    following(userId: ID!): [Follow]        # Mendapatkan daftar pengguna yang diikuti oleh user tertentu
    followersCount(userId: ID!): Int
    followingCount(userId: ID!): Int
  }
  type Mutation {
    # addFollower(user:UserInput!):User,
    # addFollowing
    followUser(followerId: ID!, followingId: ID!): Follow
    # unfollowUser(followerId: ID!, followingId: ID!): String
  }

  input FollowerInput {
    followingId: ID!
    followerId: ID!
  }
  input FollowingInput {
    followingId: ID!
    followerId: ID!
  }
`

const resolvers = {
  Query: {
    followers: async (_, { userId }) => {
      try {
        return await Follower.findAllUserFollower(userId)
      } catch (err) {
        console.error("Error in followers:", err)
        throw new Error("Failed to fetch followers")
      }
    },
    following: async (_, { userId }) => {
      try {
        return await Follower.findAllUserFollowing(userId)
      } catch (err) {
        console.error("Error in following:", err)
        throw new Error("Failed to fetch following")
      }
    },
    followersCount: async (_, { userId }) => {
      return await Follower.countFollowers(userId)
    },
    followingCount: async (_, { userId }) => {
      return await Follower.countFollowing(userId)
    },
  },

  Mutation: {
    followUser: async (_, { followerId, followingId }) => {
      try {
        return await Follower.createFollow(followerId, followingId)
      } catch (err) {
        console.error("Error in followUser:", err)
        throw new Error("Failed to follow user")
      }
    },
  }
}
module.exports = { typeDefs, resolvers }
