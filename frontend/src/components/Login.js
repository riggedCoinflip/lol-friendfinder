import React, {useState,useEffect} from "react";
import {gql, useQuery,  useApolloClient} from "@apollo/client";
import {useHistory} from "react-router-dom";
import * as Constants from '../constants'

const LOGIN = gql`
    query login($email: String!, $password: String!)
    {
        login(
            email: $email
            password: $password
        )
    }
`;



export default function Login() {
    const client = useApolloClient();
    const session = localStorage.getItem("SECREToken")
  


    const [state, setState] = useState({
        username: "",
        password: "",
    });

    const [errored, setErrored] = useState(false);
   

    function handleSubmit(event) {
        console.table(state)
        event.preventDefault();
    
        //Calling the function
        Submit(state.email, state.password). 
                    then((res) => {
                        alert(`Log in successful! - Token is stored in localStorage. 
                        localStorage.getItem("SECREToken");`);
                        const DATA_AUTH_TOKEN = res.data.login;
                        console.log(DATA_AUTH_TOKEN) //for now, log token //TODO find a way to store token
                        localStorage.setItem("SECREToken", DATA_AUTH_TOKEN);
                        history.push("/profile")
                    }).catch(() => {
                        setErrored(true)
                    });
    }
    
    function Submit( email, password) {
        return client
            .query({
                query: LOGIN,
                variables: {
                    email: email,
                    password: password
                }
            })
    }
   
    const history = useHistory();

    function handleChange(e) {
        setState({...state, [e.target.name]: e.target.value})
    }
 

 if ( session === null ) 
 return (
       
        <form  onSubmit={handleSubmit}>
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
                    id= "email-input"
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
                    id= "password-input"
                />
            </div>
         

            {
                errored &&
                <small
                    id="loginHelpBlock"
                    className="form-text text-muted"
                >
                    Email or Password incorrect
                </small>
            }
            <br />
            <div className="form-group">
            
            <button id="btn-submit" type="submit" className="btn btn-primary">
                LogIn
            </button>
            </div>
            {/*
            <p className="forgot-password text-right">
                Forgot <a href="#">password?</a>
            </p>
            TODO use proper css classes, have link to password forgot
            */}

        </form>
    );

if ( session !== null ) 
return (
    <div >
       You are already logged in
       {history.push("/profile")}
    </div>);


}