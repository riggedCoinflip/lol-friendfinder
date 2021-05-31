import React, {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {gql, useApolloClient} from "@apollo/client";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons'
import * as validateSignup from "../shared/util/validateSignup"


//TODO create check for email (missing GQL endpoint for that)
/*
const USER_EXISTS = gql`
    query user_exists($name: String!) {
        nameExists: user(filter: {
            name: $name
        }) {
            name
        }
    }
`
*/

const USER_CREATE = gql`
    mutation signup($name: String!, $email: String!, $password: String!) #TODO hash password server side
    {
        signup(
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
 * validate if form fits the business policies
 * @param {String} email
 * @param {String} password
 * @param {String} password2
 * @param {String} specialChars
 * @return {Object} validation
 */
function validateOnChange(email, password, password2, specialChars) {
    return {
        emailIsValid: validateSignup.emailValid(email),
        passwordHasLower: validateSignup.containsLower(password),
        passwordHasUpper: validateSignup.containsUpper(password),
        passwordHasDigit: validateSignup.containsDigit(password),
        passwordCharactersAllowed: validateSignup.containsOnlyAllowedCharacters(password, specialChars),
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
/*
function validateOnSubmit(response) {
    return {
        usernameAvailable: response.data?.nameExists?.name == null,
        emailAvailable: true,
    }
    //TODO create user check
    
    return {
        usernameAvailable: response.data?.nameExists?.name == null,
        emailAvailable: response.data?.emailExists?.email == null
    }
     
}
*/
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
    //OPTIMIZE write function that blocks the user from writing not allowed characters in the first place (currently only checking against)
    const client = useApolloClient();
    const history = useHistory();
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
        setValidation(validateOnChange(state.email, state.password, state.password2, validateSignup.passwordAllowedSpecialCharacters))
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
        
        createUser
            (state.username, state.email, state.password)
              .then(res => {
                history.push("/login")
                alert('Account creation successful 🔥!');
                    console.log("state:", state)
             })
            .catch(err => {
                alert('Error: Name or E-Mail are already given 😓');
                console.error(`Error in createUser: ${err}`);
               
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
        <form onSubmit={handleSubmit}>

            <div className="form-group">
                <label>Email address</label>
                <input
                    id="email-input"
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
                    id="username-input"
                    className="form-control"
                    name="username"
                    type="text"
                    placeholder="Enter username"
                    autoComplete="username"
                    required={true}
                    minLength={validateSignup.usernameMinLength}
                    maxLength={validateSignup.usernameMaxLength}
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
                        id="password-input"
                        name="password"
                        type={state.passwordInvisible ? "password" : "text"}
                        className="form-control"
                        placeholder="Enter password"
                        autoComplete="new-password"
                        required={true}
                        minLength={validateSignup.passwordMinLength}
                        maxLength={validateSignup.passwordMaxLength}
                        onChange={handleChange}
                    />
                    <button type="button" className="btn btn-outline-secondary" onClick={changePasswordVisibility}>
                        <FontAwesomeIcon icon={state.passwordInvisible ? faEyeSlash : faEye}/>
                    </button>
                </div>
                <small id="passwordHelpBlock" className="form-text text-muted">
                    <ul>
                        <li className={state.password.length >= 8 ? "text-success" : "text-danger"}>At least 8
                            characters
                        </li>
                        <li className={validation.passwordHasUpper ? "text-success" : "text-danger"}>At least 1
                            uppercase letter
                        </li>
                        <li className={validation.passwordHasLower ? "text-success" : "text-danger"}>At least 1
                            lowercase letter
                        </li>
                        <li className={validation.passwordHasDigit ? "text-success" : "text-danger"}>At least 1 digit
                        </li>
                        <li className={validation.passwordCharactersAllowed ? "text-success" : "text-danger"}>No spaces,
                            only Alphanumeric Characters or one of these special
                            characters: {validateSignup.passwordAllowedSpecialCharacters}</li>
                    </ul>
                </small>
            </div>

            <div className="form-group">
                <label>Confirm Password</label>
                <input
                    id="password2-input"
                    name="password2"
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    autoComplete="new-password"
                    required={true}
                    minLength={validateSignup.passwordMinLength}
                    maxLength={validateSignup.passwordMaxLength}
                    onChange={handleChange}
                />
                <small id="password2HelpBlock" className="form-text text-muted">
                    <ul>
                        <li className={validation.passwordIsSame ? "text-success" : "text-danger"}>Has to be equal to
                            password
                        </li>
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
    );
}