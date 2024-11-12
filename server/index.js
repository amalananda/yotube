const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const {
  typeDefs: userTypeDefs,
  resolvers: userResolvers
} = require('./schema/user')
const {
  typeDefs: followerTypeDefs,
  resolvers: followerResolvers
} = require('./schema/follower')

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
// const typeDefs = `#graphql

// type User {
//     _id: ID!
//     name: String
//     username: String! # (required, unique)
//     email: String! # (required, unique, email format)
//     password: String! # (required, min length 5)
//   }

//   type Post {
//     _id: ID!
//     content: String! # (required)
//     tags: [String]
//     imgUrl: String
//     authorId: ID! # (required)
//     comments: [Comment]
//     likes: [Like]
//     createdAt: String
//     updatedAt: String
//   }

//   type Comment {
//     content: String! # (required)
//     username: String! # (required)
//     createdAt: String
//     updatedAt: String
//   }

//   type Like {
//     username: String! # (required)
//     createdAt: String
//     updatedAt: String
//   }

//   type Follow {
//     _id: ID!
//     followingId: ID!
//     followerId: ID!
//     createdAt: String
//     updatedAt: String
//   }

//   type Query {
//     users: [User]
//     userById(id: ID!): User
//     posts: [Post]
//     follows: [Follow]
//   }

//   input UserInput {
//     name: String
//     username: String!
//     email: String!
//     password: String!
//   }

//   type Mutation {
//     addUser(user:UserInput!):User
//   }
// `

const users = [
  {
    _id: "1",
    name: "Alice",
    username: "alice123",
    email: "alice@example.com",
    password: "password123",
  },
  {
    _id: "2",
    name: "Bob",
    username: "bob456",
    email: "bob@example.com",
    password: "password456",
  },
]

// const posts = [
//   {
//     _id: "1",
//     content: "This is my first post!",
//     tags: ["introduction", "first"],
//     imgUrl: "https://example.com/image1.jpg",
//     authorId: "1",
//     comments: [
//       {
//         content: "Nice post!",
//         username: "bob456",
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       },
//     ],
//     likes: [
//       {
//         username: "bob456",
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       },
//     ],
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   },
// ]
const follows = [
  {
    _id: "1",
    followingId: "1",
    followerId: "2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

// const resolvers = {
//   Query: {
//     users: async () => {
//       try {
//         const users = await User.findAll()
//         return users
//       } catch (err) {
//         throw err
//       }
//     },
//     userById: async (_, args) => {
//       try {
//         const user = await User.findById(args.id)
//         return user
//       } catch (err) {
//         throw err
//       }
//     },
//     posts: () => {
//       return posts
//     },
//     follows: () => {
//       return follows
//     },
//   },
//   Mutation: {
//     addUser: async (_, args) => {
//       try {
//         const newUser = {
//           _id: (users.length + 1).toString(),
//           ...args.user,
//         }
//         users.push(newUser)
//         return newUser
//       } catch (err) {
//         throw new Error("Failed to add new user")
//       }
//     }
//   }
// }
const typeDefs = [userTypeDefs, followerTypeDefs]
const resolvers = [userResolvers, followerResolvers]

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  const { url } = await startStandaloneServer(server, {
    listen: { port: 3000 },
  })
  console.log(`Server ready at ${url}`)
}

startServer()
