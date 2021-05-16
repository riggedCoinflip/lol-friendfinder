import faker from "faker";

export default {
    "name": faker.internet.username(),
    "email":  faker.internet.email(),
    "password": faker.internet.password(),
    "role": "user",
    "favouriteColor": faker.internet.color(),
}

