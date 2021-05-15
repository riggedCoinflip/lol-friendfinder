import assert from "assert";
import express from "express";
import dotenv from "dotenv";
import {ApolloServer} from "apollo-server-express";
import mongoose from "mongoose";

import isAuth from "./src/middleware/jwt/is-auth.js";
import {graphqlSchema} from "./src/schemas/index.js";


// allow use of dotenv
dotenv.config()
//check if env variables set
assert(process.env.NODE_ENV, "NODE_ENV should be =development or =production")
assert(process.env.ATLAS_URI, "No MongoDB Atlas URI specified")
assert(process.env.JWT_SECRET, "Set this to ANY String (for development)")


// Connect MongoDB
const ATLAS_URI = process.env.ATLAS_URI;

mongoose
    .connect(ATLAS_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => {
        console.log('Connection to DB successful');
    })
    .catch(err => {
        console.log(`Connection to DB Error: ${err}`);
    });

//express
const app = express();
app.use(isAuth);


//apollo
const apollo = new ApolloServer({
    schema: graphqlSchema,
    context: ({req, res}) => ({req, res})
});
apollo.applyMiddleware({app, path: "/graphql"});


//launch
const PORT = process.env.PORT || 5000;
app.listen({port: PORT}, () => {
    console.log(`🚀 Apollo Server ready on http://localhost:${PORT}${apollo.graphqlPath}`);
});

