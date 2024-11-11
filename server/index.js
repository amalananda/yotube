const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql

# Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

# This "Book" type defines the queryable fields for every book in our data source.

type User {
    _id: ID!
    name: String
    username: String! # (required, unique)
    email: String! # (required, unique, email format)
    password: String! # (required, min length 5)
  }

# The "Query" type is special: it lists all of the available queries that

# clients can execute, along with the return type for each. In this

# case, the "books" query returns an array of zero or more Books (defined above).

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

  type Comment {
    content: String! # (required)
    username: String! # (required)
    createdAt: String
    updatedAt: String
  }

  type Like {
    username: String! # (required)
    createdAt: String
    updatedAt: String
  }

  type Follow {
    _id: ID!
    followingId: ID!
    followerId: ID!
    createdAt: String
    updatedAt: String
  }

  type Query {
    users: [User]
    posts: [Post]
    follows: [Follow]
  }
`

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

const posts = [
  {
    _id: "1",
    content: "This is my first post!",
    tags: ["introduction", "first"],
    imgUrl: "https://example.com/image1.jpg",
    authorId: "1",
    comments: [
      {
        content: "Nice post!",
        username: "bob456",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    likes: [
      {
        username: "bob456",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]
const follows = [
  {
    _id: "1",
    followingId: "1",
    followerId: "2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

const resolvers = {
  Query: {
    users: () => {
      // Implement your logic to fetch users here
      return users
    },
    posts: () => {
      // Implement your logic to fetch posts here
      return posts
    },
    follows: () => {
      // Implement your logic to fetch follow data here
      return follows
    },
  },
  // Mutation: {

  // }
}

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
