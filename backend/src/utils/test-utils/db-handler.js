const mongoose = require("mongoose");
const {MongoMemoryServer} = require("mongodb-memory-server");

const mongoServer = new MongoMemoryServer();

async function dbConnect() {
    const uri = await mongoServer.getUri();

    const mongooseOpts = {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    };

    await mongoose.connect(uri, mongooseOpts);
};

async function dbDisconnect() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
};

module.exports = {
    dbConnect,
    dbDisconnect
}