const {dbConnect, dbDisconnectAndWipe} = require("../utils/test-utils/db-handler");
const {User} = require("../models/user/user.js");
const testUsers = require("../models/user/user.test.data")

const util = require("./user.test.queries")
const {createTestClient} = require("apollo-server-integration-testing");

const createApollo = require("../utils/createApolloServer")
const jwt = require("jsonwebtoken");
const {query, mutate, setOptions} = createTestClient({apolloServer: createApollo()});

/**
 * Unfortunately we cannot use the *isAuth* middleware to properly authorize ourself
 * This function mimics *isAuth* and uses *setOptions* to mimic a valid JWT auth token
 * @param {String} email
 * @param {String} password
 */
async function login(email, password) {
    const loginResult = await mutate(
        util.LOGIN, {
            variables: {
                email,
                password
            }
        }
    )
    const token = loginResult.data.login
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    setOptions({
        request: {
            user: {
                isAuth: true,
                _id: decodedToken._id,
                name: decodedToken.username,
                role: decodedToken.role,
            }
        }
    });
}

async function loginUser() {
    const {email, password} = testUsers.validNoDefaults
    return login(email, password)
}

async function loginAdmin() {
    const {email, password} = testUsers.admin
    return login(email, password)
}

/**
 * reset req and res to an empty object to keep tests atomic
 * if we dont do this we might carry over a valid login to the next test if
 * we don't define other *setOptions* in that specific test case
 */
function resetOptions() {
    setOptions({
        request: {},
        response: {},
    })
}

