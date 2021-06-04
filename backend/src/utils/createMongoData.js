const createLanguages = require("./languages/createLanguages");
const createDummyUsers = require("./users/createDummyUsers");

/**
 * Create data to properly test and experiment on non-prod environments
 * This can later also be used to do system tests with real testers.
 */
async function createMongoData () {
    if (process.env.NODE_ENV === "production") throw new Error("This function may not be used on prod due to exposing admin passwords")
    await createLanguages()
    await createDummyUsers()
}

module.exports = createMongoData
