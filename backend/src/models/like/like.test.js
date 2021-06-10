const {Like} = require("./like")
const {User} = require("../user/user")
const createMongoData = require("../../utils/createMongoData")
const {dbConnect, dbDisconnectAndWipe} = require("../../utils/test-utils/db-handler")
const validators = require("../../utils/test-utils/validators")

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
            console.log(err)
            validators.validateMongoValidationError(err, "recipient", "user defined")
        }
    })

    it("adds Users to each others friends list after liking each other", async () => {
        const user1 = await User.findOne({nameNormalized: "sktt1faker"})
        const user2 = await User.findOne({nameNormalized: "kdaevelynn"})

        await new Like({
            requester: user1,
            recipient: user2,
            status: "liked"
        }).save()

        await new Like({
            requester: user2,
            recipient: user1,
            status: "liked"
        }).save()

        const user1AfterLike = await User.findOne({nameNormalized: "sktt1faker"})
        const user2AfterLike = await User.findOne({nameNormalized: "kdaevelynn"})

        expect(user1AfterLike.friends[0].user).toStrictEqual(user2._id)
        expect(user2AfterLike.friends[0].user).toStrictEqual(user1._id)
        console.log(user1AfterLike.friends.user)
        console.log(user2AfterLike.friends.user)
    })
})