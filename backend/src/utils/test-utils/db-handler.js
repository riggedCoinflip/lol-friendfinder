const mongoose = require("mongoose");
const assert = require("assert");
const {MongoMemoryServer} = require("mongodb-memory-server");

assert(process.env.MONGOMS_PLATFORM, "should be linux or win32")
assert(process.env.MONGOMS_ARCH, "should be x64 or alike")
const mongod = new MongoMemoryServer({
    binary: {
        platform: process.env.mongoms_platform,
        arch: process.env.mongoms_arch,
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

async function dbDrop() {
    await mongoose.connection.dropDatabase();
}

async function dbDisconnect() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
};

module.exports = {
    dbConnect,
    dbDrop,
    dbDisconnect
}