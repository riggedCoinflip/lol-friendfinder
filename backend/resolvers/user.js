const {UserTC} = require('../models/user.model');
const bcrypt = require('bcrypt');

/**
 * @param {String} plaintextPassword
 * @param {number} saltRounds 2^saltRounds
 * @return hash on succeed, null on error
 */
async function generateHash(plaintextPassword, saltRounds) {
    console.log("hashing")
    try {
        const hash = await bcrypt.hash(plaintextPassword, saltRounds);
        return hash;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const createUserOneHashPassword =
    UserTC
        .getResolver('createOne')
        .wrapResolve(next => async rp => {
            rp.args.record.password = await generateHash(rp.args.record.password, 10);
            //TODO validate if mutation is allowed, eg: email has @, username 3-16 chars etc
            return next(rp);
        })

module.exports = {createUserOneHashPassword}