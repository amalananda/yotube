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
const {
  typeDefs: postTypeDefs,
  resolvers: postResolvers
} = require('./schema/post')
const { verifyToken } = require('./helpers/jwt')


const typeDefs = [userTypeDefs, followerTypeDefs, postTypeDefs]
const resolvers = [userResolvers, followerResolvers, postResolvers]

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  startStandaloneServer(server, {
    listen: { port: 3000 },
    context: ({ req }) => {
      return {
        auth: () => {
          const token = req.headers.authorization
          if (!token) throw new Error("Unauthorized")
          const bearer = token.split(' ')[1]
          const user = verifyToken(bearer)
          return user
        },
      }
    },
  }).then(({ url }) => {
    console.log(`🚀  Server ready at: ${url}`)
  })
}
startServer()
