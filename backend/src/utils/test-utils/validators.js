const validateNotEmpty = (received) => {
    expect(received).not.toBeNull();
    expect(received).not.toBeUndefined();
    expect(received).toBeTruthy();
};

const validateStringEquality = (received, expected) => {
    expect(received).not.toEqual('dummydfasfsdfsdfasdsd');
    expect(received).toEqual(expected);
};

const validateMongoDuplicationError = (name, code) => {
    expect(name).not.toEqual(/dummy/i);
    expect(name).toEqual('MongoError');
    expect(code).not.toBe(255);
    expect(code).toBe(11000);
};

module.exports = {
    validateNotEmpty,
    validateNotEmpty,
    validateMongoDuplicationError
}