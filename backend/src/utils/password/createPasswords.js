const passwords = require("./passwords.json")
const {Password} = require("../../models/password/password");
const {User} = require("../../models/user/user");

async function createPasswords() {
    const promises = passwords.map(({email, password}) => new Promise(async (resolve) => {
        const {_id: userId} = await User.findOne({email})
        await new Password({password, userId}).save()
        resolve()
    }))

    await Promise.all(promises)
}

module.exports = createPasswords