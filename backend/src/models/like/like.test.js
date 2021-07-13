const {Like} = require("./like")
const {User} = require("../user/user")
const createMongoData = require("../../utils/createMongoData")
const {dbConnect, dbDisconnectAndWipe} = require("../../utils/test-utils/db-handler")
const validators = require("../../utils/test-utils/validators")
const createMatch = require("../../utils/test-utils/createMatch")

describe("Like Model Test Suite", () => {
    beforeAll(async () => {
        await dbConnect()
        await createMongoData()
        await Like.deleteMany() //we want to test Likes so this collection may not exist
    })
    afterEach(async () => await Like.deleteMany())
    afterAll(async () => await dbDisconnectAndWipe())

    it("saves a like", async () => {
        const requester = await User.findOne({nameNormalized: "sktt1faker"})
        const recipient = await User.findOne({nameNormalized: "neeko"})
        const like = new Like({
            requester,
            recipient,
            status: "liked"
        })

        await like.save()

        //get the unpopulated Document.
        const likeFromDB = await Like.findById(like._id)

        expect(likeFromDB.requester).toStrictEqual(requester._id)
        expect(likeFromDB.recipient).toStrictEqual(recipient._id)
        expect(likeFromDB.status).toBe("liked")
    })

    it("saves a dislike", async () => {
        const requester = await User.findOne({nameNormalized: "sktt1faker"})
        const recipient = await User.findOne({nameNormalized: "kdaevelynn"})
        const dislike = new Like({
            requester,
            recipient,
            status: "disliked"
        })

        await dislike.save()

        //get the unpopulated Document.
        const dislikeFromDB = await Like.findById(dislike._id)

        expect(dislikeFromDB.requester).toStrictEqual(requester._id)
        expect(dislikeFromDB.recipient).toStrictEqual(recipient._id)
        expect(dislikeFromDB.status).toBe("disliked")
    })

    it("throws E11000 duplicate error if requester and recipient are the same", async () => {
        const requester = await User.findOne({nameNormalized: "sktt1faker"})
        const recipient = await User.findOne({nameNormalized: "kdaevelynn"})
        const like = new Like({
            requester,
            recipient,
            status: "liked"
        })

        await like.save()

        const dislike = new Like({
            requester,
            recipient,
            status: "disliked"
        })

        try {
            await dislike.save()
            fail("Should throw error")
        } catch (err) {
            const {name, code} = err
            validators.validateMongoDuplicationError(name, code)
        }
    })

    it("invalidates document if requester === recipient", async () => {
        const requester = await User.findOne({nameNormalized: "sktt1faker"})
        const like = new Like({
            requester,
            recipient: requester,
            status: "liked"
        })

        try {
            await like.save()
            fail("Should throw error")
        } catch (err) {
            validators.validateMongoValidationError(err, "recipient", "user defined")
        }
    })

    it("creates a Match if2 users like each other", async () => {
        const match = await createMatch("sktt1faker", "kdaevelynn")

        expect(match.user1AfterLike.friends[0].user).toStrictEqual(match.user2._id)
        expect(match.user2AfterLike.friends[0].user).toStrictEqual(match.user1._id)
        expect(match.user1AfterLike.friends[0].chat).toBeDefined()
        expect(match.user1AfterLike.friends[0].chat).toStrictEqual(match.user2AfterLike.friends[0].chat)
    })
})