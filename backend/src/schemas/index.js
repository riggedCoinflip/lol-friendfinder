const {SchemaComposer} = require("graphql-compose");
const {UserMutation, UserQuery} = require("./user");

const schemaComposer = new SchemaComposer();

schemaComposer.Query.addFields({
    ...UserQuery
});

schemaComposer.Mutation.addFields({
    ...UserMutation
});

module.exports = schemaComposer.buildSchema();