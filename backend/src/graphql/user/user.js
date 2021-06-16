const jwt = require("jsonwebtoken");
const {User, UserTCAdmin, UserTCPublic, UserTCPrivate, normalizeName} = require("../../models/user/user");
const {Like} = require("../../models/like/like");
const requireAuthentication = require("../../middleware/jwt/requireAuthentication");
const requireAuthorization = require("../../middleware/jwt/requireAuthorization");
const {Password} = require("../../models/password/password");
const {schemaComposer} = require("graphql-compose");
const {performance} = require("perf_hooks")

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

UserTCPublic.addResolver({
    kind: "query",
    name: "userManyLikesMe",
    description: "Show all users that like logged in user.",
    type: [UserTCPublic],
    resolve: async ({context}) => {
        /**
         * First, find all userIds that like the logged in user
         * Then, return query of these (populated) users
         */

        const ids = (
            await Like.find({
                recipient: context.req.user._id,
                status: "liked",
            }).lean()
        ).map((doc) => doc.requester)

        return User.find({"_id": {$in: ids}});
    }
})

const userMany = UserTCPublic.mongooseResolvers.findMany({
    lean: false,
    limit: {defaultValue: 10},
    sort: false,
    filter: {
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

const userUpdateSelf = UserTCPrivate.mongooseResolvers.updateById()
    .setDescription("Update information of currently logged in user")
    .removeArg("_id")
    .wrapResolve((next) => (rp) => {
        rp.args._id = rp.context.req.user._id;
        return next(rp);
    })

UserTCPrivate.addResolver({
    kind: "mutation",
    name: "userUpdateSelfBlock",
    description: "Add a user to the block list",
    args: {
        _id: "MongoID"
    },
    type: UserTCPrivate,
    resolve: async ({args, context}) => {
        const userSelf = await User.findOne({_id: context.req.user._id})
        userSelf.blocked.push(args._id)
        await userSelf.save()

        return userSelf
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
        userManyLikesMe: UserTCPublic.getResolver("userManyLikesMe"),
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
        userUpdateSelf,
        userUpdateSelfBlock: UserTCPrivate.getResolver("userUpdateSelfBlock"),
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