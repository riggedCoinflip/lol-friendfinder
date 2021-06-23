module.exports = {
    valid: {
        name: "validUser",
        email: "valid@email.com",
    },

    valid2: {
        name: "validUser2",
        email: "valid2@email.com",
    },

    valid3: {
        name: "validUser3",
        email: "valid3@email.com",
    },

    admin: {
        name: "someAdmin",
        email: "someAdmin@email.com",
        role: "admin",
    },

    validNoDefaults: {
        name: "Name",
        email: "name@email.com",
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
        dateOfBirth: new Date(Date.UTC(2000, 0, 1)),
    },

    maxDateOfBirthInYear: {
        //should always have age of currentYear - 2000 - 1 (cause bday of this year didnt happen so far
        name: "20001231",
        email: "name2@email.com",
        dateOfBirth: new Date(Date.UTC(2000, 11, 31)),
    },

    //name and emails with whitespaces that the DB should trim
    trim: {
        name: " trimName ", //DO NOT DELETE WHITESPACE
        email: " trim@email.com ", //DO NOT DELETE WHITESPACE
    },

    lowerEmail: {
        name: "lowerEmail",
        email: "LOWER_THIS@Email.com",
    },

    nameTooShort: {
        name: "ab",
        email: "min3Chars@email.com",
    },

    nameTooLong: {
        name: "omfgMyNameWontFit",
        email: "max16Chars@email.com",
    },

    nameNotAlphanumeric: {
        space: {
            name: "Hello World",
            email: "space@email.com",
        },
        specialChar: {
            name: "Hello,World!",
            email: "specialChar@email.com",
        },
        de: {
            name: "HelloÄÖÜß",
            email: "de@email.com",
        },
        fr: {
            name: "HéllòWôrldçëœ",
            email: "fr@email.com",
        },
        arabianRTL: {
            name: "مرحبا بالعالم",
            email: "arabianRTL@email.com",
        },
        jp: {
            name: "こんにちは世界",
            email: "jp@email.com",
        },
        kr: {
            name: "안녕하세요세계",
            email: "space@email.com",
        },
        cn: {
            name: "你好世界",
            email: "space@email.com",
        },
        emoji: {
            name: "🙊🙉🙈",
            email: "emoji@email.com",
        },
        corruptedUnicode: { //https://lingojam.com/CorruptedText
            name: "H̸e̶l̵l̵o̶",
            email: "corruptedUnicode@email.com",
        },
        specialWhitespace: { //https://jkorpela.fi/chars/spaces.html
            name: " foo bar᠎x 　d",
            email: "specialWhitespace@email.com",
        },
    },

    requiredFieldNameMissing: {
        email: "noName@email.com",
    },

    requiredFieldEmailMissing: {
        name: "noEmail",
    },

    roleDoesNotExist: {
        name: "roleDoesNotExist",
        email: "OnlyRolesDefinedInEnumAllowed@email.com",
        role: "ThisRoleDoesNotExist"
    },

    languageDoesNotExist: {
        name: "languageError",
        email: "languageIdDoesNotExist@email.com",
        languages: ["something false"]
    },

    usernameDifferentCapitalization: {
        lower: {
            name: "name",
            email: "lower@email.com",
        },

        upper: {
            name: "NAME",
            email: "upper@email.com",
        },
    },

    emailInvalid: {
        name: "name",
        email: "@email.com",
    }
}