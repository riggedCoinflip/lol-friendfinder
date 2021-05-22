const assert = require("assert");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const createApollo = require("./src/utils/createApolloServer");
const expressApp = require("./src/utils/expressApp")


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
const app = expressApp;

//apollo
const apollo = createApollo()

//launch
const PORT = process.env.PORT || 5000;
app.listen({port: PORT}, () => {
    console.log(`🚀 Apollo Server ready on http://localhost:${PORT}${apollo.graphqlPath}`);
});

