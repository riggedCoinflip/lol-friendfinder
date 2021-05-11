import {SchemaComposer} from "graphql-compose";
import {UserMutation, UserQuery} from "./user.js";

const schemaComposer = new SchemaComposer();

schemaComposer.Query.addFields({
    ...UserQuery
});

schemaComposer.Mutation.addFields({
    ...UserMutation
});

export const graphqlSchema = schemaComposer.buildSchema();