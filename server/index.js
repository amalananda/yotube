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


const typeDefs = [userTypeDefs, followerTypeDefs, postTypeDefs]
const resolvers = [userResolvers, followerResolvers, postResolvers]

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  const { url } = await startStandaloneServer(server, {
    listen: { port: 3000 },
    context: ({ req }) => {
      return {
        authentication: () => {
          const authorizationValue = req.headers?.authorization
          const message = "Invalid Token"
          if (!authorizationValue) {
            throw new GraphQLError(message, {
              extensions: {
                code: "INVALID_TOKEN",
                http: {
                  status: 401,
                },
              },
            })
          }
          const [bearer, token] = authorizationValue.split(" ")
          if (bearer !== "Bearer" || !token) {
            throw new GraphQLError(message, {
              extensions: {
                code: "INVALID_TOKEN",
                http: {
                  status: 401,
                },
              },
            })
          }
          const payload = verifyToken(token)
          return payload
        },
      }
    },
  })
  console.log(`🚀 Server ready at ${url}`)
}
startServer()
