/**
 * Test if param is defined, not null and truthy
 * @param {*} received
 */
function validateNotEmptyAndTruthy(received) {
    expect(received).not.toBeNull();
    expect(received).not.toBeUndefined();
    expect(received).toBeTruthy();
}

function validateStringEquality(received, expected) {
    expect(received).toEqual(expected);
}

/**
 * Test if MongoDuplicationError is thrown
 * @param {String} errorName
 * @param {number} code Mongo Error Code
 */
function validateMongoDuplicationError(errorName, code) {
    expect(errorName).toEqual('MongoError');
    expect(code).toBe(11000);
}

/**
 * Test if thrown ValidationError is expected one
 * @param err Error
 * @param {String} expectedErrorField err.errors.path
 * @param {String} violatedValidation err.errors.kind
 */
function validateMongoValidationError(err, expectedErrorField, violatedValidation) {
    const {path, kind} = err.errors[expectedErrorField];
    expect(err.name).toEqual("ValidationError")
    expect(path).toEqual(expectedErrorField);
    expect(kind).toEqual(violatedValidation);
}

module.exports = {
    validateNotEmptyAndTruthy,
    validateStringEquality,
    validateMongoDuplicationError,
    validateMongoValidationError,
}