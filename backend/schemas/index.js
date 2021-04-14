const {SchemaComposer} = require('graphql-compose');

const schemaComposer = new SchemaComposer();

const {UserQuery, UserMutation} = require('./user.schema');
const {ProfileQuery, ProfileMutation} = require('./profile.schema');

schemaComposer.Query.addFields({
    ...UserQuery,
    ...ProfileQuery,
});

schemaComposer.Mutation.addFields({
    ...UserMutation,
    ...ProfileMutation,
});

module.exports = schemaComposer.buildSchema();