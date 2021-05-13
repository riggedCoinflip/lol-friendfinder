import {User, UserTCAdmin, UserTCSignup, UserTCPublic} from "../models/user.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";
import {emailValid, passwordValid, usernameValid} from "../../shared_utils/index.js"
import requireAuth from "../middleware/jwt/require-authentication.js"

//**********************
//*** custom queries ***
//**********************


//************************
//*** custom mutations ***
//************************

//signup
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
    user: UserTCPublic.mongooseResolvers.findOne(),
    ...requireAuth({//TODO require auth (works) AND user group admin
        userAdmin: UserTCAdmin.mongooseResolvers.findOne(),
    }),
};

export const UserMutation = {
    signup: signup,
    login: UserTCAdmin.getResolver("login"),
};
