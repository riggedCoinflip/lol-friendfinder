const jwt = require("jsonwebtoken");
const {User, UserTCAdmin, UserTCSignup, UserTCPublic} = require("../models/user");
const requireAuthentication = require("../middleware/jwt/require-authentication");
const requireAuthorization = require("../middleware/jwt/require-authorization");

//**********************
//*** custom queries ***
//**********************

UserTCPublic.addResolver({
    kind: 'query',
    name: 'userSelf',
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
    kind: 'mutation',
    name: 'login',
    args: {
        email: 'String!',
        password: 'String!',
    },
    type: "String!",
    resolve: async ({args}) => {
        const user = await User.findOne({email: args.email});

        if (!user) throw new Error('User does not exist.')

        if (!await user.comparePassword(args.password)) throw new Error('Password is not correct.');

        //generate token
        return jwt.sign({
                _id: user._id,
                username: user.name,
                role: user.role
            },
            process.env.JWT_SECRET, {
                expiresIn: '24h'
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
    UserMutation
}