const express = require('express');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');
require('dotenv').config();

const port = process.env.PORT || 5000;
const ATLAS_URI = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@${process.env.ATLAS_CLUSTER}.mongodb.net/${process.env.ATLAS_ENVIRONMENT}`

const app = express();
app.use(express.json());


mongoose
    .connect(ATLAS_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB database connection established successfully"))
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`)
    })
})

const graphqlSchema = require('./schemas/index');
app.use(
    "/graphql",
    graphqlHTTP({
            context: { startTime: Date.now() },
            graphiql: true,
            schema: graphqlSchema,
    })
)