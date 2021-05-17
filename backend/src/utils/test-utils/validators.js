function validateNotEmpty(received) {
    expect(received).not.toBeNull();
    expect(received).not.toBeUndefined();
    expect(received).toBeTruthy();
};

function validateStringEquality(received, expected) {
    expect(received).toEqual(expected);
};

function validateMongoDuplicationError(name, code) {
    expect(name).toEqual('MongoError');
    expect(code).toBe(11000);
};

function validateMongoValidationError(err, expectedErrorField, violatedValidation) {
    const {path, kind} = err.errors[expectedErrorField];
    expect(err.name).toEqual("ValidationError")
    expect(path).toEqual(expectedErrorField);
    expect(kind).toEqual(violatedValidation);
}

module.exports = {
    validateNotEmpty,
    validateStringEquality,
    validateMongoDuplicationError,
    validateMongoValidationError,
}