const {dbConnect, dbDisconnectAndWipe} = require("../../utils/test-utils/db-handler")
const createMongoData = require("../../utils/createMongoData")
const {User} = require("../../models/user/user");
const queries = require("./like.test.queries")
const {mutate, login, failLogin, resetOptions} = require("../../utils/test-utils/graphqlTestClient")

describe("Like GraphQL Test Suite", () => {
    beforeAll(async () => {
        await dbConnect()
        await createMongoData()
    });
    beforeEach(async () => {
        resetOptions()
    })
    afterAll(async () => dbDisconnectAndWipe());

    it("swipes only on successful login", async () => {
        const requester = await User.findOne({nameNormalized: "sktt1faker"})
        const recipient = await User.findOne({nameNormalized: "neeko"})

        //no token at all
        const swipe1 = await mutate(
            queries.SWIPE, {
                variables: {
                    requester: requester._id,
                    recipient: recipient._id,
                    status: "liked",
                }
            }
        )
        expect(swipe1.errors[0].message).toBe("You must login to view this.")

        //failed login
        await failLogin()
        const swipe2 = await mutate(
            queries.SWIPE, {
                variables: {
                    requester: requester._id,
                    recipient: recipient._id,
                    status: "liked",
                }
            }
        )
        expect(swipe2.errors[0].message).toBe("You must login to view this.")

        //successful login
        await login(requester.email, "BetterNerfBr0cc0li")
        const swipe3 = await mutate(
            queries.SWIPE, {
                variables: {
                    requester: requester._id,
                    recipient: recipient._id,
                    status: "liked",
                }
            }
        )
        expect(swipe3.errors).toBeUndefined()
    })
})