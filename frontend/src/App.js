import React, { useState, useEffect, createContext } from "react"
import { Switch, Route } from "react-router-dom"
import { GET_MY_INFO } from "./GraphQL/Queries"
import { ContextHeader } from "./constants"
import { useQuery } from "@apollo/client"

import MyNavbar from "./components/MyNavbar"
import Home from "./components/Home"
import Login from "./components/Login"
import SignUp from "./components/Signup"
import Users from "./components/Users/Users"
import Profile from "./components/Profile"
import NotFound from "./components/NotFound"
import Chat from "./components/Chat"
import ChatMessage from "./components/ChatMessage"

export const AuthContext = createContext()
export default function App() {
  const [token, setToken] = useState(0)
  const [loadingToken, setloadingToken] = useState(true)
  const [state, setState] = useState()

  useEffect(() => {
    const call = async () => {
      const token = await localStorage.getItem("SECREToken")
      if (token) {
        setToken(token)
      }
      setloadingToken(false)
    }
    call()
  }, [])

  //Use1

  useEffect(() => {
    if (dataUserSelf) 
    setState(dataUserSelf.userSelf)
    console.log("useEffect 1", state)
  }, [])

  const { loading, error, data: dataUserSelf, refetch } = useQuery(
    GET_MY_INFO,
   ContextHeader(token),
    { pollInterval: 100 }
  )

  //Use2
  useEffect(() => {
    if (dataUserSelf || !state) {
      //  refetch()
      setState(dataUserSelf?.userSelf)
      console.log("useEffect 2", state)
    }
  }, [dataUserSelf])

  console.log(dataUserSelf)
  //If F5
  if (loading) return <p>Loading...</p>
  if (loadingToken) {
    return <p>loading ...</p>
  }
  return (
    <AuthContext.Provider value={{ token, setToken, state, setState, refetch }}>
      <div>
        <MyNavbar />

        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={() => <Login />} />
          <Route path="/signup" component={SignUp} />
          <Route exact path="/users" component={() => <Users />} />
          <Route exact path="/profile" component={() => <Profile />} />
          <Route exact path="/chat" component={() => <Chat />} />
          <Route exact path="/ChatMessage" component={() => <ChatMessage />} />

          <Route component={NotFound} />
        </Switch>
      </div>
    </AuthContext.Provider>
  )
}
