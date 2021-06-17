const {User} = require("./user")
const createLanguages = require("../../utils/language/createLanguages")
const validators = require("../../utils/test-utils/validators")
const {dbConnect, dbDisconnectAndWipe} = require("../../utils/test-utils/db-handler")
const testUsers = require("./user.test.data")

describe("User Model Test Suite", () => {
    beforeAll(async () => {
        await dbConnect()
        await createLanguages()
    })
    afterEach(async () => await User.deleteMany())
    afterAll(async () => await dbDisconnectAndWipe())

    it("saves a user successfully with hashed password", async () => {
        const user = new User(testUsers.validNoDefaults)
        await user.save()

        validators.validateNotEmptyAndTruthy(user)

        validators.validateStringEquality(user.name, testUsers.validNoDefaults.name)
        validators.validateStringEquality(user.email, testUsers.validNoDefaults.email)
        validators.validateStringEquality(user.role, testUsers.validNoDefaults.role)
        validators.validateStringEquality(user.aboutMe, testUsers.validNoDefaults.aboutMe)
        validators.validateStringEquality(user.gender, testUsers.validNoDefaults.gender)
        validators.validateStringEquality(user.avatar, testUsers.validNoDefaults.avatar)
        //expected is of type: CoreMongooseArray and needs to be transformed
        expect(Array.from([...user.ingameRole])).toStrictEqual(testUsers.validNoDefaults.ingameRole)
        expect(user.dateOfBirth).toBe(testUsers.validNoDefaults.dateOfBirth)
        expect(user.age).toBe(0) //diff between current and current should be 0
    })

    it("calculates Age somewhat correctly", async () => {
        const user = new User(testUsers.minDateOfBirthInYear)
        await user.save()
        expect(user.age).toBe(21)

        const user2 = new User(testUsers.maxDateOfBirthInYear)
        await user2.save()
        expect(user2.age).toBe(20)
    })

    it("updates age if dateOfBirth/age isModified", async () => {
        const user = new User(testUsers.minDateOfBirthInYear)
        await user.save()

        let userFromDB = await User.findOne({name: user.name})
        userFromDB.dateOfBirth = new Date("2010-01-01")
        await userFromDB.save()
        expect(userFromDB.age).toBe(11)

        userFromDB = await User.findOne({name: user.name})
        //a manual change of age gets fixed
        userFromDB.age = -1
        await userFromDB.save()
        expect(userFromDB.age).toBe(11)
    })


    it("throws MongoDB duplicate error with code 11000", async () => {
        const user = new User(testUsers.validNoDefaults)
        const user2 = new User(testUsers.validNoDefaults) //clone user

        await user.save()

        try {
            await user2.save()
            fail("Should throw error")
        } catch (err) {
            const {name, code} = err
            validators.validateMongoDuplicationError(name, code)
        }
    })

    it("trims fields on save", async () => {
        const user = new User(testUsers.trim)
        await user.save()

        validators.validateStringEquality(user.name, "trimName")
        validators.validateStringEquality(user.email, "trim@email.com")
    })

    it("only allows valid email addresses", async () => {
        const user = new User(testUsers.emailInvalid)
        try {
            await user.save()
            fail("Should throw error")
        } catch (err) {
            validators.validateMongoValidationError(err, "email", "regexp")
        }
    })

    it("lowers the email on save", async () => {
        const user = new User(testUsers.lowerEmail)
        await user.save()

        validators.validateStringEquality(user.email, "lower_this@email.com")
    })

    it("throws MongoDB ValidationError on String shorter than minlength", async () => {
        const user = new User(testUsers.nameTooShort)
        try {
            await user.save()
            fail("Should throw error")
        } catch (err) {
            validators.validateMongoValidationError(err, "name", "minlength")
        }
    })

    it("throws MongoDB ValidationError on String longer than maxlength", async () => {
        const user = new User(testUsers.nameTooLong)
        try {
            await user.save()
            fail("Should throw error")
        } catch (err) {
            validators.validateMongoValidationError(err, "name", "maxlength")
        }
    })

    it("errors on invalid value in enum", async () => {
        const user = new User(testUsers.roleDoesNotExist)

        try {
            await user.save()
            fail("Should throw error")
        } catch (err) {
            validators.validateMongoValidationError(err, "role", "enum")
        }
    })

    it("errors on missing fields", async () => {
        //OPTIMIZE code duplication
        const user = new User(testUsers.requiredFieldNameMissing)
        try {
            await user.save()
            fail("Should throw error")
        } catch (err) {
            validators.validateMongoValidationError(err, "name", "required")
        }

        const user2 = new User(testUsers.requiredFieldEmailMissing)
        try {
            await user2.save()
            fail("Should throw error")
        } catch (err) {
            validators.validateMongoValidationError(err, "email", "required")
        }
    })

    it("allows only ascii names", async () => {
        //with changing requirements this test shall change
        //we might want to allow asian chars once we have asian customers
        const toTest = testUsers.nameNotAlphanumeric

        for (const e of Object.keys(toTest)) {
            const user = new User(toTest[e])
            try {
                await user.save()
                fail("Should throw error")
            } catch (err) {
                validators.validateMongoValidationError(err, "name", "user defined")
                //console.error(err)
            }
        }
    })

    it("disallows users with different capitalization", async () => {
        const userLower = new User(testUsers.usernameDifferentCapitalization.lower)
        const userUpper = new User(testUsers.usernameDifferentCapitalization.upper)

        await userLower.save()
        try {
            await userUpper.save()
            fail("Should throw error")
        } catch (err) {
            const {name, code} = err
            validators.validateMongoDuplicationError(name, code)
        }
    })

    test("if the normalized username is readonly", async () => {
        const user = new User(testUsers.validNoDefaults)
        user.nameNormalized = "upsert on a readonly field should error" //upsert: update or insert

        try {
            await user.save()
            fail("Should throw error")
        } catch (err) {
            expect(err.message).toBe("nameNormalized is read only!")
        }
    })


    it("populates language successfully", async () => {
        const user = new User(testUsers.validNoDefaults)
        await user.save()

        const doc = await User
            .findOne({nameNormalized: user.nameNormalized})
            .populate("languages")

        expect(doc.populated("languages")).toBeTruthy()

        //unfortunately comparing MongooseCoreArray to Array does not really work
        expect(doc.languages[0].nativeName).toBe("Deutsch")
        expect(doc.languages[1].name).toBe("English")
    })

    it("errors if language does not exist", async () => {
        const user = new User(testUsers.languageDoesNotExist)

        try {
            await user.save()
            fail("Should throw error")
        } catch (err) {
            expect(err.message).toBe("User validation failed: languages: languages references a non existing ID")
        }
    })
})