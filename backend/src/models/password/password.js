const mongoose = require("mongoose");
const userValidation = require("../../utils/shared_utils");
const bcrypt = require("bcrypt");
const idvalidator = require("mongoose-id-validator");

//save time on testing
const SALT_ROUNDS = process.env.NODE_ENV === "test" ? 5 : 10;


const PasswordSchema = new mongoose.Schema({
    password: {
        //hashed and salted using bcrypt
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
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
        immutable: true,
    }
});

PasswordSchema.plugin(idvalidator);

// If you set the password, be sure to hash it using bcrypt before saving
PasswordSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    }
    next()
});

//TODO rate limitation - else a DOS vulnerability (can just try to login 100times/s)
PasswordSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Password = mongoose.model("Password", PasswordSchema)

module.exports = {
    Password
}