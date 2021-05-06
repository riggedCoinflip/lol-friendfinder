const {UserTC} = require("../models/user");
const bcrypt = require("bcrypt");
const {formValid} = require("../../frontend/src/shared/util/validateSignup");
const {schemaComposer} = require("graphql-compose")


/**
 * Generate a bcrypt hash from a plaintext password
 * @async
 * @param {String} plaintextPassword
 * @param {number} saltRounds 2^saltRounds
 * @returns {(String|null)} hash on succeed, null on error
 */
async function generateHash(plaintextPassword, saltRounds = 10) {
    console.log("hashing")
    try {
        return await bcrypt.hash(plaintextPassword, saltRounds);
    } catch (err) {
        console.error(err);
        return null;
    }
}

//TODO throw errors
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
                console.dir(rp) //TODO throw error
                return null;
            }
        })

//TODO create new document "TOKEN"
//BUG this code does NOT work RN
const userLogin = schemaComposer.createResolver({
    name: "userLogin",
    kind: "mutation",
    description: "Provide a valid username + password to login the user",
    type: UserTC,
    args: {
            name: "String",
            password: "String",
    },

    resolve: async ({source, args, context, info}) => {
        console.log(this)
        let user = await UserTC.getResolver("findOne")
            .resolve( {
                    args: {
                        filter: {
                            name: args.name
                        }
                    }
                }
            )
        console.log(args)
        console.log(user)

        return await bcrypt
            .compare(args.password, user.password)
            .then((valid) => {
                if (valid) {
                    return {
                        name: "foo",
                        password: "nar"
                    }//"token" //TODO
                } else {
                    return {
                        name: "",
                        password: ""
                    }//""
                }
            })
            .catch((err) => {
                    console.log(args, user.password)
                    console.error(err)
                    return ""
                }
            )
    }
})


module.exports = {createUserOneHashPassword, userLogin}