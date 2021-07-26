const {ApolloServer} = require("apollo-server-express");
const graphqlSchema = require("../graphql/index");

function createApollo(app) {
    const apollo = new ApolloServer({
        schema: graphqlSchema,
        context: ({req, res}) => ({req, res}),
        introspection: true,
        playground: true
    })
    apollo.applyMiddleware({app, path: "/graphql"})

    return apollo
}

module.exports = createApollo