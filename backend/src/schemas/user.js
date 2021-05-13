import {User, UserTCAdmin, UserTCSignup, UserTCPublic} from "../models/user.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
import {emailValid, passwordValid, usernameValid} from "../../shared_utils/index.js"
import requireAuthentication from "../middleware/jwt/require-authentication.js"
import requireAuthorization from "../middleware/jwt/require-authorization.js"

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

const signup = UserTCSignup.mongooseResolvers.createOne().wrapResolve(next => async rp => {
    const record = rp.args.record

    //OPTIMIZE give more granular errors
    if (!usernameValid(record.name)) throw new Error("Username invalid")
    if (!emailValid(record.email)) throw new Error("email invalid")
    if (!passwordValid(record.password)) throw new Error("Password invalid")

    rp.beforeRecordMutate = async function (doc) {
        //hash pw
        try {
            doc.password = await bcrypt.hash(doc.password, 10);
        } catch (err) {
            throw new Error(err)
        }

        return doc
    }

    return next(rp)
})


//login
UserTCAdmin.addFields({
    token: {
        type: "String",
        description: "Token of authenticated user",
    }
})

UserTCAdmin.addResolver({
    kind: 'mutation',
    name: 'login',
    args: {
        email: 'String!',
        password: 'String!',
    },
    type: UserTCAdmin.mongooseResolvers.updateById().getType(),
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
        return {
            record: {
                email: user.email,
                token: token,
            }
        }
    }
})


//***************
//*** EXPORTS ***
//***************

export const UserQuery = {
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

export const UserMutation = {
    signup: signup,
    login: UserTCAdmin.getResolver("login"),
};


