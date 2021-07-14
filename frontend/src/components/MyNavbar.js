import React from "react"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { Navbar } from "react-bootstrap"

function MyNavbar(appProps) {
  const [log, setLog] = useState(false)

  useEffect(() => {
    console.log("Token changed ", appProps.token)
    appProps.token?setLog(true):setLog(false)
    //  return ( ) =>{    console.log("Token setted(null) ", TOKEN)}
  }, [ appProps.token ])
  return (
    <div>
      <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Link to="/profile" className="nav-link">
            Profile
          </Link>

          <Link to="/Users" className="nav-link">
            Users
          </Link>
          <Link to="/Friends" className="nav-link">
            Friends
          </Link>
          <Navbar.Brand className="mx-auto order-0 justify-content-md-center">
            <Link to="/" className="nav-link order-0" type="button">
              Hooked
            </Link>
          </Navbar.Brand>

          {!log && (
            <Link to="/signup" className="nav-link text-warning">
              Signup for free!
            </Link>
          )}
          {log ? (
            <div className="nav-item">
              <Link
                value="Logout"
                to="/Login"
                className="nav-link"
                onClick={() => {
                  appProps.setToken(null)
                  localStorage.clear()
                }}
              >
                Logout
              </Link>
            </div>
          ) : (
            //if TOKEN === undefined, null...
            <div className="nav-item" value="Login">
              <Link
                to="/Login"
                className="nav-link"
                onClick={() => {
                  appProps.setToken(localStorage.getItem("SECREToken"))
                }}
              >
                Login
              </Link>
            </div>
          )}
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}
export default MyNavbar
