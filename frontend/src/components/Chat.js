import { useContext, useEffect, useState, React } from "react"
import { GET_MY_INFO } from "../GraphQL/Queries"
import { UPDATE_USER, SEND_MESSAGE } from "../GraphQL/Mutations"
import { useQuery, useMutation } from "@apollo/client"

import { ContextHeader } from "../constants"

import { AuthContext } from "../App"
import FriendList from "./FriendList"
import { Card, Image, Row, Button, Col } from "react-bootstrap"
import AvatarImage from "./AvatarImage"

export default function Chat({}) {
  const { token, state, setState, refetch } = useContext(AuthContext)
  const [userID, setUserID] = useState("UserId!")
  const [chatID, setChatID] = useState("ChatId!")
  const [userNameChat, setUserNameChat] = useState("Rudis!")
  const [chatAvatar, setChatAvatar] = useState()
  const [contentMessage, setContentMessage] = useState()

  const [errored, setErrored] = useState(false)

  useEffect(() => {
    if (!state) {
      refetch()
      console.log("We refetch", state)
    }
  }, [])

  const [sendMessage, { data: dataMessage }] = useMutation(
    SEND_MESSAGE,
    ContextHeader(token)
  )
  const sendTheMessage = (e) => {
    e.preventDefault()
  
//    setChatID(item.chat)
    console.log("contentMessage: ", contentMessage)
    sendMessage({
      variables: {
        chatID: chatID,
        content: contentMessage,
      },
    }).catch(() => {
      setErrored(true)
    })
    // alert("Msg sent")
    setContentMessage()
  }
  const messageHandler = (e) => {
    e.preventDefault()
    e.persist() //important
    setContentMessage(e.target.value)
    console.log(contentMessage)
  }

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
          <div className="chat-users">
            {state?.friends &&
              state?.friends?.map((item, index) => {
                return (
                  <FriendList
                    setUserID={setUserID}
                    setUserNameChat={setUserNameChat}
                    setChatAvatar={setChatAvatar}
                    userId={item.user}
                  />
                )
              })}
          </div>
        </div>

        <div className="chat-room">
          <div className="user-info">
            {userNameChat}/UserID: {userID}/{chatID}/
            <AvatarImage avatarUrl={chatAvatar} name={userNameChat} />
          </div>

          <div className="conversation">
            Many mgs...
            <div className="message">hi</div>
            <div className="message">hola</div>
            <div className="message">hallo</div>
            <div className="message">hi</div>
            <div className="message">hola</div>
            <div className="message">hallo</div>
            {/*Find all chat for the selected user, show the ChatID's
             */}
            {state?.friends &&
              state?.friends
                ?.filter((item) => {
                  return item.user === userID
                })
                .map((item) => {
                  return item.chat
                })}
          </div>
          {/*Do we nedd a element for the input? */}

          <div className="message-field">
            {" "}
            <input
              value={contentMessage}
              id="contentMessage"
              onChange={messageHandler}
              name="contentMessage"
              type="text"
              className="message-text"
              placeholder="Something good to say?"
            />
            <Button
              className="send-button"
              variant="primary"
              size="sm"
              onClick={sendTheMessage}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
