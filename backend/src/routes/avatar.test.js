const aws = require("aws-sdk")
const createMongoData = require("../utils/createMongoData")
const {dbConnect, dbDisconnectAndWipe} = require("../utils/test-utils/db-handler")
const supertest = require("supertest")

/**
 *
 * @param {String} email
 * @param {String} password
 * @param request supertest(app)
 * @return {Promise<String>} Token
 */
async function login(email, password, request) {
    const res = await request
        .get("/graphql")
        .query({
            query: `{ login(email: "${email}" password: "${password}")}`
        })
    //return token
    return res.body.data.login
}

/**
 * Log in as SKTT1Faker
 * @param request supertest(app)
 * @return {Promise<String>}
 */
async function loginUser(request) {
    return login("faker@skt-t1.gg", "BetterNerfBr0cc0li", request)
}

describe("/avatar Test Suite", () => {
    const OLD_ENV = process.env
    const BUCKET_NAME = "lol-friendfinder-test"
    const s3 = new aws.S3({
        apiVersion: "2006-03-01",
    })
    let server
    let request
    let userToken

    beforeAll(async () => {
        process.env.S3_BUCKET_NAME = BUCKET_NAME
        //has to be imported AFTER process.env got changed
        const startTestClient = require("../utils/test-utils/fullyFunctionalTestClient")
        const {app, server: testServer} = startTestClient()
        server = testServer
        request = supertest(app)
        await dbConnect()
        await createMongoData()
        aws.config.update({
            region: process.env.AWS_REGION,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        })
        userToken = await loginUser(request)
    }, 20_000)

    //beforeEach(() => resetOptions())

    afterAll(async () => {
        await dbDisconnectAndWipe()

        //empty S3 storage
        //finds up to 1000 objects. If tests should require more, rewrite this
        const objects = await s3.listObjectsV2({
            Bucket: process.env.S3_BUCKET_NAME
        }).promise()
        await s3.deleteObjects({
            Bucket: process.env.S3_BUCKET_NAME,
            Delete: {
                Objects: objects.Contents.map(obj => {
                    return {Key: obj.Key}
                })
            }
        }).promise()
        process.env = OLD_ENV

        //kill open handle
        server.close()
    })

    it("throws 401 if user is not authenticated", async () => {
        //test with missing isAuth
        await request
            .post("/api/avatar")
            .expect(401)

        //test with incorrect token
        const token = {
            header: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
            payload: "eyJfaWQiOiI2MGNkMmJkYzI1MDllMDNkYzhiMWM2ZjciLCJ1c2VybmFtZSI6IkFkbWluIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjI1Njg3NjE2LCJleHAiOjE2MjU3NzQwMTZ9",
            faultySignature: "0000000000000000000000000000000000000000000"
        }
        await request
            .post("/api/avatar")
            .set("x-auth-token", `${token.header}.${token.payload}.${token.faultySignature}`)
            .expect(401)
    })

    it("throws 406 if request does not contain a file", async () => {
        await request
            .post("/api/avatar")
            .set("x-auth-token", userToken)
            .expect(406)
    })

    it("saves an image correctly", async () => {
        // noinspection JSUnresolvedFunction
        const res = await request
            .post("/api/avatar")
            .set("x-auth-token", userToken)
            .attach("avatar", `${__dirname}/testFiles/allowed.png`)
            .expect(200)

        const URI = res.body.location

        //a request to the image URI should work
        await supertest(URI)
            .get("")
            .expect(200)
    })

    it.skip("deletes the users last avatar if one already existed", async () => {
        //save 1st avatar image
        // noinspection JSUnresolvedFunction
        await request
            .post("/api/avatar")
            .set("x-auth-token", userToken)
            .attach("avatar", `${__dirname}/testFiles/allowed.png`)
            .expect(200)

        //save 2nd avatar image - this should remove the first one
        // noinspection JSUnresolvedFunction
        await request
            .post("/api/avatar")
            .set("x-auth-token", userToken)
            .attach("avatar", `${__dirname}/testFiles/allowed.png`)
            .expect(200)

        //due to AWS eventual consistency / basically no waiting time, the 1st image is not deleted instantly.
        //Real world testing showed that it does work.
        await s3.listObjectsV2({
            Bucket: process.env.S3_BUCKET_NAME
        }).promise()
    })

    // noinspection JSCheckFunctionSignatures
    it("checks max file size", async () => {
        // noinspection JSUnresolvedFunction
        await request
            .post("/api/avatar")
            .set("x-auth-token", userToken)
            .attach("avatar", `${__dirname}/testFiles/1.7MB.png`)
            .expect(500)
    }, 15_000)

    it("checks file extension is correct", async () => {
        // noinspection JSUnresolvedFunction
        await request
            .post("/api/avatar")
            .set("x-auth-token", userToken)
            .attach("avatar", `${__dirname}/testFiles/wrongFileExtension.txt`)
            .expect(500)
    })
})