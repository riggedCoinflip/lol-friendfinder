const {SchemaComposer} = require('graphql-compose');
const {UserQuery, UserMutation} = require('./user');

const schemaComposer = new SchemaComposer();

schemaComposer.Query.addFields({
    ...UserQuery,
});

schemaComposer.Mutation.addFields({
    ...UserMutation,
});

module.exports = schemaComposer.buildSchema();