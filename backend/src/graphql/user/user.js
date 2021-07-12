const jwt = require("jsonwebtoken");
const {User, UserTCAdmin, UserTCPublic, UserTCPrivate, normalizeName} = require("../../models/user/user");
const {Like} = require("../../models/like/like");
const requireAuthentication = require("../../middleware/jwt/requireAuthentication");
const requireAuthorization = require("../../middleware/jwt/requireAuthorization");
const {Password} = require("../../models/password/password");
const {schemaComposer} = require("graphql-compose");
const {performance} = require("perf_hooks")
const _ = require("lodash")

//***************
//*** QUERIES ***
//***************

//login
const login = schemaComposer.createResolver({
    kind: "query",
    name: "login",
    description: "Use Login Credentials (Email + PW) to get a JWT auth token",
    args: {
        email: "String!",
        password: "String!",
    },
    type: "String!",
    resolve: async ({args}) => {
        const user = await User.findOne({email: args.email});

        const start = performance.now()
        const errorToThrow = (
            !user ||
            !await (await Password.findOne({userId: user._id})).comparePassword(args.password)
        )
        const timeElapsed = performance.now() - start

        // wait constant time to protect against timing attacks that would allow attacker
        // to find out which emails have acc on our website
        // OPTIMIZE still able to go for timing attack if `comparePassword` takes >1000ms (around 70ms on @riggedCoinflip's local dev machine)
        // perhaps this helps: https://nodejs.org/api/perf_hooks.html#perf_hooks_performance_measurement_apis
        await new Promise((resolve) => {
            setTimeout(resolve, 1000 - timeElapsed);
        });
        if (errorToThrow) throw new Error("User or Password is not correct.")

        //generate token
        return jwt.sign({
                _id: user._id,
                username: user.name,
                role: user.role
            },
            process.env.JWT_SECRET, {
                expiresIn: "24h"
            });
    }
})


UserTCPublic.addResolver({
    kind: "query",
    name: "userOneByName",
    description: "Show public information of user by name",
    args: {
        nameNormalized: "String!",
    },
    type: UserTCPublic,
    resolve: async ({args}) => {
        return User.findOne({nameNormalized: normalizeName(args.nameNormalized)});
    }
})


const userSelf = UserTCPrivate.mongooseResolvers
    .findById()
    .setDescription("Get information of currently logged in user")
    .removeArg("_id")
    .wrapResolve((next) => (rp) => {
        rp.args._id = rp.context.req.user._id;
        return next(rp);
    })

/*
FUTURE: premium feature
UserTCPublic.addResolver({
    kind: "query",
    name: "userManyLikesMe",
    description: "Show all users that like logged in user.",
    type: [UserTCPublic],
    resolve: async ({context}) => {
        const ids = (
            await Like.find({
                recipient: context.req.user._id,
                status: "liked",
            }).lean()
        ).map((doc) => doc.requester)

        return User.find({"_id": {$in: ids}});
    }
})
*/


const userMany = UserTCPublic.mongooseResolvers.findMany({
    lean: false,
    limit: {defaultValue: 10},
    sort: false,
    filter: {
        //IF YOU CHANGE THIS, CHANGE userManyToSwipe AS WELL!
        // https://github.com/graphql-compose/graphql-compose-mongoose#filterhelperargsopts
        // only allow to filter with operators
        removeFields: [
            "_id",
            "name",
            "aboutMe",
            "avatar",
        ],
        operators: {
            "_id": false,
            "name": false,
            "aboutMe": false,
            "languages": ["in"],
            "gender": ["in"],
            "age": ["gte", "lte"],
            "avatar": false,
            "ingameRole": ["in"]
        }
    }
})
    .setDescription("Get the public information of userMany with restricted filters")


