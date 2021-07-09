const validators = require("../../utils/test-utils/validators");
const {User} = require("../user/user");
const {Password} = require("./password");
const {dbConnect, dbDisconnectAndWipe} = require("../../utils/test-utils/db-handler");

describe("User Model Test Suite", () => {
    let userId
    //valid cleartext password
    const password = "Password1"

    beforeAll(async () => {
        await dbConnect()
        userId = (await new User({name: "Foo", email: "foo@email.com"}).save())._id
    })
    afterEach(async () => await Password.deleteMany())
    afterAll(async () => await dbDisconnectAndWipe())

    it("hashes a password successfully", async () => {
        const passwordDoc = new Password({
            password,
            userId,
        })

        await passwordDoc.save()
        //use bcrypt compare to validate password
        const passwordDocFromDB = await Password.findOne({userId})
        expect(await passwordDocFromDB.comparePassword(password)).toBe(true)
    })

    it("creates a new hash on password change", async () => {
        const passwordDoc = new Password({
            password,
            userId,
        })
        await passwordDoc.save()

        const oldHashedPassword = passwordDoc.password
        expect(await passwordDoc.comparePassword(password)).toBe(true)
        expect(passwordDoc.password).toBe(oldHashedPassword)

        // we need to change the password as our middleware only creates a new hash if the password is changed. ¹
        // we then change the password back and save AGAIN to make sure bcrypt works properly -
        // due to a different salt, the hash should be different as well.
        //
        // ¹ See: PasswordSchema.pre("save",...)

        passwordDoc.password = "pwTemp12"
        await passwordDoc.save()
        passwordDoc.password = password
        await passwordDoc.save()

        expect(await passwordDoc.comparePassword(password)).toBe(true)
        expect(passwordDoc.password).not.toBe(oldHashedPassword)
    })

    it("errors on invalid passwords", async () => {
        const passwordDocTooShort = new Password({
            password: "Pw12345",
            userId,
        })
        try {
            await passwordDocTooShort.save()
            fail("Should throw error")
        } catch (err) {
            validators.validateMongoValidationError(err, "password", "minlength")
        }

        const passwordDocTooLong = new Password({
            password: "Password91113151719212325272931333537394143454749515355575961636567697173", //length 73,
            userId,
        })
        try {
            await passwordDocTooLong.save()
            fail("Should throw error")
        } catch (err) {
            validators.validateMongoValidationError(err, "password", "maxlength")
        }

        const passwordDocNoUppercase = new Password({
            password: "password1",
            userId,
        })
        try {
            await passwordDocNoUppercase.save()
            fail("Should throw error")
        } catch (err) {
            validators.validateMongoValidationError(err, "password", "user defined")
            expect(err.errors.password.properties.message).toBe("Password must contain uppercase letter")
        }

        const passwordDocNoLowercase = new Password({
            password: "PASSWORD1",
            userId,
        })
        try {
            await passwordDocNoLowercase.save()
            fail("Should throw error")
        } catch (err) {
            validators.validateMongoValidationError(err, "password", "user defined")
            expect(err.errors.password.properties.message).toBe("Password must contain lowercase letter")

        }

        const passwordDocNoDigit = new Password({
            password: "hasNoDigit",
            userId,
        })
        try {
            await passwordDocNoDigit.save()
            fail("Should throw error")
        } catch (err) {
            validators.validateMongoValidationError(err, "password", "user defined")
            expect(err.errors.password.properties.message).toBe("Password must contain a digit")

        }

        const passwordDocInvalidChar = new Password({
            password: "Password1 +-",
            userId,
        })
        try {
            await passwordDocInvalidChar.save()
            fail("Should throw error")
        } catch (err) {
            validators.validateMongoValidationError(err, "password", "user defined")
            expect(err.errors.password.properties.message).toBe("Password may only contain certain special chars")
        }
    })
})