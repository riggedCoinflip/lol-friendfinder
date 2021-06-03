const {Like} = require("./like")
const {User} = require("../user/user")
const createMongoData = require("../../utils/createMongoData")
const {dbConnect, dbDisconnectAndWipe} = require("../../utils/test-utils/db-handler")
const validators = require("../../utils/test-utils/validators")

describe("Like Model Test Suite", () => {
    beforeAll(async () => {
        await dbConnect()
        await createMongoData()
    })
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
        const like = new Like({
            requester,
            recipient,
            status: "disliked"
        })

        await like.save()

        //get the unpopulated Document.
        const likeFromDB = await Like.findById(like._id)

        expect(likeFromDB.requester).toStrictEqual(requester._id)
        expect(likeFromDB.recipient).toStrictEqual(recipient._id)
        expect(likeFromDB.status).toBe("disliked")
    })
})