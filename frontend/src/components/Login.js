import React, { useState } from "react"
import { useApolloClient } from "@apollo/client"
import { useHistory } from "react-router-dom"
import { useForm } from '../customHooks/useForm'
import { LOGIN } from '../GraphQL/Queries'
 
export default function Login(appProps) {
 
  const client = useApolloClient()
  let TOKEN = localStorage.getItem("SECREToken")
  /*
  const [state, setState] = useState({ username: "",  password: "", })
  
  function handleChange(e) {
    setState({ ...state, [e.target.name]: e.target.value })
  }
  */
  const [values, handleChange] = useForm({ 
   
  })
  const [errored, setErrored] = useState(false)

  function handleSubmit(event) {
    console.table(values)
    event.preventDefault()

    //Calling the function
    Submit(values.email, values.password)
      .then((res) => {
       // console.log(`Log in successful!`)
        TOKEN = res.data.login
        console.log(TOKEN) //for now, log token //TODO find a way to store token
        localStorage.setItem("SECREToken", TOKEN)
        appProps.setToken(TOKEN)
        history.push("/profile")
      })
      .catch(() => {
        setErrored(true)
      })
  }

  function Submit(email, password) {
    return client.query({
      query: LOGIN,
      variables: {
        email,
        password,
      },
    })
  }
  console.table(values)

  const history = useHistory()

   return(
    TOKEN ?
     <div>
       You are already logged in
       {history.push("/profile")}
     </div>

     :  //if TOKEN does not exist
 
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
            id="email-input"
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
            id="password-input"
          />
        </div>

        {errored && (
          <small id="loginHelpBlock" className="form-text text-muted">
            Email or Password incorrect
          </small>
        )}
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
  
    )
}
