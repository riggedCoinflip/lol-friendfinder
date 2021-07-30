import { useContext, useEffect, useState, React } from "react"
import { GET_MY_INFO } from "../GraphQL/Queries"
import { UPDATE_USER } from "../GraphQL/Mutations"
import { useQuery, useMutation } from "@apollo/client"

import { ContextHeader } from "../constants"

import { AuthContext } from "../App"
import { ProfileContext } from "./Profile"
import { Button } from "react-bootstrap"

export default function Chat() {
  const { token } = useContext(AuthContext)
 // const { state } = useContext(ProfileContext)

  //console.log("Chat-state ", state)

  /*
  const [state, setState] = useState({})
  const [errored, setErrored] = useState(false)

  const { loading, error, data, refetch } = useQuery(
    GET_MY_INFO,
    ContextHeader(token),
    { pollInterval: 100 }
  )

  useEffect(() => {
    if (data || !state) {
      setState(data?.userSelf)

      console.log("State from useEffect", state)
    }
  }, [data])

  useEffect(() => {
    if (token) {
      refetch()
      setState(data?.userSelf)
    }
  }, [token])
  console.log(data)
  //If F5

  const [updateUser, { data: dataUpdate }] = useMutation(
    UPDATE_USER,
    ContextHeader(token)
  )

  //Get users data
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error, are you already logged in?!</p>

  console.table(data.userSelf)
*/
  /*
  const changeHandler = (e) => {
    e.persist() //important
    setState((state) => ({ ...state, [e.target.name]: e.target.value }))
  }

  const getValuesFromChild = (values) => {
    console.log("value from child", values)
  }
*/
  return !token ? (
    <div>You are NOT logged in</div>
  ) : (
    <div className="chat-container padding5">
      <div className="chat-left-column">
        <input
          className="user-search"
          autoFocus
          type="text"
          placeholder="Who are u looking for?🔍"
          id="user-search"
          name="user-search"
          onChange={(e) => {
            console.log("typing", e.target.value)
          }}
        />
        <div className="chat-users">Users</div>
      </div>

      <div className="chat-room">
        <div className="user-info">Your are texting with x</div>

        <div className="conversation">
          Many mgs...
          <div className="message">hi</div>
          <div className="message">hola</div>
          <div className="message">hallo</div>
          <div className="message">hi</div>
          <div className="message">hola</div>
          <div className="message">hallo</div>
        </div>
        {/*Do we nedd a element for the input? */}

        <div className="message-field">
          {" "}
          <input
            className="message-text"
            autoFocus
            type="text"
            placeholder="Something good to tell me?"
            id="message-text"
            name="message-text"
            onChange={(e) => {
              console.log("typing", e.target.value)
            }}
          />
          <Button
            className="send-button"
            variant="primary"
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              //send msg
            }}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
