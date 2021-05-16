const faker = require("faker");
const {User} = require("../src/models/user.js");
const fakeUserdata = require("../src/utils/test-utils/fakeUserdata");
const {
    validateNotEmpty,
    validateStringEquality,
    validateMongoDuplicationError
} = require("../src/utils/test-utils/validators");
const {dbConnect, dbDisconnect} = require("../src/utils/test-utils/db-handler");

beforeAll(async () => dbConnect());
//afterAll(async () => dbDisconnect());

describe('User Model Test Suite', () => {
    test('should validate saving a new student user successfully', async () => {
        faker.seed(23587359)

        const fakeUser = fakeUserdata
        console.log(fakeUser)
        const validStudentUser = new User(fakeUser);
        const savedStudentUser = await validStudentUser.save();

        validateNotEmpty(savedStudentUser);

        validateStringEquality(savedStudentUser.name, fakeUser.name);
        validateStringEquality(savedStudentUser.email, fakeUser.email);
        validateStringEquality(savedStudentUser.password, fakeUserData.password);
        validateStringEquality(savedStudentUser.role, fakeUser.role);
        validateStringEquality(savedStudentUser.favouriteColor, fakeUser.favouriteColor)
    });

    test('should validate MongoError duplicate error with code 11000', async () => {
        faker.seed(283579468)

        const fakeUser = fakeUserdata

        const validStudentUser = new User(fakeUser);
        const validStudentUser2 = new User(fakeUser); //clone fakeUser

        await validStudentUser.save();
        try {
            await validStudentUser2.save();
        } catch (error) {
            const {name, code} = error;
            validateMongoDuplicationError(name, code);
        }
    });
});