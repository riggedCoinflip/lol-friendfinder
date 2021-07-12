const assert = require("assert")
const dotenv = require("dotenv")
const createApollo = require("../createApolloServer")
const createExpressApp = require("../createExpressApp")
const launchServer = require("../launchServer")

dotenv.config()

function startTestClient() {
    assert.strictEqual(process.env.NODE_ENV, "test")
    assert(process.env.JWT_SECRET, "Set this to ANY non-falsy String")

    //express
    const app = createExpressApp()

    //apollo
    const apollo = createApollo(app)

    //launch
    const port = process.env.PORT || 5001
    const server = launchServer(app, apollo, port)

    return {
        app,
        apollo,
        port,
        server
    }
}

module.exports = startTestClient
