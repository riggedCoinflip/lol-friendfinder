const {User} = require("./user.js");
const validators = require("../middleware/jwt/user.test.validators");
const {dbConnect, dbDrop, dbDisconnect} = require("../utils/test-utils/db-handler");
const testUsers = require("./user.test.data")

beforeAll(async () => dbConnect());
afterEach(async () => dbDrop());
afterAll(async () => dbDisconnect());


//TODO make validations before save: https://stackoverflow.com/questions/11325372/mongoose-odm-change-variables-before-saving
describe("User Model Test Suite", () => {
    it("saves a user successfully with hashed password", async () => {
        const user = new User(testUsers.valid);
        await user.save();

        validators.validateNotEmptyAndTruthy(user);

        validators.validateStringEquality(user.name, testUsers.valid.name);
        validators.validateStringEquality(user.email, testUsers.valid.email);
        //use bcrypt compare to validate password
        expect(await user.comparePassword(testUsers.valid.password)).toBe(true);
        validators.validateStringEquality(user.role, testUsers.valid.role);
        validators.validateStringEquality(user.favouriteColor, testUsers.valid.favouriteColor)
    });

    it("creates new hash on password change", async () => {
        const user = new User(testUsers.valid);

        //save the cleartextPassword as it gets overriden by a hash on save
        const cleartextPassword = user.password;
        await user.save();

        const oldHashedPassword = user.password;
        //login with password possible
        expect(await user.comparePassword(cleartextPassword)).toBe(true);
        expect(user.password).toBe(oldHashedPassword);

        /*
        we need to change the password as our middleware only creates a new hash if the password is changed. ¹
        we then change the password back and save AGAIN to make sure bcrypt works properly -
        due to a different salt, the hash should be different as well.

        ¹ See: UserSchema.pre("save",...)
         */
        user.password = "pwTemp12"
        await user.save();
        user.password = cleartextPassword
        await user.save();

        //login with same password still possible, but due to a different salt we should have a different hash
        expect(await user.comparePassword(cleartextPassword)).toBe(true);
        expect(user.password).not.toBe(oldHashedPassword);
    });

    it("throws MongoDB duplicate error with code 11000", async () => {
        const user = new User(testUsers.valid);
        const user2 = new User(testUsers.valid); //clone user

        await user.save();
        try {
            await user2.save();
        } catch (err) {
            const {name, code} = err;
            validators.validateMongoDuplicationError(name, code);
        }
    });

    it("trims fields on save", async () => {
        const user = new User(testUsers.trim);
        await user.save();

        validators.validateStringEquality(user.name, "trimName");
        validators.validateStringEquality(user.email, "trim@email.com");
    })

    it("lowers the email as setter", async () => {
        const user = new User(testUsers.lowerEmail)
        await user.save();

        validators.validateStringEquality(user.email, "lower_this@email.com");
    })

    it("lowers the favouriteColor as setter", async () => {
        const user = new User(testUsers.lowerFavouriteColor)
        await user.save();

        validators.validateStringEquality(user.favouriteColor, "red");
    })

    it("throws MongoDB ValidationError on String shorter than minlength", async () => {
        const user = new User(testUsers.nameTooShort);
        try {
            await user.save();
        } catch (err) {
            validators.validateMongoValidationError(err, "name", "minlength")
        }
    })

    it("throws MongoDB ValidationError on String longer than maxlength", async () => {
        const user = new User(testUsers.nameTooLong);
        try {
            await user.save();
        } catch (err) {
            validators.validateMongoValidationError(err, "name", "maxlength")
        }
    })

    it("errors on invalid value in enum", async () => {
        const user = new User(testUsers.roleDoesNotExist);

        try {
            await user.save();
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
        //it errors on missing name
        const user = new User(testUsers.requiredFieldNameMissing);
        try {
            await user.save();
        } catch (err) {
            validators.validateMongoValidationError(err, "name", "required")
        }
        //it errors on missing email
        const user2 = new User(testUsers.requiredFieldEmailMissing);
        try {
            await user2.save();
        } catch (err) {
            validators.validateMongoValidationError(err, "email", "required")
        }

        //it errors on missing password
        const user3 = new User(testUsers.requiredFieldPasswordMissing);
        try {
            await user3.save();
        } catch (err) {
            validators.validateMongoValidationError(err, "password", "required")
        }
    })
});