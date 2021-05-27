const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {composeMongoose} = require("graphql-compose-mongoose");
const userValidation = require("../utils/shared_utils/index");


//faster salting for testing to save time
const saltRounds = process.env.NODE_ENV!=="test" ? 10 : 5;

/*
dev-admin:
name: Admin
email: admin@email.com
password: Password1
 */
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
    nameNormalized: {
        /**
         We want users to decide on capitalization (MyUsername vs myusername) but not be able to create users
         that only differ in capitalization (foo and FOO may not exist concurrently)
         -> We use this field for unique validation
         https://stackoverflow.com/questions/13991604/mongoose-schema-validating-unique-field-case-insensitive
         */
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true, //do not allow users to have 2 accounts with same email (foo@email.com and FOO@email.com)
        match: [/^.+[@].+$/, "Not a valid Email"], //one to unlimited chars, then @, then one to unlimited chars
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
        lowercase: true, //simplify queries
    }
}, {
    timestamps: true,
});

/**
 * Save a hashed and salted password to the DB using bcrypt
 */
UserSchema.pre("save", async function (next) {
    // only hash password if it has been modified (or is new)
    if (this.isModified('password')) {
        // override the cleartext password with the hashed one
        this.password = await bcrypt.hash(this.password, saltRounds);
    }

    next()
});

/**
 * Set a normalized name for unique name check
 */
UserSchema.pre("save", function (next) {
    if (this.isModified("nameNormalized")) {
        throw new Error("nameNormalized is read only!")
    } else if (this.isModified("name")) {
        const normalizedName = this.name.toLowerCase()
        this.nameNormalized = normalizedName
    }
    next();
})

UserSchema.methods.comparePassword = async function (candidatePassword) {
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

