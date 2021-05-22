const {dbConnect, dbDisconnectAndWipe} = require("../utils/test-utils/db-handler");
const {User} = require("../models/user.js");
const testUsers = require("../models/user.test.data")

const util = require("./user.test.queries")
const {createTestClient} = require("apollo-server-integration-testing");

const createApollo = require("../utils/createApolloServer")
const {query, mutate, setOptions} = createTestClient({apolloServer: createApollo()});


describe("User GraphQL Test Suite", () => {
    beforeAll(async () => dbConnect());
    beforeEach(async () => {
        //create test users to have a user and admin login possible at all times
        await new User(testUsers.validNoDefaults).save();
        await new User(testUsers.admin).save();
    })
    afterEach(async () => {
        await User.deleteMany()
    });
    afterAll(async () => dbDisconnectAndWipe());

    it("creates a user on signup", async () => {
        const signupResult = await mutate(
            util.SIGNUP, {
                variables: testUsers.valid
            });

        expect(signupResult).toStrictEqual({
            data: {
                signup: {
                    record: {
                        name: "validUser",
                        email: "valid@email.com",
                    }
                }
            }
        })
    });

    it("errors on signup if the mutation is faulty", async () => {
        const nameTooShort = await mutate(
            util.SIGNUP, {
                variables: testUsers.nameTooShort
            });
        expect(nameTooShort.data.signup).toBeNull()
        expect(nameTooShort.errors[0].message).toBe("User validation failed: name: Path `name` (`ab`) is shorter than the minimum allowed length (3).")

        const nameTooLong = await mutate(
            util.SIGNUP, {
                variables: testUsers.nameTooLong
            });
        expect(nameTooLong.data.signup).toBeNull()
        expect(nameTooLong.errors[0].message).toBe("User validation failed: name: Path `name` (`omfgMyNameWontFit`) is longer than the maximum allowed length (16).")

        const nameNotAlphanumeric = testUsers.nameNotAlphanumeric
        for (const e of Object.keys(nameNotAlphanumeric)) {
            const invalidName = await mutate(
                util.SIGNUP, {
                    variables: nameNotAlphanumeric[e]
                });
            expect(invalidName.data.signup).toBeNull()
            expect(invalidName.errors[0].message).toBe("User validation failed: name: Username may only contain alphanumeric chars")
        }

        const emailInvalid = await mutate(
            util.SIGNUP, {
                variables: testUsers.emailInvalid
            });
        expect(emailInvalid.data.signup).toBeNull()
        expect(emailInvalid.errors[0].message).toBe("User validation failed: email: Not a valid Email")

        const pwTooShort = await mutate(
            util.SIGNUP, {
                variables: testUsers.invalidPassword.tooShort
            });
        expect(pwTooShort.data.signup).toBeNull()
        expect(pwTooShort.errors[0].message).toBe("User validation failed: password: Path `password` (`Pw12345`) is shorter than the minimum allowed length (8).")

        const pwTooLong = await mutate(
            util.SIGNUP, {
                variables: testUsers.invalidPassword.tooLong
            });
        expect(pwTooLong.data.signup).toBeNull()
        expect(pwTooLong.errors[0].message).toBe("User validation failed: password: Path `password` (`Password91123456789212345678931234567894123456789512345678961234567897123`) is longer than the maximum allowed length (72).")

        const pwNoUppercase = await mutate(
            util.SIGNUP, {
                variables: testUsers.invalidPassword.noUppercase
            });
        expect(pwNoUppercase.data.signup).toBeNull()
        expect(pwNoUppercase.errors[0].message).toBe("User validation failed: password: Password must contain uppercase letter")

        const pwNoLowercase = await mutate(
            util.SIGNUP, {
                variables: testUsers.invalidPassword.noLowercase
            });
        expect(pwNoLowercase.data.signup).toBeNull()
        expect(pwNoLowercase.errors[0].message).toBe("User validation failed: password: Password must contain lowercase letter")

        const pwNoDigit = await mutate(
            util.SIGNUP, {
                variables: testUsers.invalidPassword.noDigit
            });
        expect(pwNoDigit.data.signup).toBeNull()
        expect(pwNoDigit.errors[0].message).toBe("User validation failed: password: Password must contain a digit")

        const pwInvalidChar = await mutate(
            util.SIGNUP, {
                variables: testUsers.invalidPassword.invalidChar
            });
        expect(pwInvalidChar.data.signup).toBeNull()
        expect(pwInvalidChar.errors[0].message).toBe("User validation failed: password: Password may only contain certain special chars")
    })
});
