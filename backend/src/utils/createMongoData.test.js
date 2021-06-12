const createMongoData = require("./createMongoData");
const {dbConnect, dbDisconnectAndWipe} = require("./test-utils/db-handler")


describe("createMongoData Test Suite", () => {
    beforeAll(async () => {
        await dbConnect()
    })
    afterAll(async () => dbDisconnectAndWipe())

    it("doesn't create data twice", async () => {
        //will always be correct - but coverage report shows difference
        await createMongoData()
        await createMongoData()
    })

    it("doesn't create data on prod", async () => {
        process.env.NODE_ENV = "production"
        try {
            await createMongoData()
        } catch (err) {
            expect(err.message).toStrictEqual("This function may not be used on prod due to exposing admin passwords")
        }
    })
})


