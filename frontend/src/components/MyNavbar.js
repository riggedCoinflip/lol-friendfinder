import { Link } from "react-router-dom"
import { useEffect, useState, React, useContext } from "react"
import { Navbar } from "react-bootstrap"
import { AuthContext } from "../App"

function MyNavbar() {
  const { token, setToken, setState } = useContext(AuthContext)

  useEffect(() => {
    console.log("Token changed ", token)
  }, [token])

  return (
    <div>
      <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {token && (
            <>
              <Link to="/profile" className="nav-link">
                Profile
              </Link>

              <Link to="/users" className="nav-link">
                Users
              </Link>
              <Link to="/friends" className="nav-link">
                Friends
               
              </Link>
              <Link to="/chat" className="nav-link">
                Chat
              </Link>
            </>
          )}

          <Navbar.Brand className="mx-auto order-0 justify-content-md-center">
            <Link to="/" className="nav-link order-0" type="button">
              Hooked
            </Link>
          </Navbar.Brand>

          {token ? (
            <div className="nav-item">
              <Link
                value="Logout"
                to="/login"
                className="nav-link"
                onClick={() => {
                  setToken(null)
                  localStorage.clear()
                  setState(null)
                }}
              >
                Logout
              </Link>
            </div>
          ) : (
            <>
              <div className="nav-item" value="Signup">
                <Link to="/signup" className="nav-link text-warning">
                  Signup for free!
                </Link>
              </div>

              <div className="nav-item" value="Login">
                <Link
                  to="/login"
                  className="nav-link"
                  onClick={() => {
                    setToken(localStorage.getItem("SECREToken"))
                  }}
                >
                  Login
                </Link>
              </div>
            </>
          )}
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}
export default MyNavbar
