const mongoose = require("mongoose");
const assert = require("assert");
const os = require("os");
const {MongoMemoryServer} = require("mongodb-memory-server");

const mongod = new MongoMemoryServer({
    binary: {
        platform: process.env.mongoms_platform || os.platform(),
        arch: process.env.mongoms_arch || os.arch(),
    }
})

async function dbConnect() {
    const uri = await mongod.getUri();

    const mongooseOpts = {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    };

    await mongoose.connect(uri, mongooseOpts);
};


async function dbDisconnectAndWipe() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
};

module.exports = {
    dbConnect,
    dbDisconnectAndWipe
}