import React, {useState} from "react";
import {gql, useMutation} from "@apollo/client";
import {useHistory} from "react-router-dom";

const LOGIN = gql`
    mutation (
        $email: String!
        $password: String!
    ) {
        login(
            email: $email
            password: $password
        )
    }
`;

export default function Login() {
    const [state, setState] = useState({
        username: "",
        password: "",
    });

    const [errored, setErrored] = useState(false);
    const [submitLogin, {data}] = useMutation(LOGIN);
    const history = useHistory();

    function handleChange(event) {
        setState({...state, [event.target.name]: event.target.value})
    }

    function handleSubmit(event) {
        event.preventDefault();

        submitLogin({
            variables: {
                email: state.email,
                password: state.password,
            }
        })
            .then((res) => {
                history.push("/")

                alert(`Log in successful! - Token: ${res.data.login}`);
                console.log(res) //for now, log token //TODO find a way to store token
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
                <label>Email</label>
                <input
                    className="form-control"
                    name="email"
                    type="text"
                    placeholder="Enter Email"
                    autoComplete="email"
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
                TODO integrate remember button behaviour on BE - or store it cached on client?
                */}

            {
                errored &&
                <small
                    id="loginHelpBlock"
                    className="form-text text-muted"
                >
                    Email or Password incorrect
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