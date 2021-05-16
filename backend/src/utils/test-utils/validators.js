function validateNotEmpty (received) {
    expect(received).not.toBeNull();
    expect(received).not.toBeUndefined();
    expect(received).toBeTruthy();
};

function validateStringEquality (received, expected) {
    expect(received).toEqual(expected);
};

function validateMongoDuplicationError (name, code) {
    expect(name).toEqual('MongoError');
    expect(code).toBe(11000);
};

module.exports = {
    validateNotEmpty,
    validateStringEquality,
    validateMongoDuplicationError
}