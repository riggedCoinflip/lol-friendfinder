const {Language} = require("./language")
const createLanguages = require("../../utils/language/createLanguages")
const {dbConnect, dbDisconnectAndWipe} = require("../../utils/test-utils/db-handler")

describe("Language Model Test Suite", () => {
    beforeAll(async () => dbConnect())
    afterAll(async () => dbDisconnectAndWipe())

    it("saves all languages", async () => {
        await createLanguages()
    })
})