describe("User GraphQL Test Suite", () => {
    beforeAll(async () => dbConnect());
    beforeEach(async () => {
        resetOptions()
        //create test users to have a user and admin login possible at all times
        await new User(testUsers.validNoDefaults).save();
        await new User(testUsers.admin).save();
    })
    afterEach(async () => {
        await User.deleteMany()
    });
    afterAll(async () => dbDisconnectAndWipe());

    it("creates a user on signup", async () => {
        const signupResult = await mutate(
            util.SIGNUP, {
                variables: testUsers.valid
            });

        expect(signupResult).toStrictEqual({
            data: {
                signup: {
                    record: {
                        name: "validUser",
                        email: "valid@email.com",
                    }
                }
            }
        })
    });

    it("errors on signup if the mutation is faulty", async () => {
        const nameTooShort = await mutate(
            util.SIGNUP, {
                variables: testUsers.nameTooShort
            });
        expect(nameTooShort.data.signup).toBeNull()
        expect(nameTooShort.errors[0].message).toBe("User validation failed: name: Path `name` (`ab`) is shorter than the minimum allowed length (3).")

        const nameTooLong = await mutate(
            util.SIGNUP, {
                variables: testUsers.nameTooLong
            });
        expect(nameTooLong.data.signup).toBeNull()
        expect(nameTooLong.errors[0].message).toBe("User validation failed: name: Path `name` (`omfgMyNameWontFit`) is longer than the maximum allowed length (16).")

        const nameNotAlphanumeric = testUsers.nameNotAlphanumeric
        for (const e of Object.keys(nameNotAlphanumeric)) {
            const invalidName = await mutate(
                util.SIGNUP, {
                    variables: nameNotAlphanumeric[e]
                });
            expect(invalidName.data.signup).toBeNull()
            expect(invalidName.errors[0].message).toBe("User validation failed: name: Username may only contain alphanumeric chars")
        }

        const emailInvalid = await mutate(
            util.SIGNUP, {
                variables: testUsers.emailInvalid
            });
        expect(emailInvalid.data.signup).toBeNull()
        expect(emailInvalid.errors[0].message).toBe("User validation failed: email: Not a valid Email")

        const pwTooShort = await mutate(
            util.SIGNUP, {
                variables: testUsers.invalidPassword.tooShort
            });
        expect(pwTooShort.data.signup).toBeNull()
        expect(pwTooShort.errors[0].message).toBe("User validation failed: password: Path `password` (`Pw12345`) is shorter than the minimum allowed length (8).")

        const pwTooLong = await mutate(
            util.SIGNUP, {
                variables: testUsers.invalidPassword.tooLong
            });
        expect(pwTooLong.data.signup).toBeNull()
        expect(pwTooLong.errors[0].message).toBe("User validation failed: password: Path `password` (`Password91123456789212345678931234567894123456789512345678961234567897123`) is longer than the maximum allowed length (72).")

        const pwNoUppercase = await mutate(
            util.SIGNUP, {
                variables: testUsers.invalidPassword.noUppercase
            });
        expect(pwNoUppercase.data.signup).toBeNull()
        expect(pwNoUppercase.errors[0].message).toBe("User validation failed: password: Password must contain uppercase letter")

        const pwNoLowercase = await mutate(
            util.SIGNUP, {
                variables: testUsers.invalidPassword.noLowercase
            });
        expect(pwNoLowercase.data.signup).toBeNull()
        expect(pwNoLowercase.errors[0].message).toBe("User validation failed: password: Password must contain lowercase letter")

        const pwNoDigit = await mutate(
            util.SIGNUP, {
                variables: testUsers.invalidPassword.noDigit
            });
        expect(pwNoDigit.data.signup).toBeNull()
        expect(pwNoDigit.errors[0].message).toBe("User validation failed: password: Password must contain a digit")

        const pwInvalidChar = await mutate(
            util.SIGNUP, {
                variables: testUsers.invalidPassword.invalidChar
            });
        expect(pwInvalidChar.data.signup).toBeNull()
        expect(pwInvalidChar.errors[0].message).toBe("User validation failed: password: Password may only contain certain special chars")
    })

    it("returns a JWT on successful login", async () => {
        const {email, password} = testUsers.validNoDefaults
        const loginResult = await mutate(
            util.LOGIN, {
                variables: {
                    email,
                    password
                }
            }
        )
        const token = loginResult.data.login
        expect(token).toBeTruthy()
        expect(typeof token).toBe("string")
    })

    it("errors on wrong login credentials", async () => {
        const {email, password} = testUsers.validNoDefaults
        const loginFalseEmailResult = await mutate(
            util.LOGIN, {
                variables: {
                    email: email + "a",
                    password
                }
            }
        )
        expect(loginFalseEmailResult.errors[0].message).toBe("User does not exist.")

        const {email: email2, password: password2} = testUsers.validNoDefaults
        const loginFalsePasswordResult = await mutate(
            util.LOGIN, {
                variables: {
                    email: email2,
                    password: password2 + "a"
                }
            }
        )
        expect(loginFalsePasswordResult.errors[0].message).toBe("Password is not correct.")
    })

    it("executes requireAuthentication queries", async () => {
        //the USER_SELF query requires authorization.
        //We use it as an example for other authorization queries.
        await loginUser()

        const resultUserSelf = await query(util.USER_SELF)
        expect(resultUserSelf.errors).toBeUndefined()
        expect(resultUserSelf.data.userSelf).toBeTruthy()
    })

    it("errors if authentication is missing/false on requireAuthentication queries", async () => {
        //missing req.user completely
        const resultUserSelf = await query(util.USER_SELF)
        expect(resultUserSelf.errors[0].message).toBe("Cannot read property 'isAuth' of undefined")

        //JWT not correct
        setOptions({
            request: {
                user: {
                    isAuth: false,
                }
            }
        });
        const resultUserSelf2 = await query(util.USER_SELF)
        expect(resultUserSelf2.errors[0].message).toBe("You must login to view this.")
    })

    it("executes requireAuthorization queries", async () => {
        await loginAdmin()

        const resultUserOneAdmin = await query(util.USER_ONE_ADMIN)
        //console.log(resultUserOneAdmin)
        expect(resultUserOneAdmin.errors).toBeUndefined()
        expect(resultUserOneAdmin.data.userOneAdmin).toBeDefined()
    })

    it("errors if role does not have permission for query", async () => {
        //do log in with role:user for admin query so user is not authorized for query
        await loginUser()

        const resultUserOneAdmin = await query(util.USER_ONE_ADMIN)
        expect(resultUserOneAdmin.errors[0].message).toBe("You do not have the required permissions to view this")
    })
});
