const {dbConnect, dbDisconnectAndWipe} = require("../../utils/test-utils/db-handler")
const {User} = require("../../models/user/user")
const queries = require("./user.test.queries")
const createDummyLikes = require("../../utils/like/createDummyLikes");
const createDummyUsers = require("../../utils/user/createDummyUsers");
const createLanguages = require("../../utils/language/createLanguages");
const _ = require("lodash");
const {Like} = require("../../models/like/like");
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
        await createLanguages()
    })
    beforeEach(async () => {
        await createDummyLikes()
        await createDummyUsers()
        resetOptions()
    })
    afterEach(async () => {
        await Like.deleteMany()
        await User.deleteMany()
    })
    afterAll(async () => dbDisconnectAndWipe())

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

    test.skip("UserManyLikesMe", async () => {
        await loginUser()

        const userManyLikesMeResult = await mutate(queries.USER_MANY_LIKES_ME)

        expect(userManyLikesMeResult.errors).toBeUndefined()
        expect(userManyLikesMeResult.data.userManyLikesMe[0].name).toStrictEqual("Neeko")
    })

    test("UserUpdateSelf", async () => {
        await loginUser()

        const userSelf = await User.findOne({nameNormalized: "sktt1faker"})

        const userIDs = (await User.find({
            nameNormalized: [
                "admin",
                "neeko",
                "riggedcoinflip",
                "alfredo",
                "jeff",
            ]
        })).map(item => item._id)

        // add users to friends/block list so we can test properly
        userSelf.friends.push({user: userIDs[0]}, {user: userIDs[1]}, {user: userIDs[2]})
        userSelf.blocked.push(userIDs[3])
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
                        toPop: [userIDs[0]]
                    },
                    blocked: {
                        toPush: [
                            userIDs[4], //standard push
                            userIDs[1] //should delete from friendlist as well
                        ],
                        toPop: [userIDs[3]]
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
        // we started with friends 0, 1, 2
        // popped friend 0 and added friend 1 to the block list which should automatically pop it as well
        // leaving us with friend 2
        expect(userUpdateSelfResult.data.userUpdateSelf.friends).toStrictEqual([{user: userIDs[2].toString()}])
        // we started with blocked 3
        // added blocked 4 and 1 and popped blocked 3
        // leaving us with blocked 4 and 1
        expect(userUpdateSelfResult.data.userUpdateSelf.blocked).toStrictEqual([userIDs[4].toString(), userIDs[1].toString()])

        //can null languages/ingame role
        const userUpdateSelfResultWithoutUpdate = await mutate(
            queries.USER_UPDATE_SELF, {
                variables: {}
            }
        )
        expect(userUpdateSelfResultWithoutUpdate.errors).toBeUndefined()
        //no changes so should be same response
        expect(userUpdateSelfResultWithoutUpdate).toStrictEqual(userUpdateSelfResult)

    })

    test("userManyToSwipe", async () => {
        await loginUser()

        const userSelf = await User.findOne({nameNormalized: "sktt1faker"})


        // add 4 users that like client
        const usersLikeClientIds = (await User.find({
            nameNormalized: [
                "alfredo",
                "jeff",
                "maxmustermann",
                "johndoe",
            ]
        })).map(item => item._id)
        const likesClientToCreate = usersLikeClientIds.map(_id => {
            return {
                requester: _id,
                recipient: userSelf._id,
                status: "liked"
            }
        })
        await Like.create(likesClientToCreate)

        //exclude:
        // add 1 user to friend list
        const userToBefriendId = (await User.findOne({nameNormalized: "wukong"}))._id
        userSelf.friends.push({user: userToBefriendId})

        // add 1 user to block list
        const userToBlockId = (await User.findOne({nameNormalized: "elpolyglottian"}))._id
        userSelf.blocked.push(userToBlockId)

        // add 1 like and 1 dislike of the client
        const userToLikeId = (await User.findOne({nameNormalized: "g2claps"}))._id
        const userToDislikeId = (await User.findOne({nameNormalized: "g2craps"}))._id
        await Like.create([
            {
                requester: userSelf._id,
                recipient: userToLikeId,
                status: "liked"
            },
            {
                requester: userSelf._id,
                recipient: userToDislikeId,
                status: "disliked"
            }
        ])
        await userSelf.save()

        const excludedUsers = [userSelf._id, userToBefriendId, userToBlockId, userToLikeId, userToDislikeId] //TODO different queries where these shall never show up

        const showsLikedClientUpTo3 = await query(
            queries.USER_MANY_TO_SWIPE, {
                variables: {
                    filter: {
                        _operators: {
                            age: {
                                //impossible to be in these filters; so only likes should be shown
                                lte: -1, //operators checks truthy, 0 isnt truthy, so -1
                                gte: 100
                            }
                        }
                    }
                }
            }
        )
        expect(showsLikedClientUpTo3.data.userManyToSwipe.length).toBe(3)

        //with 20 users - 5 excluded, 15 possible users. Only show 10
        const limitsTo10 = await query(
            queries.USER_MANY_TO_SWIPE, {
                variables: {
                    filter: {}
                }
            }
        )
        expect(limitsTo10.data.userManyToSwipe.length).toBe(10)

        //randomizes order
        //order of 2 shuffled orders can be the same with a chance of 1:10!; but not 4 times in a row (1:10!^4 / 10^26)
        const doQueryMultipleTimes = await Promise.all(Array(5).fill(null).map(async () => query(
            queries.USER_MANY_TO_SWIPE, {
                variables: {
                    filter: {}
                }
            }
        )))
        const [first, ...other] = doQueryMultipleTimes
        const notAllEqual = other.some((elem) => !_.isEqual(elem, first))

        expect(notAllEqual).toBe(true)
    })
})
