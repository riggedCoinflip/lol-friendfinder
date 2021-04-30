import React, {useEffect, useState} from "react";
import {gql, useApolloClient} from "@apollo/client";
import {Link} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';



const USER_EXISTS = gql`
    query getAlreadyExists($name: String!, $email: String!) {
        nameExists: userOne(filter: {
            name: $name
        })
        {
            name
        }

        emailExists: userOne(filter: {
            email: $email
        })
        {
            email
        }
    }
`

const USER_CREATE = gql`
    mutation createUser($name: String!, $email: String!, $password: String!) #TODO hash password server side
    {
        userCreateOneHashPassword(
            record: {
                name: $name
                email: $email
                password: $password
            })
        {
            record
            {
                name
                email
                password
            }
        }
    }
`;

/**
 * Returns true if the string matches the following rules:
 * allow all alphanumeric characters
 * allow all defined special characters
 * @param {string} str
 * @param {string} specialChararcters
 * @returns {boolean}
 */
function passwordContainsOnlyAllowedCharacters(str, specialChararcters) {
    const regex = new RegExp(`^[a-zA-Z0-9${specialChararcters}]+$`)
    return regex.test(str)
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
 * validate if form fits the business policies
 * @param {String} email
 * @param {String} password
 * @param {String} password2
 * @param {String} specialChars
 * @return {Object} validation
 */
function validateOnChange(email, password, password2, specialChars) {
    return {
        emailIsValid: isEmail(email),
        
        passwordHasLower: containsLower(password),
        passwordHasUpper: containsUpper(password),
        passwordHasDigit: containsDigit(password),
        passwordCharactersAllowed: passwordContainsOnlyAllowedCharacters(password, specialChars),
        passwordIsSame: password === password2,
    }
}

/**
 * takes a response and checks if the username/email the user wishes to create an account for are available
 * @param {Object} response
 * @param {String} response.data.nameExists.name
 * @param {String} response.data.emailExists.email
 * @return {Object} validation
 */
function validateOnSubmit(response) {
    return {
        usernameAvailable: response.data?.nameExists?.name == null,
        emailAvailable: response.data?.emailExists?.email == null
    }
}

/**
 * A Signup form that allows the user to create an account
 * Submit Button is disabled while there are errors in the input.
 * Takes username, email and password and does a query if that username/email already exists.
 * If it doesnt, the DB is mutated with a new user
 * If it does, an annotation is given to the user prompting him to resubmit after changes
 * @return {JSX.Element}
 * @constructor
 */
export default function Signup() {
    const [pwMinLength, pwMaxLength] = [8, 72];
    const pwAllowedSpecialCharacters = "*.!@#$%^&(){}:;<>,.?~_=|" //special characters that dont need escaping in regex. //OPTIMIZE add more allowed special characters

    //OPTIMIZE write function that blocks the user from writing not allowed characters in the first place (currently only checking against)

    const client = useApolloClient();
    const [state, setState] = useState({
        email: "",
        username: "",
        password: "",
        password2: "",
        passwordInvisible: true,
    });
    const [validation, setValidation] = useState({
        emailIsValid: false,

        passwordHasLower: false,
        passwordHasUpper: false,
        passwordHasDigit: false,
        passwordCharactersAllowed: false,
        passwordIsSame: false,
    });
    const [validationQuery, setValidationQuery] = useState({
        emailAvailable: null,
        usernameAvailable: null,
    });


    useEffect(() => {
        console.table(state)
        setValidation(validateOnChange(state.email, state.password, state.password2, pwAllowedSpecialCharacters))
    }, [state]);

    useEffect(() => {
        console.log(validation)
    }, [validation])

    useEffect(() => {
        console.log(validationQuery)
    }, [validationQuery])

    /**
     * update the corresponding state field
     * @param event
     */
    function handleChange(event) {
        setState({...state, [event.target.name]: event.target.value})
    }

    /**
     * call handleChange
     * invalidate the validationQuery for username
     * @param event
     */
    function handleUsernameChange(event) {
        handleChange(event)

        const {usernameAvailable, ...newValidationQuery} = validationQuery //use destructuring to remove key
        setValidationQuery(newValidationQuery)
    }

    /**
     * call handleChange
     * invalidate the validationQuery for email
     * @param event
     */
    function handleEmailChange(event) {
        handleChange(event)

        const {emailAvailable, ...newValidationQuery} = validationQuery //use destructuring to remove key
        setValidationQuery(newValidationQuery)
    }

    /**
     * If the user submits a form, look if the chosen username/email are not already in use.
     * If they are already in use, show new errors.
     * Else, create the new account
     * @param event
     */
    function handleSubmit(event) {
        console.table(state)
        event.preventDefault();


        // Request if the username/email exists already, if available, create the account
        client
            .query({
                query: USER_EXISTS,
                variables: {
                    name: state.username,
                    email: state.email,
                }
            })
            .then(response => {
                const newValidationQuery = validateOnSubmit(response)
                setValidationQuery(newValidationQuery)

                if (Object.values(newValidationQuery).every(item => item === true)) { //if no errors
                    createUser(state.username, state.email, state.password)
                        .then((response) => {
                            console.log(`User created: ${response.data.userCreateOne.record}`)
                        })
                        .catch((err) => {
                            console.error(`Error in createUser: ${err}`)
                        })
                }
            })
            .catch(err => {
                    console.log("Something went wrong", err)
                }
            );
    }


    /**
     * TODO move this to backend?
     * Create a user on the DB
     * @param {String} username
     * @param {String} email
     * @param {String} password
     * @return {Promise}
     */
    function createUser(username, email, password) { //TODO hash PW
        return client
            .mutate({
                mutation: USER_CREATE,
                variables: {
                    name: username,
                    email: email,
                    password: password
                }
            })
    }

    function changePasswordVisibility() {
        setState({...state, passwordInvisible: !state.passwordInvisible})
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Email address</label>
                    <input
                        className="form-control"
                        name="email"
                        type="email"
                        placeholder="Enter email"
                        autoComplete="email"
                        required={true}
                        onChange={handleEmailChange}
                    />
                    <small id="emailHelpBlock" className="form-text text-muted">
                        <ul>
                            <li className={validation.emailIsValid ? "text-success" : "text-danger"}>Valid Email</li>
                            {validationQuery.emailAvailable === false &&
                            <li className="text-danger">Email already in use</li>
                            }
                        </ul>
                    </small>
                </div>

                <div className="form-group">
                    <label>Name</label>
                    <input
                        className="form-control"
                        name="username"
                        type="text"
                        placeholder="Enter username"
                        autoComplete="username"
                        required={true}
                        minLength="3"
                        maxLength="16"
                        onChange={handleUsernameChange}
                    />
                    <small id="usernameHelpBlock" className="form-text text-muted">
                        <ul>
                            <li className={state.username.length >= 3 ? "text-success" : "text-danger"}>3-16 Characters</li>
                            {validationQuery.usernameAvailable === false &&
                            <li className="text-danger">Username already in use</li>
                            }
                        </ul>
                    </small>
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <div className="input-group">
                        <input
                            name="password"
                            type={state.passwordInvisible ? "password" : "text"}
                            className="form-control"
                            placeholder="Enter password"
                            autoComplete="new-password"
                            required={true}
                            minLength={pwMinLength}
                            maxLength={pwMaxLength}
                            onChange={handleChange}
                        />
                        <button type="button" className="btn btn-outline-secondary" onClick={changePasswordVisibility}>
                            <FontAwesomeIcon icon={state.passwordInvisible ? faEyeSlash : faEye} />
                        </button>
                    </div>
                    <small id="passwordHelpBlock" className="form-text text-muted">
                        <ul>
                            <li className={state.password.length >= 8 ? "text-success" : "text-danger"}>At least 8 characters</li>
                            <li className={validation.passwordHasUpper ? "text-success" : "text-danger"}>At least 1 uppercase letter</li>
                            <li className={validation.passwordHasLower ? "text-success" : "text-danger"}>At least 1 lowercase letter</li>
                            <li className={validation.passwordHasDigit ? "text-success" : "text-danger"}>At least 1 digit</li>
                            <li className={validation.passwordCharactersAllowed ? "text-success" : "text-danger"}>No spaces, only Alphanumeric Characters or one of these special characters: {pwAllowedSpecialCharacters}</li>
                        </ul>
                    </small>
                </div>

                <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                        name="password2"
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        autoComplete="new-password"
                        required={true}
                        minLength={pwMinLength}
                        maxLength={pwMaxLength}
                        onChange={handleChange}
                    />
                    <small id="password2HelpBlock" className="form-text text-muted">
                        <ul>
                            <li className={validation.passwordIsSame ? "text-success" : "text-danger"}>Has to be equal to password</li>
                        </ul>
                    </small>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={!Object.values({...validation, ...validationQuery}).every(v => v === true)}
                >
                    Sign Up
                </button>
                <p className="forgot-password text-right">
                    Already registered? <Link to="/login">Log in</Link>
                </p>
            </form>
        </div>
    );
}