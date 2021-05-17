const faker = require("faker");
const {User} = require("../src/models/user.js");
const fakeUserdata = require("../src/utils/test-utils/fakeUserdata");
const validators = require("../src/utils/test-utils/validators");
const {dbConnect, dbDrop, dbDisconnect} = require("../src/utils/test-utils/db-handler");

const valid = {
    name: "Name",
    email: "Name@email.com",
    password: "Password1",
    role: "user",
    favouriteColor: "green",
}

//name and emails with whitespaces that the DB should trim
const trim = {
    name: " trimName ", //DO NOT DELETE WHITESPACE
    email: " trim@email.com ", //DO NOT DELETE WHITESPACE
    password: "Password1",
}

//name that breaks the minLength rule
const nameTooShort = {
    name: "ab",
    email: "min3Chars@email.com",
    password: "Password1",
}

const nameTooLong = {
    name: "omfgMyNameWontFit",
    email: "max16Chars@email.com",
    password: "Password1",
}

const requiredFieldNameMissing = {
    email: "noName@email.com",
    password: "Password1",
}

const requiredFieldEmailMissing = {
    name: "noEmail",
    password: "Password1",
}

const requiredFieldPasswordMissing = {
    name: "noPassword",
    email: "noPassword@email.com",
}

const passwordTooShort = {
    name: "pwTooShort",
    email: "Min8Chats@email.com",
    password: "Pw12345",
}

const passwordTooLong = {
    name: "passwordTooLong",
    email: "TheBcryptAlgorithmDoesNotHaveDifferentHashesForPasswordsBeyond72BYTE@email.com",
    password: "Password91123456789212345678931234567894123456789512345678961234567897123", //length 73
}

const passwordNoUpper = {
    name: "pwNoUpper",
    email: "AtLeast1Uppercase@email.com",
    password: "nouppercase1",
}

const passwordNoLower = {
    name: "pwNoLower",
    email: "AtLeast1Lowercase@email.com",
    password: "NOLOWERCASE1",
}

const passwordNoDigit = {
    name: "pwNoDigit",
    email: "AtLeast1Digit@email.com",
    password: "PasswordNoDigit",
}

const passwordDisallowedSpecialChar = {
    name: "passwordDisallowedSpecialChar",
    email: "onlyCertainSpecialCharsAllowed@email.com",
    password: "Password1 +-",
}

const roleDoesNotExist = {
    name: "roleDoesNotExist",
    email: "OnlyRolesDefinedInEnumAllowed@email.com",
    password: "Password1",
    role: "ThisRoleDoesNotExist"
}


beforeAll(async () => dbConnect());
afterEach(async () => dbDrop())
afterAll(async () => dbDisconnect());


//TODO make validations before save: https://stackoverflow.com/questions/11325372/mongoose-odm-change-variables-before-saving
describe("User Model Test Suite", () => {
    it("saves a user successfully", async () => {
        const user = new User(valid);
        const savedUser = await user.save();

        validators.validateNotEmpty(savedUser);

        validators.validateStringEquality(savedUser.name, valid.name);
        validators.validateStringEquality(savedUser.email, valid.email);
        validators.validateStringEquality(savedUser.password, valid.password);
        validators.validateStringEquality(savedUser.role, valid.role);
        validators.validateStringEquality(savedUser.favouriteColor, valid.favouriteColor)
    });

    it("throws MongoDB duplicate error with code 11000", async () => {
        const user = new User(valid);
        const user2 = new User(valid); //clone user

        await user.save();
        try {
            await user2.save();
        } catch (err) {
            const {name, code} = err;
            validators.validateMongoDuplicationError(name, code);
        }
    });

    it("trims fields on save", async () => {
        const user = new User(trim);
        const savedUser = await user.save();

        validators.validateNotEmpty(savedUser);

        validators.validateStringEquality(savedUser.name, "trimName");
        validators.validateStringEquality(savedUser.email, "trim@email.com");
    })

    it("throws MongoDB ValidationError on String shorter than minlength", async () => {
        const user = new User(nameTooShort);
        try {
            await user.save()
        } catch (err) {
            validators.validateMongoValidationError(err, "name", "minlength")
        }
    })

    it("throws MongoDB ValidationError on String longer than maxlength", async () => {
        const user = new User(nameTooLong);
        try {
            await user.save()
        } catch (err) {
            validators.validateMongoValidationError(err, "name", "maxlength")
        }
    })

    test("Validate role enum", async () => {
        fail()
    })

    test("Validate color default", async () => {
        fail()
    })

    it("errors on missing fields", async () => {
        //it errors on missing name
        const user = new User(requiredFieldNameMissing);
        try {
            await user.save()
        } catch (err) {
            validators.validateMongoValidationError(err, "name", "required")
        }
        //it errors on missing email
        const user2 = new User(requiredFieldEmailMissing);
        try {
            await user2.save()
        } catch (err) {
            validators.validateMongoValidationError(err, "email", "required")
        }

        //it errors on missing password
        const user3 = new User(requiredFieldPasswordMissing);
        try {
            await user3.save()
        } catch (err) {
            validators.validateMongoValidationError(err, "password", "required")
        }
    })

    test("Something with timestamps", async () => {
        fail()
    })
})
;