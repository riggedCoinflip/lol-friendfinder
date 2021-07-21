import { Link } from "react-router-dom"
import { useEffect, useState, React } from "react"
import { Navbar } from "react-bootstrap"

function MyNavbar(appProps) {
  const [logged, setLogged] = useState(false)

  useEffect(() => {
    console.log("Token changed ", appProps.token)
    appProps.token?setLogged(true):setLogged(false)
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

          <Link to="/users" className="nav-link">
            Users
          </Link>
          <Link to="/friends" className="nav-link">
            Friends
          </Link>
          <Navbar.Brand className="mx-auto order-0 justify-content-md-center">
            <Link to="/" className="nav-link order-0" type="button">
              Hooked
            </Link>
          </Navbar.Brand>

          {!logged && (
            <Link to="/signup" className="nav-link text-warning">
              Signup for free!
            </Link>
          )}
          {logged ? (
            <div className="nav-item">
              <Link
                value="Logout"
                to="/login"
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
                to="/login"
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
