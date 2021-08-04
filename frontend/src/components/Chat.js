import { useContext, useEffect, useState, React } from "react"
import { GET_MY_INFO } from "../GraphQL/Queries"
import { UPDATE_USER, SEND_MESSAGE } from "../GraphQL/Mutations"
import { useQuery, useMutation } from "@apollo/client"

import { ContextHeader } from "../constants"

import { AuthContext } from "../App"
import FriendList from "./FriendList"
import { Card, Image, Row, Button, Col } from "react-bootstrap"

export default function Chat({ textWith }) {
  const { token, state, setState, refetch } = useContext(AuthContext)
  const [chatWith, setChatWith] = useState("Me!")

  useEffect(() => {
    if (!state) {
      refetch()
      console.log("We refetch", state)
    }
  }, [])

  return !token ? (
    <div>You are NOT logged in</div>
  ) : (
    <>
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
          <div className="chat-users" >
           
              {state?.friends &&
                state?.friends?.map((item, index) => {
                  return (
                    <FriendList
                      setChatWith={setChatWith}
                      userId={item.user}
                      friendship={true}
                      chatID={item.chat}
                    />
                  )
                })}
            
          </div>
        </div>

        <div className="chat-room">
          <div className="user-info">
            Your are texting with: {textWith}/{chatWith}
          </div>

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
    </>
  )
}
