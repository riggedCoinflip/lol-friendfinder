const {SchemaComposer} = require("graphql-compose")
const {UserMutation, UserQuery} = require("./user/user")
const {LanguageQuery} =  require("./language")
const {LikeMutation}  = require("./like/like")
const {ChatQuery, ChatMutation} = require("./chat/chat")

const schemaComposer = new SchemaComposer();

schemaComposer.Query.addFields({
    ...UserQuery,
    ...LanguageQuery,
    ...ChatQuery,
});

schemaComposer.Mutation.addFields({
    ...UserMutation,
    ...LikeMutation,
    ...ChatMutation
});

module.exports = schemaComposer.buildSchema();