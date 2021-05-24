const faker = require("faker");

const fakeUser = {
    "name": faker.internet.userName(),
    "email":  faker.internet.email(),
    "password": faker.internet.password(),
    "role": "user",
    "favouriteColor": faker.internet.color(),
}

module.exports = fakeUser

