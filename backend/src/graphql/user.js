const jwt = require("jsonwebtoken");
const {User, UserTCAdmin, UserTCSignup, UserTCPublic, UserTCPrivate} = require("../models/user/user");
const {Like} = require("../models/like/like");
const requireAuthentication = require("../middleware/jwt/requireAuthentication");
const requireAuthorization = require("../middleware/jwt/requireAuthorization");

//***************
//*** QUERIES ***
//***************
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
    type: [UserTCPublic], //UserTCPublic.mongooseResolvers.findMany().getType(),
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

//*****************
//*** MUTATIONS ***
//*****************

//login
UserTCPublic.addResolver({
    kind: "mutation",
    name: "login",
    description: "Use Login Credentials (Email + PW) to get a JWT auth token",
    args: {
        email: "String!",
        password: "String!",
    },
    type: "String!",
    resolve: async ({args}) => {
        const user = await User.findOne({email: args.email});

        //FIXME
        // timing attacks -> as a login takes substantially longer if the user is correct due to comparing a password,
        // a "hacker" can use the difference in time-till-response to find out which emails are in use
        // SEVERITY: minor
        if (!user || !await user.comparePassword(args.password)) throw new Error("User or Password is not correct.");

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


const userUpdateSelf = UserTCPrivate.mongooseResolvers.updateById()
    .setDescription("Update information of currently logged in user")
    .removeArg("_id")
    .wrapResolve((next) => (rp) => {
        rp.args._id = rp.context.req.user._id;
        return next(rp);
    })

//***************
//*** EXPORTS ***
//***************

const UserQuery = {
    ...requireAuthentication({
        userSelf,
        user: UserTCPublic.mongooseResolvers.findOne(), //TODO restrict filters
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
    signup: UserTCSignup.mongooseResolvers.createOne(),
    login: UserTCPublic.getResolver("login"),
    ...requireAuthentication({
        userUpdateSelf,
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