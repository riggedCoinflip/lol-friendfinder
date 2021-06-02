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
    //add languages once on new DB
    if (await User.countDocuments() === 0) {
        console.log("User collection is empty.")
        console.log("Add Dummy Languages")
        await User.insertMany(mongoosifyUsers())
        console.log(`Languages added: ${await User.countDocuments()}`)
    } else {
        console.log("Languages exist already; no data added")
    }
}

module.exports = createDummyUsers