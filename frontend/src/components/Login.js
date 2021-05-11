import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";

//TODO use mutation query
const LOGIN_USER = gql`
    query passwordCorrect($name: String!, $password: String!){
        userOne(filter: {
            name: $name
            password: $password
        }) 
        {
            name,
        }
    }
`

export default function Login() {
    const [state, setState] = useState({
        username: "",
        password: "",
    });
/* ToDo is this a better alternative?
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    */

    const [errored, setErrored] = useState(false);
    const [submitLogin, {data}] = useMutation(LOGIN_USER);
    const history = useHistory();

    function handleChange(event) {
        setState({...state, [event.target.name]: event.target.value})
    }

    function handleSubmit(event) {
        event.preventDefault();

        submitLogin({
            variables: {
                username: this.state.username,
                password: this.state.password,
            }
        })
            .then((res) => {
                //TODO do something with JIT token in response
                history.push("/")
                alert('Log in successful!');
            })
            .catch(() => {
                setErrored(true)
            })
    }

    return (
        <form onSubmit={handleSubmit}>
            <h3>Log In</h3>

            <div className="form-group">
                {/*TODO add min/maxlength validation from shared/utils. This will reduce server load as less (100% false) forms will be submitted*/}
                <label>Name</label>
                <input
                    className="form-control"
                    name="username"
                    type="text"
                    placeholder="Enter username"
                    autoComplete="username"
                    required={true}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Password</label>
                {/*TODO add min/maxlength validation from shared/utils*/}
                <input
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Enter password"
                    autoComplete="password"
                    required={true}
                    onChange={handleChange}
                />
            </div>
            {/*
                <div className="form-group">
                    <div className="custom-control custom-checkbox">
                        <input type="checkbox" className="custom-control-input" id="customCheck1" />
                        <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                    </div>
                </div>
                TODO integrate remember button behaviour on BE
                */}

            {
                errored &&
                <small
                    id="loginHelpBlock"
                    className="form-text text-muted"
                >
                    Username or Password incorrect
                </small>
            }

            <button
                type="submit"
                className="btn btn-primary btn-block"
            >
                Submit
            </button>
            {/*
            <p className="forgot-password text-right">
                Forgot <a href="#">password?</a>
            </p>
            TODO use proper css classes, have link to password forgot
            */}

        </form>
    );
}