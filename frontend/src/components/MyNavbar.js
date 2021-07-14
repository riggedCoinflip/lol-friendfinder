import React from "react"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { Navbar } from "react-bootstrap"

function MyNavbar() {
  const [TOKEN, setTOKEN] = useState(localStorage.getItem("SECREToken"))
  
  useEffect(() => {
    setTOKEN(localStorage.getItem("SECREToken"))
   // alert("Token cambio ", TOKEN)
  }, [TOKEN])

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

          {!TOKEN &&
          <Link to="/signup" className="nav-link text-warning">
            Signup for free!
          </Link>
          }
          {TOKEN ? 
          (
            <div className="nav-item">
              <Link
                value="Logout"
                to="/Login"
                className="nav-link"
                onClick={() => 
                  {
                  setTOKEN(null);
                  localStorage.clear();
                }
                }
              >
                Logout
              </Link>
            </div>
          )
          : //if TOKEN === undefined, null...
          (
            <div className="nav-item" value="Login">
              <Link
                to="/Login"
                className="nav-link"
                onClick={() => 
                  {
                setTOKEN(localStorage.getItem("SECREToken"))
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
