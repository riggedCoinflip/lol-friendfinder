import { Link, useHistory } from "react-router-dom"
import { useEffect, React, useContext } from "react"
import { Navbar, Nav } from "react-bootstrap"
import { AuthContext } from "../App"

function MyNavbar() {
  const history = useHistory()

  const { token, setToken, setState } = useContext(AuthContext)

  useEffect(() => {
    console.log("Token changed ", token)
  }, [token])

  return (
    <div>
      <Navbar
        className="navbar"
        collapseOnSelect
        expand="md"
        bg="dark"
        variant="dark"
      >
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {token && (
            <>
              <Nav.Link eventKey="2">
                {" "}
                <Link to="/profile" className="nav-link">
                  Profile
                </Link>
              </Nav.Link>

              <Nav.Link eventKey="2">
                {" "}
                <Link to="/users" className="nav-link">
                  Users
                </Link>
              </Nav.Link>
              <Nav.Link eventKey="2">
                {" "}
                <Link to="/chat" className="nav-link">
                  Chat
                </Link>
              </Nav.Link>
            </>
          )}

          <Navbar.Brand className="mx-auto order-0 justify-content-md-center">
            <Nav.Link eventKey="2">
              {" "}
              <Link to="/" className="nav-link order-0" type="button">
                Hooked
              </Link>
            </Nav.Link>
          </Navbar.Brand>

          {token ? (
            <div className="nav-item">
              <Nav.Link eventKey="2">
                {" "}
                <Link
                  value="Logout"
                  to="/login"
                  className="nav-link"
                  onClick={() => {
                    setToken(null)
                    localStorage.clear()
                   setState(null)
                   window.location.reload(true);
                   history.push("/profile")
                  }}
                >
                  Logout
                </Link>
              </Nav.Link>
            </div>
          ) : (
            <>
              <div className="nav-item" value="Signup">
                <Nav.Link eventKey="2">
                  {" "}
                  <Link to="/signup" className="nav-link text-warning">
                    Signup for free!
                  </Link>
                </Nav.Link>
              </div>

              <div className="nav-item" value="Login">
                <Nav.Link eventKey="2">
                  {" "}
                  <Link
                    to="/login"
                    className="nav-link"
                    onClick={() => {
                      setToken(localStorage.getItem("SECREToken"))
                    }}
                  >
                    Login
                  </Link>
                </Nav.Link>
              </div>
            </>
          )}
        </Navbar.Collapse>
      </Navbar>
    </div>
  )
}
export default MyNavbar
