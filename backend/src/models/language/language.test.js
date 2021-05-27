const {Language} = require("./language")
const {mongooseLanguages} = require("../../utils/createLanguages")
const {dbConnect, dbDisconnectAndWipe} = require("../../utils/test-utils/db-handler")

describe("Language Model Test Suite", () => {
    beforeAll(async () => dbConnect())
    afterAll(async () => dbDisconnectAndWipe())

    it("saves all languages", async () => {
        const languages = mongooseLanguages()
        const numberOfLanguages = languages.length
        await Language.insertMany(languages)

        expect(await Language.countDocuments()).toBe(numberOfLanguages)
    })
})