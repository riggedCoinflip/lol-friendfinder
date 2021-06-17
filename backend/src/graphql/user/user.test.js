const {dbConnect, dbDisconnectAndWipe} = require("../../utils/test-utils/db-handler")
const createMongoData = require("../../utils/createMongoData")
const {User} = require("../../models/user/user")
const queries = require("./user.test.queries")
const {
    query,
    mutate,
    loginAdmin,
    loginUser,
    failLogin,
    resetOptions
} = require("../../utils/test-utils/graphqlTestClient")


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
                variables: {
                    name: "validUser",
                    email: "valid@email.com",
                    password: "Password1",
                }
            });

        expect(signupResult).toStrictEqual({
            data: {
                signup: {
                    name: "validUser",
                    email: "valid@email.com",
                }
            }
        })
    });

    it("returns a JWT on successful login", async () => {
        const admin = await User.findOne({nameNormalized: "admin"})
        const loginResult = await mutate(
            queries.LOGIN, {
                variables: {
                    email: admin.email,
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

        const userSelf = await User.findOne({nameNormalized: "sktt1faker"})

        const {_id: user1ID} = await User.findOne({nameNormalized: "admin"})
        const {_id: user2ID} = await User.findOne({nameNormalized: "neeko"})
        const {_id: user3ID} = await User.findOne({nameNormalized: "riggedcoinflip"})
        const {_id: user4ID} = await User.findOne({nameNormalized: "alfredo"})
        const {_id: user5ID} = await User.findOne({nameNormalized: "jeff"})

        // add users to friends/block list so we can test properly
        userSelf.friends.push({user: user1ID}, {user: user2ID}, {user: user3ID})
        userSelf.blocked.push(user4ID)
        await userSelf.save()

        const userUpdateSelfResult = await mutate(
            queries.USER_UPDATE_SELF, {
                variables: {
                    name: "foo",
                    aboutMe: "Lorem Ipsum",
                    gender: "female",
                    dateOfBirth: "2010-01-01",
                    languages: ["de", "en"],
                    ingameRole: ["Mid", "Top"],
                    friends: {
                        toPop: [user1ID]
                    },
                    blocked: {
                        toPush: [
                            user5ID, //standard push
                            user2ID //should delete from friendlist as well
                        ],
                        toPop: [user4ID]
                    },
                }
            }
        )
        expect(userUpdateSelfResult.errors).toBeUndefined()
        expect(userUpdateSelfResult.data.userUpdateSelf.name).toStrictEqual("foo")
        expect(userUpdateSelfResult.data.userUpdateSelf.aboutMe).toStrictEqual("Lorem Ipsum")
        expect(userUpdateSelfResult.data.userUpdateSelf.gender).toStrictEqual("female")
        expect(userUpdateSelfResult.data.userUpdateSelf.dateOfBirth).toStrictEqual("2010-01-01T00:00:00.000Z")
        expect(userUpdateSelfResult.data.userUpdateSelf.languages).toStrictEqual(["de", "en"])
        expect(userUpdateSelfResult.data.userUpdateSelf.ingameRole).toStrictEqual(["Mid", "Top"])
        // we started with friends 1, 2, 3
        // popped friend 1 and added friend 2 to the block list which should automatically pop it as well
        // leaving us with friend 3
        expect(userUpdateSelfResult.data.userUpdateSelf.friends).toStrictEqual([{user: user3ID.toString()}])
        // we started with blocked 4
        // added blocked 5 and 2 and popped blocked 4
        // leaving us with blocked 5 and 2
        expect(userUpdateSelfResult.data.userUpdateSelf.blocked).toStrictEqual([user5ID.toString(), user2ID.toString()])

        //can null languages/ingame role
        const userUpdateSelfResultWithoutUpdate= await mutate(
            queries.USER_UPDATE_SELF, {
                variables: {}
            }
        )
        expect(userUpdateSelfResultWithoutUpdate.errors).toBeUndefined()
        //no changes so should be same response
        expect(userUpdateSelfResultWithoutUpdate).toStrictEqual(userUpdateSelfResult)

    })
});
