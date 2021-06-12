const {User} = require("../../models/user/user");
const {Like} = require("../../models/like/like");

async function createDummyLikes () {

    if (await Like.countDocuments() === 0) {
        //console.debug("Like collection is empty.")
        //console.debug("Add Dummy Likes")

        const allUsers = await User.find().lean()

        const neeko = allUsers.filter(user => {
            return user.nameNormalized === "neeko"
        })[0]

        const wukong = allUsers.filter(user => {
            return user.nameNormalized === "wukong"
        })[0]

        let neekoLikes = []
        let wukongDislikes = []

        for (let user of allUsers) {
            if (neeko._id !== user._id) {
                neekoLikes.push({
                    requester: neeko._id,
                    recipient: user._id,
                    status: "liked"
                })
            }
            if (wukong._id !== user._id) {
                wukongDislikes.push({
                    requester: wukong._id,
                    recipient: user._id,
                    status: "disliked"
                })
            }
        }
        await Like.insertMany([...neekoLikes, ...wukongDislikes])
        //console.debug("♥ Neeko likes everyone! ♥")
        //console.debug("Wukong dislikes everyone... ☹")
        //console.debug(`Likes added: ${await Like.countDocuments()}`)
    } else {
        //console.debug("Likes exist already; no data added")
    }
}

module.exports = createDummyLikes