UserTCPublic.addResolver({
    name: "userManyToSwipe",
    description: `
    Show users the client may be interested in swiping. This includes:
    1. All users that liked the client
    2. All users that match the filters used
    
    Excludes the following users: The client itself, friends, blocked users and users the client already liked.
    Limit: 10
    `,
    args:
        {
            filter: userMany.getArgs().filter,
        },
    type: [UserTCPublic],
    resolve: async ({args, context}) => {
        const userSelf = await User.findOne({_id: context.req.user._id})

        //exclude
        const excludeBlocked = userSelf.blocked
        const excludeFriends = userSelf.friends.map(item => item.user)
        const excludeRated = (await Like.find({requester: userSelf._id})).map(item => item.recipient)
        const excluded = [userSelf._id, ...excludeFriends, ...excludeBlocked, ...excludeRated]

        //likes
        const likedClientIds = (await Like.find({recipient: userSelf._id, status: "liked"}).select({requester: 1, _id: 0}))
            .map(item => item.requester)
        //console.log("likedClientIds:", likedClientIds)

        const usersLikedClient = await User.find({
            _id: {
                $nin: excluded,
                $in: likedClientIds
            }
        })
            .limit(3)
        //console.log("usersLikedClient:", usersLikedClient)

        //filter
        const filter = {}
        /**
         * //OPTIMIZE not sure if annotation is right
         * @param {Object} [args.filter._operators] Operators used for filtering
         */
        if (args?.filter?._operators) {
            const operators = args?.filter?._operators
            if (operators?.languages?.in) filter.languages = {$in: operators.languages.in}
            if (operators?.gender?.in) filter.gender = {$in: operators.gender.in}
            if (operators?.ingameRole?.in) filter.ingameRole = {$in: operators.ingameRole.in}
            if (operators?.age) {
                const age = {}
                //does not work if gte/lte are 0
                if (operators?.age?.gte) age.$gte = operators.age.gte
                if (operators?.age?.lte) age.$lte = operators.age.lte
                filter.age = age
            }
        }

        //OPTIMIZE (good enough for now)
        // Depending on different reasons, a user should be more likely to appear in the next X swipes:
        // - the other user liked the client already - meaning if the client likes that user, it results in a match. high weight.
        // - the time since the other user was online - the lower the better
        // - how much personal information the over user gives of himself - users without a profile picture, without an about me text should be less likely to appear
        // - a high like-to-match-ratio
        // etc.
        // All of these things feed a score algorithm.
        // The weight is then calculated (logarithmically?) from the score.
        // But I dont want to sort by score/weight directly. Because then, all users that liked the client will show on top -> the user will generate all matches at the beginning and none later on. The "match quality" will also gradually decrease.
        // With a weighted shuffle, these effects still exist - but are lessened
        //OPTIMIZE generate a weighted shuffle
        // 1.map weight to object
        // 2.map weight to random * weight
        // 3.sort after weight
        // https://softwareengineering.stackexchange.com/questions/233541/how-to-implement-a-weighted-shuffle
        // https://utopia.duth.gr/~pefraimi/research/data/2007EncOfAlg.pdf
        //current: show up to 3 users that liked the client per request. Fill up to 10 with other users. Shuffle order.

        //filter
        const usersFiltered = await User.find({
            _id: {$nin: [...excluded, ...likedClientIds]},
            ...filter
        })
            .limit(10 - usersLikedClient.length) //fill up to 10
        //console.log("usersFiltered:", usersFiltered.map(item => {return {_id: item._id, name: item.name}}))

        return  _.shuffle([...usersLikedClient, ...usersFiltered])
    }
})


//*****************
//*** MUTATIONS ***
//*****************

UserTCPrivate.addResolver({
    kind: "mutation",
    name: "signup",
    description: "Create an account",
    args: {
        name: "String!",
        email: "String!",
        password: "String!",
    },
    type: UserTCPrivate,
    resolve: async ({args}) => {
        const user = await new User({name: args.name, email: args.email}).save()
        await new Password({password: args.password, userId: user._id}).save()

        return user
    }
})

schemaComposer.createInputTC({
    name: "UserPrivateFriendsMutation",
    fields: {
        toPop: ["MongoID"],
    }
})

schemaComposer.createInputTC({
    name: "UserPrivateBlockedMutation",
    fields: {
        toPush: ["MongoID"],
        toPop: ["MongoID"],
    }
})

