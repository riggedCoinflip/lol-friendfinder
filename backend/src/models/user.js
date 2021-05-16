const mongoose = require("mongoose");
const {composeMongoose} = require("graphql-compose-mongoose");

/*
dev-admin:
name: Admin
email: admin@admin
password: Admin123
 */

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 16,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: { //hashed and salted using bcrypt
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    favouriteColor: { //temp TODO replace with better fitting field, add more fields, add fields to UserTCPublic
        type: String,
        default: 'blue'
    }
}, {
    timestamps: true,
});

const User = mongoose.model('User', UserSchema)

//CONVERT MONGOOSE MODEL TO GraphQL PIECES
//see opts: https://graphql-compose.github.io/docs/plugins/plugin-mongoose.html#customization-options
const UserTCAdmin = composeMongoose(User, {
    name: "UserAdmin",
    description: "Full User Model. Exposed only for Admins"
});

const UserTCPublic = composeMongoose(User, {
    name: "UserPublic",
    description: "Contains all public fields of users. Use this for filtering as well",
    onlyFields: [
        "name",
        "favouriteColor"
    ]
})

const UserTCSignup = composeMongoose(User, {
    name: "UserSignup",
    description: "Login a user or create a new user",
    onlyFields: [
        "name",
        "email",
        "password"
    ]
})

module.exports = {
    User,
    UserTCAdmin,
    UserTCPublic,
    UserTCSignup
}

