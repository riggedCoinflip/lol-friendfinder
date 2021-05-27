const assert = require("assert");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const createApollo = require("./src/utils/createApolloServer");
const expressApp = require("./src/utils/expressApp")


// allow use of dotenv
dotenv.config()
//check if env variables set
assert(process.env.NODE_ENV, "Specify NODE_ENV")
const NODE_ENV_ALLOWED = ["production", "development", "test"]
if (!NODE_ENV_ALLOWED.includes(process.env.NODE_ENV)) throw new Error(`NODE_ENV '${process.env.NODE_ENV}' has to be in: ${NODE_ENV_ALLOWED}`)
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
    .then(async () => {
        console.log('Connection to DB successful');

        if (process.env.NODE_ENV === "development") {
            //create data for db
            const createMongoData = require("./src/utils/createMongoData");
            await createMongoData()
        }
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

