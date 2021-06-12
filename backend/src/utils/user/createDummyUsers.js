const dummyUsers = require("./dummyUsers.json");
const {User} = require("../../models/user/user")

function mongoosifyUsers() {
    return dummyUsers
        .map(user =>
            user.dateOfBirth = {
                ...user,
                //otherwise we would save NaN to the DB
                dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : undefined
            }
        )
}

async function createDummyUsers() {
    if (await User.countDocuments() === 0) {
        //console.debug("User collection is empty.")
        //console.debug("Add Dummy Users")
        await User.create(mongoosifyUsers())
        //console.debug(`Users added: ${await User.countDocuments()}`)
    } else {
        //console.debug("Users exist already; no data added")
    }
}

module.exports = createDummyUsers