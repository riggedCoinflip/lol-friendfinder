export const [passwordMinLength, passwordMaxLength] = [8, 72];
export const [usernameMinLength, usernameMaxLength] = [3, 16];

/**
 * Returns true if the string matches the following rules:
 * allow all alphanumeric characters
 * allow all defined special characters
 * @param {string} str
 * @param {string} specialCharacters
 * @returns {boolean}
 */
export function passwordContainsOnlyAllowedCharacters(str, specialCharacters) {
    const regex = new RegExp(`^[a-zA-Z0-9${specialCharacters}]+$`)
    return regex.test(str)
}

/**
 * Returns true if the string contains at least 1 lower case char
 * @param {string} str
 * @returns {boolean}
 */
export function containsLower(str) {
    return str !== str.toUpperCase()
}

/**
 * Returns true if the string contains at least 1 upper case char
 * @param {string} str
 * @returns {boolean}
 */
export function containsUpper(str) {
    return str !== str.toLowerCase()
}

/**
 * Returns true if the string contains at least 1 digit
 * @param {string} str
 * @returns {boolean}
 */
export function containsDigit(str) {
    return /\d/.test(str)
}

/**
 * Returns true if the string is a (perhaps) valid email address.
 * We rather want to have false positives than false negatives, so we choose a permissive regex.
 * @param {string} str
 * @return {boolean}
 */
export function isEmail(str) {
    return /^.+[@].+$/.test(str) //one to unlimited chars, then @, then one to unlimited chars
}




