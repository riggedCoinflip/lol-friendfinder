import { useContext, useEffect, useState, React } from "react"
import { GET_MY_INFO } from "../GraphQL/Queries"
import { UPDATE_USER, SEND_MESSAGE } from "../GraphQL/Mutations"
import { useQuery, useMutation } from "@apollo/client"
import { AuthContext } from "../App"

import { ContextHeader } from "../constants"

import FriendList from "./FriendList"
import ChatMessage from "./ChatMessage"
import { Card, Image, Row, Button, Col } from "react-bootstrap"
import AvatarImage from "./AvatarImage"

export default function Chat({}) {
  const { token, state, setState, refetch } = useContext(AuthContext)
  
  const [userID, setUserID] = useState("UserId!")
  const [chatID, setChatID] = useState("-")
  const [userNameChat, setUserNameChat] = useState("My clone")
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
    console.log("chatID ", chatID,
    )
    sendMessage({
      variables: {
        chatID: chatID,
        content: contentMessage,
      },
    }).catch(() => {
      setErrored(true)
    })
    /*
    .then((res) => { 
      console.log("Msg sent successfully", res)
    })
    */
    setContentMessage("")
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
              //This is just fun, setting a different image as background
              console.log("typing", e.target.value);
              const imgUrl = `url(${e.target.value})`;

              document.getElementById("chat-room")
              .style.backgroundImage = imgUrl;
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

        <div className="chat-room" id="chat-room">
          <div className="user-info">
            {userNameChat}
            <AvatarImage avatarUrl={chatAvatar} name={userNameChat} />
            <br />
            UserID: {userID} <br /> ChatID: {chatID}
          </div>

          <div className="conversation">
            All mgs...
            <br />
            {state?.friends &&
              state?.friends
                ?.filter((item) => {
                  return item.user === userID
                })
                .map((item) => {
                  return (
                    <>
                     <br />
                    {item.chat}
                    <br /> <br />
                      <ChatMessage chatID={item.chat} />
                    </>
                  )
                })}
            <div className="message">hola</div>
            <div className="message">hallo</div>
            <div className="message">hi</div>
            <div className="message">hallo</div>
            <br/>
            {/*Find all chat for the selected user, show the ChatID's
             */}
            {state?.friends &&
              state?.friends
                ?.filter((item) => {
                  return item.user === userID
                })
                .map((item) => {
                 
                 // setChatID(item.chat)
                  return (`chatID: ${item.chat}` )
                   
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
