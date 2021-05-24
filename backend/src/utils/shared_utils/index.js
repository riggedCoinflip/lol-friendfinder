/**
 * bcrypt only uses the first 72 BYTES for its hash. Any char more will produce the same hash.
 * We use UTF8 - meaning if sb uses unicode chars (1̵̤͒Äà🎈🎗😁 etc.) someone might enter a 72 char pw, but 100+ bytes
 * This means that the last characters are irrelevant for the password and can be changed in the password query.
 *
 * We only allow chars that use 1 byte for the password
 */
const [passwordMinLength, passwordMaxLength] = [8, 72];
const passwordAllowedSpecialCharacters = "*.!@#$%^&(){}:;<>,.?~_=|" //special characters that dont need escaping in regex. //OPTIMIZE add more allowed special characters
const [usernameMinLength, usernameMaxLength] = [3, 16];

/**
 * Returns true if the string matches the following rules:
 * allow all alphanumeric characters
 * allow all defined special characters
 * @param {string} str
 * @param {string} specialCharacters
 * @returns {boolean}
 */
function containsOnlyAllowedCharacters(str, specialCharacters = passwordAllowedSpecialCharacters) {
    const regex = new RegExp(`^[a-zA-Z0-9${specialCharacters}]+$`)
    return regex.test(str)
}

/**
 * Returns true if the string only contains alphanumeric characters
 * @param {string} str
 * @returns {boolean}
 */
function isAlphanumeric(str) {
    return containsOnlyAllowedCharacters(str, "")
}

/**
 * Returns true if the string contains at least 1 lower case char
 * @param {string} str
 * @returns {boolean}
 */
function containsLower(str) {
    return str !== str.toUpperCase()
}

/**
 * Returns true if the string contains at least 1 upper case char
 * @param {string} str
 * @returns {boolean}
 */
function containsUpper(str) {
    return str !== str.toLowerCase()
}

/**
 * Returns true if the string contains at least 1 digit
 * @param {string} str
 * @returns {boolean}
 */
function containsDigit(str) {
    return /\d/.test(str)
}

/**
 * Returns true if the string is a (perhaps) valid email address.
 * We rather want to have false positives than false negatives, so we choose a permissive regex.
 * @param {string} str
 * @return {boolean}
 */
function isEmail(str) {
    return /^.+[@].+$/.test(str) //one to unlimited chars, then @, then one to unlimited chars
}

/**
 * Return minLength <= str.length <= maxLength
 * @param {String} str
 * @param {number} minLength
 * @param {number} maxLength
 * @return {boolean}
 */
function isLengthAllowed(str, minLength, maxLength) {
    return (
        str.length >= minLength &&
        str.length <= maxLength
    )
}

/**
 * Return if password passes all checks
 * @param {String} password
 * @param {String} specialCharacters allowed special chars for that password
 * @param {number} minLength
 * @param {number} maxLength
 * @return {boolean} password passed all checks
 */
function passwordValid(password, specialCharacters = passwordAllowedSpecialCharacters, minLength = passwordMinLength, maxLength = passwordMaxLength) {
    //console.log(password, minLength, maxLength)
    return (
        isLengthAllowed(password, minLength, maxLength) &&
        containsUpper(password) &&
        containsLower(password) &&
        containsDigit(password) &&
        containsOnlyAllowedCharacters(password, specialCharacters)
    )
}

/**
 * Return if email passes all checks
 * @param {String} email
 * @return {boolean} email passed all checks
 */
function emailValid(email) {
    return (
        isEmail(email)
    )
}

/**
 * Return if username passes all checks
 * @param {String} username
 * @param {number} minLength
 * @param {number} maxLength
 * @return {boolean}
 */
function usernameValid(username, minLength = usernameMinLength, maxLength = usernameMaxLength) {
    return (
        isLengthAllowed(username, minLength, maxLength)
    )
}

module.exports = {
    passwordMinLength,
    passwordMaxLength,
    passwordAllowedSpecialCharacters,
    containsOnlyAllowedCharacters,
    containsLower,
    containsUpper,
    containsDigit,
    passwordValid,
    usernameMinLength,
    usernameMaxLength,
    isAlphanumeric,
    usernameValid,
    isEmail,
    emailValid
}