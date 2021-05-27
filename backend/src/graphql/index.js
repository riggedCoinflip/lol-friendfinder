const {SchemaComposer} = require("graphql-compose");
const {UserMutation, UserQuery} = require("./user");
const {LanguageQuery} =  require("./language")

const schemaComposer = new SchemaComposer();

schemaComposer.Query.addFields({
    ...UserQuery,
    ...LanguageQuery,
});

schemaComposer.Mutation.addFields({
    ...UserMutation,
});

module.exports = schemaComposer.buildSchema();