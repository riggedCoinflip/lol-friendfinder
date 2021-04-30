const {UserTC} = require("../models/user");
const bcrypt = require("bcrypt");
const {formValid} = require("../../frontend/src/shared/util/validateSignup");

/**
 * Generate a bcrypt hash from a plaintext password
 * @async
 * @param {String} plaintextPassword
 * @param {number} saltRounds 2^saltRounds
 * @returns {(String|null)} hash on succeed, null on error
 */
async function generateHash(plaintextPassword, saltRounds=10) {
    console.log("hashing")
    try {
        return await bcrypt.hash(plaintextPassword, saltRounds);
    } catch (err) {
        console.error(err);
        return null;
    }
}


const createUserOneHashPassword =
    UserTC
        .getResolver('createOne')
        .wrapResolve(next => async rp => {
            const record = rp.args.record
            if (formValid(record.email, record.name, record.password)) {
                rp.args.record.password = await generateHash(record.password, 10);
                return next(rp);
            } else {
                console.log("Validation checks failed for:")
                console.dir(rp)
                return null;
            }
        })

module.exports = {createUserOneHashPassword}