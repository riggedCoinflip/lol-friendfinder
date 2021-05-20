module.exports = {
    valid: {
        name: "Name",
        email: "name@email.com",
        password: "Password1",
        role: "user",
        favouriteColor: "green",
    },

    //name and emails with whitespaces that the DB should trim
    trim: {
        name: " trimName ", //DO NOT DELETE WHITESPACE
        email: " trim@email.com ", //DO NOT DELETE WHITESPACE
        password: "Password1",
    },

    //name that breaks the minLength rule
    nameTooShort: {
        name: "ab",
        email: "min3Chars@email.com",
        password: "Password1",
    },

    nameTooLong: {
        name: "omfgMyNameWontFit",
        email: "max16Chars@email.com",
        password: "Password1",
    },

    requiredFieldNameMissing: {
        email: "noName@email.com",
        password: "Password1",
    },

    requiredFieldEmailMissing: {
        name: "noEmail",
        password: "Password1",
    },

    requiredFieldPasswordMissing: {
        name: "noPassword",
        email: "noPassword@email.com",
    },

    passwordTooShort: {
        name: "pwTooShort",
        email: "Min8Chats@email.com",
        password: "Pw12345",
    },

    passwordTooLong: {
        name: "passwordTooLong",
        email: "TheBcryptAlgorithmDoesNotHaveDifferentHashesForPasswordsBeyond72BYTE@email.com",
        password: "Password91123456789212345678931234567894123456789512345678961234567897123", //length 73
    },

    passwordNoUpper: {
        name: "pwNoUpper",
        email: "AtLeast1Uppercase@email.com",
        password: "nouppercase1",
    },

    passwordNoLower: {
        name: "pwNoLower",
        email: "AtLeast1Lowercase@email.com",
        password: "NOLOWERCASE1",
    },

    passwordNoDigit: {
        name: "pwNoDigit",
        email: "AtLeast1Digit@email.com",
        password: "PasswordNoDigit",
    },

    passwordDisallowedSpecialChar: {
        name: "passwordDisallowedSpecialChar",
        email: "onlyCertainSpecialCharsAllowed@email.com",
        password: "Password1 +-",
    },

    roleDoesNotExist: {
        name: "roleDoesNotExist",
        email: "OnlyRolesDefinedInEnumAllowed@email.com",
        password: "Password1",
        role: "ThisRoleDoesNotExist"
    },

    useDefaultColor: {
        name: "useDefaultColor",
        email: "usesDefaultValueIfNoColorSpecified@email.com",
        password: "Password1",
    }
}