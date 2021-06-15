const {dbConnect, dbDisconnectAndWipe} = require("../../utils/test-utils/db-handler")
const createMongoData = require("../../utils/createMongoData")
const {User} = require("../../models/user/user")
const testUsers = require("../../models/user/user.test.data")
const queries = require("./user.test.queries")
const {query, mutate, loginAdmin, loginUser, failLogin, resetOptions} = require("../../utils/test-utils/graphqlTestClient")


describe("User GraphQL Test Suite", () => {
    beforeAll(async () => {
        await dbConnect()
        await createMongoData()
    });
    beforeEach(async () => {
        resetOptions()
    })
    afterAll(async () => dbDisconnectAndWipe());

    it("creates a user on signup", async () => {
        const signupResult = await mutate(
            queries.SIGNUP, {
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
            queries.SIGNUP, {
                variables: testUsers.nameTooShort
            });
        expect(nameTooShort.data.signup).toBeNull()
        expect(nameTooShort.errors[0].message).toBe("User validation failed: name: Path `name` (`ab`) is shorter than the minimum allowed length (3).")

        const nameTooLong = await mutate(
            queries.SIGNUP, {
                variables: testUsers.nameTooLong
            });
        expect(nameTooLong.data.signup).toBeNull()
        expect(nameTooLong.errors[0].message).toBe("User validation failed: name: Path `name` (`omfgMyNameWontFit`) is longer than the maximum allowed length (16).")

        const nameNotAlphanumeric = testUsers.nameNotAlphanumeric
        for (const e of Object.keys(nameNotAlphanumeric)) {
            const invalidName = await mutate(
                queries.SIGNUP, {
                    variables: nameNotAlphanumeric[e]
                });
            expect(invalidName.data.signup).toBeNull()
            expect(invalidName.errors[0].message).toBe("User validation failed: name: Username may only contain alphanumeric chars")
        }

        const emailInvalid = await mutate(
            queries.SIGNUP, {
                variables: testUsers.emailInvalid
            });
        expect(emailInvalid.data.signup).toBeNull()
        expect(emailInvalid.errors[0].message).toBe("User validation failed: email: Not a valid Email")

        const pwTooShort = await mutate(
            queries.SIGNUP, {
                variables: testUsers.invalidPassword.tooShort
            });
        expect(pwTooShort.data.signup).toBeNull()
        expect(pwTooShort.errors[0].message).toBe("User validation failed: password: Path `password` (`Pw12345`) is shorter than the minimum allowed length (8).")

        const pwTooLong = await mutate(
            queries.SIGNUP, {
                variables: testUsers.invalidPassword.tooLong
            });
        expect(pwTooLong.data.signup).toBeNull()
        expect(pwTooLong.errors[0].message).toBe("User validation failed: password: Path `password` (`Password91123456789212345678931234567894123456789512345678961234567897123`) is longer than the maximum allowed length (72).")

        const pwNoUppercase = await mutate(
            queries.SIGNUP, {
                variables: testUsers.invalidPassword.noUppercase
            });
        expect(pwNoUppercase.data.signup).toBeNull()
        expect(pwNoUppercase.errors[0].message).toBe("User validation failed: password: Password must contain uppercase letter")

        const pwNoLowercase = await mutate(
            queries.SIGNUP, {
                variables: testUsers.invalidPassword.noLowercase
            });
        expect(pwNoLowercase.data.signup).toBeNull()
        expect(pwNoLowercase.errors[0].message).toBe("User validation failed: password: Password must contain lowercase letter")

        const pwNoDigit = await mutate(
            queries.SIGNUP, {
                variables: testUsers.invalidPassword.noDigit
            });
        expect(pwNoDigit.data.signup).toBeNull()
        expect(pwNoDigit.errors[0].message).toBe("User validation failed: password: Password must contain a digit")

        const pwInvalidChar = await mutate(
            queries.SIGNUP, {
                variables: testUsers.invalidPassword.invalidChar
            });
        expect(pwInvalidChar.data.signup).toBeNull()
        expect(pwInvalidChar.errors[0].message).toBe("User validation failed: password: Password may only contain certain special chars")
    })

    it("returns a JWT on successful login", async () => {
        const admin = await User.findOne({nameNormalized: "admin"})
        const loginResult = await mutate(
            queries.LOGIN, {
                variables: {
                    email:admin.email,
                    password: "AdminPW1",
                }
            }
        )
        const token = loginResult.data.login
        expect(token).toBeTruthy()
        expect(typeof token).toBe("string")
    })

    it("errors on wrong login credentials", async () => {
        const admin = await User.findOne({nameNormalized: "admin"})
        const loginFalseEmailResult = await mutate(
            queries.LOGIN, {
                variables: {
                    email: admin.email + "a",
                    password: "AdminPW1"
                }
            }
        )
        expect(loginFalseEmailResult.errors[0].message).toBe("User or Password is not correct.")

        const loginFalsePasswordResult = await mutate(
            queries.LOGIN, {
                variables: {
                    email: admin.email,
                    password: "AdminPW1" + "a"
                }
            }
        )
        expect(loginFalsePasswordResult.errors[0].message).toBe("User or Password is not correct.")
    })

    it("executes requireAuthentication queries", async () => {
        //the USER_SELF query requires authorization.
        //We use it as an example for other authorization queries.
        await loginUser()

        const resultUserSelf = await query(queries.USER_SELF)
        expect(resultUserSelf.errors).toBeUndefined()
        expect(resultUserSelf.data.userSelf).toBeTruthy()
    })

    it("errors if authentication is missing/false on requireAuthentication queries", async () => {
        //missing req.user completely
        const resultUserSelf = await query(queries.USER_SELF)
        expect(resultUserSelf.errors[0].message).toBe("You must login to view this.")

        //JWT not correct
        failLogin()

        const resultUserSelf2 = await query(queries.USER_SELF)
        expect(resultUserSelf2.errors[0].message).toBe("You must login to view this.")
    })

    it("executes requireAuthorization queries", async () => {
        await loginAdmin()

        const resultUserOneAdmin = await query(queries.USER_ONE_ADMIN)
        //console.log(resultUserOneAdmin)
        expect(resultUserOneAdmin.errors).toBeUndefined()
        expect(resultUserOneAdmin.data.userOneAdmin).toBeDefined()
    })

    it("errors if role does not have permission for query", async () => {
        //do log in with role:user for admin query so user is not authorized for query
        await loginUser()

        const resultUserOneAdmin = await query(queries.USER_ONE_ADMIN)
        expect(resultUserOneAdmin.errors[0].message).toBe("You do not have the required permissions to view this")
    })

    test("UserOneByName", async () => {
        const userOneByNameResult = await query(
            queries.USER_ONE_BY_NAME, {
                variables: {
                    nameNormalized: "admin"
                }
            }
        )

        expect(userOneByNameResult.errors).toBeUndefined()
        expect(userOneByNameResult.data.userOneByName.name).toStrictEqual("Admin")
    })

    test("UserManyLikesMe", async () => {
        await loginUser()

        const userManyLikesMeResult = await mutate(queries.USER_MANY_LIKES_ME)

        expect(userManyLikesMeResult.errors).toBeUndefined()
        expect(userManyLikesMeResult.data.userManyLikesMe[0].name).toStrictEqual("Neeko")
    })

    test("UserUpdateSelf", async () => {
        await loginUser()

        const userUpdateSelfResult = await mutate(
            queries.USER_UPDATE_SELF, {
                variables: {
                    record: {
                        aboutMe: "foofoo"
                    }
                }
            }
        )

        expect(userUpdateSelfResult.errors).toBeUndefined()
        expect(userUpdateSelfResult.data.userUpdateSelf.record.aboutMe).toStrictEqual("foofoo")
    })

    test("userUpdateSelfBlock", async () => {
        await loginUser()

        //get ids of other users
        const adminId = (await mutate(
            queries.USER_ONE_BY_NAME, {
                variables: {
                    nameNormalized: "admin"
                }
            }
        )).data.userOneByName._id

        const userUpdateSelfBlockResult = await mutate(
            queries.USER_UPDATE_SELF_BLOCK, {
                variables: {
                    _id: adminId
                }
            }
        )

        expect(userUpdateSelfBlockResult.errors).toBeUndefined()
        expect(userUpdateSelfBlockResult.data.userUpdateSelfBlock.blocked).toStrictEqual([adminId])


        console.log(userUpdateSelfBlockResult)

        const userUpdateSelfBlockWithFalseIdResult = await mutate(
            queries.USER_UPDATE_SELF_BLOCK, {
                variables: {
                    _id: "000000000000000000000000" //is a MongoID, but doesnt exist on DB
                }
            }
        )

        expect(userUpdateSelfBlockWithFalseIdResult.errors[0].message).toBe("User validation failed: blocked: blocked references a non existing ID")
    })
});
