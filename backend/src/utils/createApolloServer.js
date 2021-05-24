const {ApolloServer} = require("apollo-server-express");
const graphqlSchema = require("../graphql/index");
const app = require("./expressApp")

function createApollo() {
    const apollo = new ApolloServer({
        schema: graphqlSchema,
        context: ({req, res}) => ({req, res}),
    });
    apollo.applyMiddleware({app, path: "/graphql"});

    return apollo
}

module.exports = createApollo