const {User} = require("./user.js");
const validators = require("./user.test.validators");
const {dbConnect, dbClean, dbDisconnectAndWipe} = require("../utils/test-utils/db-handler");
const testUsers = require("./user.test.data")

describe("User Model Test Suite", () => {
    beforeAll(async () => dbConnect());
    afterEach(async () => {
        await User.deleteMany()
    });
    afterAll(async () => dbDisconnectAndWipe());

    it("saves a user successfully with hashed password", async () => {
        const user = new User(testUsers.validNoDefaults);
        await user.save();

        validators.validateNotEmptyAndTruthy(user);

        validators.validateStringEquality(user.name, testUsers.validNoDefaults.name);
        validators.validateStringEquality(user.email, testUsers.validNoDefaults.email);
        //use bcrypt compare to validate password
        expect(await user.comparePassword(testUsers.validNoDefaults.password)).toBe(true);
        validators.validateStringEquality(user.role, testUsers.validNoDefaults.role);
        validators.validateStringEquality(user.favouriteColor, testUsers.validNoDefaults.favouriteColor)
    })

    it("throws MongoDB duplicate error with code 11000", async () => {
        const user = new User(testUsers.validNoDefaults);
        const user2 = new User(testUsers.validNoDefaults); //clone user

        await user.save();

        try {
            await user2.save();
            fail("Should throw error");
        } catch (err) {
            const {name, code} = err;
            validators.validateMongoDuplicationError(name, code);
        }
    })

    it("creates new hash on password change", async () => {
        const user = new User(testUsers.validNoDefaults);

        //save the cleartextPassword as it gets overridden by a hash on save
        const cleartextPassword = user.password;
        await user.save();

        const oldHashedPassword = user.password;
        //login with password possible
        expect(await user.comparePassword(cleartextPassword)).toBe(true);
        expect(user.password).toBe(oldHashedPassword);

        /**
         * we need to change the password as our middleware only creates a new hash if the password is changed. ¹
         * we then change the password back and save AGAIN to make sure bcrypt works properly -
         * due to a different salt, the hash should be different as well.
         *
         * ¹ See: UserSchema.pre("save",...)
         */
        user.password = "pwTemp12"
        await user.save();
        user.password = cleartextPassword
        await user.save();

        //login with same password still possible, but due to a different salt we should have a different hash
        expect(await user.comparePassword(cleartextPassword)).toBe(true);
        expect(user.password).not.toBe(oldHashedPassword);
    })

    it("trims fields on save", async () => {
        const user = new User(testUsers.trim);
        await user.save();

        validators.validateStringEquality(user.name, "trimName");
        validators.validateStringEquality(user.email, "trim@email.com");
    })

    it("only allows valid email addresses", async () => {
        const user = new User(testUsers.emailInvalid)
        try {
            await user.save();
            fail("Should throw error");
        } catch(err) {
            validators.validateMongoValidationError(err, "email", "regexp")
        }
    })

    it("lowers the email on save", async () => {
        const user = new User(testUsers.lowerEmail)
        await user.save();

        validators.validateStringEquality(user.email, "lower_this@email.com");
    })

    it("lowers the favouriteColor on save", async () => {
        const user = new User(testUsers.lowerFavouriteColor)
        await user.save();

        validators.validateStringEquality(user.favouriteColor, "red");
    })

    it("throws MongoDB ValidationError on String shorter than minlength", async () => {
        const user = new User(testUsers.nameTooShort);
        try {
            await user.save();
            fail("Should throw error");
        } catch (err) {
            validators.validateMongoValidationError(err, "name", "minlength")
        }
    })

    it("throws MongoDB ValidationError on String longer than maxlength", async () => {
        const user = new User(testUsers.nameTooLong);
        try {
            await user.save();
            fail("Should throw error");
        } catch (err) {
            validators.validateMongoValidationError(err, "name", "maxlength")
        }
    })

    it("errors on invalid value in enum", async () => {
        const user = new User(testUsers.roleDoesNotExist);

        try {
            await user.save();
            fail("Should throw error");
        } catch (err) {
            validators.validateMongoValidationError(err, "role", "enum")
        }
    })

    test("Validate color default", async () => {
        const user = new User(testUsers.useDefaultColor);
        await user.save();

        validators.validateNotEmptyAndTruthy(user);

        validators.validateStringEquality(user.favouriteColor, "blue")
    })

    it("errors on missing fields", async () => {
        //OPTIMIZE code duplication
        const user = new User(testUsers.requiredFieldNameMissing);
        try {
            await user.save();
            fail("Should throw error");
        } catch (err) {
            validators.validateMongoValidationError(err, "name", "required")
        }

        const user2 = new User(testUsers.requiredFieldEmailMissing);
        try {
            await user2.save();
            fail("Should throw error");
        } catch (err) {
            validators.validateMongoValidationError(err, "email", "required")
        }

        const user3 = new User(testUsers.requiredFieldPasswordMissing);
        try {
            await user3.save();
            fail("Should throw error");
        } catch (err) {
            validators.validateMongoValidationError(err, "password", "required")
        }
    })

    it("allows only ascii names", async () => {
        //with changing requirements this test shall change
        //we might want to allow asian chars once we have asian customers
        const toTest = testUsers.nameNotAlphanumeric

        for (const e of Object.keys(toTest)) {
            const user = new User(toTest[e])
            try {
                await user.save();
                fail("Should throw error");
            } catch (err) {
                validators.validateMongoValidationError(err, "name", "user defined")
                //console.error(err)
            }
        }
    })


    it("errors on invalid passwords", async () => {
        //OPTIMIZE code duplication
        const pwInvalid = testUsers.invalidPassword

        const user = new User(pwInvalid.tooShort)
        try {
            await user.save();
            fail("Should throw error");
        } catch (err) {
            validators.validateMongoValidationError(err, "password", "minlength")
        }

        const user2 = new User(pwInvalid.tooLong)
        try {
            await user2.save();
            fail("Should throw error");
        } catch (err) {
            validators.validateMongoValidationError(err, "password", "maxlength")
        }

        const user3 = new User(pwInvalid.noUppercase)
        try {
            await user3.save();
            fail("Should throw error");
        } catch (err) {
            validators.validateMongoValidationError(err, "password", "user defined")
            expect(err.errors.password.properties.message).toBe("Password must contain uppercase letter")
        }

        const user4 = new User(pwInvalid.noLowercase)
        try {
            await user4.save();
            fail("Should throw error");
        } catch (err) {
            validators.validateMongoValidationError(err, "password", "user defined")
            expect(err.errors.password.properties.message).toBe("Password must contain lowercase letter")
        }

        const user5 = new User(pwInvalid.noDigit)
        try {
            await user5.save();
            fail("Should throw error");
        } catch (err) {
            validators.validateMongoValidationError(err, "password", "user defined")
            expect(err.errors.password.properties.message).toBe("Password must contain a digit")
        }

        const user6 = new User(pwInvalid.invalidChar)
        try {
            await user6.save();
            fail("Should throw error");
        } catch (err) {
            validators.validateMongoValidationError(err, "password", "user defined")
            expect(err.errors.password.properties.message).toBe("Password may only contain certain special chars")
        }
    })

    it("disallows users with different capitalization", async () => {
        const userLower = new User(testUsers.usernameDifferentCapitalization.lower)
        const userUpper = new User(testUsers.usernameDifferentCapitalization.upper)

        await userLower.save()
        try {
            await userUpper.save();
            fail("Should throw error");
        } catch (err) {
            const {name, code} = err;
            validators.validateMongoDuplicationError(name, code);
        }
    })

    test("if the normalized username is readonly", async () => {
        const user = new User(testUsers.validNoDefaults)
        user.nameNormalized = "upsert on a readonly field should error" //upsert: update or insert

        try {
            await user.save()
            fail("Should throw error");
        } catch (err) {
            expect(err.message).toBe("nameNormalized is read only!")
        }
    })

    it("doesnt bcrypt the password if another field is updated", async () => {
        //BUG this randomly errors sometimes - on a rerun it then works again...
        const user = new User(testUsers.validNoDefaults)

        await user.save()
        const oldHashedPassword = user.password

        //change other field
        user.favouriteColor = "black"
        await user.save()
        const newHashedPassword = user.password

        expect(newHashedPassword).toBe(oldHashedPassword)
    })
});