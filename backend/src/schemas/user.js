const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {User, UserTCAdmin, UserTCSignup, UserTCPublic} = require("../models/user");
const {emailValid, passwordValid, usernameValid} = require("../utils/shared_utils/index");
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


const signup = UserTCSignup.mongooseResolvers.createOne().wrapResolve(next => async rp => {
    const record = rp.args.record

    //OPTIMIZE give more granular errors
    if (!usernameValid(record.name)) throw new Error("Username invalid")
    if (!emailValid(record.email)) throw new Error("email invalid")
    if (!passwordValid(record.password)) throw new Error("Password invalid")

    return next(rp)
})


//login
UserTCAdmin.addFields({
    token: {
        type: "String",
        description: "Token of authenticated user",
    }
})

UserTCPublic.addResolver({
    kind: 'mutation',
    name: 'login',
    args: {
        email: 'String!',
        password: 'String!',
    },
    type: "String!",
    resolve: async ({args}) => {
        let user = await User.findOne({email: args.email});

        if (!user) {
            throw new Error('User does not exist.')
        }
        const isEqual = await bcrypt.compare(args.password, user.password);
        if (!isEqual) {
            throw new Error('Password is not correct.');
        }
        const token = jwt.sign({
                _id: user._id,
                username: user.name,
                role: user.role
            },
            process.env.JWT_SECRET, {
                expiresIn: '24h'
            });
        return token
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
    signup: signup,
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