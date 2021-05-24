const {dbConnect, dbDrop, dbDisconnect} = require("../utils/test-utils/db-handler");

beforeAll(async () => dbConnect());
afterEach(async () => dbDrop());
afterAll(async () => dbDisconnect());

describe("User GraphQL Test Suite", () => {
    it("creates a user", async () => {
        fail();
    });
});