UserTCPrivate.addResolver({
    kind: "mutation",
    name: "userUpdateSelf",
    description: "Update currently logged in user",
    args: {
        name: "String",
        aboutMe: "String",
        gender: "EnumUserPrivateGender",
        languages: ["String"],
        dateOfBirth: "Date",
        ingameRole: ["EnumUserPrivateIngameRole"],
        friends: "UserPrivateFriendsMutation",
        blocked: "UserPrivateBlockedMutation",
    },
    type: UserTCPrivate,
    resolve: async ({args, context}) => {
        /**
         * @param {Array} arr - array to filter
         * @param {Array} values - values to filter out
         * @param {String} [nestedKey] - if defined, filters after nested key instead
         * @returns {Array} filtered
         */
        function filterByValues(arr, values, nestedKey) {
            return arr.filter(
                itemArray => {
                    if (!nestedKey) return !values.some(itemValues => itemArray.equals(itemValues))
                    else return !values.some(itemValues => itemArray[nestedKey].equals(itemValues))
                })
        }

        const userSelf = await User.findOne({_id: context.req.user._id})

        if (args.name) userSelf.name = args.name
        if (args.aboutMe) userSelf.aboutMe = args.aboutMe
        if (args.gender) userSelf.gender = args.gender
        if (args.languages) userSelf.languages = args.languages
        if (args.dateOfBirth) userSelf.dateOfBirth = args.dateOfBirth
        if (args.ingameRole) userSelf.ingameRole = args.ingameRole
        if (args.friends?.toPop) userSelf.friends = filterByValues(userSelf.friends, args.friends.toPop, "user")
        if (args.blocked?.toPush) {
            userSelf.blocked.push(...args.blocked.toPush)
            //if a friend gets blocked, they are also removed from the friendlist
            userSelf.friends = filterByValues(userSelf.friends, args.blocked.toPush, "user")
        }
        if (args.blocked?.toPop) userSelf.blocked = filterByValues(userSelf.blocked, args.blocked.toPop)

        await userSelf.save()
        return User.findOne({_id: context.req.user._id})
    }
})

//***************
//*** EXPORTS ***
//***************

const UserQuery = {
    login,
    userOneById: UserTCPublic.mongooseResolvers.findById(),
    userOneByName: UserTCPublic.getResolver("userOneByName"),
    userMany,
    ...requireAuthentication({
        userSelf,
        // userManyLikesMe: UserTCPublic.getResolver("userManyLikesMe"),
        userManyToSwipe: UserTCPublic.getResolver("userManyToSwipe"),
    }),
    ...requireAuthorization({
            userByIdAdmin: UserTCAdmin.mongooseResolvers.findById(),
            userByIdsAdmin: UserTCAdmin.mongooseResolvers.findByIds(),
            userOneAdmin: UserTCAdmin.mongooseResolvers.findOne(),
            userManyAdmin: UserTCAdmin.mongooseResolvers.findMany(),
            userCountAdmin: UserTCAdmin.mongooseResolvers.count(),
            userConnectionAdmin: UserTCAdmin.mongooseResolvers.connection(),
            userPaginationAdmin: UserTCAdmin.mongooseResolvers.pagination(),
        },
        "admin"
    ),
};

const UserMutation = {
    signup: UserTCPrivate.getResolver("signup"),
    ...requireAuthentication({
        userUpdateSelf: UserTCPrivate.getResolver("userUpdateSelf"),
    }),
    ...requireAuthorization({
            userCreateOneAdmin: UserTCAdmin.mongooseResolvers.createOne(),
            userCreateManyAdmin: UserTCAdmin.mongooseResolvers.createMany(),
            userUpdateByIdAdmin: UserTCAdmin.mongooseResolvers.updateById(),
            userUpdateOneAdmin: UserTCAdmin.mongooseResolvers.updateOne(),
            userUpdateManyAdmin: UserTCAdmin.mongooseResolvers.updateMany(),
            userRemoveByIdAdmin: UserTCAdmin.mongooseResolvers.removeById(),
            userRemoveOneAdmin: UserTCAdmin.mongooseResolvers.removeOne(),
            userRemoveManyAdmin: UserTCAdmin.mongooseResolvers.removeMany(),
        },
        "admin"
    ),
};

module.exports = {
    UserQuery,
    UserMutation,
}