const mongoose = require("mongoose")
const {composeMongoose} = require("graphql-compose-mongoose")
const userValidation = require("../../utils/shared_utils")
const idvalidator = require("mongoose-id-validator")
const _ = require("lodash");


const normalizeName = name => name.toLowerCase()

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
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
        required: true,
    },
    aboutMe: {
        type: String,
        maxlength: 250, //we can increase this but never decrease it, choose wisely
    },
    languages: [{
        type: String,
        ref: "Language"
    }],
    gender: {
        //I identify as
        type: String,
        enum: ["male", "female", "non-binary", "transgender", "intersex", "other", "I prefer not to say"],
        default: "I prefer not to say",
        required: true
    },
    dateOfBirth: {
        type: Date,
    },
    age: {
        type: Number,
    },
    avatar: {
        type: String //URI to image
    },
    ingameRole: {
        type: [String],
        enum: ["Top", "Jungle", "Mid", "Bot", "Support", "Fill"]
        //max 2 roles
        //Frontend: If Fill is Selected first, don't ask for 2nd role
    },
    friends: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
        }
    }],
    blocked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }]
    /*
    playstyle: {
        type: String,
        enum: ["Competitive", "Semi-Competitive", "For Fun"]
    }
     */
    /*
    elo: {
    }
     */

}, {
    timestamps: true,
});

UserSchema.plugin(idvalidator);

//update dateOfBirth
UserSchema.pre("save", function (next) {
    if (this.isModified("dateOfBirth") || this.isModified("age")) {
        this.age = (() => {
            //https://stackoverflow.com/a/24181701/12340711  - good enough
            if (!this.dateOfBirth) return -1 //default
            const ageDifMs = Date.now() - this.dateOfBirth
            const ageDate = new Date(ageDifMs); // milliseconds from epoch
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        })()
    }
    next()
})

//validate uniqueness of friends
UserSchema.pre("save", function (next) {
    this.friends.user = _.uniqBy(this.friends.user, i => i._id.toString())
    next()
})

//Set a normalized name for unique name check
UserSchema.pre("save", function (next) {
    if (this.isModified("nameNormalized")) {
        throw new Error("nameNormalized is read only!")
    } else if (this.isModified("name")) {
        this.nameNormalized = normalizeName(this.name)
    }
    next()
})

UserSchema.virtual("password", {
    ref: "password",
    localField: "_id",
    foreignField: "userId",
});

const User = mongoose.model("User", UserSchema)

//CONVERT MONGOOSE MODEL TO GraphQL PIECES
//see opts: https://graphql-compose.github.io/docs/plugins/plugin-mongoose.html#customization-options
const UserTCAdmin = composeMongoose(User, {
    name: "UserAdmin",
    description: "Full User Model. Exposed only for Admins",
    removeFields: [
        "passwordId"
    ]
});

const UserTCPrivate = composeMongoose(User, {
    name: "UserPrivate",
    description: "Fields the user can see about himself",
    onlyFields: [
        "_id",
        "name",
        "email",
        "aboutMe",
        "dateOfBirth",
        "languages",
        "gender",
        "avatar",
        "ingameRole",
        "friends",
        "blocked",
    ]
})


const UserTCPublic = composeMongoose(User, {
    name: "UserPublic",
    description: "Contains all public fields of users. Use this for filtering as well",
    onlyFields: [
        "_id",
        "name",
        "aboutMe",
        "languages",
        "gender",
        "avatar",
        "ingameRole",
        "age",
    ]
})

module.exports = {
    User,
    UserTCAdmin,
    UserTCPublic,
    UserTCPrivate,
    normalizeName
}

