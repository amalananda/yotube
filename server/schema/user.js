const User = require("../models/User")
const { GraphQLError } = require('graphql')


// Definisi schema menggunakan #graphql, tanpa gql
const typeDefs = `#graphql
type User {
    _id: ID!
    name: String
    username: String!
    email: String!
    password: String!
    post: [Post]
    followers: [User!]!
    followings: [User!]!
}
type Query {
    users: [User]
    userById(id: ID!): User
    searchUsers(query: String!): [User]
    # getUserWithFollowersAndFollowing(userId: ID!): User
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
    // getUserWithFollowersAndFollowing: async (_, { userId }) => {
    //   return await User.follower(userId)
    // },
  },
  Mutation: {
    registerUser: async (_, { user }) => {
      const { name, username, email, password } = user
      try {
        const newUser = await User.register(name, username, email, password)
        return newUser
      } catch (err) {
        console.error("Error during user registration:", err.message) // Log error lebih jelas

        // Jika email sudah terdaftar
        if (err.message === "Email sudah terdaftar.") {
          throw new GraphQLError("Email sudah terdaftar.", {
            extensions: {
              code: "BAD_REQUEST",
              http: { status: 400 },
            },
          })
        }

        // Untuk error lainnya, beri penanganan lebih jelas
        throw new GraphQLError("Gagal mendaftarkan pengguna baru.", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            http: { status: 500 },
          },
        })
      }
    },
    loginUser: async (_, { email, password }) => {
      try {
        const accessToken = await User.login(email, password)
        return accessToken
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
