const {Like} = require("../../models/like/like")
const {User} = require("../../models/user/user")

async function createMatch (user1Name, user2Name) {
    const user1 = await User.findOne({nameNormalized: user1Name})
    const user2 = await User.findOne({nameNormalized: user2Name})

    if (!user1) throw new Error("User1 does not exist")
    if (!user2) throw new Error("User2 does not exist")

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

    const user1AfterLike = await User.findOne({nameNormalized: user1Name})
    const user2AfterLike = await User.findOne({nameNormalized: user2Name})

    return {
        user1,
        user1AfterLike,
        user2,
        user2AfterLike
    }
}

module.exports = createMatch