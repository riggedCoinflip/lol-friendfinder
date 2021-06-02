const {createLanguages} = require("./createLanguages");

/**
 * Create data to properly test and experiment on non-prod environments
 * This can later also be used to do system tests with real testers.
 */
async function createMongoData () {
    await createLanguages()
    //TODO create users
    //TODO create admin if (process.env.NODE_ENV === "production") throw new Error("This function may not be used on prod due to exposing admin passwords")
}

module.exports = createMongoData
