const {SchemaComposer} = require("graphql-compose")
const {UserMutation, UserQuery} = require("./user")
const {LanguageQuery} =  require("./language")
const {LikeMutation}  = require("./like")

const schemaComposer = new SchemaComposer();

schemaComposer.Query.addFields({
    ...UserQuery,
    ...LanguageQuery,
});

schemaComposer.Mutation.addFields({
    ...UserMutation,
    ...LikeMutation,
});

module.exports = schemaComposer.buildSchema();