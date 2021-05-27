const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {composeMongoose} = require("graphql-compose-mongoose");
const userValidation = require("../../utils/shared_utils");


//save time on testing
const SALT_ROUNDS = process.env.NODE_ENV === "test" ? 5 : 10;

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
    /*
    filter: {
        //create new model
        //gender: "I am looking for"
    },
     */
    dateOfBirth: {
        //is set with a Date - but returns an Integer of the Age as getter
        type: Date,
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

UserSchema.virtual("age").get(function () {
    //https://stackoverflow.com/a/24181701/12340711
    //good enough
    const ageDifMs = Date.now() - this.dateOfBirth
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
})

//Save a hashed and salted password to the DB using bcrypt
UserSchema.pre("save", async function (next) {
    // only hash password if it has been modified (or is new)
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    }
    next()
});

//Set a normalized name for unique name check
UserSchema.pre("save", function (next) {
    if (this.isModified("nameNormalized")) {
        throw new Error("nameNormalized is read only!")
    } else if (this.isModified("name")) {
        this.nameNormalized = this.name.toLowerCase()
    }
    next();
})

UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", UserSchema)

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
        "aboutMe",
        "languages",
        "gender",
        "avatar",
        "ingameRole",
        //age - is added seperately due to being a virtual
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

//virtuals have to be added to TC seperately
//https://github.com/graphql-compose/graphql-compose-mongoose/issues/135
const ageForTC ={
    age: {
        type: "Int",
        description: 'Uses the virtual "age" that is calculated from DateOfBirth',
    }
}

UserTCAdmin.addFields(ageForTC)
UserTCPublic.addFields(ageForTC)

module.exports = {
    User,
    UserTCAdmin,
    UserTCPublic,
    UserTCSignup
}

