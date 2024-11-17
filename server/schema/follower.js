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
    followers(userId: ID!): [Follow]
    following(userId: ID!): [Follow]
    followersCount(userId: ID!): Int
    followingCount(userId: ID!): Int
  }
  type Mutation {
    followUser(followerId: ID!, followingId: ID!): Follow
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
        const followers = await Follower.findAllUserFollower(userId)
        return followers || []  // Pastikan ini adalah array
      } catch (err) {
        console.error("Error in followers:", err)
        throw new Error("Failed to fetch followers")
      }
    },
    following: async (_, { userId }) => {
      try {
        const followings = await Follower.findAllUserFollowing(userId)
        return followings || []
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
