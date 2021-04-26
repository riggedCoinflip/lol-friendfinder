import React, {useEffect, useState} from "react";
import {gql, useApolloClient} from "@apollo/client";
import {Link} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'



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
        userCreateOne(
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

/** TODO write function
 * Returns true if the string only contains UTF8-1Byte aka US-ASCII Characters
 * @param str
 * @returns {boolean}
 */
function isAscii(str) {

}

/**
 * Returns true if the string matches the password rules
 * @param str
 * @returns {boolean}
 */
function containsOnlyAllowedCharacters(str) {
    if (!isAscii(str)) return false;
    else {
        //TODO
    }
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
 * validate if form fits the business policies:
 * * contains at least 1 lowercase character
 * * contains at least 1 uppercase character
 * * contains at least 1 digit
 * * password and password 2 (confirmation) have to be the same
 * @return {Object}
 */
function validateOnChange(password, password2) {
    let errors = {}

    if (!containsLower(password)) errors.passwordHasLower = "Password requires at least 1 lowercase letter";
    if (!containsUpper(password)) errors.passwordHasUpper = "Password requires at least 1 uppercase letter";
    if (!containsDigit(password)) errors.passwordHasDigit = "Password requires at least 1 number";
    if (!containsOnlyAllowedCharacters(password)) errors.passwordCharactersAllowed = "Password contains unallowed characters.";
    if (password !== password2) errors.passwordIsSame = "Password confirmation has to match the password";

    return errors
}

/**
 * TODO
 * this validates if the form is correct on submit.
 * If the form is syntactically correct (password business rules etc.) it looks if the Username/Password are allowed
 * @param {Object} response
 * @param {String} response.data.nameExists.name
 * @param {String} response.data.emailExists.email
 * @return {Object}
 */
function validateOnSubmit(response) {
    const errors = {}

    const username_available = response.data?.nameExists?.name == null
    const email_available = response.data?.emailExists?.email == null

    if (!username_available) errors.usernameAvailable = "A User with that name exists already";
    if (!email_available) errors.emailAvailable = "Email is already in use";

    return errors
}

/**
 * TODO
 * @return {JSX.Element}
 * @constructor
 */
export default function Signup() {
    const [pw_minLength, pw_maxLength] = [8, 72];

    //TODO write function that blocks the user from writing not allowed characters

    const client = useApolloClient();
    const [state, setState] = useState({
        email: "",
        username: "",
        password: "",
        password2: "",
        passwordInvisible: true,
    });
    const [errors, setErrors] = useState({});
    const [errorsQuery, setErrorsQuery] = useState({});


    useEffect(() => {
        console.table(state)
        //OPTIMIZE calling validate every time the state changes might be too expensive. Bottleneck will highly likely be the user input itself anyway,
        setErrors(validateOnChange(state.password, state.password2))
    }, [state]);

    useEffect(() => {
        console.log(errors)
    }, [errors])

    useEffect(() => {
        console.log(errorsQuery)
    }, [errorsQuery])

    /**
     * update the corresponding state field
     * @param event
     */
    function handleChange(event) {
        setState({...state, [event.target.name]: event.target.value})
    }

    /**
     * call handleChange
     * invalidate the errorsQuery for username
     * @param event
     */
    function handleUsernameChange(event) {
        handleChange(event)

        const {usernameAvailable, ...newErrorsQuery} = errorsQuery //use destructuring to remove key
        setErrorsQuery(newErrorsQuery)
    }

    /**
     * call handleChange
     * invalidate the errorsQuery for email
     * @param event
     */
    function handleEmailChange(event) {
        handleChange(event)

        const {emailAvailable, ...newErrorsQuery} = errorsQuery //use destructuring to remove key
        setErrorsQuery(newErrorsQuery)
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
                const newErrorsQuery = validateOnSubmit(response)
                setErrorsQuery(newErrorsQuery)

                if (Object.keys(newErrorsQuery).length === 0) { //if no errors
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
                    <small id="passwordHelpBlock" className="form-text text-muted">
                        <ul>
                            {errorsQuery.emailAvailable &&
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
                    <small id="passwordHelpBlock" className="form-text text-muted">
                        <ul>
                            <li className={state.username.length >= 3 ? "text-success" : "text-danger"}>3-16 Characters</li>
                            {errorsQuery.usernameAvailable &&
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
                            minLength={pw_minLength}
                            maxLength={pw_maxLength}
                            onChange={handleChange}
                        />
                        <button type="button" className="btn btn-outline-secondary" onClick={changePasswordVisibility}>
                            <FontAwesomeIcon icon={state.passwordInvisible ? faEyeSlash : faEye} />
                        </button>
                    </div>
                    <small id="passwordHelpBlock" className="form-text text-muted">
                        <ul>
                            <li className={state.password.length >= 8 ? "text-success" : "text-danger"}>At least 8 characters</li>
                            <li className={!errors.passwordHasUpper ? "text-success" : "text-danger"}>At least 1 uppercase letter</li>
                            <li className={!errors.passwordHasLower ? "text-success" : "text-danger"}>At least 1 lowercase letter</li>
                            <li className={!errors.passwordHasDigit ? "text-success" : "text-danger"}>At least 1 digit</li>
                            <li>No spaces, emojis or special characters</li> {/*TODO enforce*/}
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
                        minLength={pw_minLength}
                        maxLength={pw_maxLength}
                        onChange={handleChange}
                    />
                    <small id="passwordHelpBlock" className="form-text text-muted">
                        <ul>
                            <li className={!errors.passwordIsSame ? "text-success" : "text-danger"}>Has to be equal to password</li>
                        </ul>
                    </small>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={Object.keys({...errors, ...errorsQuery}).length !== 0}
                >
                    Sign Up
                </button>
                <p className="forgot-password text-right">
                    Already registered <Link to="/login">sign in?</Link>
                </p>
            </form>
            <ul>
                {
                    //TODO integrate this as part of the form
                    Object.entries({...errors, ...errorsQuery}).map(([key, value]) =>
                        <li key={key}>
                            {value}
                        </li>
                    )}
            </ul>
        </div>
    );
}