const User = require("../models/User")
const { GraphQLError } = require('graphql')

const typeDefs = `#graphql
type User {
    _id: ID!
    name: String
    username: String!
    email: String!
    password: String!
    post: [Post]
    followers: [User]
    followings: [User]
}
type Query {
    users: [User]
    userById(id: ID!): User
    searchUsers(query: String!): [User]
    getUserWithFollowersAndFollowing(userId: ID!): User
}
type Token{
  access_token: String!
}

type Mutation {
  registerUser(user: UserInput!): User
  loginUser(email: String!, password: String!): Token
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
    userById: async (_, { id }, { auth }) => {
      try {
        const signInUser = await auth()
        let user
        if (!id) {
          user = await User.findById(signInUser.id)
        } else {
          user = await User.findById(id)
        }
        console.log(user, "userById")
        if (!user) {
          throw new GraphQLError("User not found.", {
            extensions: {
              code: "BAD_REQUEST",
            },
          })
        }
        let followers = user.followers || []
        let followings = []

        if (Array.isArray(followers)) {
          followers = followers.filter(follower => follower !== null && follower !== undefined)
          followers = followers.map(follower => ({
            _id: follower._id ? follower._id : "",
            username: follower.username || "Unknown",
          }))
        }

        // Menangani followings
        if (user.followings && Array.isArray(user.followings)) {
          followings = await Promise.all(
            user.followings.map(async (follow) => {
              if (!follow || !follow.followingId) return null
              const followingUser = await User.findById(follow.followingId)
              if (followingUser) {
                return {
                  _id: followingUser._id ? followingUser._id : "",
                  username: followingUser.username || "Unknown",
                }
              }
              return null
            })
          )
          followings = followings.filter(Boolean)
        }

        return {
          _id: user._id || "",
          name: user.name || "Unknown",
          username: user.username || "Unknown",
          email: user.email || "Unknown",
          posts: user.posts || [],
          followers,
          followings,
        }
      } catch (err) {
        console.error(err)
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
      try {
        const user = await User.getUserWithFollowersAndFollowing(userId)
        console.log(user, ">>>")
        if (!user) {
          throw new GraphQLError("User not found.", {
            extensions: {
              code: "BAD_REQUEST",
            },
          })
        }

        return user
      } catch (err) {
        console.error("Error in getUserWithFollowersAndFollowing:", err)
        throw new GraphQLError("Failed to fetch user data.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
          },
        })
      }

    },
  },
  Mutation: {
    registerUser: async (_, { user }) => {
      try {
        const newUser = await User.register(user.name, user.username, user.email, user.password)
        return newUser
      } catch (err) {
        if (err.message === "Email sudah terdaftar.") {
          throw new GraphQLError("Email already registered.", {
            extensions: {
              code: "BAD_REQUEST",
            },
          })
        }
        throw new GraphQLError("Registration failed.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
          },
        })
      }
    },
    loginUser: async (_, { email, password }) => {
      try {
        const access_token = await User.login(email, password)
        return access_token
      } catch (err) {
        if (err.message === "Pengguna tidak ditemukan.") {
          throw new GraphQLError("Pengguna tidak ditemukan.", {
            extensions: {
              code: "BAD_REQUEST",
              http: {
                status: 400,
              },
            },
          })
        } else if (err.message === "Password salah.") {
          throw new GraphQLError("Password salah.", {
            extensions: {
              code: "BAD_REQUEST",
              http: {
                status: 400,
              },
            },
          })
        }
        throw new GraphQLError("Gagal masuk.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            http: {
              status: 500,
            },
          },
        })
      }
    },
  },

}

module.exports = { typeDefs, resolvers }
