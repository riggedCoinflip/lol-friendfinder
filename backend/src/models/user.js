const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {composeMongoose} = require("graphql-compose-mongoose");
const userValidation = require("../utils/shared_utils/index");

/*
dev-admin:
name: Admin
email: admin@admin
password: Admin123
 */

//TODO https://stackoverflow.com/questions/13991604/mongoose-schema-validating-unique-field-case-insensitive/54577742
//https://docs.mongodb.com/manual/reference/collation/
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: userValidation.usernameMinLength,
        maxlength: userValidation.usernameMaxLength,
        validate: {
            validator: v => {
                if (!userValidation.isAlphanumeric(v)) throw new Error("Username may only contain alphanumeric chars");
                return true
            }
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        set: v => v.toLowerCase(), //do not allow users to have 2 accounts with same email (foo@email.com and FOO@email.com)
        validate: {
            validator: v => {
                if (!userValidation.isEmail(v)) throw new Error("Invalid Email")

                return true
            }
        }
    },
    password: { //hashed and salted using bcrypt
        type: String,
        required: true,
        minlength: userValidation.passwordMinLength,
        maxlength: userValidation.passwordMaxLength,
        validate: {
            validator: v => {
                if (!userValidation.containsUpper(v)) throw new Error("Password must contain uppercase letter");
                if (!userValidation.containsLower(v)) throw new Error("Password must contain lowercase letter");
                if (!userValidation.containsDigit(v)) throw new Error("Password must contain a digit");
                if (!userValidation.containsOnlyAllowedCharacters(v)) throw new Error("Password may only contain certain special chars");

                return true
            }
        }
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
        required: true,
    },
    favouriteColor: { //temp TODO replace with better fitting field, add more fields, add fields to UserTCPublic
        type: String,
        default: "blue",
        set: v => v.toLowerCase(), //simplify queries
    }
}, {
    timestamps: true,
});

//TODO test: CREATE (passed) and UPDATE (todo)
UserSchema.pre("save", async function() {
    // only hash password if it has been modified (or is new)
    if (this.isModified('password')) {
        // override the cleartext password with the hashed one
        this.password = await bcrypt.hash(this.password, 10);
    }
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

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

