const faker = require("faker");
const {User} = require("../src/models/user.js");
const fakeUserdata = require("../src/utils/test-utils/fakeUserdata");
const {
    validateNotEmpty,
    validateStringEquality,
    validateMongoDuplicationError
} = require("../src/utils/test-utils/validators");
const {dbConnect, dbDrop, dbDisconnect} = require("../src/utils/test-utils/db-handler");

const validUser = {
    name: "JohnDoe",
    email: "JohnDoe@email.com",
    password: "Password1",
    role: "user",
    favouriteColor: "red",
}

const validUser2 = {
    name: "MaxMustermann",
    email: "MaxMustermann@muster.de",
    password: "Muster123",
    role: "user",
    favouriteColor: "green",
}


beforeAll(async () => dbConnect());
afterEach(async () => dbDrop())
afterAll(async () => dbDisconnect());

describe('User Model Test Suite', () => {
    test('should validate saving a new student user successfully', async () => {
        const newValidUser = new User(validUser);
        const savedValidUser = await newValidUser.save();

        validateNotEmpty(savedValidUser);

        validateStringEquality(savedValidUser.name, validUser.name);
        validateStringEquality(savedValidUser.email, validUser.email);
        validateStringEquality(savedValidUser.password, validUser.password);
        validateStringEquality(savedValidUser.role, validUser.role);
        validateStringEquality(savedValidUser.favouriteColor, validUser.favouriteColor)
    });

    test('should validate MongoError duplicate error with code 11000', async () => {

        const validStudentUser = new User(validUser);
        const validStudentUser2 = new User(validUser); //clone fakeUser

        await validStudentUser.save();
        try {
            await validStudentUser2.save();
        } catch (error) {
            const {name, code} = error;
            validateMongoDuplicationError(name, code);
        }
    });
});