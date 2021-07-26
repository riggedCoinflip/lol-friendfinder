import React, { useState, useEffect, createContext } from "react"
import { Switch, Route } from "react-router-dom"

import MyNavbar from "./components/MyNavbar"
import Home from "./components/Home"
import Login from "./components/Login"
import SignUp from "./components/Signup"
import Users from "./components/Users/Users"
import Profile from "./components/Profile"
import NotFound from "./components/NotFound"
import Friends from "./components/Friends"

export const AuthContext = createContext()
export default function App() {
  const [token, setToken] = useState(0)
  const [loading, setloading] = useState(true)
  console.log("token: ", token)

  /* const ContextHeader = {
    context: {
      headers: {
        "x-auth-token": token,
      },
    },
  }
*/
  useEffect(() => {
    const call = async () => {
      const value = await localStorage.getItem("SECREToken")
      if (value) {
        setToken(value)
      }
      setloading(false)
    }
    call()
  }, [])

  if (loading) {
    return <p>loading ...</p>
  }
  return (
    <AuthContext.Provider value={{ token, setToken }}>
      <div>
        <MyNavbar token={token} setToken={setToken} />

        <Switch>
          <Route exact path="/" component={Home} />
          <Route
            path="/login"
            component={() => <Login token={token} setToken={setToken} />}
          />
          <Route path="/signup" component={SignUp} />

          <Route exact path="/users" component={() => <Users />} />
          <Route exact path="/friends" component={() => <Friends />} />

          <Route exact path="/profile" component={() => <Profile />}  />
         

          <Route component={NotFound} />
        </Switch>
      </div>
    </AuthContext.Provider>
  )
}
