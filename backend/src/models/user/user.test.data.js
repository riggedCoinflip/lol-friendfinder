module.exports = {
    valid: {
        name: "validUser",
        email: "valid@email.com",
        password: "Password1",
    },

    admin: {
        name: "Admin",
        email: "admin@email.com",
        password: "Password1",
        role: "admin",
    },

    validNoDefaults: {
        name: "Name",
        email: "name@email.com",
        password: "Password1",
        role: "user",
        aboutMe: "Lorem Ipsum",
        gender: "male",
        dateOfBirth: new Date(), //dateOfBirth = now
        languages: ["de", "en"],
        avatar: "URI to image",
        ingameRole: ["Top", "Jungle"]
    },

    minDateOfBirthInYear: {
        //should always have age of currentYear - 2000
        name: "20000101",
        email: "name@email.com",
        password: "Password1",
        dateOfBirth: new Date(Date.UTC(2000, 0, 1)),
    },

    maxDateOfBirthInYear: {
        //should always have age of currentYear - 2000 - 1 (cause bday of this year didnt happen so far
        name: "20001231",
        email: "name2@email.com",
        password: "Password1",
        dateOfBirth: new Date(Date.UTC(2000, 11, 31)),
    },

    //name and emails with whitespaces that the DB should trim
    trim: {
        name: " trimName ", //DO NOT DELETE WHITESPACE
        email: " trim@email.com ", //DO NOT DELETE WHITESPACE
        password: "Password1",
    },

    lowerEmail: {
        name: "lowerEmail",
        email: "LOWER_THIS@Email.com",
        password: "Password1",
    },

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

    nameNotAlphanumeric: {
        space: {
            name: "Hello World",
            email: "space@email.com",
            password: "Password1",
        },
        specialChar: {
            name: "Hello,World!",
            email: "specialChar@email.com",
            password: "Password1",
        },
        de: {
            name: "HelloÄÖÜß",
            email: "de@email.com",
            password: "Password1",
        },
        fr: {
            name: "HéllòWôrldçëœ",
            email: "fr@email.com",
            password: "Password1",
        },
        arabianRTL: {
            name: "مرحبا بالعالم",
            email: "arabianRTL@email.com",
            password: "Password1",
        },
        jp: {
            name: "こんにちは世界",
            email: "jp@email.com",
            password: "Password1",
        },
        kr: {
            name: "안녕하세요세계",
            email: "space@email.com",
            password: "Password1",
        },
        cn: {
            name: "你好世界",
            email: "space@email.com",
            password: "Password1",
        },
        emoji: {
            name: "🙊🙉🙈",
            email: "emoji@email.com",
            password: "Password1",
        },
        corruptedUnicode: { //https://lingojam.com/CorruptedText
            name: "H̸e̶l̵l̵o̶",
            email: "corruptedUnicode@email.com",
            password: "Password1",
        },
        specialWhitespace: { //https://jkorpela.fi/chars/spaces.html
            name: " foo bar᠎x 　d",
            email: "specialWhitespace@email.com",
            password: "Password1",
        },
    },

    invalidPassword: {
        tooShort: {
            name: "tooShort",
            email: "Min8Chars@email.com",
            password: "Pw12345",
        },
        tooLong: {
            name: "tooLong",
            email: "TheBcryptAlgorithmDoesNotHaveDifferentHashesForPasswordsBeyond72BYTE@email.com",
            password: "Password91123456789212345678931234567894123456789512345678961234567897123", //length 73
        },
        noUppercase: {
            name: "noUppercase",
            email: "noUppercase@email.com",
            password: "password1",
        },
        noLowercase: {
            name: "noLowercase",
            email: "noLowercase@email.com",
            password: "PASSWORD1",
        },
        noDigit: {
            name: "noDigit",
            email: "noDigit@email.com",
            password: "Password",
        },
        invalidChar: {
            name: "invalidChar",
            email: "invalidChar@email.com",
            password: "Password1 +-",
        },
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

    roleDoesNotExist: {
        name: "roleDoesNotExist",
        email: "OnlyRolesDefinedInEnumAllowed@email.com",
        password: "Password1",
        role: "ThisRoleDoesNotExist"
    },

    usernameDifferentCapitalization: {
        lower: {
            name: "name",
            email: "lower@email.com",
            password: "Password1",
        },

        upper: {
            name: "NAME",
            email: "upper@email.com",
            password: "Password1",
        },
    },

    emailInvalid: {
        name: "name",
        email: "@email.com",
        password: "Password1",
    }
}