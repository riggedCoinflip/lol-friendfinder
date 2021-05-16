import {seed as fakerSeed} from "faker"
import {User} from "../src/models/user.js"
import fakeUserdata from "../src/utils/test-utils/fakeUserdata";
import {
    validateNotEmpty,
    validateStringEquality,
    validateMongoDuplicationError
} from "../src/utils/test-utils/validators";
import {dbConnect, dbDisconnect} from "../src/utils/test-utils/db-handler";

beforeAll(async () => dbConnect());
afterAll(async () => dbDisconnect());

describe('User Model Test Suite', () => {
    test('should validate saving a new student user successfully', async () => {
        fakerSeed(598672938)

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
        fakerSeed(3746164)
        expect.assertions(5);

        const fakeUser = fakeUserdata

        const validStudentUser = new User(fakeUser);
        const validStudentUser2 = new User(fakeUser); //clone fakeUser

        await validStudentUser.save();
        try {
            await validStudentUser2.save();
        } catch (error) {
            const { name, code } = error;
            validateMongoDuplicationError(name, code);
        }
    });
});