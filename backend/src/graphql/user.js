const jwt = require("jsonwebtoken");
const {User, UserTCAdmin, UserTCSignup, UserTCPublic} = require("../models/user/user");
const requireAuthentication = require("../middleware/jwt/requireAuthentication");
const requireAuthorization = require("../middleware/jwt/requireAuthorization");

//**********************
//*** custom queries ***
//**********************

UserTCPublic.addResolver({
    kind: "query",
    name: "userSelf",
    description: "get public schema of currently logged in user",
    type: UserTCPublic.mongooseResolvers.findById().getType(),
    resolve: async ({context}) => {
        return User.findById(context.req.user._id);
    }
})

//************************
//*** custom mutations ***
//************************

//TODO
/*
UserTCPublic.addResolver({
    kind: 'mutation',
    name: 'userUpdateSelf',
    description: "update schema of currently logged in user",
    type: UserTCPublic.mongooseResolvers.updateById().getType,
    resolve: async ({args, context}) => {
        return User.updateOne();
    }
})
 */

//login
UserTCPublic.addResolver({
    kind: "mutation",
    name: "login",
    args: {
        email: "String!",
        password: "String!",
    },
    type: "String!",
    resolve: async ({args}) => {
        const user = await User.findOne({email: args.email});

        //OPTIMIZE/FIXME 2 different error messages -> "hacker" can find out which emails exist and which dont
        // if we want to fix the error, we still need a pseudo-compare password cause else a "hacker" can do
        // timing attacks -> as a login takes substantially longer if the user is correct due to comparing a password
        // a "hacker" can use the difference in time-till-response to find out which emails are in use
        // SEVERITY: minor
        if (!user) throw new Error("User does not exist.")
        if (!await user.comparePassword(args.password)) throw new Error("Password is not correct.");

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


//***************
//*** EXPORTS ***
//***************

const UserQuery = {
    ...requireAuthentication({
        userSelf: UserTCPublic.getResolver("userSelf"),
        user: UserTCPublic.mongooseResolvers.findOne(), //TODO restrict filters
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