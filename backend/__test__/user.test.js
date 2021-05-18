const {User} = require("../src/models/user.js");
const validators = require("../src/utils/test-utils/validators");
const {dbConnect, dbDrop, dbDisconnect} = require("../src/utils/test-utils/db-handler");
const testUsers = require("./testusers")

beforeAll(async () => dbConnect());
afterEach(async () => dbDrop())
afterAll(async () => dbDisconnect());


//TODO make validations before save: https://stackoverflow.com/questions/11325372/mongoose-odm-change-variables-before-saving
describe("User Model Test Suite", () => {
    it("saves a user successfully", async () => {
        const user = new User(testUsers.valid);
        const savedUser = await user.save();

        validators.validateNotEmpty(savedUser);

        validators.validateStringEquality(savedUser.name, testUsers.valid.name);
        validators.validateStringEquality(savedUser.email, testUsers.valid.email);
        validators.validateStringEquality(savedUser.password, testUsers.valid.password);
        validators.validateStringEquality(savedUser.role, testUsers.valid.role);
        validators.validateStringEquality(savedUser.favouriteColor, testUsers.valid.favouriteColor)
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
        const savedUser = await user.save();

        validators.validateNotEmpty(savedUser);

        validators.validateStringEquality(savedUser.name, "trimName");
        validators.validateStringEquality(savedUser.email, "trim@email.com");
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

    test("Validate role enum", async () => {
        fail()
    })

    test("Validate color default", async () => {
        fail()
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